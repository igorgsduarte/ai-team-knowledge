import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import { readWorkspaceFile, uploadWorkspaceFile } from "@/lib/firebase/storage";
import type { AgentsDocumentVersion } from "@/lib/types/domain";

export const agentsRepository = {
  async createVersion(
    workspaceId: string,
    authorId: string,
    content: string,
    status: AgentsDocumentVersion["status"] = "published"
  ): Promise<AgentsDocumentVersion> {
    const meta = await uploadWorkspaceFile({
      workspaceId,
      entityType: "agents",
      entityId: "agents-md",
      content,
      authorId,
    });

    const latest = await getFirestoreDb()
      .collection(firestoreCollections.agents)
      .where("workspaceId", "==", workspaceId)
      .orderBy("version", "desc")
      .limit(1)
      .get();

    const version = (latest.empty ? 0 : Number(latest.docs[0].data().version ?? 0)) + 1;
    const item: AgentsDocumentVersion = {
      id: crypto.randomUUID(),
      workspaceId,
      version,
      status,
      authorId,
      storagePath: meta.path,
      createdAt: new Date().toISOString(),
    };

    await getFirestoreDb().collection(firestoreCollections.agents).doc(item.id).set(item);
    return item;
  },

  async list(workspaceId: string): Promise<AgentsDocumentVersion[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.agents)
      .where("workspaceId", "==", workspaceId)
      .orderBy("version", "desc")
      .get();

    return snapshot.docs.map((doc) => doc.data() as AgentsDocumentVersion);
  },

  async current(workspaceId: string): Promise<AgentsDocumentVersion | null> {
    const latest = await getFirestoreDb()
      .collection(firestoreCollections.agents)
      .where("workspaceId", "==", workspaceId)
      .orderBy("version", "desc")
      .limit(1)
      .get();

    if (latest.empty) {
      return null;
    }

    return latest.docs[0].data() as AgentsDocumentVersion;
  },

  async getContent(workspaceId: string, version?: number): Promise<string | null> {
    let record: AgentsDocumentVersion | null = null;

    if (typeof version === "number") {
      const snapshot = await getFirestoreDb()
        .collection(firestoreCollections.agents)
        .where("workspaceId", "==", workspaceId)
        .where("version", "==", version)
        .limit(1)
        .get();
      record = snapshot.empty ? null : (snapshot.docs[0].data() as AgentsDocumentVersion);
    } else {
      record = await this.current(workspaceId);
    }

    if (!record) {
      return null;
    }

    return readWorkspaceFile(record.storagePath);
  },
};
