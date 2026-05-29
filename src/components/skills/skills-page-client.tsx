"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MySkillsPanel } from "@/components/skills/my-skills-panel";
import { SkillCard } from "@/components/skills/skill-card";
import type { Skill, UserSkill } from "@/lib/types/domain";

type SkillsPageClientProps = {
  memberCounts: Record<string, number>;
  skills: Skill[];
  userSkillBySkillId: Record<string, UserSkill | null>;
  userSkills: UserSkill[];
};

export function SkillsPageClient({
  memberCounts,
  skills,
  userSkillBySkillId,
  userSkills,
}: SkillsPageClientProps) {
  const t = useTranslations("Skills");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return skills;
    }
    return skills.filter((skill) => {
      const haystack = `${skill.name} ${skill.description} ${skill.prompt} ${(skill.tags ?? []).join(" ")}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, skills]);

  return (
    <>
      <MySkillsPanel skills={skills} userSkills={userSkills} />
      <input
        className="skills-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        value={query}
      />
      <section className="three-column skills-grid">
        {filtered.map((skill) => (
          <SkillCard
            key={skill.id}
            memberCount={memberCounts[skill.id] ?? 0}
            skill={skill}
            userSkill={userSkillBySkillId[skill.id] ?? null}
          />
        ))}
        {filtered.length === 0 ? <p className="empty-state">{t("empty")}</p> : null}
      </section>
    </>
  );
}
