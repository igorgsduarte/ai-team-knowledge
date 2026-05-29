"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/firebase/auth";
import { boardsRepository } from "@/lib/repositories/boards-repository";
import type { BoardStatus } from "@/lib/types/domain";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseStatus(raw: FormDataEntryValue | null): BoardStatus {
  const value = String(raw || "learning");
  if (value === "doing" || value === "done") {
    return value;
  }
  return "learning";
}

export async function createBoard(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  await boardsRepository.create(auth.workspaceId, {
    title: String(formData.get("title") || "Untitled"),
    description: String(formData.get("description") || ""),
    status: parseStatus(formData.get("status")),
    tags: parseTags(formData.get("tags")),
    createdBy: auth.userId,
  });

  revalidatePath("/board");
}

export async function deleteBoard(boardId: string): Promise<void> {
  const auth = await requireAuthContext();
  await boardsRepository.delete(auth.workspaceId, boardId);
  revalidatePath("/board");
}
