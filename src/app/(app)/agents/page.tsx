import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { AgentCreateDrawer } from "@/components/agents/agent-create-drawer";
import { AgentsPageClient } from "@/components/agents/agents-page-client";
import { PageHeader } from "@/components/page-header";
import { getAuthContext } from "@/lib/firebase/auth";
import { agentsRepository } from "@/lib/repositories/agents-repository";
import { commentsRepository } from "@/lib/repositories/comments-repository";
import { usersRepository } from "@/lib/repositories/users-repository";

export default async function Page() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Agents");
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return (
      <AppShell section="agents">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const agents = await agentsRepository.list(auth.workspaceId);
  const members = await usersRepository.getUsersByWorkspace(auth.workspaceId);
  const authorNames: Record<string, string> = Object.fromEntries(
    members.map((member) => [member.id, member.name ?? t("unknownAuthor")])
  );

  const cards = await Promise.all(
    agents.map(async (agent) => ({
      agent,
      commentCount: (await commentsRepository.listByEntity(auth.workspaceId, "agent", agent.id)).length,
    }))
  );

  return (
    <AppShell section="agents">
      <div className="content-stack space-y-6">
        <PageHeader actions={<AgentCreateDrawer />} subtitle={t("subtitle")} title={t("pageTitle")} />
        <AgentsPageClient
          authorNames={authorNames}
          cards={cards}
          currentUserId={auth.userId}
        />
      </div>
    </AppShell>
  );
}
