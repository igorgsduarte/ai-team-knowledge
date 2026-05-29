"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { KnowledgeItem, KnowledgeType } from "@/lib/types/domain";

type KnowledgeToolbarProps = {
  items: KnowledgeItem[];
  onFiltered: (items: KnowledgeItem[]) => void;
};

export function KnowledgeToolbar({ items, onFiltered }: KnowledgeToolbarProps) {
  const t = useTranslations("Knowledge");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | KnowledgeType>("all");

  useEffect(() => {
    const normalized = query.trim().toLowerCase();
    const next = items.filter((item) => {
      const matchesType = type === "all" || (item.type ?? "article") === type;
      if (!matchesType) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      const haystack = `${item.title} ${item.body} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(normalized);
    });
    onFiltered(next);
  }, [items, onFiltered, query, type]);

  return (
    <div className="knowledge-toolbar">
      <input
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        value={query}
      />
      <select onChange={(event) => setType(event.target.value as "all" | KnowledgeType)} value={type}>
        <option value="all">{t("filterAll")}</option>
        <option value="link">{t("filterLink")}</option>
        <option value="article">{t("filterArticle")}</option>
      </select>
    </div>
  );
}
