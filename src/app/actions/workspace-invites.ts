"use server";

import { revalidatePath } from "next/cache";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireWorkspaceAdmin } from "@/lib/firebase/workspace-access";
import { workspaceInvitesRepository } from "@/lib/repositories/workspace-invites-repository";
import { deliverWorkspaceInvite } from "@/lib/workspace/invite-delivery";
import type { WorkspaceInvite } from "@/lib/types/workspace-lifecycle";

export async function createWorkspaceInvite(formData: FormData): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceAdmin(auth);
  const email = String(formData.get("email") || "").trim();

  await deliverWorkspaceInvite({
    email,
    invitedBy: auth.userId,
    role: "member",
    workspaceId: auth.workspaceId,
  });

  revalidatePath("/workspace/settings");
  revalidatePath("/team");
}

export async function revokeWorkspaceInvite(inviteId: string): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceAdmin(auth);
  await workspaceInvitesRepository.revokeInvite(auth.workspaceId, inviteId);
  revalidatePath("/workspace/settings");
  revalidatePath("/team");
}

export async function listWorkspaceInvites(): Promise<WorkspaceInvite[]> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceAdmin(auth);
  return workspaceInvitesRepository.listPendingByWorkspace(auth.workspaceId);
}

export async function acceptWorkspaceInvite(token: string): Promise<{ workspaceId: string }> {
  const auth = await requireEnrichedAuthContext();
  const result = await workspaceInvitesRepository.acceptInvite({
    email: auth.email,
    token,
    userId: auth.userId,
  });

  const { cookies } = await import("next/headers");
  const jar = await cookies();
  jar.set("tk_workspace_id", result.workspaceId, { httpOnly: true, path: "/" });
  await import("@/lib/workspace/workspace-cookies").then((mod) => mod.setWorkspaceStatusCookie("active"));

  return { workspaceId: result.workspaceId };
}
