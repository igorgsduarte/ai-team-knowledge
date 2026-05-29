"use server";

import { requireAuthContext } from "@/lib/firebase/auth";
import { generateApiKey, hashApiKey } from "@/lib/mcp/key-hash";
import { mcpRepository } from "@/lib/repositories/mcp-repository";

export async function createMcpKey(expiresAt?: string) {
  const auth = await requireAuthContext();
  const plain = generateApiKey();
  const rec = await mcpRepository.createKey({
    workspaceId: auth.workspaceId,
    keyPrefix: plain.slice(0, 12),
    keyHash: hashApiKey(plain),
    status: "active",
    createdBy: auth.userId,
    expiresAt,
  });

  return { ...rec, plainKey: plain };
}

export async function revokeMcpKey(keyId: string) {
  const auth = await requireAuthContext();
  return mcpRepository.revokeKey(auth.workspaceId, keyId, auth.userId);
}

export async function rotateMcpKey(keyId: string) {
  await revokeMcpKey(keyId);
  return createMcpKey();
}
