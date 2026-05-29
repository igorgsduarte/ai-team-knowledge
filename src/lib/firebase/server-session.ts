import { NextRequest, NextResponse } from "next/server";
import { localeCookieName, negotiateLocale, normalizeLocale } from "@/i18n/locales";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { usersRepository } from "@/lib/repositories/users-repository";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;
const LOCALE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function createAuthSessionResponse(idToken: string, request?: NextRequest): Promise<NextResponse> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(idToken);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });

  const response = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  const workspaceId = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || "acme";
  const profile = await usersRepository.getUserProfile(decoded.uid).catch(() => null);
  const locale = normalizeLocale(profile?.locale) ?? negotiateLocale(request?.headers.get("accept-language"));

  response.cookies.set("__session", sessionCookie, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("tk_user_id", decoded.uid, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("tk_workspace_id", workspaceId, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("tk_email", decoded.email ?? "", {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: LOCALE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return response;
}

export function authErrorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status });
}
