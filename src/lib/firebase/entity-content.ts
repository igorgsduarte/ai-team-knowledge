import "server-only";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import { readWorkspaceFile, uploadWorkspaceFile } from "@/lib/firebase/storage";
import type { FileMetadata } from "@/lib/types/domain";

export { buildSummary } from "@/lib/markdown";

export async function getLatestEntityFile(
  workspaceId: string,
  entityType: FileMetadata["entityType"],
  entityId: string
): Promise<FileMetadata | null> {
  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.files)
    .where("entityId", "==", entityId)
    .get();

  const latest = snapshot.docs
    .map((doc) => doc.data() as FileMetadata)
    .filter((file) => file.workspaceId === workspaceId && file.entityType === entityType)
    .sort((a, b) => b.version - a.version)[0];

  return latest ?? null;
}

export async function getLatestEntityContent(
  workspaceId: string,
  entityType: FileMetadata["entityType"],
  entityId: string
): Promise<string | null> {
  const latest = await getLatestEntityFile(workspaceId, entityType, entityId);
  if (!latest) {
    return null;
  }

  return readWorkspaceFile(latest.path, workspaceId);
}

export async function saveEntityContent(
  workspaceId: string,
  entityType: FileMetadata["entityType"],
  entityId: string,
  content: string,
  authorId: string
): Promise<FileMetadata> {
  return uploadWorkspaceFile({
    authorId,
    content,
    entityId,
    entityType,
    workspaceId,
  });
}
