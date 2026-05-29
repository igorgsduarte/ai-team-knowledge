import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateApiKey, hashApiKey } from "@/lib/mcp/key-hash";
import type { McpApiKeyRecord, McpWorkspaceSettings } from "@/lib/types/mcp";

const records = {
  settings: null as McpWorkspaceSettings | null,
  key: null as McpApiKeyRecord | null,
};

vi.mock("@/lib/repositories/mcp-repository", () => ({
  mcpRepository: {
    async setWorkspaceMcp(input: McpWorkspaceSettings) {
      records.settings = input;
      return input;
    },
    async getWorkspaceMcp(workspaceId: string) {
      return records.settings?.workspaceId === workspaceId ? records.settings : null;
    },
    async createKey(input: Omit<McpApiKeyRecord, "id" | "createdAt">) {
      records.key = { ...input, id: "key-1", createdAt: new Date().toISOString() };
      return records.key;
    },
    async findActiveByPrefix(workspaceId: string, keyPrefix: string) {
      if (records.key?.workspaceId !== workspaceId || records.key.keyPrefix !== keyPrefix || records.key.status !== "active") {
        return null;
      }
      return records.key;
    },
  },
}));

describe("mcp connection", () => {
  beforeEach(() => {
    vi.resetModules();
    records.settings = null;
    records.key = null;
  });

  it("accepts valid key for enabled workspace", async () => {
    const { mcpRepository } = await import("@/lib/repositories/mcp-repository");
    const { validateMcpConnection } = await import("@/lib/mcp/validator");

    const key = generateApiKey();
    await mcpRepository.setWorkspaceMcp({
      workspaceId: "w1",
      enabled: true,
      updatedAt: new Date().toISOString(),
      updatedBy: "u1",
    });

    await mcpRepository.createKey({
      workspaceId: "w1",
      keyPrefix: key.slice(0, 12),
      keyHash: hashApiKey(key),
      status: "active",
      createdBy: "u1",
    });

    const result = await validateMcpConnection({ workspaceId: "w1", apiKey: key });
    expect(result.ok).toBe(true);
  });
});
