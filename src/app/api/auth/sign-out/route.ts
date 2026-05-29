import { NextResponse } from "next/server";
import { applyClearAuthCookies } from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function POST() {
  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ ok: true });
  return applyClearAuthCookies(response, secure);
}
