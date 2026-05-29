"use server";

import { requireAuthContext } from "@/lib/firebase/auth";
import { agentsRepository } from "@/lib/repositories/agents-repository";

export async function publishAgents(content: string) {
  const auth = await requireAuthContext();
  const result = await agentsRepository.createVersion(auth.workspaceId, auth.userId, content, "published");
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/profile");
  return result;
}

export async function getAgentsHistory() {
  const auth = await requireAuthContext();
  return agentsRepository.list(auth.workspaceId);
}
