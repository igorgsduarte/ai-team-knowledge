import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, userSkillsTable, skillsTable } from "@workspace/db";
import {
  GetMeResponse,
  UpdateMeBody,
  GetUserParams,
  GetUserResponse,
  ListUsersResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

async function getOrCreateUser(clerkId: string, name: string, email: string, avatarUrl?: string) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (existing.length > 0) return existing[0];
  const [created] = await db.insert(usersTable).values({ clerkId, name, email, avatarUrl: avatarUrl ?? null }).returning();
  return created;
}

const requireAuth = async (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.clerkId = clerkId;
  next();
};

router.get("/users/me", requireAuth, async (req: any, res): Promise<void> => {
  const auth = getAuth(req);
  const clerkId = auth?.userId!;
  const sessionClaims = auth?.sessionClaims as any;
  const name = sessionClaims?.name ?? sessionClaims?.fullName ?? sessionClaims?.firstName ?? "Team Member";
  const email = sessionClaims?.email ?? sessionClaims?.primaryEmail ?? `${clerkId}@unknown.com`;
  const avatarUrl = sessionClaims?.imageUrl ?? sessionClaims?.profileImageUrl ?? null;

  const user = await getOrCreateUser(clerkId, name, email, avatarUrl);
  res.json(GetMeResponse.parse({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
});

router.patch("/users/me", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const clerkId = req.clerkId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.bio != null) updates.bio = parsed.data.bio;
  if (parsed.data.area != null) updates.area = parsed.data.area;
  if (parsed.data.avatarUrl != null) updates.avatarUrl = parsed.data.avatarUrl;

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, user.id)).returning();
  res.json(GetMeResponse.parse({ ...updated, createdAt: updated.createdAt.toISOString() }));
});

router.get("/users", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(usersTable.name);
  res.json(ListUsersResponse.parse(users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))));
});

router.get("/users/:userId", async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse({ userId: Number(req.params.userId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.userId)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(GetUserResponse.parse({ ...user, createdAt: user.createdAt.toISOString() }));
});

export { requireAuth, getOrCreateUser };
export default router;
