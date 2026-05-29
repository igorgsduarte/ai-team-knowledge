"use client";

import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { stripMarkdown } from "@/lib/markdown";
import type { Skill, UserSkill } from "@/lib/types/domain";
import { AddSkillButton } from "@/components/skills/add-skill-button";

type SkillCardProps = {
  memberCount: number;
  skill: Skill;
  userSkill: UserSkill | null;
};

export function SkillCard({ memberCount, skill, userSkill }: SkillCardProps) {
  const t = useTranslations("Skills");

  return (
    <article className="list-card skill-card">
      <div className="skill-card-header">
        <h2 className="font-semibold">{skill.name}</h2>
        {userSkill ? (
          <StatusBadge
            kind="skill"
            label={t(`level.${userSkill.level}`)}
            value={userSkill.level}
          />
        ) : (
          <AddSkillButton skillId={skill.id} />
        )}
      </div>
      <p className="board-card-description">
        {stripMarkdown(skill.description || skill.prompt || "") || t("noPrompt")}
      </p>
      <TagList tags={skill.tags ?? []} />
      <p className="muted text-sm">{t("memberCount", { count: memberCount })}</p>
    </article>
  );
}
