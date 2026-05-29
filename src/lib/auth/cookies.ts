import type { NextResponse } from "next/server";

export const AUTH_COOKIE_NAMES = [
  "__session",
  "tk_auth_token",
  "tk_email",
  "tk_user_id",
  "tk_workspace_id",
  "tk_workspace_status",
] as const;

export const SESSION_EXPIRED_PATH = "/api/auth/clear-session";

export function getClearAuthCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax" as const,
    secure,
  };
}

export function applyClearAuthCookies(response: NextResponse, secure: boolean): NextResponse {
  const options = getClearAuthCookieOptions(secure);

  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.set(name, "", options);
  }

  return response;
}
