import { createHash } from "crypto";
import { getFirebaseAdminStorage } from "@/lib/firebase/admin";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { FileMetadata } from "@/lib/types/domain";

export function buildStoragePath(workspaceId: string, entityType: string, entityId: string, version: number): string {
  return `workspaces/${workspaceId}/${entityType}/${entityId}/v${version}.md`;
}

export async function uploadWorkspaceFile(input: {
  workspaceId: string;
  entityType: FileMetadata["entityType"];
  entityId: string;
  content: string;
  authorId: string;
  contentType?: string;
}): Promise<FileMetadata> {
  const existing = await getFirestoreDb()
    .collection(firestoreCollections.files)
    .where("workspaceId", "==", input.workspaceId)
    .where("entityType", "==", input.entityType)
    .where("entityId", "==", input.entityId)
    .orderBy("version", "desc")
    .limit(1)
    .get();

  const lastVersion = existing.empty ? 0 : Number(existing.docs[0].data().version ?? 0);
  const version = lastVersion + 1;
  const path = buildStoragePath(input.workspaceId, input.entityType, input.entityId, version);

  const bucket = getFirebaseAdminStorage().bucket();
  await bucket.file(path).save(input.content, {
    contentType: input.contentType ?? "text/markdown",
  });

  const item: FileMetadata = {
    id: crypto.randomUUID(),
    workspaceId: input.workspaceId,
    entityType: input.entityType,
    entityId: input.entityId,
    path,
    version,
    authorId: input.authorId,
    contentHash: createHash("sha256").update(input.content).digest("hex"),
    contentType: input.contentType ?? "text/markdown",
    createdAt: new Date().toISOString(),
  };

  await getFirestoreDb().collection(firestoreCollections.files).doc(item.id).set(item);
  return item;
}

export async function readWorkspaceFile(path: string): Promise<string | null> {
  const bucket = getFirebaseAdminStorage().bucket();
  const file = bucket.file(path);
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }

  const [buffer] = await file.download();
  return buffer.toString("utf8");
}
