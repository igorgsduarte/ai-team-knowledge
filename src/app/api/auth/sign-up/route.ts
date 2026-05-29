import { NextRequest } from "next/server";
import { authenticateWithPassword } from "@/lib/firebase/identity-toolkit";
import { authErrorResponse, createAuthSessionResponse } from "@/lib/firebase/server-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return authErrorResponse("Email e senha são obrigatórios.");
  }

  try {
    const { idToken } = await authenticateWithPassword({ email, password, createAccount: true });
    return createAuthSessionResponse(idToken, request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao cadastrar.";
    return authErrorResponse(message, 400);
  }
}
