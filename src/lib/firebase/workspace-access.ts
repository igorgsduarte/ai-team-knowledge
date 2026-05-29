import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { AuthContext, Workspace, WorkspaceMember } from "@/lib/types/domain";
import { WorkspaceAccessError, WorkspaceAccessErrorCode } from "@/lib/types/workspace-lifecycle";

export async function resolveWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<WorkspaceMember["role"] | null> {
  const snapshot = await getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId).get();
  if (!snapshot.exists) {
    return null;
  }

  const workspace = snapshot.data() as Workspace;
  const member = workspace.members.find((entry) => entry.userId === userId);
  return member?.role ?? null;
}

export async function getWorkspaceForAccess(workspaceId: string): Promise<Workspace | null> {
  const snapshot = await getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId).get();
  if (!snapshot.exists) {
    return null;
  }

  return { id: workspaceId, ...(snapshot.data() as Omit<Workspace, "id">) };
}

function assertMembership(auth: AuthContext, workspace: Workspace, workspaceId: string): WorkspaceMember {
  if (workspace.id !== workspaceId) {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.WORKSPACE_MISMATCH,
      "workspace id does not match session"
    );
  }

  const member = workspace.members.find((entry) => entry.userId === auth.userId);
  if (!member) {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.NOT_A_MEMBER,
      "user is not a member of this workspace"
    );
  }

  return member;
}

export async function requireWorkspaceMember(
  auth: AuthContext,
  workspaceId: string = auth.workspaceId
): Promise<WorkspaceMember> {
  const workspace = await getWorkspaceForAccess(workspaceId);
  if (!workspace) {
    throw new WorkspaceAccessError(WorkspaceAccessErrorCode.WORKSPACE_NOT_FOUND, "workspace not found");
  }

  return assertMembership(auth, workspace, workspaceId);
}

export async function requireWorkspaceOwner(
  auth: AuthContext,
  workspaceId: string = auth.workspaceId
): Promise<WorkspaceMember> {
  const member = await requireWorkspaceMember(auth, workspaceId);
  if (member.role !== "owner") {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.OWNER_REQUIRED,
      "workspace owner role is required"
    );
  }

  return member;
}

export async function requireWorkspaceAdmin(
  auth: AuthContext,
  workspaceId: string = auth.workspaceId
): Promise<WorkspaceMember> {
  const member = await requireWorkspaceMember(auth, workspaceId);
  if (member.role !== "owner" && member.role !== "admin") {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.ADMIN_REQUIRED,
      "workspace admin role is required"
    );
  }

  return member;
}

export async function requireActiveWorkspace(
  auth: AuthContext,
  workspaceId: string = auth.workspaceId
): Promise<Workspace> {
  const workspace = await getWorkspaceForAccess(workspaceId);
  if (!workspace) {
    throw new WorkspaceAccessError(WorkspaceAccessErrorCode.WORKSPACE_NOT_FOUND, "workspace not found");
  }

  assertMembership(auth, workspace, workspaceId);

  if ((workspace.status ?? "active") !== "active") {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.WORKSPACE_NOT_ACTIVE,
      "workspace is not active"
    );
  }

  return workspace;
}
