"use server";

import { revalidatePath } from "next/cache";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireWorkspaceOwner } from "@/lib/firebase/workspace-access";
import { workspacesRepository } from "@/lib/repositories/workspaces-repository";
import { clearWorkspaceStatusCookie, setWorkspaceStatusCookie } from "@/lib/workspace/workspace-cookies";

export type WorkspaceStats = {
  fileCount: number;
  memberCount: number;
  name: string;
  purgeScheduledAt?: string;
  status: string;
  workspaceId: string;
};

export async function getWorkspaceStats(): Promise<WorkspaceStats> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceOwner(auth);
  const workspace = await workspacesRepository.getById(auth.workspaceId);
  if (!workspace) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  return {
    fileCount: await workspacesRepository.countFilesByWorkspace(auth.workspaceId),
    memberCount: workspace.members.length,
    name: workspace.name,
    purgeScheduledAt: workspace.purgeScheduledAt,
    status: workspace.status ?? "active",
    workspaceId: workspace.id,
  };
}

export async function renameWorkspace(formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceOwner(auth);
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    throw new Error("WORKSPACE_NAME_REQUIRED");
  }

  await workspacesRepository.updateName(auth.workspaceId, name, auth.userId);
  revalidatePath("/workspace/settings");
}

export async function requestWorkspaceDeletion(): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceOwner(auth);
  await workspacesRepository.markPendingDeletion(auth.workspaceId, auth.userId);
  await setWorkspaceStatusCookie("pending_deletion");
  revalidatePath("/workspace/settings");
}

export async function restoreWorkspace(): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceOwner(auth);
  await workspacesRepository.restoreActive(auth.workspaceId, auth.userId);
  await setWorkspaceStatusCookie("active");
  revalidatePath("/workspace/settings");
}
