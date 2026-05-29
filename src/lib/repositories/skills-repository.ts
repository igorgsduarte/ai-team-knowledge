import "server-only";
import {
  buildSummary,
  getLatestEntityContent,
  saveEntityContent,
} from "@/lib/firebase/entity-content";
import { isStorageBucketNotFoundError } from "@/lib/firebase/storage-bucket";
import { getWorkspaceForAccess } from "@/lib/firebase/workspace-access";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { Skill } from "@/lib/types/domain";
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

async function migrateLegacyPrompt(
  workspaceId: string,
  item: Skill
): Promise<string | null> {
  const legacyContent = (item.prompt ?? item.description ?? "").trim();
  if (!legacyContent) {
    return null;
  }

  const existing = await getLatestEntityContent(workspaceId, "skill", item.id);
  if (existing) {
    return existing;
  }

  try {
    await saveEntityContent(workspaceId, "skill", item.id, legacyContent, item.createdBy);
    const summary = buildSummary(legacyContent);
    await getFirestoreDb().collection(firestoreCollections.skills).doc(item.id).update({
      description: summary,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (isStorageBucketNotFoundError(error)) {
      return legacyContent;
    }
    throw error;
  }

  return legacyContent;
}

export const skillsRepository = {
  async list(workspaceId: string): Promise<Skill[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.skills)
      .where("workspaceId", "==", workspaceId)
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as Skill)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(workspaceId: string, id: string): Promise<Skill | null> {
    const doc = await getFirestoreDb().collection(firestoreCollections.skills).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const item = doc.data() as Skill;
    return item.workspaceId === workspaceId ? item : null;
  },

  async getContent(workspaceId: string, id: string): Promise<string | null> {
    const item = await this.get(workspaceId, id);
    if (!item) {
      return null;
    }

    const content = await getLatestEntityContent(workspaceId, "skill", id);
    if (content) {
      return content;
    }

    return migrateLegacyPrompt(workspaceId, item);
  },

  async create(
    workspaceId: string,
    input: {
      name: string;
      body: string;
      tags?: string[];
      category?: string;
      createdBy: string;
    }
  ): Promise<Skill> {
    await assertWorkspaceAllowsWrites(workspaceId);
    const now = new Date().toISOString();
    const summary = buildSummary(input.body);
    const item: Skill = {
      id: crypto.randomUUID(),
      workspaceId,
      name: input.name,
      description: summary,
      tags: input.tags,
      category: input.category,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    await getFirestoreDb().collection(firestoreCollections.skills).doc(item.id).set(item);
    await saveEntityContent(workspaceId, "skill", item.id, input.body, input.createdBy);
    return item;
  },

  async update(
    workspaceId: string,
    id: string,
    input: {
      name?: string;
      body?: string;
      tags?: string[];
      category?: string;
      authorId: string;
    }
  ): Promise<Skill | null> {
    await assertWorkspaceAllowsWrites(workspaceId);
    const item = await this.get(workspaceId, id);
    if (!item) {
      return null;
    }

    const now = new Date().toISOString();
    const next: Skill = {
      ...item,
      name: input.name ?? item.name,
      tags: input.tags ?? item.tags,
      category: input.category ?? item.category,
      updatedAt: now,
    };

    if (typeof input.body === "string") {
      next.description = buildSummary(input.body);
      await saveEntityContent(workspaceId, "skill", id, input.body, input.authorId);
    }

    await getFirestoreDb().collection(firestoreCollections.skills).doc(id).set(next);
    return next;
  },

  async delete(workspaceId: string, id: string): Promise<void> {
    const doc = await getFirestoreDb().collection(firestoreCollections.skills).doc(id).get();
    if (!doc.exists) {
      return;
    }
    const item = doc.data() as Skill;
    if (item.workspaceId === workspaceId) {
      await doc.ref.delete();
    }
  },
};
