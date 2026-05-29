"use server";

import { revalidatePath } from "next/cache";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireWorkspaceAdmin } from "@/lib/firebase/workspace-access";
import { usersRepository } from "@/lib/repositories/users-repository";
import { workspacesRepository } from "@/lib/repositories/workspaces-repository";
import { deliverWorkspaceInvite } from "@/lib/workspace/invite-delivery";
import type { WorkspaceMemberRole, WorkspaceMemberStatus } from "@/lib/types/domain";
import type { WorkspaceInviteRole } from "@/lib/types/workspace-lifecycle";

function normalizeEmails(raw: string[]): string[] {
  const seen = new Set<string>();
  const emails: string[] = [];

  for (const value of raw) {
    const email = value.trim().toLowerCase();
    if (!email || seen.has(email)) {
      continue;
    }
    seen.add(email);
    emails.push(email);
  }

  return emails;
}

function parseInviteRole(value: string): WorkspaceInviteRole {
  if (value === "admin") {
    return "admin";
  }
  return "member";
}

function parseMemberRole(value: string): Extract<WorkspaceMemberRole, "admin" | "member"> {
  if (value === "admin") {
    return "admin";
  }
  return "member";
}

export async function sendWorkspaceInvites(input: {
  emails: string[];
  role: WorkspaceInviteRole;
}): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  const actor = await requireWorkspaceAdmin(auth);

  if (actor.role === "admin" && input.role === "admin") {
    throw new Error("ADMIN_CANNOT_INVITE_ADMIN");
  }

  const emails = normalizeEmails(input.emails);
  if (emails.length === 0) {
    throw new Error("INVITE_EMAIL_REQUIRED");
  }

  for (const email of emails) {
    await deliverWorkspaceInvite({
      email,
      invitedBy: auth.userId,
      role: input.role,
      workspaceId: auth.workspaceId,
    });
  }

  revalidatePath("/team");
  revalidatePath("/workspace/settings");
}

export async function updateWorkspaceMemberRole(
  userId: string,
  role: Extract<WorkspaceMemberRole, "admin" | "member">
): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  const actor = await requireWorkspaceAdmin(auth);

  await workspacesRepository.updateMemberRole(
    auth.workspaceId,
    actor,
    auth.userId,
    userId,
    role,
    auth.userId
  );

  revalidatePath("/team");
}

export async function setWorkspaceMemberStatus(
  userId: string,
  status: WorkspaceMemberStatus
): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  const actor = await requireWorkspaceAdmin(auth);

  await workspacesRepository.setMemberStatus(
    auth.workspaceId,
    actor,
    auth.userId,
    userId,
    status,
    auth.userId
  );

  revalidatePath("/team");
}

export async function removeWorkspaceMember(userId: string): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  const actor = await requireWorkspaceAdmin(auth);

  await workspacesRepository.removeMember(
    auth.workspaceId,
    actor,
    auth.userId,
    userId,
    auth.userId
  );

  revalidatePath("/team");
}

export async function updateWorkspaceMemberProfile(
  userId: string,
  input: { area: string; bio: string; name: string }
): Promise<void> {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceAdmin(auth);

  await usersRepository.updateProfile(userId, input);
  revalidatePath("/team");
  revalidatePath("/profile");
}

export async function sendWorkspaceInvitesFromForm(formData: FormData): Promise<void> {
  const emailsRaw = String(formData.get("emails") || "");
  const emails = emailsRaw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const role = parseInviteRole(String(formData.get("role") || "member"));

  await sendWorkspaceInvites({ emails, role });
}

export async function updateWorkspaceMemberRoleFromForm(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") || "");
  const role = parseMemberRole(String(formData.get("role") || "member"));
  await updateWorkspaceMemberRole(userId, role);
}
