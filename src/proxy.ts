import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePrefixes = ["/dashboard", "/board", "/knowledge", "/skills", "/team", "/profile"];

function hasSession(request: NextRequest): boolean {
  const hasUser = Boolean(request.cookies.get("tk_user_id")?.value);
  const hasWorkspace = Boolean(request.cookies.get("tk_workspace_id")?.value);
  return hasUser && hasWorkspace;
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivate = privatePrefixes.some((prefix) => path.startsWith(prefix));
  const session = hasSession(request);

  if (isPrivate && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (path === "/dashboard") {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  if ((path === "/sign-in" || path === "/sign-up") && session) {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
