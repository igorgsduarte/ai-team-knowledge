import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applyClearAuthCookies, AUTH_COOKIE_NAMES } from "@/lib/auth/cookies";

const privatePrefixes = [
  "/dashboard",
  "/board",
  "/knowledge",
  "/skills",
  "/team",
  "/profile",
  "/workspace/settings",
];

const operationalPrefixes = ["/dashboard", "/knowledge", "/skills", "/team", "/profile"];

function hasSession(request: NextRequest): boolean {
  const hasUser = Boolean(request.cookies.get("tk_user_id")?.value);
  const hasWorkspace = Boolean(request.cookies.get("tk_workspace_id")?.value);
  const hasSessionCookie = Boolean(request.cookies.get("__session")?.value);
  return hasUser && hasWorkspace && hasSessionCookie;
}

function redirectWithClearedAuthCookies(request: NextRequest, pathname: string): NextResponse {
  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(new URL(pathname, request.url));
  return applyClearAuthCookies(response, secure);
}

// Middleware is a UX redirect layer only — not a security boundary.
// CVE-2025-29927 showed middleware can be bypassed; every API route,
// Server Action, and DAL call must re-verify auth independently.
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivate = privatePrefixes.some((prefix) => path.startsWith(prefix));
  const session = hasSession(request);

  if (isPrivate && !session) {
    return redirectWithClearedAuthCookies(request, "/");
  }

  const workspaceStatus = request.cookies.get("tk_workspace_status")?.value;
  if (
    workspaceStatus === "pending_deletion" &&
    operationalPrefixes.some((prefix) => path.startsWith(prefix))
  ) {
    return NextResponse.redirect(new URL("/workspace/settings?pending=1", request.url));
  }

  if (path === "/board" || path === "/dashboard") {
    return NextResponse.redirect(new URL("/knowledge", request.url));
  }

  if ((path === "/sign-in" || path === "/sign-up") && session) {
    return NextResponse.redirect(new URL("/knowledge", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export { AUTH_COOKIE_NAMES };
