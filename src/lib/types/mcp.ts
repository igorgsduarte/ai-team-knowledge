export type McpKeyStatus = "active" | "revoked" | "expired";
export interface McpApiKeyRecord { id: string; workspaceId: string; keyPrefix: string; keyHash: string; status: McpKeyStatus; createdAt: string; createdBy: string; expiresAt?: string; rotatedAt?: string; revokedAt?: string; revokedBy?: string; }
export interface McpConnectionRequest { workspaceId: string; apiKey: string; clientName?: string; }
export interface McpConnectionResponse { ok: boolean; code: "OK" | "INVALID_KEY" | "WORKSPACE_MISMATCH" | "MCP_DISABLED" | "RATE_LIMITED"; message: string; }
export interface McpWorkspaceSettings { workspaceId: string; enabled: boolean; updatedAt: string; updatedBy: string; }
