import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db, workspacesTable, workspaceMembersTable, workspaceInvitesTable, usersTable } from "@workspace/db";
import { requireAuth } from "./users";

const router: IRouter = Router();

function formatWorkspace(ws: any, role?: string, membersCount = 0) {
  return {
    id: ws.id,
    name: ws.name,
    slug: ws.slug,
    ownerId: ws.ownerId,
    role: role ?? null,
    membersCount,
    createdAt: ws.createdAt instanceof Date ? ws.createdAt.toISOString() : ws.createdAt,
    updatedAt: ws.updatedAt instanceof Date ? ws.updatedAt.toISOString() : ws.updatedAt,
  };
}

function formatMember(member: any, user: any) {
  return {
    id: member.id,
    workspaceId: member.workspaceId,
    userId: member.userId,
    role: member.role,
    joinedAt: member.joinedAt instanceof Date ? member.joinedAt.toISOString() : member.joinedAt,
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
      area: user.area ?? null,
    } : null,
  };
}

async function getMe(clerkId: string) {
  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  return me ?? null;
}

async function getMembership(workspaceId: number, userId: number) {
  const [m] = await db.select().from(workspaceMembersTable)
    .where(and(eq(workspaceMembersTable.workspaceId, workspaceId), eq(workspaceMembersTable.userId, userId)))
    .limit(1);
  return m ?? null;
}

router.get("/workspaces", requireAuth, async (req: any, res): Promise<void> => {
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const memberships = await db
    .select()
    .from(workspaceMembersTable)
    .leftJoin(workspacesTable, eq(workspaceMembersTable.workspaceId, workspacesTable.id))
    .where(eq(workspaceMembersTable.userId, me.id));

  const memberCounts = await db
    .select({ workspaceId: workspaceMembersTable.workspaceId, count: sql<number>`count(*)::int` })
    .from(workspaceMembersTable)
    .groupBy(workspaceMembersTable.workspaceId);
  const countMap = new Map(memberCounts.map(c => [c.workspaceId, c.count]));

  const workspaces = memberships
    .filter(m => m.workspaces != null)
    .map(m => formatWorkspace(m.workspaces!, m.workspace_members.role, countMap.get(m.workspaces!.id) ?? 0));

  res.json(workspaces);
});

router.post("/workspaces", requireAuth, async (req: any, res): Promise<void> => {
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const { name } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: "Name is required" }); return; }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + randomBytes(3).toString("hex");

  const [ws] = await db.insert(workspacesTable).values({ name: name.trim(), slug, ownerId: me.id }).returning();
  await db.insert(workspaceMembersTable).values({ workspaceId: ws.id, userId: me.id, role: "owner" });

  res.status(201).json(formatWorkspace(ws, "owner", 1));
});

router.get("/workspaces/:workspaceId", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  if (isNaN(workspaceId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const membership = await getMembership(workspaceId, me.id);
  if (!membership) { res.status(403).json({ error: "Not a member" }); return; }

  const [ws] = await db.select().from(workspacesTable).where(eq(workspacesTable.id, workspaceId)).limit(1);
  if (!ws) { res.status(404).json({ error: "Not found" }); return; }

  const membersWithUsers = await db
    .select()
    .from(workspaceMembersTable)
    .leftJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
    .where(eq(workspaceMembersTable.workspaceId, workspaceId));

  const members = membersWithUsers.map(m => formatMember(m.workspace_members, m.users));

  res.json({ ...formatWorkspace(ws, membership.role, members.length), members });
});

router.patch("/workspaces/:workspaceId", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const membership = await getMembership(workspaceId, me.id);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const { name } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: "Name is required" }); return; }

  const [updated] = await db.update(workspacesTable).set({ name: name.trim() }).where(eq(workspacesTable.id, workspaceId)).returning();
  res.json(formatWorkspace(updated, membership.role));
});

router.get("/workspaces/:workspaceId/members", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const membership = await getMembership(workspaceId, me.id);
  if (!membership) { res.status(403).json({ error: "Not a member" }); return; }

  const membersWithUsers = await db
    .select()
    .from(workspaceMembersTable)
    .leftJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
    .where(eq(workspaceMembersTable.workspaceId, workspaceId));

  res.json(membersWithUsers.map(m => formatMember(m.workspace_members, m.users)));
});

router.post("/workspaces/:workspaceId/invites", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const membership = await getMembership(workspaceId, me.id);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    res.status(403).json({ error: "Only owner/admin can invite" }); return;
  }

  const { email, role = "editor" } = req.body;
  if (!email?.trim()) { res.status(400).json({ error: "Email is required" }); return; }
  if (!["admin", "editor"].includes(role)) { res.status(400).json({ error: "Invalid role" }); return; }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [invite] = await db.insert(workspaceInvitesTable).values({
    workspaceId,
    email: email.trim().toLowerCase(),
    role,
    token,
    invitedBy: me.id,
    expiresAt,
  }).returning();

  res.status(201).json({
    id: invite.id,
    email: invite.email,
    role: invite.role,
    token: invite.token,
    expiresAt: invite.expiresAt instanceof Date ? invite.expiresAt.toISOString() : invite.expiresAt,
    createdAt: invite.createdAt instanceof Date ? invite.createdAt.toISOString() : invite.createdAt,
  });
});

router.get("/workspaces/:workspaceId/invites", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const membership = await getMembership(workspaceId, me.id);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const invites = await db.select().from(workspaceInvitesTable)
    .where(and(eq(workspaceInvitesTable.workspaceId, workspaceId)));

  res.json(invites.map(i => ({
    id: i.id,
    email: i.email,
    role: i.role,
    token: i.token,
    acceptedAt: i.acceptedAt ? (i.acceptedAt instanceof Date ? i.acceptedAt.toISOString() : i.acceptedAt) : null,
    expiresAt: i.expiresAt instanceof Date ? i.expiresAt.toISOString() : i.expiresAt,
    createdAt: i.createdAt instanceof Date ? i.createdAt.toISOString() : i.createdAt,
  })));
});

router.post("/workspaces/invites/:token/accept", requireAuth, async (req: any, res): Promise<void> => {
  const { token } = req.params;
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const [invite] = await db.select().from(workspaceInvitesTable)
    .where(eq(workspaceInvitesTable.token, token)).limit(1);

  if (!invite) { res.status(404).json({ error: "Invite not found" }); return; }
  if (invite.acceptedAt) { res.status(409).json({ error: "Already accepted" }); return; }
  if (new Date() > new Date(invite.expiresAt)) { res.status(410).json({ error: "Invite expired" }); return; }
  if (invite.email !== me.email.toLowerCase()) { res.status(403).json({ error: "Email mismatch" }); return; }

  const existing = await getMembership(invite.workspaceId, me.id);
  if (!existing) {
    await db.insert(workspaceMembersTable).values({ workspaceId: invite.workspaceId, userId: me.id, role: invite.role });
  }
  await db.update(workspaceInvitesTable).set({ acceptedAt: new Date() }).where(eq(workspaceInvitesTable.id, invite.id));

  res.json({ success: true });
});

router.patch("/workspaces/:workspaceId/members/:memberId", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  const memberId = Number(req.params.memberId);
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const myMembership = await getMembership(workspaceId, me.id);
  if (!myMembership || !["owner", "admin"].includes(myMembership.role)) {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const { role } = req.body;
  if (!["admin", "editor"].includes(role)) { res.status(400).json({ error: "Invalid role" }); return; }

  const [updated] = await db.update(workspaceMembersTable)
    .set({ role })
    .where(and(eq(workspaceMembersTable.id, memberId), eq(workspaceMembersTable.workspaceId, workspaceId)))
    .returning();

  if (!updated) { res.status(404).json({ error: "Member not found" }); return; }
  res.json({ id: updated.id, role: updated.role });
});

router.delete("/workspaces/:workspaceId/members/:memberId", requireAuth, async (req: any, res): Promise<void> => {
  const workspaceId = Number(req.params.workspaceId);
  const memberId = Number(req.params.memberId);
  const me = await getMe(req.clerkId);
  if (!me) { res.status(401).json({ error: "User not found" }); return; }

  const myMembership = await getMembership(workspaceId, me.id);
  if (!myMembership || !["owner", "admin"].includes(myMembership.role)) {
    const [targetMember] = await db.select().from(workspaceMembersTable)
      .where(and(eq(workspaceMembersTable.id, memberId), eq(workspaceMembersTable.workspaceId, workspaceId))).limit(1);
    if (!targetMember || targetMember.userId !== me.id) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
  }

  await db.delete(workspaceMembersTable)
    .where(and(eq(workspaceMembersTable.id, memberId), eq(workspaceMembersTable.workspaceId, workspaceId)));
  res.sendStatus(204);
});

export default router;
