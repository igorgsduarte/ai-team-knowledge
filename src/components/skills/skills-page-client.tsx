"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MySkillsPanel } from "@/components/skills/my-skills-panel";
import { SkillCard } from "@/components/skills/skill-card";
import { SkillDetailDrawer } from "@/components/skills/skill-detail-drawer";
import { EntityListToolbar } from "@/components/ui/entity-list-toolbar";
import { collectAuthors, collectTags, matchesEntityFilters } from "@/lib/entity-list-filters";
import type { Skill, UserSkill } from "@/lib/types/domain";

type SkillsPageClientProps = {
  authorNames: Record<string, string>;
  cards: Array<{
    commentCount: number;
    skill: Skill;
  }>;
  currentUserId: string;
  memberCounts: Record<string, number>;
  userSkillBySkillId: Record<string, UserSkill | null>;
  userSkills: UserSkill[];
};

export function SkillsPageClient({
  authorNames,
  cards,
  currentUserId,
  memberCounts,
  userSkillBySkillId,
  userSkills,
}: SkillsPageClientProps) {
  const t = useTranslations("Skills");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [selected, setSelected] = useState<Skill | null>(null);

  const skills = useMemo(() => cards.map((card) => card.skill), [cards]);
  const tagOptions = useMemo(() => collectTags(skills), [skills]);
  const authorOptions = useMemo(
    () => collectAuthors(skills, authorNames, t("unknownAuthor")),
    [authorNames, skills, t]
  );

  const visible = useMemo(
    () =>
      cards.filter((card) =>
        matchesEntityFilters(
          card.skill,
          { authorId, query, tag },
          (skill) =>
            `${skill.name} ${skill.description ?? ""} ${skill.prompt ?? ""} ${(skill.tags ?? []).join(" ")}`
        )
      ),
    [authorId, cards, query, tag]
  );

  return (
    <>
      <MySkillsPanel skills={skills} userSkills={userSkills} />
      <EntityListToolbar
        authorId={authorId}
        authors={authorOptions}
        onAuthorChange={setAuthorId}
        onQueryChange={setQuery}
        onTagChange={setTag}
        query={query}
        searchPlaceholder={t("searchPlaceholder")}
        tag={tag}
        tags={tagOptions}
      />
      <section className="entity-list-grid">
        {visible.map((card) => (
          <SkillCard
            authorName={authorNames[card.skill.createdBy] ?? t("unknownAuthor")}
            commentCount={card.commentCount}
            key={card.skill.id}
            memberCount={memberCounts[card.skill.id] ?? 0}
            onSelect={setSelected}
            skill={card.skill}
            userSkill={userSkillBySkillId[card.skill.id] ?? null}
          />
        ))}
        {visible.length === 0 ? <p className="empty-state">{t("empty")}</p> : null}
      </section>
      <SkillDetailDrawer
        authorName={selected ? authorNames[selected.createdBy] ?? t("unknownAuthor") : ""}
        authorNames={authorNames}
        currentUserId={currentUserId}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
        open={selected !== null}
        skill={selected}
      />
    </>
  );
}
