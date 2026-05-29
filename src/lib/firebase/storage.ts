import { createHash } from "crypto";
import type { Bucket } from "@google-cloud/storage";
import { getFirebaseAdminStorage } from "@/lib/firebase/admin";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import {
  listStorageBucketCandidates,
  StorageBucketNotFoundError,
} from "@/lib/firebase/storage-bucket";
import { assertGovernedEntityType, buildStoragePath, validateStoragePath } from "@/lib/firebase/storage-policy";
import type { FileMetadata } from "@/lib/types/domain";

export { buildStoragePath } from "@/lib/firebase/storage-policy";

let resolvedBucket: Bucket | null = null;

function getProjectIdForStorage(): string {
  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim() || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!projectId) {
    throw new Error("FIREBASE_CONFIG_MISSING: missing FIREBASE_PROJECT_ID");
  }
  return projectId;
}

export async function getWorkspaceStorageBucket(): Promise<Bucket> {
  if (resolvedBucket) {
    return resolvedBucket;
  }

  const projectId = getProjectIdForStorage();
  const storage = getFirebaseAdminStorage();
  const candidates = listStorageBucketCandidates(projectId);

  for (const name of candidates) {
    const bucket = storage.bucket(name);
    const [exists] = await bucket.exists();
    if (exists) {
      resolvedBucket = bucket;
      return bucket;
    }
  }

  throw new StorageBucketNotFoundError(projectId, candidates);
}

export async function uploadWorkspaceFile(input: {
  workspaceId: string;
  entityType: FileMetadata["entityType"];
  entityId: string;
  content: string;
  authorId: string;
  contentType?: string;
}): Promise<FileMetadata> {
  const entityType = assertGovernedEntityType(input.entityType);

  const existing = await getFirestoreDb()
    .collection(firestoreCollections.files)
    .where("entityId", "==", input.entityId)
    .get();

  const scoped = existing.docs
    .map((doc) => doc.data() as FileMetadata)
    .filter((file) => file.workspaceId === input.workspaceId && file.entityType === entityType);

  const lastVersion = scoped.length
    ? Math.max(...scoped.map((file) => Number(file.version ?? 0)))
    : 0;
  const version = lastVersion + 1;
  const path = buildStoragePath(input.workspaceId, entityType, input.entityId, version);
  validateStoragePath(path, input.workspaceId);

  const bucket = await getWorkspaceStorageBucket();
  await bucket.file(path).save(input.content, {
    contentType: input.contentType ?? "text/markdown",
  });

  const item: FileMetadata = {
    id: crypto.randomUUID(),
    workspaceId: input.workspaceId,
    entityType,
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

export async function readWorkspaceFile(path: string, expectedWorkspaceId: string): Promise<string | null> {
  validateStoragePath(path, expectedWorkspaceId);

  const bucket = await getWorkspaceStorageBucket();
  const file = bucket.file(path);
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }

  const [buffer] = await file.download();
  return buffer.toString("utf8");
}
