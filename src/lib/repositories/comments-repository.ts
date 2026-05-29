import "server-only";
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

  async getById(workspaceId: string, commentId: string): Promise<Comment | null> {
    const doc = await getFirestoreDb().collection(firestoreCollections.comments).doc(commentId).get();
    if (!doc.exists) {
      return null;
    }
    const item = doc.data() as Comment;
    if (item.workspaceId !== workspaceId) {
      return null;
    }
    return item;
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

  async update(workspaceId: string, commentId: string, body: string): Promise<Comment | null> {
    const item = await this.getById(workspaceId, commentId);
    if (!item) {
      return null;
    }
    const updated: Comment = {
      ...item,
      body,
    };
    await getFirestoreDb().collection(firestoreCollections.comments).doc(commentId).set(updated);
    return updated;
  },

  async delete(workspaceId: string, commentId: string): Promise<boolean> {
    const item = await this.getById(workspaceId, commentId);
    if (!item) {
      return false;
    }
    await getFirestoreDb().collection(firestoreCollections.comments).doc(commentId).delete();
    return true;
  },
};
