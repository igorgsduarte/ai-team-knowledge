"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/firebase/auth";
import { knowledgeRepository } from "@/lib/repositories/knowledge-repository";
import type { KnowledgeType } from "@/lib/types/domain";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseType(raw: FormDataEntryValue | null): KnowledgeType {
  return String(raw) === "article" ? "article" : "link";
}

export async function createKnowledge(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  const body = String(formData.get("body") || "");
  await knowledgeRepository.create(auth.workspaceId, {
    title: String(formData.get("title") || "Untitled"),
    body,
    summary: body.slice(0, 240),
    type: parseType(formData.get("type")),
    url: String(formData.get("url") || "") || undefined,
    tags: parseTags(formData.get("tags")),
    createdBy: auth.userId,
  });

  revalidatePath("/knowledge");
}

export async function deleteKnowledge(knowledgeId: string): Promise<void> {
  const auth = await requireAuthContext();
  await knowledgeRepository.delete(auth.workspaceId, knowledgeId);
  revalidatePath("/knowledge");
}
