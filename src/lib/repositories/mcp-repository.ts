import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { McpApiKeyRecord, McpWorkspaceSettings } from "@/lib/types/mcp";

export const mcpRepository = {
  async listKeys(workspaceId: string): Promise<McpApiKeyRecord[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.mcpKeys)
      .where("workspaceId", "==", workspaceId)
      .get();
    return snapshot.docs
      .map((doc) => doc.data() as McpApiKeyRecord)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async createKey(input: Omit<McpApiKeyRecord, "id" | "createdAt">): Promise<McpApiKeyRecord> {
    const item: McpApiKeyRecord = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await getFirestoreDb().collection(firestoreCollections.mcpKeys).doc(item.id).set(item);
    return item;
  },

  async revokeKey(workspaceId: string, keyId: string, userId: string): Promise<McpApiKeyRecord | null> {
    const ref = getFirestoreDb().collection(firestoreCollections.mcpKeys).doc(keyId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return null;
    }

    const item = snapshot.data() as McpApiKeyRecord;
    if (item.workspaceId !== workspaceId) {
      return null;
    }

    const updated: McpApiKeyRecord = {
      ...item,
      status: "revoked",
      revokedAt: new Date().toISOString(),
      revokedBy: userId,
    };

    await ref.set(updated);
    return updated;
  },

  async findActiveByPrefix(workspaceId: string, keyPrefix: string): Promise<McpApiKeyRecord | null> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.mcpKeys)
      .where("workspaceId", "==", workspaceId)
      .where("keyPrefix", "==", keyPrefix)
      .where("status", "==", "active")
      .limit(1)
      .get();

    return snapshot.empty ? null : (snapshot.docs[0].data() as McpApiKeyRecord);
  },

  async setWorkspaceMcp(input: McpWorkspaceSettings): Promise<McpWorkspaceSettings> {
    await getFirestoreDb().collection(firestoreCollections.mcpWorkspaceSettings).doc(input.workspaceId).set(input);
    return input;
  },

  async getWorkspaceMcp(workspaceId: string): Promise<McpWorkspaceSettings | null> {
    const snapshot = await getFirestoreDb().collection(firestoreCollections.mcpWorkspaceSettings).doc(workspaceId).get();
    return snapshot.exists ? (snapshot.data() as McpWorkspaceSettings) : null;
  },
};
