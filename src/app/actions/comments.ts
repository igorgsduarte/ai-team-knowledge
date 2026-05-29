"use server";

import { requireAuthContext } from "@/lib/firebase/auth";
import { commentsRepository } from "@/lib/repositories/comments-repository";

export async function createComment(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  await commentsRepository.create(auth.workspaceId, {
    entityType: String(formData.get("entityType") || "knowledge") as "knowledge",
    entityId: String(formData.get("entityId") || ""),
    body: String(formData.get("body") || ""),
    createdBy: auth.userId,
  });
}
