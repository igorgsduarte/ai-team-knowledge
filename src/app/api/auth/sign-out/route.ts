import { NextResponse } from "next/server";

const AUTH_COOKIES = ["__session", "tk_user_id", "tk_workspace_id", "tk_email", "tk_auth_token", "tk_locale"];

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of AUTH_COOKIES) {
    response.cookies.set(name, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
