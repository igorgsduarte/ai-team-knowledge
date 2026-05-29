import type { WorkspaceMember, WorkspaceMemberRole } from "@/lib/types/domain";

export function assertMemberCanBeManaged(
  actor: WorkspaceMember,
  target: WorkspaceMember,
  actorUserId: string,
  targetUserId: string
): void {
  if (target.role === "owner") {
    throw new Error("OWNER_CANNOT_BE_MODIFIED");
  }

  if (actorUserId === targetUserId) {
    throw new Error("SELF_MODIFICATION_NOT_ALLOWED");
  }

  if (actor.role === "admin" && target.role === "admin") {
    throw new Error("ADMIN_CANNOT_MANAGE_ADMIN");
  }
}

export function assertMemberRoleChangeAllowed(
  actor: WorkspaceMember,
  role: Extract<WorkspaceMemberRole, "admin" | "member">
): void {
  if (actor.role === "admin" && role === "admin") {
    throw new Error("ADMIN_CANNOT_PROMOTE_TO_ADMIN");
  }
}

export function normalizeMemberStatus(
  status: WorkspaceMember["status"] | undefined
): NonNullable<WorkspaceMember["status"]> {
  return status ?? "active";
}

export function normalizeMembers(members: WorkspaceMember[]): WorkspaceMember[] {
  return members.map((member) => ({
    ...member,
    status: normalizeMemberStatus(member.status),
  }));
}

export function findWorkspaceMember(
  members: WorkspaceMember[],
  userId: string
): WorkspaceMember | undefined {
  return members.find((member) => member.userId === userId);
}
