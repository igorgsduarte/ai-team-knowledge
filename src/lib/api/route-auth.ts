import "server-only";

import { NextResponse } from "next/server";
import { UnauthenticatedError } from "@/lib/dal/session";
import { WorkspaceAccessError } from "@/lib/types/workspace-lifecycle";

export function apiUnauthorized(): NextResponse {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export function apiForbidden(): NextResponse {
  return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
}

export function apiTooManyRequests(): NextResponse {
  return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof UnauthenticatedError) {
    return apiUnauthorized();
  }

  if (error instanceof WorkspaceAccessError) {
    return apiForbidden();
  }

  throw error;
}
