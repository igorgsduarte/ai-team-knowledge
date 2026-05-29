import { NextRequest } from "next/server";
import { apiTooManyRequests, authErrorResponse, createAuthSessionResponse } from "@/lib/firebase/server-session";
import { authenticateWithPassword } from "@/lib/firebase/identity-toolkit";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { signUpSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

const AUTH_RATE_LIMIT = 5;
const AUTH_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!enforceRateLimit(request, "auth-sign-up", AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS)) {
    return apiTooManyRequests();
  }

  const body = (await request.json()) as unknown;
  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return authErrorResponse("Email e senha são obrigatórios.");
  }

  try {
    const { idToken } = await authenticateWithPassword({
      ...parsed.data,
      createAccount: true,
    });
    return createAuthSessionResponse(idToken, request);
  } catch {
    return authErrorResponse("Não foi possível criar a conta.", 400);
  }
}
