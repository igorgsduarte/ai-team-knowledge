import "server-only";
import {
  buildSummary,
  getLatestEntityContent,
  saveEntityContent,
} from "@/lib/firebase/entity-content";
import { getWorkspaceForAccess } from "@/lib/firebase/workspace-access";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { Agent } from "@/lib/types/domain";
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

function isLegacyAgentRecord(data: Record<string, unknown>): boolean {
  return typeof data.version === "number" && typeof data.storagePath === "string";
}

export const agentsRepository = {
  async list(workspaceId: string): Promise<Agent[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.agents)
      .where("workspaceId", "==", workspaceId)
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as Agent)
      .filter((item) => !isLegacyAgentRecord(item as unknown as Record<string, unknown>))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(workspaceId: string, id: string): Promise<Agent | null> {
    const doc = await getFirestoreDb().collection(firestoreCollections.agents).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const item = doc.data() as Agent;
    if (item.workspaceId !== workspaceId) {
      return null;
    }
    if (isLegacyAgentRecord(item as unknown as Record<string, unknown>)) {
      return null;
    }
    return item;
  },

  async getContent(workspaceId: string, id: string): Promise<string | null> {
    const item = await this.get(workspaceId, id);
    if (!item) {
      return null;
    }

    return getLatestEntityContent(workspaceId, "agents", id);
  },

  async create(
    workspaceId: string,
    input: {
      name: string;
      body: string;
      tags?: string[];
      createdBy: string;
    }
  ): Promise<Agent> {
    await assertWorkspaceAllowsWrites(workspaceId);
    const now = new Date().toISOString();
    const item: Agent = {
      id: crypto.randomUUID(),
      workspaceId,
      name: input.name,
      summary: buildSummary(input.body),
      tags: input.tags,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    await getFirestoreDb().collection(firestoreCollections.agents).doc(item.id).set(item);
    await saveEntityContent(workspaceId, "agents", item.id, input.body, input.createdBy);
    return item;
  },

  async update(
    workspaceId: string,
    id: string,
    input: {
      name?: string;
      body?: string;
      tags?: string[];
      authorId: string;
    }
  ): Promise<Agent | null> {
    await assertWorkspaceAllowsWrites(workspaceId);
    const item = await this.get(workspaceId, id);
    if (!item) {
      return null;
    }

    const now = new Date().toISOString();
    const next: Agent = {
      ...item,
      name: input.name ?? item.name,
      tags: input.tags ?? item.tags,
      updatedAt: now,
    };

    if (typeof input.body === "string") {
      next.summary = buildSummary(input.body);
      await saveEntityContent(workspaceId, "agents", id, input.body, input.authorId);
    }

    await getFirestoreDb().collection(firestoreCollections.agents).doc(id).set(next);
    return next;
  },

  async delete(workspaceId: string, id: string): Promise<void> {
    const doc = await getFirestoreDb().collection(firestoreCollections.agents).doc(id).get();
    if (!doc.exists) {
      return;
    }
    const item = doc.data() as Agent;
    if (item.workspaceId === workspaceId && !isLegacyAgentRecord(item as unknown as Record<string, unknown>)) {
      await doc.ref.delete();
    }
  },

  async listWithContent(workspaceId: string): Promise<Array<Agent & { content: string | null }>> {
    const agents = await this.list(workspaceId);
    return Promise.all(
      agents.map(async (agent) => ({
        ...agent,
        content: await this.getContent(workspaceId, agent.id),
      }))
    );
  },
};
