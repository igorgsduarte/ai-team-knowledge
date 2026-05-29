import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const WORKSPACE_SCOPED_COLLECTIONS = [
  "agents",
  "boards",
  "comments",
  "files",
  "knowledge",
  "mcp_keys",
  "skills",
  "userSkills",
  "workspace_invites",
] as const;

async function deleteCollectionByWorkspaceId(collection: string, workspaceId: string): Promise<void> {
  const db = getFirestore();
  const snapshot = await db.collection(collection).where("workspaceId", "==", workspaceId).get();
  if (snapshot.empty) {
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function deleteStoragePrefix(workspaceId: string, bucketName?: string): Promise<void> {
  const bucket = bucketName ? getStorage().bucket(bucketName) : getStorage().bucket();
  await bucket.deleteFiles({ prefix: `workspaces/${workspaceId}/` });
}

export async function purgeWorkspaceData(workspaceId: string, bucketName?: string): Promise<void> {
  await deleteStoragePrefix(workspaceId, bucketName);

  for (const collection of WORKSPACE_SCOPED_COLLECTIONS) {
    await deleteCollectionByWorkspaceId(collection, workspaceId);
  }

  const db = getFirestore();
  await db.collection("mcp_workspace_settings").doc(workspaceId).delete();
  await db.collection("workspaces").doc(workspaceId).delete();
}
