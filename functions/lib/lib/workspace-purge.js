"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeWorkspaceData = purgeWorkspaceData;
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
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
];
async function deleteCollectionByWorkspaceId(collection, workspaceId) {
    const db = (0, firestore_1.getFirestore)();
    const snapshot = await db.collection(collection).where("workspaceId", "==", workspaceId).get();
    if (snapshot.empty) {
        return;
    }
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
}
async function deleteStoragePrefix(workspaceId, bucketName) {
    const bucket = bucketName ? (0, storage_1.getStorage)().bucket(bucketName) : (0, storage_1.getStorage)().bucket();
    await bucket.deleteFiles({ prefix: `workspaces/${workspaceId}/` });
}
async function purgeWorkspaceData(workspaceId, bucketName) {
    await deleteStoragePrefix(workspaceId, bucketName);
    for (const collection of WORKSPACE_SCOPED_COLLECTIONS) {
        await deleteCollectionByWorkspaceId(collection, workspaceId);
    }
    const db = (0, firestore_1.getFirestore)();
    await db.collection("mcp_workspace_settings").doc(workspaceId).delete();
    await db.collection("workspaces").doc(workspaceId).delete();
}
//# sourceMappingURL=workspace-purge.js.map