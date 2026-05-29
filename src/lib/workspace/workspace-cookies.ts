import { cookies } from "next/headers";
import { getSessionCookieOptions } from "@/lib/firebase/session-cookies";
import type { WorkspaceStatus } from "@/lib/types/domain";

export async function setWorkspaceStatusCookie(status: WorkspaceStatus): Promise<void> {
  const jar = await cookies();
  jar.set("tk_workspace_status", status, getSessionCookieOptions());
}

export async function clearWorkspaceStatusCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete("tk_workspace_status");
}
