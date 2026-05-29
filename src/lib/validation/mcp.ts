import { z } from "zod";

export const mcpConnectSchema = z.object({
  apiKey: z.string().min(12),
  clientName: z.string().max(128).optional(),
  workspaceId: z.string().min(1),
});

export type McpConnectInput = z.infer<typeof mcpConnectSchema>;
