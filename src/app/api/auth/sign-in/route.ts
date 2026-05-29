import { NextRequest } from "next/server";
import { authenticateWithPassword } from "@/lib/firebase/identity-toolkit";
import {
  apiTooManyRequests,
  authErrorResponse,
  createAuthSessionResponse,
} from "@/lib/firebase/server-session";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { signInSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

const AUTH_RATE_LIMIT = 5;
const AUTH_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!enforceRateLimit(request, "auth-sign-in", AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS)) {
    return apiTooManyRequests();
  }

  const body = (await request.json()) as unknown;
  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return authErrorResponse("Email e senha são obrigatórios.");
  }

  try {
    const { idToken } = await authenticateWithPassword(parsed.data);
    return createAuthSessionResponse(idToken, request);
  } catch {
    return authErrorResponse("Credenciais inválidas.", 401);
  }
}
