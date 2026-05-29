"use server";

import { revalidatePath } from "next/cache";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireActiveWorkspace, requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { skillsRepository } from "@/lib/repositories/skills-repository";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createSkill(formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);
  const body = String(formData.get("description") || "");
  await skillsRepository.create(auth.workspaceId, {
    body,
    category: String(formData.get("category") || "") || undefined,
    createdBy: auth.userId,
    name: String(formData.get("name") || "Untitled"),
    tags: parseTags(formData.get("tags")),
  });

  revalidatePath("/skills");
}

export async function getSkillContent(skillId: string): Promise<string | null> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  return skillsRepository.getContent(auth.workspaceId, skillId);
}

export async function updateSkill(skillId: string, formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  const item = await skillsRepository.get(auth.workspaceId, skillId);
  if (!item) {
    return;
  }

  if (item.createdBy !== auth.userId) {
    throw new Error("Forbidden");
  }

  await skillsRepository.update(auth.workspaceId, skillId, {
    authorId: auth.userId,
    body: String(formData.get("body") || ""),
    category: String(formData.get("category") || "") || undefined,
    name: String(formData.get("name") || item.name),
    tags: parseTags(formData.get("tags")),
  });

  revalidatePath("/skills");
}

export async function deleteSkill(skillId: string): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  const item = await skillsRepository.get(auth.workspaceId, skillId);
  if (item && item.createdBy !== auth.userId) {
    throw new Error("Forbidden");
  }

  await skillsRepository.delete(auth.workspaceId, skillId);
  revalidatePath("/skills");
}
