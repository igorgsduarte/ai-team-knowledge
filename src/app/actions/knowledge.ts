"use server";

import { revalidatePath } from "next/cache";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireActiveWorkspace, requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { knowledgeRepository } from "@/lib/repositories/knowledge-repository";
import type { KnowledgeType } from "@/lib/types/domain";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseType(raw: FormDataEntryValue | null): KnowledgeType {
  return String(raw) === "link" ? "link" : "article";
}

export async function createKnowledge(formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);
  const body = String(formData.get("body") || "");
  await knowledgeRepository.create(auth.workspaceId, {
    body,
    createdBy: auth.userId,
    tags: parseTags(formData.get("tags")),
    title: String(formData.get("title") || "Untitled"),
    type: parseType(formData.get("type")),
    url: String(formData.get("url") || "") || undefined,
  });

  revalidatePath("/knowledge");
}

export async function getKnowledgeContent(knowledgeId: string): Promise<string | null> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  return knowledgeRepository.getContent(auth.workspaceId, knowledgeId);
}

export async function updateKnowledge(knowledgeId: string, formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  const item = await knowledgeRepository.get(auth.workspaceId, knowledgeId);
  if (!item) {
    return;
  }

  if (item.createdBy !== auth.userId) {
    throw new Error("Forbidden");
  }

  await knowledgeRepository.update(auth.workspaceId, knowledgeId, {
    authorId: auth.userId,
    body: String(formData.get("body") || ""),
    tags: parseTags(formData.get("tags")),
    title: String(formData.get("title") || item.title),
    type: parseType(formData.get("type")),
    url: String(formData.get("url") || "") || undefined,
  });

  revalidatePath("/knowledge");
}

export async function deleteKnowledge(knowledgeId: string): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  const item = await knowledgeRepository.get(auth.workspaceId, knowledgeId);
  if (item && item.createdBy !== auth.userId) {
    throw new Error("Forbidden");
  }

  await knowledgeRepository.delete(auth.workspaceId, knowledgeId);
  revalidatePath("/knowledge");
}
