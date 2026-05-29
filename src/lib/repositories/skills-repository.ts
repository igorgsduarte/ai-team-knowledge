import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { Skill } from "@/lib/types/domain";

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

  async create(workspaceId: string, input: Omit<Skill, "id" | "workspaceId" | "createdAt" | "updatedAt">): Promise<Skill> {
    const now = new Date().toISOString();
    const item: Skill = {
      id: crypto.randomUUID(),
      workspaceId,
      createdAt: now,
      updatedAt: now,
      ...input,
    };

    await getFirestoreDb().collection(firestoreCollections.skills).doc(item.id).set(item);
    return item;
  },
};
