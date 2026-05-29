import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SkillCreateDrawer } from "@/components/skills/skill-create-drawer";
import { SkillsPageClient } from "@/components/skills/skills-page-client";
import { getAuthContext } from "@/lib/firebase/auth";
import { skillsRepository } from "@/lib/repositories/skills-repository";
import { userSkillsRepository } from "@/lib/repositories/user-skills-repository";

export default async function Page() {
  const common = await getTranslations("Common");
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return (
      <AppShell section="skills">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const t = await getTranslations("Skills");
  const skills = await skillsRepository.list(auth.workspaceId);
  const userSkills = await userSkillsRepository.listByUser(auth.workspaceId, auth.userId);
  const userSkillBySkillId = Object.fromEntries(
    userSkills.map((userSkill) => [userSkill.skillId, userSkill])
  );

  const memberCounts: Record<string, number> = {};
  await Promise.all(
    skills.map(async (skill) => {
      memberCounts[skill.id] = await userSkillsRepository.countBySkill(auth.workspaceId, skill.id);
    })
  );

  return (
    <AppShell section="skills">
      <div className="content-stack space-y-6">
        <PageHeader actions={<SkillCreateDrawer />} subtitle={t("subtitle")} title={t("pageTitle")} />
        <SkillsPageClient
          memberCounts={memberCounts}
          skills={skills}
          userSkillBySkillId={userSkillBySkillId}
          userSkills={userSkills}
        />
      </div>
    </AppShell>
  );
}
