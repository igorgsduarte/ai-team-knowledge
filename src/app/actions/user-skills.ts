"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/firebase/auth";
import { userSkillsRepository } from "@/lib/repositories/user-skills-repository";
import type { UserSkillLevel } from "@/lib/types/domain";

function parseLevel(raw: FormDataEntryValue | null): UserSkillLevel {
  const value = String(raw || "beginner");
  if (value === "intermediate" || value === "advanced") {
    return value;
  }
  return "beginner";
}

export async function addUserSkill(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  const skillId = String(formData.get("skillId") || "");
  if (!skillId) {
    return;
  }

  const existing = await userSkillsRepository.findByUserAndSkill(auth.workspaceId, auth.userId, skillId);
  if (existing) {
    return;
  }

  await userSkillsRepository.add(auth.workspaceId, {
    userId: auth.userId,
    skillId,
    level: parseLevel(formData.get("level")),
  });

  revalidatePath("/skills");
  revalidatePath("/team");
  revalidatePath("/profile");
}

export async function removeUserSkill(userSkillId: string): Promise<void> {
  const auth = await requireAuthContext();
  await userSkillsRepository.remove(auth.workspaceId, userSkillId);
  revalidatePath("/skills");
  revalidatePath("/team");
  revalidatePath("/profile");
}
