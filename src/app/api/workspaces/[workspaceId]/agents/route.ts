import { NextResponse } from "next/server";
import { agentsRepository } from "@/lib/repositories/agents-repository";

export async function GET(_: Request, ctx: { params: Promise<{ workspaceId: string }> }): Promise<Response> {
  const { workspaceId } = await ctx.params;
  const current = await agentsRepository.current(workspaceId);
  const content = await agentsRepository.getContent(workspaceId);
  return NextResponse.json({ current, content });
}
