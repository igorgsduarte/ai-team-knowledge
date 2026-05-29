import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { getAuthContext } from "@/lib/firebase/auth";
import { skillsRepository } from "@/lib/repositories/skills-repository";

export default async function SkillDetail({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("Skills");
  const { id } = await params;
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return <AppShell section="skillDetail"><p>{t("missingWorkspace")}</p></AppShell>;
  }

  const item = await skillsRepository.get(auth.workspaceId, id);

  return (
    <AppShell section="skillDetail">
      {item ? <pre>{JSON.stringify(item, null, 2)}</pre> : <p>{t("notFound")}</p>}
    </AppShell>
  );
}
