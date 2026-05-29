"use server";

import { requireAuthContext } from "@/lib/firebase/auth";
import { mcpRepository } from "@/lib/repositories/mcp-repository";

export async function setMcpEnabled(enabled: boolean) {
  const auth = await requireAuthContext();
  return mcpRepository.setWorkspaceMcp({
    workspaceId: auth.workspaceId,
    enabled,
    updatedAt: new Date().toISOString(),
    updatedBy: auth.userId,
  });
}
