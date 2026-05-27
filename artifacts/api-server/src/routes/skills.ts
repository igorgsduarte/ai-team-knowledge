import { Router, type IRouter } from "express";
import { eq, ilike, sql, and } from "drizzle-orm";
import { db, skillsTable, userSkillsTable, usersTable } from "@workspace/db";
import {
  ListSkillsQueryParams,
  ListSkillsResponse,
  CreateSkillBody,
  GetSkillParams,
  GetSkillResponse,
  UpdateSkillParams,
  UpdateSkillBody,
  UpdateSkillResponse,
  DeleteSkillParams,
  ListMySkillsResponse,
  AddMySkillBody,
  UpdateMySkillParams,
  UpdateMySkillBody,
  UpdateMySkillResponse,
  RemoveMySkillParams,
  ListUserSkillsParams,
  ListUserSkillsResponse,
} from "@workspace/api-zod";
import { requireAuth } from "./users";

const router: IRouter = Router();

function formatSkill(skill: any, usersCount = 0) {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description ?? null,
    tags: skill.tags ?? [],
    usersCount,
    createdAt: skill.createdAt instanceof Date ? skill.createdAt.toISOString() : skill.createdAt,
  };
}

function formatUserSkill(us: any, skill: any, user?: any) {
  return {
    id: us.id,
    userId: us.userId,
    skillId: us.skillId,
    level: us.level,
    skill: formatSkill(skill),
    user: user ? { ...user, createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt } : undefined,
    createdAt: us.createdAt instanceof Date ? us.createdAt.toISOString() : us.createdAt,
  };
}

router.get("/skills", async (req, res): Promise<void> => {
  const params = ListSkillsQueryParams.safeParse(req.query);

  const skillsList = await db.select().from(skillsTable).orderBy(skillsTable.name);

  const counts = await db
    .select({ skillId: userSkillsTable.skillId, count: sql<number>`count(*)::int` })
    .from(userSkillsTable)
    .groupBy(userSkillsTable.skillId);

  const countMap = new Map(counts.map(c => [c.skillId, c.count]));

  let result = skillsList.map(s => formatSkill(s, countMap.get(s.id) ?? 0));

  if (params.success && params.data.search) {
    const q = params.data.search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.tags.some((t: string) => t.toLowerCase().includes(q)));
  }
  if (params.success && params.data.tag) {
    const tag = params.data.tag.toLowerCase();
    result = result.filter(s => s.tags.some((t: string) => t.toLowerCase() === tag));
  }

  res.json(ListSkillsResponse.parse(result));
});

router.post("/skills", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [skill] = await db.insert(skillsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    tags: parsed.data.tags ?? [],
  }).returning();

  res.status(201).json(formatSkill(skill));
});

router.get("/skills/:skillId", async (req, res): Promise<void> => {
  const params = GetSkillParams.safeParse({ skillId: Number(req.params.skillId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [skill] = await db.select().from(skillsTable).where(eq(skillsTable.id, params.data.skillId)).limit(1);
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  const userSkillsRows = await db
    .select()
    .from(userSkillsTable)
    .leftJoin(usersTable, eq(userSkillsTable.userId, usersTable.id))
    .where(eq(userSkillsTable.skillId, skill.id));

  const users = userSkillsRows.map(row => formatUserSkill(row.user_skills, skill, row.users));

  res.json(GetSkillResponse.parse({
    ...formatSkill(skill, users.length),
    users,
  }));
});

router.patch("/skills/:skillId", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateSkillParams.safeParse({ skillId: Number(req.params.skillId) });
  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const updates: any = {};
  if (parsed.data.name != null) updates.name = parsed.data.name;
  if (parsed.data.description != null) updates.description = parsed.data.description;
  if (parsed.data.tags != null) updates.tags = parsed.data.tags;

  const [updated] = await db.update(skillsTable).set(updates).where(eq(skillsTable.id, params.data.skillId)).returning();
  if (!updated) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.json(UpdateSkillResponse.parse(formatSkill(updated)));
});

router.delete("/skills/:skillId", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteSkillParams.safeParse({ skillId: Number(req.params.skillId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(skillsTable).where(eq(skillsTable.id, params.data.skillId));
  res.sendStatus(204);
});

// User skills
router.get("/users/me/skills", requireAuth, async (req: any, res): Promise<void> => {
  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.json([]);
    return;
  }

  const rows = await db
    .select()
    .from(userSkillsTable)
    .leftJoin(skillsTable, eq(userSkillsTable.skillId, skillsTable.id))
    .where(eq(userSkillsTable.userId, me.id));

  res.json(ListMySkillsResponse.parse(rows.map(r => formatUserSkill(r.user_skills, r.skills!))));
});

router.post("/users/me/skills", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = AddMySkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const [us] = await db.insert(userSkillsTable).values({
    userId: me.id,
    skillId: parsed.data.skillId,
    level: parsed.data.level,
  }).returning();

  const [skill] = await db.select().from(skillsTable).where(eq(skillsTable.id, us.skillId)).limit(1);
  res.status(201).json(formatUserSkill(us, skill!));
});

router.patch("/users/me/skills/:skillId", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateMySkillParams.safeParse({ skillId: Number(req.params.skillId) });
  const parsed = UpdateMySkillBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const [updated] = await db
    .update(userSkillsTable)
    .set({ level: parsed.data.level })
    .where(and(eq(userSkillsTable.userId, me.id), eq(userSkillsTable.skillId, params.data.skillId)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Skill association not found" });
    return;
  }

  const [skill] = await db.select().from(skillsTable).where(eq(skillsTable.id, updated.skillId)).limit(1);
  res.json(UpdateMySkillResponse.parse(formatUserSkill(updated, skill!)));
});

router.delete("/users/me/skills/:skillId", requireAuth, async (req: any, res): Promise<void> => {
  const params = RemoveMySkillParams.safeParse({ skillId: Number(req.params.skillId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  await db
    .delete(userSkillsTable)
    .where(and(eq(userSkillsTable.userId, me.id), eq(userSkillsTable.skillId, params.data.skillId)));

  res.sendStatus(204);
});

router.get("/users/:userId/skills", async (req, res): Promise<void> => {
  const params = ListUserSkillsParams.safeParse({ userId: Number(req.params.userId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(userSkillsTable)
    .leftJoin(skillsTable, eq(userSkillsTable.skillId, skillsTable.id))
    .where(eq(userSkillsTable.userId, params.data.userId));

  res.json(ListUserSkillsResponse.parse(rows.map(r => formatUserSkill(r.user_skills, r.skills!))));
});

export default router;
