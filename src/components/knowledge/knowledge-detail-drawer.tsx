"use client";

import { ExternalLink } from "lucide-react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { getKnowledgeContent, updateKnowledge } from "@/app/actions/knowledge";
import { EntityMarkdownDrawer } from "@/components/ui/entity-markdown-drawer";
import type { KnowledgeItem, KnowledgeType } from "@/lib/types/domain";

type KnowledgeDetailDrawerProps = {
  authorName: string;
  authorNames: Record<string, string>;
  currentUserId: string;
  item: KnowledgeItem | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function KnowledgeDetailDrawer({
  authorName,
  authorNames,
  currentUserId,
  item,
  onOpenChange,
  open,
}: KnowledgeDetailDrawerProps) {
  const t = useTranslations("Knowledge");
  const editable = item?.createdBy === currentUserId;
  const type: KnowledgeType = item?.type ?? "article";

  const loadContent = useCallback(async () => {
    if (!item) {
      return null;
    }
    return getKnowledgeContent(item.id);
  }, [item]);

  if (!item) {
    return null;
  }

  return (
    <EntityMarkdownDrawer
      authorName={authorName}
      authorNames={authorNames}
      contentLabel={t("fieldBody")}
      currentUserId={currentUserId}
      entityId={item.id}
      entityType="knowledge"
      createdAt={item.createdAt}
      drawerTitle={editable ? t("drawerEditTitle", { title: item.title }) : t("drawerViewTitle", { title: item.title })}
      editable={editable}
      extra={
        type === "link" && item.url ? (
          <a className="knowledge-link" href={item.url} rel="noreferrer" target="_blank">
            <ExternalLink size={14} />
            {item.url}
          </a>
        ) : null
      }
      fields={
        <>
          <label>
            {t("fieldTitle")}
            <input defaultValue={item.title} name="title" required />
          </label>
          <label>
            {t("fieldType")}
            <select defaultValue={type} name="type">
              <option value="article">{t("typeArticle")}</option>
              <option value="link">{t("typeLink")}</option>
            </select>
          </label>
          <label>
            {t("fieldUrl")}
            <input defaultValue={item.url ?? ""} name="url" placeholder="https://" type="url" />
          </label>
          <label>
            {t("fieldTags")}
            <input defaultValue={item.tags.join(", ")} name="tags" />
          </label>
        </>
      }
      loadContent={loadContent}
      loadingLabel={t("loadingContent")}
      onOpenChange={onOpenChange}
      onSave={(formData) => updateKnowledge(item.id, formData)}
      open={open}
      previewContent={item.summary ?? ""}
      saveLabel={t("save")}
      savingLabel={t("saving")}
      tags={item.tags}
    />
  );
}
