"use server";

import { cookies } from "next/headers";
import { getSessionCookieOptions } from "@/lib/firebase/session-cookies";
import { requireEnrichedAuthContext } from "@/lib/firebase/auth";
import { requireWorkspaceMember, resolveWorkspaceRole } from "@/lib/firebase/workspace-access";
import { workspacesRepository } from "@/lib/repositories/workspaces-repository";
import { setWorkspaceStatusCookie } from "@/lib/workspace/workspace-cookies";
import { WorkspaceAccessError, WorkspaceAccessErrorCode } from "@/lib/types/workspace-lifecycle";

export async function setActiveWorkspace(workspaceId: string) {
  const auth = await requireEnrichedAuthContext();
  await requireWorkspaceMember(auth, workspaceId);

  const workspace = await workspacesRepository.getById(workspaceId);
  if (!workspace) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  const role = await resolveWorkspaceRole(auth.userId, workspaceId);
  if (workspace.status === "pending_deletion" && role !== "owner") {
    throw new WorkspaceAccessError(
      WorkspaceAccessErrorCode.WORKSPACE_NOT_ACTIVE,
      "workspace is pending deletion"
    );
  }

  const jar = await cookies();
  jar.set("tk_workspace_id", workspaceId, getSessionCookieOptions());
  await setWorkspaceStatusCookie(workspace.status ?? "active");

  return { userId: auth.userId, workspaceId };
}
