import { NextResponse } from "next/server";
import { apiTooManyRequests } from "@/lib/api/route-auth";
import { validateMcpConnection } from "@/lib/mcp/validator";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { mcpConnectSchema } from "@/lib/validation/mcp";

const MCP_RATE_LIMIT = 20;
const MCP_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: Request): Promise<Response> {
  if (!enforceRateLimit(req, "mcp-connect", MCP_RATE_LIMIT, MCP_RATE_WINDOW_MS)) {
    return apiTooManyRequests();
  }

  const body = (await req.json()) as unknown;
  const parsed = mcpConnectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "INVALID_KEY", message: "Invalid request payload" },
      { status: 400 }
    );
  }

  const result = await validateMcpConnection(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
