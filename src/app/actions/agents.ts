"use server";

import { revalidatePath } from "next/cache";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireActiveWorkspace, requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { agentsRepository } from "@/lib/repositories/agents-repository";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createAgent(formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);
  const body = String(formData.get("body") || "");
  await agentsRepository.create(auth.workspaceId, {
    body,
    createdBy: auth.userId,
    name: String(formData.get("name") || "Untitled"),
    tags: parseTags(formData.get("tags")),
  });

  revalidatePath("/agents");
}

export async function getAgentContent(agentId: string): Promise<string | null> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  return agentsRepository.getContent(auth.workspaceId, agentId);
}

export async function updateAgent(agentId: string, formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  const item = await agentsRepository.get(auth.workspaceId, agentId);
  if (!item) {
    return;
  }

  if (item.createdBy !== auth.userId) {
    throw new Error("Forbidden");
  }

  await agentsRepository.update(auth.workspaceId, agentId, {
    authorId: auth.userId,
    body: String(formData.get("body") || ""),
    name: String(formData.get("name") || item.name),
    tags: parseTags(formData.get("tags")),
  });

  revalidatePath("/agents");
}

export async function deleteAgent(agentId: string): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth);
  await requireActiveWorkspace(auth);

  const item = await agentsRepository.get(auth.workspaceId, agentId);
  if (item && item.createdBy !== auth.userId) {
    throw new Error("Forbidden");
  }

  await agentsRepository.delete(auth.workspaceId, agentId);
  revalidatePath("/agents");
}
