import { compareApiKey } from "@/lib/mcp/key-hash";
import { mcpRepository } from "@/lib/repositories/mcp-repository";
import type { McpConnectionRequest, McpConnectionResponse } from "@/lib/types/mcp";

export async function validateMcpConnection(input: McpConnectionRequest): Promise<McpConnectionResponse> {
  const settings = await mcpRepository.getWorkspaceMcp(input.workspaceId);
  if (!settings?.enabled) {
    return { ok: false, code: "MCP_DISABLED", message: "MCP disabled for workspace" };
  }

  const key = await mcpRepository.findActiveByPrefix(input.workspaceId, input.apiKey.slice(0, 12));
  if (!key) {
    return { ok: false, code: "INVALID_KEY", message: "Invalid API key" };
  }

  if (!compareApiKey(input.apiKey, key.keyHash)) {
    return { ok: false, code: "INVALID_KEY", message: "Invalid API key" };
  }

  return { ok: true, code: "OK", message: "Connection authorized" };
}
