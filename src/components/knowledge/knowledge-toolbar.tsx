"use client";

import { useTranslations } from "next-intl";
import { EntityListToolbar } from "@/components/ui/entity-list-toolbar";
import type { AuthorOption } from "@/lib/entity-list-filters";
import type { KnowledgeType } from "@/lib/types/domain";

type KnowledgeToolbarProps = {
  authorId: string;
  authors: AuthorOption[];
  onAuthorChange: (authorId: string) => void;
  onQueryChange: (query: string) => void;
  onTagChange: (tag: string) => void;
  onTypeChange: (type: "all" | KnowledgeType) => void;
  query: string;
  tag: string;
  tags: string[];
  type: "all" | KnowledgeType;
};

export function KnowledgeToolbar({
  authorId,
  authors,
  onAuthorChange,
  onQueryChange,
  onTagChange,
  onTypeChange,
  query,
  tag,
  tags,
  type,
}: KnowledgeToolbarProps) {
  const t = useTranslations("Knowledge");

  return (
    <EntityListToolbar
      authorId={authorId}
      authors={authors}
      extraFilters={
        <select onChange={(event) => onTypeChange(event.target.value as "all" | KnowledgeType)} value={type}>
          <option value="all">{t("filterAll")}</option>
          <option value="link">{t("filterLink")}</option>
          <option value="article">{t("filterArticle")}</option>
        </select>
      }
      onAuthorChange={onAuthorChange}
      onQueryChange={onQueryChange}
      onTagChange={onTagChange}
      query={query}
      searchPlaceholder={t("searchPlaceholder")}
      tag={tag}
      tags={tags}
    />
  );
}
