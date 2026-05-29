import "server-only";

import { verifySession, verifySessionOptional } from "@/lib/dal/session";

export async function getAuthContext() {
  return verifySessionOptional();
}

export async function requireAuthContext() {
  return verifySession();
}

export async function requireEnrichedAuthContext() {
  return verifySession();
}
