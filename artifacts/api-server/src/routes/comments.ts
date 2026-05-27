import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, commentsTable, usersTable } from "@workspace/db";
import {
  ListBoardCommentsParams,
  ListBoardCommentsResponse,
  CreateBoardCommentParams,
  CreateBoardCommentBody,
  ListKnowledgeCommentsParams,
  ListKnowledgeCommentsResponse,
  CreateKnowledgeCommentParams,
  CreateKnowledgeCommentBody,
  DeleteCommentParams,
} from "@workspace/api-zod";
import { requireAuth } from "./users";

const router: IRouter = Router();

function formatComment(c: any, author: any) {
  return {
    id: c.id,
    authorId: c.authorId,
    content: c.content,
    author: author ? { ...author, createdAt: author.createdAt instanceof Date ? author.createdAt.toISOString() : author.createdAt } : undefined,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
  };
}

router.get("/boards/:boardId/comments", async (req, res): Promise<void> => {
  const params = ListBoardCommentsParams.safeParse({ boardId: Number(req.params.boardId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(commentsTable)
    .leftJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(eq(commentsTable.boardId, params.data.boardId))
    .orderBy(commentsTable.createdAt);

  res.json(ListBoardCommentsResponse.parse(rows.map(r => formatComment(r.comments, r.users))));
});

router.post("/boards/:boardId/comments", requireAuth, async (req: any, res): Promise<void> => {
  const params = CreateBoardCommentParams.safeParse({ boardId: Number(req.params.boardId) });
  const parsed = CreateBoardCommentBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const [comment] = await db.insert(commentsTable).values({
    authorId: me.id,
    boardId: params.data.boardId,
    content: parsed.data.content,
  }).returning();

  res.status(201).json(formatComment(comment, me));
});

router.get("/knowledge/:entryId/comments", async (req, res): Promise<void> => {
  const params = ListKnowledgeCommentsParams.safeParse({ entryId: Number(req.params.entryId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(commentsTable)
    .leftJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(eq(commentsTable.knowledgeId, params.data.entryId))
    .orderBy(commentsTable.createdAt);

  res.json(ListKnowledgeCommentsResponse.parse(rows.map(r => formatComment(r.comments, r.users))));
});

router.post("/knowledge/:entryId/comments", requireAuth, async (req: any, res): Promise<void> => {
  const params = CreateKnowledgeCommentParams.safeParse({ entryId: Number(req.params.entryId) });
  const parsed = CreateKnowledgeCommentBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const [comment] = await db.insert(commentsTable).values({
    authorId: me.id,
    knowledgeId: params.data.entryId,
    content: parsed.data.content,
  }).returning();

  res.status(201).json(formatComment(comment, me));
});

router.delete("/comments/:commentId", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteCommentParams.safeParse({ commentId: Number(req.params.commentId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(commentsTable).where(eq(commentsTable.id, params.data.commentId));
  res.sendStatus(204);
});

export default router;
