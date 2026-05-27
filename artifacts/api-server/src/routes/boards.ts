import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, boardsTable, usersTable, commentsTable } from "@workspace/db";
import {
  ListBoardsQueryParams,
  ListBoardsResponse,
  CreateBoardBody,
  GetBoardParams,
  GetBoardResponse,
  UpdateBoardParams,
  UpdateBoardBody,
  UpdateBoardResponse,
  DeleteBoardParams,
} from "@workspace/api-zod";
import { requireAuth } from "./users";

const router: IRouter = Router();

async function formatBoard(b: any, author: any, commentsCount = 0) {
  return {
    id: b.id,
    authorId: b.authorId,
    title: b.title,
    content: b.content ?? null,
    status: b.status,
    tags: b.tags ?? [],
    commentsCount,
    author: author ? { ...author, createdAt: author.createdAt instanceof Date ? author.createdAt.toISOString() : author.createdAt } : undefined,
    createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
    updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
  };
}

router.get("/boards", async (req, res): Promise<void> => {
  const params = ListBoardsQueryParams.safeParse(req.query);

  const rows = await db
    .select()
    .from(boardsTable)
    .leftJoin(usersTable, eq(boardsTable.authorId, usersTable.id))
    .orderBy(boardsTable.createdAt);

  const counts = await db
    .select({ boardId: commentsTable.boardId, count: sql<number>`count(*)::int` })
    .from(commentsTable)
    .groupBy(commentsTable.boardId);
  const countMap = new Map(counts.map(c => [c.boardId, c.count]));

  let boards = await Promise.all(rows.map(r => formatBoard(r.boards, r.users, countMap.get(r.boards.id) ?? 0)));

  if (params.success && params.data.userId) {
    boards = boards.filter(b => b.authorId === params.data.userId);
  }

  res.json(ListBoardsResponse.parse(boards.reverse()));
});

router.post("/boards", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateBoardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const [b] = await db.insert(boardsTable).values({
    authorId: me.id,
    title: parsed.data.title,
    content: parsed.data.content ?? null,
    status: parsed.data.status,
    tags: parsed.data.tags ?? [],
  }).returning();

  res.status(201).json(await formatBoard(b, me, 0));
});

router.get("/boards/:boardId", async (req, res): Promise<void> => {
  const params = GetBoardParams.safeParse({ boardId: Number(req.params.boardId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(boardsTable)
    .leftJoin(usersTable, eq(boardsTable.authorId, usersTable.id))
    .where(eq(boardsTable.id, params.data.boardId))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Board entry not found" });
    return;
  }

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(commentsTable)
    .where(eq(commentsTable.boardId, row.boards.id));

  res.json(GetBoardResponse.parse(await formatBoard(row.boards, row.users, countRow?.count ?? 0)));
});

router.patch("/boards/:boardId", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateBoardParams.safeParse({ boardId: Number(req.params.boardId) });
  const parsed = UpdateBoardBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  const [board] = await db.select().from(boardsTable).where(eq(boardsTable.id, params.data.boardId)).limit(1);
  if (!board || !me || board.authorId !== me.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const updates: any = {};
  if (parsed.data.title != null) updates.title = parsed.data.title;
  if (parsed.data.content != null) updates.content = parsed.data.content;
  if (parsed.data.status != null) updates.status = parsed.data.status;
  if (parsed.data.tags != null) updates.tags = parsed.data.tags;

  const [updated] = await db.update(boardsTable).set(updates).where(eq(boardsTable.id, board.id)).returning();
  res.json(await formatBoard(updated, me, 0));
});

router.delete("/boards/:boardId", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteBoardParams.safeParse({ boardId: Number(req.params.boardId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(boardsTable).where(eq(boardsTable.id, params.data.boardId));
  res.sendStatus(204);
});

export default router;
