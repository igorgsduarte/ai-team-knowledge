import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, knowledgeTable, usersTable, commentsTable } from "@workspace/db";
import {
  ListKnowledgeQueryParams,
  ListKnowledgeResponse,
  CreateKnowledgeBody,
  GetKnowledgeParams,
  GetKnowledgeResponse,
  UpdateKnowledgeParams,
  UpdateKnowledgeBody,
  UpdateKnowledgeResponse,
  DeleteKnowledgeParams,
} from "@workspace/api-zod";
import { requireAuth } from "./users";

const router: IRouter = Router();

async function formatEntry(k: any, author: any, commentsCount = 0) {
  return {
    id: k.id,
    authorId: k.authorId,
    type: k.type,
    title: k.title,
    content: k.content ?? null,
    url: k.url ?? null,
    description: k.description ?? null,
    tags: k.tags ?? [],
    commentsCount,
    author: author ? { ...author, createdAt: author.createdAt instanceof Date ? author.createdAt.toISOString() : author.createdAt } : undefined,
    createdAt: k.createdAt instanceof Date ? k.createdAt.toISOString() : k.createdAt,
    updatedAt: k.updatedAt instanceof Date ? k.updatedAt.toISOString() : k.updatedAt,
  };
}

router.get("/knowledge", async (req, res): Promise<void> => {
  const params = ListKnowledgeQueryParams.safeParse(req.query);

  const rows = await db
    .select()
    .from(knowledgeTable)
    .leftJoin(usersTable, eq(knowledgeTable.authorId, usersTable.id))
    .orderBy(knowledgeTable.createdAt);

  const counts = await db
    .select({ knowledgeId: commentsTable.knowledgeId, count: sql<number>`count(*)::int` })
    .from(commentsTable)
    .groupBy(commentsTable.knowledgeId);
  const countMap = new Map(counts.map(c => [c.knowledgeId, c.count]));

  let entries = await Promise.all(rows.map(r => formatEntry(r.knowledge, r.users, countMap.get(r.knowledge.id) ?? 0)));

  if (params.success) {
    if (params.data.type) entries = entries.filter(e => e.type === params.data.type);
    if (params.data.search) {
      const q = params.data.search.toLowerCase();
      entries = entries.filter(e => e.title.toLowerCase().includes(q) || (e.description ?? "").toLowerCase().includes(q) || e.tags.some((t: string) => t.toLowerCase().includes(q)));
    }
    if (params.data.tag) {
      const tag = params.data.tag.toLowerCase();
      entries = entries.filter(e => e.tags.some((t: string) => t.toLowerCase() === tag));
    }
    if (params.data.authorId) entries = entries.filter(e => e.authorId === params.data.authorId);
  }

  res.json(ListKnowledgeResponse.parse(entries.reverse()));
});

router.post("/knowledge", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateKnowledgeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  if (!me) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const [k] = await db.insert(knowledgeTable).values({
    authorId: me.id,
    type: parsed.data.type,
    title: parsed.data.title,
    content: parsed.data.content ?? null,
    url: parsed.data.url ?? null,
    description: parsed.data.description ?? null,
    tags: parsed.data.tags ?? [],
  }).returning();

  res.status(201).json(await formatEntry(k, me, 0));
});

router.get("/knowledge/:entryId", async (req, res): Promise<void> => {
  const params = GetKnowledgeParams.safeParse({ entryId: Number(req.params.entryId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(knowledgeTable)
    .leftJoin(usersTable, eq(knowledgeTable.authorId, usersTable.id))
    .where(eq(knowledgeTable.id, params.data.entryId))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(commentsTable)
    .where(eq(commentsTable.knowledgeId, row.knowledge.id));

  res.json(GetKnowledgeResponse.parse(await formatEntry(row.knowledge, row.users, countRow?.count ?? 0)));
});

router.patch("/knowledge/:entryId", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateKnowledgeParams.safeParse({ entryId: Number(req.params.entryId) });
  const parsed = UpdateKnowledgeBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [me] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.clerkId)).limit(1);
  const [entry] = await db.select().from(knowledgeTable).where(eq(knowledgeTable.id, params.data.entryId)).limit(1);
  if (!entry || !me || entry.authorId !== me.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const updates: any = {};
  if (parsed.data.title != null) updates.title = parsed.data.title;
  if (parsed.data.content != null) updates.content = parsed.data.content;
  if (parsed.data.url != null) updates.url = parsed.data.url;
  if (parsed.data.description != null) updates.description = parsed.data.description;
  if (parsed.data.tags != null) updates.tags = parsed.data.tags;

  const [updated] = await db.update(knowledgeTable).set(updates).where(eq(knowledgeTable.id, entry.id)).returning();
  res.json(await formatEntry(updated, me, 0));
});

router.delete("/knowledge/:entryId", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteKnowledgeParams.safeParse({ entryId: Number(req.params.entryId) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(knowledgeTable).where(eq(knowledgeTable.id, params.data.entryId));
  res.sendStatus(204);
});

export default router;
