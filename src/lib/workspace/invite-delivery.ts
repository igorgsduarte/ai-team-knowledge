import "server-only";

import { sendWorkspaceInviteEmail } from "@/lib/email/invite-mailer";
import { workspaceInvitesRepository } from "@/lib/repositories/workspace-invites-repository";
import { workspacesRepository } from "@/lib/repositories/workspaces-repository";
import type { WorkspaceInviteRole } from "@/lib/types/workspace-lifecycle";

function inviteBaseUrl(): string {
  const base = process.env.INVITE_BASE_URL;
  if (!base) {
    throw new Error("INVITE_BASE_URL_NOT_CONFIGURED");
  }
  return base.replace(/\/$/, "");
}

export async function deliverWorkspaceInvite(input: {
  email: string;
  invitedBy: string;
  role?: WorkspaceInviteRole;
  workspaceId: string;
}): Promise<void> {
  const email = input.email.trim();
  if (!email) {
    throw new Error("INVITE_EMAIL_REQUIRED");
  }

  const workspace = await workspacesRepository.getById(input.workspaceId);
  if (!workspace) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  const { token } = await workspaceInvitesRepository.createInvite({
    email,
    invitedBy: input.invitedBy,
    role: input.role ?? "member",
    workspaceId: input.workspaceId,
  });

  const inviteUrl = `${inviteBaseUrl()}/invite/${token}`;
  await sendWorkspaceInviteEmail({
    email,
    inviteUrl,
    workspaceName: workspace.name,
  });
}
