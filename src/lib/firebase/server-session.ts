import { NextRequest, NextResponse } from "next/server";
import { localeCookieName, negotiateLocale, normalizeLocale } from "@/i18n/locales";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { getSessionCookieOptions, SESSION_MAX_AGE_SECONDS } from "@/lib/firebase/session-cookies";
import { usersRepository } from "@/lib/repositories/users-repository";
import { workspacesRepository } from "@/lib/repositories/workspaces-repository";

const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;
const LOCALE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function createAuthSessionResponse(idToken: string, request?: NextRequest): Promise<NextResponse> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(idToken);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });

  const response = NextResponse.json({ ok: true });
  const sessionCookieOptions = getSessionCookieOptions();
  const workspaceId = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || "acme";
  const workspace = await workspacesRepository.getById(workspaceId).catch(() => null);
  const profile = await usersRepository.getUserProfile(decoded.uid).catch(() => null);
  const locale = normalizeLocale(profile?.locale) ?? negotiateLocale(request?.headers.get("accept-language"));

  response.cookies.set("__session", sessionCookie, sessionCookieOptions);
  response.cookies.set("tk_user_id", decoded.uid, sessionCookieOptions);
  response.cookies.set("tk_workspace_id", workspaceId, sessionCookieOptions);
  response.cookies.set("tk_workspace_status", workspace?.status ?? "active", sessionCookieOptions);
  response.cookies.set("tk_email", decoded.email ?? "", sessionCookieOptions);
  response.cookies.set(localeCookieName, locale, {
    ...sessionCookieOptions,
    maxAge: LOCALE_MAX_AGE_SECONDS,
  });

  return response;
}

export function authErrorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function apiTooManyRequests(): NextResponse {
  return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
}
