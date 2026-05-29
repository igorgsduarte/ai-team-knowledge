import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { KnowledgeItem } from "@/lib/types/domain";

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

  async create(
    workspaceId: string,
    input: Omit<KnowledgeItem, "id" | "workspaceId" | "createdAt" | "updatedAt">
  ): Promise<KnowledgeItem> {
    const now = new Date().toISOString();
    const item: KnowledgeItem = {
      id: crypto.randomUUID(),
      workspaceId,
      createdAt: now,
      updatedAt: now,
      ...input,
    };

    await getFirestoreDb().collection(firestoreCollections.knowledge).doc(item.id).set(item);
    return item;
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
