"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { AuthorOption } from "@/lib/entity-list-filters";

type EntityListToolbarProps = {
  authorId: string;
  authors: AuthorOption[];
  extraFilters?: ReactNode;
  onAuthorChange: (authorId: string) => void;
  onQueryChange: (query: string) => void;
  onTagChange: (tag: string) => void;
  query: string;
  searchPlaceholder: string;
  tag: string;
  tags: string[];
};

export function EntityListToolbar({
  authorId,
  authors,
  extraFilters,
  onAuthorChange,
  onQueryChange,
  onTagChange,
  query,
  searchPlaceholder,
  tag,
  tags,
}: EntityListToolbarProps) {
  const t = useTranslations("Common");

  return (
    <div className="entity-list-toolbar knowledge-toolbar">
      <input
        className="skills-search"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={searchPlaceholder}
        value={query}
      />
      <select
        aria-label={t("filterByTag")}
        onChange={(event) => onTagChange(event.target.value)}
        value={tag}
      >
        <option value="">{t("filterAllTags")}</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        aria-label={t("filterByAuthor")}
        onChange={(event) => onAuthorChange(event.target.value)}
        value={authorId}
      >
        <option value="">{t("filterAllAuthors")}</option>
        {authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </select>
      {extraFilters}
    </div>
  );
}
