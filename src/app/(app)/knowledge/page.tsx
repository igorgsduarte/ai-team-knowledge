import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { KnowledgeCreateDrawer } from "@/components/knowledge/knowledge-create-drawer";
import { KnowledgePageClient } from "@/components/knowledge/knowledge-page-client";
import { PageHeader } from "@/components/page-header";
import { getAuthContext } from "@/lib/firebase/auth";
import { commentsRepository } from "@/lib/repositories/comments-repository";
import { knowledgeRepository } from "@/lib/repositories/knowledge-repository";
import { usersRepository } from "@/lib/repositories/users-repository";

export default async function Page() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Knowledge");
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return (
      <AppShell section="knowledge">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const items = await knowledgeRepository.list(auth.workspaceId);
  const members = await usersRepository.getUsersByWorkspace(auth.workspaceId);
  const memberMap = new Map(members.map((member) => [member.id, member]));
  const authorNames: Record<string, string> = Object.fromEntries(
    members.map((member) => [member.id, member.name ?? t("unknownAuthor")])
  );

  const cards = await Promise.all(
    items.map(async (item) => ({
      item,
      authorName: memberMap.get(item.createdBy)?.name || t("unknownAuthor"),
      commentCount: (await commentsRepository.listByEntity(auth.workspaceId, "knowledge", item.id)).length,
    }))
  );

  return (
    <AppShell section="knowledge">
      <div className="content-stack space-y-6">
        <PageHeader actions={<KnowledgeCreateDrawer />} subtitle={t("subtitle")} title={t("pageTitle")} />
        <KnowledgePageClient authorNames={authorNames} cards={cards} currentUserId={auth.userId} />
      </div>
    </AppShell>
  );
}
