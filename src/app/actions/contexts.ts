"use server";

import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireActiveWorkspace, requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { uploadWorkspaceFile } from "@/lib/firebase/storage";
import type { FileMetadata } from "@/lib/types/domain";

export async function uploadContext(formData: FormData): Promise<FileMetadata> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  return uploadWorkspaceFile({
    authorId: auth.userId,
    content: String(formData.get("content") || ""),
    entityId: String(formData.get("entityId") || "context"),
    entityType: "context",
    workspaceId: auth.workspaceId,
  });
}
