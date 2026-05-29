import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { Comment } from "@/lib/types/domain";

export const commentsRepository = {
  async listByEntity(workspaceId: string, entityType: Comment["entityType"], entityId: string): Promise<Comment[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.comments)
      .where("workspaceId", "==", workspaceId)
      .where("entityType", "==", entityType)
      .where("entityId", "==", entityId)
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as Comment)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(workspaceId: string, input: Omit<Comment, "id" | "workspaceId" | "createdAt">): Promise<Comment> {
    const item: Comment = {
      id: crypto.randomUUID(),
      workspaceId,
      createdAt: new Date().toISOString(),
      ...input,
    };

    await getFirestoreDb().collection(firestoreCollections.comments).doc(item.id).set(item);
    return item;
  },
};
