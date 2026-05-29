import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { getAuthContext } from "@/lib/firebase/auth";
import { skillsRepository } from "@/lib/repositories/skills-repository";
import { userSkillsRepository } from "@/lib/repositories/user-skills-repository";
import { usersRepository } from "@/lib/repositories/users-repository";
import type { UserSkillLevel } from "@/lib/types/domain";

export default async function TeamPage() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Team");
  const skillsT = await getTranslations("Skills");
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return (
      <AppShell section="team">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const levelLabels: Record<UserSkillLevel, string> = {
    beginner: skillsT("level.beginner"),
    intermediate: skillsT("level.intermediate"),
    advanced: skillsT("level.advanced"),
  };

  const members = await usersRepository.getUsersByWorkspace(auth.workspaceId);
  const skills = await skillsRepository.list(auth.workspaceId);
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));
  const workspaceUserSkills = await userSkillsRepository.listByWorkspace(auth.workspaceId);

  const cards = members.map((member) => ({
    member,
    skills: workspaceUserSkills
      .filter((userSkill) => userSkill.userId === member.id)
      .map((userSkill) => {
        const skill = skillMap.get(userSkill.skillId);
        return skill ? { name: skill.name, level: userSkill.level } : null;
      })
      .filter((entry): entry is { name: string; level: UserSkillLevel } => Boolean(entry)),
  }));

  return (
    <AppShell section="team">
      <div className="content-stack space-y-6">
        <PageHeader subtitle={t("subtitle")} title={t("pageTitle")} />
        <section className="team-grid">
          {cards.map(({ member, skills: memberSkills }) => (
            <TeamMemberCard key={member.id} levelLabels={levelLabels} member={member} skills={memberSkills} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
