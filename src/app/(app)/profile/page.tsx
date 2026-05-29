import { getLocale, getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { AgentsEditDrawer } from "@/components/agents/agents-edit-drawer";
import { PageHeader } from "@/components/page-header";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { ProfileSkillsCard } from "@/components/profile/profile-skills-card";
import { ProfileLanguageForm } from "@/components/profile-language-form";
import { normalizeLocale, type AppLocale } from "@/i18n/locales";
import { getAuthContext } from "@/lib/firebase/auth";
import { agentsRepository } from "@/lib/repositories/agents-repository";
import { skillsRepository } from "@/lib/repositories/skills-repository";
import { userSkillsRepository } from "@/lib/repositories/user-skills-repository";
import { usersRepository } from "@/lib/repositories/users-repository";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const common = await getTranslations("Common");
  const locale = normalizeLocale(await getLocale()) as AppLocale;
  const auth = await getAuthContext();

  if (!auth?.workspaceId || !auth.userId) {
    return (
      <AppShell section="profile">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const profile =
    (await usersRepository.getUserProfile(auth.userId).catch(() => null)) ?? {
      id: auth.userId,
      email: auth.email,
      name: t("defaultName"),
      area: t("defaultArea"),
      bio: t("defaultBio"),
    };

  const currentLocale = normalizeLocale(profile.locale) ?? locale;
  const skills = await skillsRepository.list(auth.workspaceId);
  const userSkills = await userSkillsRepository.listByUser(auth.workspaceId, auth.userId);
  const agentsContent = (await agentsRepository.getContent(auth.workspaceId)) ?? t("agentsDefaultContent");

  return (
    <AppShell section="profile">
      <div className="content-stack space-y-6">
        <PageHeader subtitle={t("subtitle")} title={t("pageTitle")} />
        <div className="profile-layout">
          <ProfileInfoCard profile={{ ...profile, email: profile.email || auth.email }} />
          <div className="profile-side">
            <ProfileSkillsCard skills={skills} userSkills={userSkills} />
            <section className="app-card">
              <h2 className="mb-2 font-semibold">{t("languageTitle")}</h2>
              <p className="mb-3 text-sm muted">{t("languageDescription")}</p>
              <ProfileLanguageForm currentLocale={currentLocale} />
            </section>
            <AgentsEditDrawer initialContent={agentsContent} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
