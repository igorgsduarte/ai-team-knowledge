import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api/route-auth";
import { verifySession } from "@/lib/dal/session";
import { requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { agentsRepository } from "@/lib/repositories/agents-repository";

export async function GET(_: Request, ctx: { params: Promise<{ workspaceId: string }> }): Promise<Response> {
  try {
    const auth = await verifySession();
    const { workspaceId } = await ctx.params;
    await requireWorkspaceMember(auth, workspaceId);
    const agents = await agentsRepository.listWithContent(workspaceId);
    return NextResponse.json({ agents });
  } catch (error) {
    return handleRouteError(error);
  }
}
