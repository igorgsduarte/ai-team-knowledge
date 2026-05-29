import "server-only";

import { cookies } from "next/headers";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { resolveWorkspaceRole } from "@/lib/firebase/workspace-access";
import type { AuthContext } from "@/lib/types/domain";

export class UnauthenticatedError extends Error {
  constructor() {
    super("UNAUTHENTICATED");
    this.name = "UnauthenticatedError";
  }
}

function isInsecureDevAuthAllowed(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.ALLOW_INSECURE_DEV_AUTH === "true";
}

async function buildAuthContext(
  userId: string,
  workspaceId: string,
  email?: string
): Promise<AuthContext> {
  const role = await resolveWorkspaceRole(userId, workspaceId);
  return {
    email,
    role: role ?? undefined,
    userId,
    workspaceId,
  };
}

async function resolveFromSessionCookie(
  sessionCookie: string,
  workspaceId: string
): Promise<AuthContext | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
    return buildAuthContext(decoded.uid, workspaceId, decoded.email);
  } catch {
    return null;
  }
}

async function resolveFromIdToken(token: string, workspaceId: string): Promise<AuthContext | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    return buildAuthContext(decoded.uid, workspaceId, decoded.email);
  } catch {
    return null;
  }
}

async function resolveFromInsecureCookies(
  jar: Awaited<ReturnType<typeof cookies>>
): Promise<AuthContext | null> {
  if (!isInsecureDevAuthAllowed()) {
    return null;
  }

  const userId = jar.get("tk_user_id")?.value;
  if (!userId) {
    return null;
  }

  const workspaceId = jar.get("tk_workspace_id")?.value;
  if (!workspaceId) {
    return null;
  }

  return buildAuthContext(userId, workspaceId, jar.get("tk_email")?.value);
}

export async function verifySessionOptional(): Promise<AuthContext | null> {
  const jar = await cookies();
  const workspaceId = jar.get("tk_workspace_id")?.value;
  if (!workspaceId) {
    return null;
  }

  const sessionCookie = jar.get("__session")?.value;
  if (sessionCookie) {
    const auth = await resolveFromSessionCookie(sessionCookie, workspaceId);
    if (auth) {
      return auth;
    }
  }

  const token = jar.get("tk_auth_token")?.value;
  if (token) {
    const auth = await resolveFromIdToken(token, workspaceId);
    if (auth) {
      return auth;
    }
  }

  return resolveFromInsecureCookies(jar);
}

export async function verifySession(): Promise<AuthContext> {
  const auth = await verifySessionOptional();
  if (!auth) {
    throw new UnauthenticatedError();
  }

  return auth;
}

export {
  requireActiveWorkspace,
  requireWorkspaceMember as authorizeWorkspaceMember,
  requireWorkspaceOwner as authorizeWorkspaceOwner,
  requireWorkspaceMember,
  requireWorkspaceOwner,
} from "@/lib/firebase/workspace-access";
