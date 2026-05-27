import { Router, type IRouter } from "express";
import { eq, sql, desc } from "drizzle-orm";
import { db, usersTable, skillsTable, userSkillsTable, knowledgeTable, boardsTable, commentsTable } from "@workspace/db";
import {
  GetStatsOverviewResponse,
  GetTopSkillsQueryParams,
  GetTopSkillsResponse,
  GetRecentActivityQueryParams,
  GetRecentActivityResponse,
  GetSkillMapResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/overview", async (_req, res): Promise<void> => {
  const [usersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
  const [skillsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(skillsTable);
  const [knowledgeCount] = await db.select({ count: sql<number>`count(*)::int` }).from(knowledgeTable);
  const [boardsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(boardsTable);
  const [commentsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(commentsTable);

  res.json(GetStatsOverviewResponse.parse({
    totalUsers: usersCount.count,
    totalSkills: skillsCount.count,
    totalKnowledge: knowledgeCount.count,
    totalBoards: boardsCount.count,
    totalComments: commentsCount.count,
  }));
});

router.get("/stats/top-skills", async (req, res): Promise<void> => {
  const params = GetTopSkillsQueryParams.safeParse(req.query);
  const limit = params.success && params.data.limit ? params.data.limit : 10;

  const rows = await db
    .select({
      skillId: skillsTable.id,
      name: skillsTable.name,
      tags: skillsTable.tags,
      usersCount: sql<number>`count(user_skills.id)::int`,
    })
    .from(skillsTable)
    .leftJoin(userSkillsTable, eq(skillsTable.id, userSkillsTable.skillId))
    .groupBy(skillsTable.id, skillsTable.name, skillsTable.tags)
    .orderBy(desc(sql`count(user_skills.id)`))
    .limit(limit);

  res.json(GetTopSkillsResponse.parse(rows.map(r => ({
    skillId: r.skillId,
    name: r.name,
    tags: r.tags ?? [],
    usersCount: r.usersCount,
  }))));
});

router.get("/stats/recent-activity", async (req, res): Promise<void> => {
  const params = GetRecentActivityQueryParams.safeParse(req.query);
  const limit = params.success && params.data.limit ? params.data.limit : 20;

  const boardRows = await db
    .select()
    .from(boardsTable)
    .leftJoin(usersTable, eq(boardsTable.authorId, usersTable.id))
    .orderBy(desc(boardsTable.createdAt))
    .limit(limit);

  const knowledgeRows = await db
    .select()
    .from(knowledgeTable)
    .leftJoin(usersTable, eq(knowledgeTable.authorId, usersTable.id))
    .orderBy(desc(knowledgeTable.createdAt))
    .limit(limit);

  const commentRows = await db
    .select()
    .from(commentsTable)
    .leftJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .orderBy(desc(commentsTable.createdAt))
    .limit(limit);

  const activity = [
    ...boardRows.map(r => ({
      id: r.boards.id,
      type: "board" as const,
      title: r.boards.title,
      authorId: r.boards.authorId,
      authorName: r.users?.name ?? "Unknown",
      avatarUrl: r.users?.avatarUrl ?? null,
      createdAt: r.boards.createdAt.toISOString(),
    })),
    ...knowledgeRows.map(r => ({
      id: r.knowledge.id,
      type: "knowledge" as const,
      title: r.knowledge.title,
      authorId: r.knowledge.authorId,
      authorName: r.users?.name ?? "Unknown",
      avatarUrl: r.users?.avatarUrl ?? null,
      createdAt: r.knowledge.createdAt.toISOString(),
    })),
    ...commentRows.map(r => ({
      id: r.comments.id,
      type: "comment" as const,
      title: r.comments.content.slice(0, 80),
      authorId: r.comments.authorId,
      authorName: r.users?.name ?? "Unknown",
      avatarUrl: r.users?.avatarUrl ?? null,
      createdAt: r.comments.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  res.json(GetRecentActivityResponse.parse(activity));
});

router.get("/stats/skill-map", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(usersTable.name);

  const skillMapEntries = await Promise.all(users.map(async (user) => {
    const userSkillRows = await db
      .select()
      .from(userSkillsTable)
      .leftJoin(skillsTable, eq(userSkillsTable.skillId, skillsTable.id))
      .where(eq(userSkillsTable.userId, user.id));

    return {
      userId: user.id,
      userName: user.name,
      avatarUrl: user.avatarUrl ?? null,
      area: user.area ?? null,
      skills: userSkillRows.map(r => ({
        skillId: r.skills!.id,
        name: r.skills!.name,
        level: r.user_skills.level,
      })),
    };
  }));

  res.json(GetSkillMapResponse.parse(skillMapEntries));
});

export default router;
