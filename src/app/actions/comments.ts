"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/firebase/auth";
import { commentsRepository } from "@/lib/repositories/comments-repository";
import type { Comment } from "@/lib/types/domain";

const ENTITY_PATHS: Record<Comment["entityType"], string> = {
  agent: "/agents",
  knowledge: "/knowledge",
  skill: "/skills",
};

function parseEntityType(raw: FormDataEntryValue | null): Comment["entityType"] | null {
  const value = String(raw || "");
  if (value === "knowledge" || value === "skill" || value === "agent") {
    return value;
  }
  return null;
}

function revalidateEntityPath(entityType: Comment["entityType"]): void {
  revalidatePath(ENTITY_PATHS[entityType]);
}

export async function listComments(
  entityType: Comment["entityType"],
  entityId: string
): Promise<Comment[]> {
  const auth = await requireAuthContext();
  if (!entityId) {
    return [];
  }
  return commentsRepository.listByEntity(auth.workspaceId, entityType, entityId);
}

export async function createComment(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  const entityType = parseEntityType(formData.get("entityType"));
  const entityId = String(formData.get("entityId") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!entityType || !entityId || !body) {
    return;
  }

  await commentsRepository.create(auth.workspaceId, {
    body,
    createdBy: auth.userId,
    entityId,
    entityType,
  });
  revalidateEntityPath(entityType);
}

export async function updateComment(commentId: string, body: string): Promise<void> {
  const auth = await requireAuthContext();
  const trimmed = body.trim();
  if (!commentId || !trimmed) {
    return;
  }

  const comment = await commentsRepository.getById(auth.workspaceId, commentId);
  if (!comment || comment.createdBy !== auth.userId) {
    return;
  }

  await commentsRepository.update(auth.workspaceId, commentId, trimmed);
  revalidateEntityPath(comment.entityType);
}

export async function deleteComment(commentId: string): Promise<void> {
  const auth = await requireAuthContext();
  if (!commentId) {
    return;
  }

  const comment = await commentsRepository.getById(auth.workspaceId, commentId);
  if (!comment || comment.createdBy !== auth.userId) {
    return;
  }

  await commentsRepository.delete(auth.workspaceId, commentId);
  revalidateEntityPath(comment.entityType);
}
