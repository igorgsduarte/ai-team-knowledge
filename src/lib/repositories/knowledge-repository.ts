import "server-only";
import {
  buildSummary,
  getLatestEntityContent,
  saveEntityContent,
} from "@/lib/firebase/entity-content";
import { isStorageBucketNotFoundError } from "@/lib/firebase/storage-bucket";
import { getWorkspaceForAccess } from "@/lib/firebase/workspace-access";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { KnowledgeItem, KnowledgeType } from "@/lib/types/domain";
import { WorkspaceAccessError, WorkspaceAccessErrorCode } from "@/lib/types/workspace-lifecycle";

async function assertWorkspaceAllowsWrites(workspaceId: string): Promise<void> {
  const workspace = await getWorkspaceForAccess(workspaceId);
  if (!workspace) {
    throw new WorkspaceAccessError(WorkspaceAccessErrorCode.WORKSPACE_NOT_FOUND, "workspace not found");
  }

  if ((workspace.status ?? "active") !== "active") {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.WORKSPACE_NOT_ACTIVE,
      "workspace is not active"
    );
  }
}

async function migrateLegacyBody(
  workspaceId: string,
  item: KnowledgeItem
): Promise<string | null> {
  const legacyBody = item.body?.trim();
  if (!legacyBody) {
    return null;
  }

  const existing = await getLatestEntityContent(workspaceId, "knowledge", item.id);
  if (existing) {
    return existing;
  }

  try {
    await saveEntityContent(workspaceId, "knowledge", item.id, legacyBody, item.createdBy);
    const summary = buildSummary(legacyBody);
    await getFirestoreDb().collection(firestoreCollections.knowledge).doc(item.id).update({
      summary,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (isStorageBucketNotFoundError(error)) {
      return legacyBody;
    }
    throw error;
  }

  return legacyBody;
}

export const knowledgeRepository = {
  async list(workspaceId: string): Promise<KnowledgeItem[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.knowledge)
      .where("workspaceId", "==", workspaceId)
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as KnowledgeItem)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(workspaceId: string, id: string): Promise<KnowledgeItem | null> {
    const doc = await getFirestoreDb().collection(firestoreCollections.knowledge).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const item = doc.data() as KnowledgeItem;
    return item.workspaceId === workspaceId ? item : null;
  },

  async getContent(workspaceId: string, id: string): Promise<string | null> {
    const item = await this.get(workspaceId, id);
    if (!item) {
      return null;
    }

    const content = await getLatestEntityContent(workspaceId, "knowledge", id);
    if (content) {
      return content;
    }

    return migrateLegacyBody(workspaceId, item);
  },

  async create(
    workspaceId: string,
    input: {
      title: string;
      body: string;
      type?: KnowledgeType;
      url?: string;
      tags: string[];
      createdBy: string;
    }
  ): Promise<KnowledgeItem> {
    await assertWorkspaceAllowsWrites(workspaceId);
    const now = new Date().toISOString();
    const item: KnowledgeItem = {
      id: crypto.randomUUID(),
      workspaceId,
      title: input.title,
      summary: buildSummary(input.body),
      type: input.type,
      url: input.url,
      tags: input.tags,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    await getFirestoreDb().collection(firestoreCollections.knowledge).doc(item.id).set(item);
    await saveEntityContent(workspaceId, "knowledge", item.id, input.body, input.createdBy);
    return item;
  },

  async update(
    workspaceId: string,
    id: string,
    input: {
      title?: string;
      body?: string;
      type?: KnowledgeType;
      url?: string;
      tags?: string[];
      authorId: string;
    }
  ): Promise<KnowledgeItem | null> {
    await assertWorkspaceAllowsWrites(workspaceId);
    const item = await this.get(workspaceId, id);
    if (!item) {
      return null;
    }

    const now = new Date().toISOString();
    const next: KnowledgeItem = {
      ...item,
      title: input.title ?? item.title,
      type: input.type ?? item.type,
      url: input.url ?? item.url,
      tags: input.tags ?? item.tags,
      updatedAt: now,
    };

    if (typeof input.body === "string") {
      next.summary = buildSummary(input.body);
      await saveEntityContent(workspaceId, "knowledge", id, input.body, input.authorId);
    }

    await getFirestoreDb().collection(firestoreCollections.knowledge).doc(id).set(next);
    return next;
  },

  async delete(workspaceId: string, id: string): Promise<void> {
    const doc = await getFirestoreDb().collection(firestoreCollections.knowledge).doc(id).get();
    if (!doc.exists) {
      return;
    }
    const item = doc.data() as KnowledgeItem;
    if (item.workspaceId === workspaceId) {
      await doc.ref.delete();
    }
  },
};
