import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import { getWorkspaceStorageBucket } from "@/lib/firebase/storage";
import { STORAGE_WORKSPACE_PREFIX } from "@/lib/firebase/storage-policy";

const WORKSPACE_SCOPED_COLLECTIONS = [
  firestoreCollections.agents,
  "boards",
  firestoreCollections.comments,
  firestoreCollections.files,
  firestoreCollections.knowledge,
  firestoreCollections.mcpKeys,
  firestoreCollections.skills,
  firestoreCollections.userSkills,
  firestoreCollections.workspaceInvites,
] as const;

async function deleteCollectionByWorkspaceId(collection: string, workspaceId: string): Promise<void> {
  const snapshot = await getFirestoreDb()
    .collection(collection)
    .where("workspaceId", "==", workspaceId)
    .get();

  if (snapshot.empty) {
    return;
  }

  const batch = getFirestoreDb().batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function deleteStoragePrefix(workspaceId: string): Promise<void> {
  const bucket = await getWorkspaceStorageBucket();
  const prefix = `${STORAGE_WORKSPACE_PREFIX}/${workspaceId}/`;
  await bucket.deleteFiles({ prefix });
}

export async function purgeWorkspaceData(workspaceId: string): Promise<void> {
  await deleteStoragePrefix(workspaceId);

  for (const collection of WORKSPACE_SCOPED_COLLECTIONS) {
    await deleteCollectionByWorkspaceId(collection, workspaceId);
  }

  await getFirestoreDb().collection(firestoreCollections.mcpWorkspaceSettings).doc(workspaceId).delete();
  await getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId).delete();
}
