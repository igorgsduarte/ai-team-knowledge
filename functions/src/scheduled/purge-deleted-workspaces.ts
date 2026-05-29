import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { purgeWorkspaceData } from "../lib/workspace-purge";

export const purgeDeletedWorkspaces = onSchedule(
  {
    region: "us-central1",
    schedule: "0 3 * * *",
    timeZone: "UTC",
  },
  async () => {
    const nowIso = new Date().toISOString();
    const snapshot = await getFirestore()
      .collection("workspaces")
      .where("status", "==", "pending_deletion")
      .where("purgeScheduledAt", "<=", nowIso)
      .get();

    if (snapshot.empty) {
      logger.info("purge-deleted-workspaces: no workspaces eligible");
      return;
    }

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    for (const doc of snapshot.docs) {
      const workspaceId = doc.id;
      try {
        await purgeWorkspaceData(workspaceId, bucketName);
        logger.info("purge-deleted-workspaces: purged workspace", { workspaceId });
      } catch (error) {
        logger.error("purge-deleted-workspaces: failed workspace", { error, workspaceId });
      }
    }
  }
);
