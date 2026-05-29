"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { getSkillContent, updateSkill } from "@/app/actions/skills";
import { EntityMarkdownDrawer } from "@/components/ui/entity-markdown-drawer";
import type { Skill } from "@/lib/types/domain";

type SkillDetailDrawerProps = {
  authorName: string;
  authorNames: Record<string, string>;
  currentUserId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  skill: Skill | null;
};

export function SkillDetailDrawer({
  authorName,
  authorNames,
  currentUserId,
  onOpenChange,
  open,
  skill,
}: SkillDetailDrawerProps) {
  const t = useTranslations("Skills");
  const editable = skill?.createdBy === currentUserId;

  const loadContent = useCallback(async () => {
    if (!skill) {
      return null;
    }
    return getSkillContent(skill.id);
  }, [skill]);

  if (!skill) {
    return null;
  }

  return (
    <EntityMarkdownDrawer
      authorName={authorName}
      authorNames={authorNames}
      contentLabel={t("fieldPrompt")}
      currentUserId={currentUserId}
      entityId={skill.id}
      entityType="skill"
      createdAt={skill.createdAt}
      drawerTitle={editable ? t("drawerEditTitle", { title: skill.name }) : t("drawerViewTitle", { title: skill.name })}
      editable={editable}
      fields={
        <>
          <label>
            {t("fieldName")}
            <input defaultValue={skill.name} name="name" required />
          </label>
          <label>
            {t("fieldTags")}
            <input defaultValue={(skill.tags ?? []).join(", ")} name="tags" />
          </label>
        </>
      }
      loadContent={loadContent}
      loadingLabel={t("loadingContent")}
      onOpenChange={onOpenChange}
      onSave={(formData) => updateSkill(skill.id, formData)}
      open={open}
      previewContent={skill.description ?? ""}
      saveLabel={t("save")}
      savingLabel={t("saving")}
      tags={skill.tags ?? []}
    />
  );
}
