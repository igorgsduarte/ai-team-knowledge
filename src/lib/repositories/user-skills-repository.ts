import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { UserSkill } from "@/lib/types/domain";

export const userSkillsRepository = {
  async listByUser(workspaceId: string, userId: string): Promise<UserSkill[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.userSkills)
      .where("workspaceId", "==", workspaceId)
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as UserSkill);
  },

  async listByWorkspace(workspaceId: string): Promise<UserSkill[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.userSkills)
      .where("workspaceId", "==", workspaceId)
      .get();

    return snapshot.docs.map((doc) => doc.data() as UserSkill);
  },

  async countBySkill(workspaceId: string, skillId: string): Promise<number> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.userSkills)
      .where("workspaceId", "==", workspaceId)
      .where("skillId", "==", skillId)
      .get();

    return snapshot.size;
  },

  async add(
    workspaceId: string,
    input: Omit<UserSkill, "id" | "workspaceId">
  ): Promise<UserSkill> {
    const item: UserSkill = {
      id: crypto.randomUUID(),
      workspaceId,
      ...input,
    };

    await getFirestoreDb().collection(firestoreCollections.userSkills).doc(item.id).set(item);
    return item;
  },

  async remove(workspaceId: string, id: string): Promise<void> {
    const doc = await getFirestoreDb().collection(firestoreCollections.userSkills).doc(id).get();
    if (!doc.exists) {
      return;
    }
    const item = doc.data() as UserSkill;
    if (item.workspaceId === workspaceId) {
      await doc.ref.delete();
    }
  },

  async findByUserAndSkill(
    workspaceId: string,
    userId: string,
    skillId: string
  ): Promise<UserSkill | null> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.userSkills)
      .where("workspaceId", "==", workspaceId)
      .where("userId", "==", userId)
      .where("skillId", "==", skillId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data() as UserSkill;
  },
};
