"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { KnowledgeToolbar } from "@/components/knowledge/knowledge-toolbar";
import type { KnowledgeItem } from "@/lib/types/domain";

type KnowledgePageClientProps = {
  cards: Array<{
    authorName: string;
    commentCount: number;
    item: KnowledgeItem;
  }>;
};

export function KnowledgePageClient({ cards }: KnowledgePageClientProps) {
  const t = useTranslations("Knowledge");
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);

  const items = cards.map((card) => card.item);
  const visible =
    filteredIds === null
      ? cards
      : cards.filter((card) => filteredIds.includes(card.item.id));

  return (
    <>
      <KnowledgeToolbar
        items={items}
        onFiltered={(next) => setFilteredIds(next.map((item) => item.id))}
      />
      <section className="two-column board-grid">
        {visible.map((card) => (
          <KnowledgeCard
            authorName={card.authorName}
            commentCount={card.commentCount}
            item={card.item}
            key={card.item.id}
          />
        ))}
        {visible.length === 0 ? <p className="empty-state">{t("empty")}</p> : null}
      </section>
    </>
  );
}
