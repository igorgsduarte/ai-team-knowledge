"use client";

import { KeyboardEvent } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityCardAuthor } from "@/components/ui/entity-card-author";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { stripMarkdown } from "@/lib/markdown";
import type { Skill, UserSkill } from "@/lib/types/domain";
import { AddSkillButton } from "@/components/skills/add-skill-button";

type SkillCardProps = {
  authorName: string;
  commentCount: number;
  memberCount: number;
  onSelect: (skill: Skill) => void;
  skill: Skill;
  userSkill: UserSkill | null;
};

export function SkillCard({
  authorName,
  commentCount,
  memberCount,
  onSelect,
  skill,
  userSkill,
}: SkillCardProps) {
  const t = useTranslations("Skills");

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(skill);
    }
  }

  return (
    <article
      className="list-card skill-card skill-card-selectable"
      onClick={() => onSelect(skill)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="list-card-header">
        <EntityCardAuthor authorName={authorName} createdAt={skill.createdAt} />
        <div className="board-card-actions" onClick={(event) => event.stopPropagation()}>
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
      </div>
      <h2 className="board-card-title">{skill.name}</h2>
      <p className="board-card-description">
        {stripMarkdown(skill.description || skill.prompt || "") || t("noPrompt")}
      </p>
      <TagList tags={skill.tags ?? []} />
      <footer className="board-card-footer">
        <span className="muted text-sm">{t("memberCount", { count: memberCount })}</span>
        <span className="board-card-footer-comments">
          <MessageCircle aria-hidden size={16} />
          <span>{t("comments", { count: commentCount })}</span>
        </span>
      </footer>
    </article>
  );
}
