"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/firebase/auth";
import { skillsRepository } from "@/lib/repositories/skills-repository";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createSkill(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  const description = String(formData.get("description") || "");
  await skillsRepository.create(auth.workspaceId, {
    name: String(formData.get("name") || "Untitled"),
    prompt: description,
    description,
    tags: parseTags(formData.get("tags")),
    category: String(formData.get("category") || "") || undefined,
    createdBy: auth.userId,
  });

  revalidatePath("/skills");
}
