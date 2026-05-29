import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { getAuthContext } from "@/lib/firebase/auth";
import { knowledgeRepository } from "@/lib/repositories/knowledge-repository";

export default async function KnowledgeDetail({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("Knowledge");
  const { id } = await params;
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return <AppShell section="knowledgeDetail"><p>{t("missingWorkspace")}</p></AppShell>;
  }

  const item = await knowledgeRepository.get(auth.workspaceId, id);

  return (
    <AppShell section="knowledgeDetail">
      {item ? <pre>{JSON.stringify(item, null, 2)}</pre> : <p>{t("notFound")}</p>}
    </AppShell>
  );
}
