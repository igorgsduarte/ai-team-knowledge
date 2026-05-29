import { cookies } from "next/headers";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { AuthContext } from "@/lib/types/domain";

export async function getAuthContext(): Promise<AuthContext | null> {
  const jar = await cookies();
  const workspaceId = jar.get("tk_workspace_id")?.value;
  if (!workspaceId) {
    return null;
  }

  const sessionCookie = jar.get("__session")?.value;
  if (sessionCookie && isFirebaseAdminConfigured()) {
    try {
      const decoded = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
      return {
        userId: decoded.uid,
        workspaceId,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  }

  const token = jar.get("tk_auth_token")?.value;
  if (token && isFirebaseAdminConfigured()) {
    try {
      const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
      return {
        userId: decoded.uid,
        workspaceId,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  }

  const userId = jar.get("tk_user_id")?.value;
  if (!userId) {
    return null;
  }

  return {
    userId,
    workspaceId,
    email: jar.get("tk_email")?.value,
  };
}

export async function requireAuthContext(): Promise<AuthContext> {
  const auth = await getAuthContext();
  if (!auth) {
    throw new Error("UNAUTHENTICATED");
  }
  return auth;
}
