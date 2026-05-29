import { NextResponse } from "next/server";
import { validateMcpConnection } from "@/lib/mcp/validator";

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as { workspaceId: string; apiKey: string; clientName?: string };
  const result = await validateMcpConnection(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
