import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { Board } from "@/lib/types/domain";

export const boardsRepository = {
  async list(workspaceId: string): Promise<Board[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.boards)
      .where("workspaceId", "==", workspaceId)
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as Board)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(workspaceId: string, id: string): Promise<Board | null> {
    const doc = await getFirestoreDb().collection(firestoreCollections.boards).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const board = doc.data() as Board;
    return board.workspaceId === workspaceId ? board : null;
  },

  async create(
    workspaceId: string,
    input: Omit<Board, "id" | "workspaceId" | "createdAt" | "updatedAt">
  ): Promise<Board> {
    const now = new Date().toISOString();
    const item: Board = {
      id: crypto.randomUUID(),
      workspaceId,
      createdAt: now,
      updatedAt: now,
      ...input,
    };

    await getFirestoreDb().collection(firestoreCollections.boards).doc(item.id).set(item);
    return item;
  },

  async delete(workspaceId: string, id: string): Promise<void> {
    const doc = await getFirestoreDb().collection(firestoreCollections.boards).doc(id).get();
    if (!doc.exists) {
      return;
    }
    const board = doc.data() as Board;
    if (board.workspaceId === workspaceId) {
      await doc.ref.delete();
    }
  },
};
