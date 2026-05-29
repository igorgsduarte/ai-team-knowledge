import { NextResponse } from "next/server";
import { applyClearAuthCookies } from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(new URL("/", request.url));
  return applyClearAuthCookies(response, secure);
}
