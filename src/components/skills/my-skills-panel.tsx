"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { removeUserSkill } from "@/app/actions/user-skills";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Skill, UserSkill } from "@/lib/types/domain";

type MySkillsPanelProps = {
  skills: Skill[];
  userSkills: UserSkill[];
};

export function MySkillsPanel({ skills, userSkills }: MySkillsPanelProps) {
  const t = useTranslations("Skills");
  const [pending, startTransition] = useTransition();
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));

  return (
    <section className="app-card my-skills-panel">
      <h2 className="font-semibold">{t("mySkillsTitle")}</h2>
      <div className="my-skills-list">
        {userSkills.map((userSkill) => {
          const skill = skillMap.get(userSkill.skillId);
          if (!skill) {
            return null;
          }
          return (
            <div className="my-skill-row" key={userSkill.id}>
              <span className="font-medium">{skill.name}</span>
              <StatusBadge
                kind="skill"
                label={t(`level.${userSkill.level}`)}
                value={userSkill.level}
              />
              <button
                className="pill-link"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await removeUserSkill(userSkill.id);
                  })
                }
                type="button"
              >
                {t("remove")}
              </button>
            </div>
          );
        })}
        {userSkills.length === 0 ? <p className="muted text-sm">{t("mySkillsEmpty")}</p> : null}
      </div>
    </section>
  );
}
