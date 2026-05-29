import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Skill, UserSkill, UserSkillLevel } from "@/lib/types/domain";

type ProfileSkillsCardProps = {
  skills: Skill[];
  userSkills: UserSkill[];
};

export async function ProfileSkillsCard({ skills, userSkills }: ProfileSkillsCardProps) {
  const t = await getTranslations("Skills");
  const profileT = await getTranslations("Profile");
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));

  const levelLabels: Record<UserSkillLevel, string> = {
    beginner: t("level.beginner"),
    intermediate: t("level.intermediate"),
    advanced: t("level.advanced"),
  };

  return (
    <section className="app-card profile-skills-card">
      <h2 className="font-semibold">{profileT("mySkillsTitle", { count: userSkills.length })}</h2>
      <div className="profile-skills-list">
        {userSkills.map((userSkill) => {
          const skill = skillMap.get(userSkill.skillId);
          if (!skill) {
            return null;
          }
          return (
            <div className="profile-skill-row" key={userSkill.id}>
              <span>{skill.name}</span>
              <StatusBadge
                kind="skill"
                label={levelLabels[userSkill.level]}
                value={userSkill.level}
              />
            </div>
          );
        })}
        {userSkills.length === 0 ? <p className="muted text-sm">{profileT("mySkillsEmpty")}</p> : null}
      </div>
    </section>
  );
}
