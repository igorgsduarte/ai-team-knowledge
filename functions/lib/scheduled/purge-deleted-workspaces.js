"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeDeletedWorkspaces = void 0;
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const workspace_purge_1 = require("../lib/workspace-purge");
exports.purgeDeletedWorkspaces = (0, scheduler_1.onSchedule)({
    region: "us-central1",
    schedule: "0 3 * * *",
    timeZone: "UTC",
}, async () => {
    const nowIso = new Date().toISOString();
    const snapshot = await (0, firestore_1.getFirestore)()
        .collection("workspaces")
        .where("status", "==", "pending_deletion")
        .where("purgeScheduledAt", "<=", nowIso)
        .get();
    if (snapshot.empty) {
        firebase_functions_1.logger.info("purge-deleted-workspaces: no workspaces eligible");
        return;
    }
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    for (const doc of snapshot.docs) {
        const workspaceId = doc.id;
        try {
            await (0, workspace_purge_1.purgeWorkspaceData)(workspaceId, bucketName);
            firebase_functions_1.logger.info("purge-deleted-workspaces: purged workspace", { workspaceId });
        }
        catch (error) {
            firebase_functions_1.logger.error("purge-deleted-workspaces: failed workspace", { error, workspaceId });
        }
    }
});
//# sourceMappingURL=purge-deleted-workspaces.js.map