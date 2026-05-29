"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { KnowledgeDetailDrawer } from "@/components/knowledge/knowledge-detail-drawer";
import { KnowledgeToolbar } from "@/components/knowledge/knowledge-toolbar";
import { collectAuthors, collectTags, matchesEntityFilters } from "@/lib/entity-list-filters";
import type { KnowledgeItem, KnowledgeType } from "@/lib/types/domain";

type KnowledgePageClientProps = {
  authorNames: Record<string, string>;
  cards: Array<{
    authorName: string;
    commentCount: number;
    item: KnowledgeItem;
  }>;
  currentUserId: string;
};

function matchesType(item: KnowledgeItem, type: "all" | KnowledgeType): boolean {
  return type === "all" || (item.type ?? "article") === type;
}

export function KnowledgePageClient({ authorNames, cards, currentUserId }: KnowledgePageClientProps) {
  const t = useTranslations("Knowledge");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [type, setType] = useState<"all" | KnowledgeType>("all");
  const [selected, setSelected] = useState<{
    authorName: string;
    item: KnowledgeItem;
  } | null>(null);

  const items = useMemo(() => cards.map((card) => card.item), [cards]);
  const tagOptions = useMemo(() => collectTags(items), [items]);
  const authorOptions = useMemo(
    () => collectAuthors(items, authorNames, t("unknownAuthor")),
    [authorNames, items, t]
  );

  const visible = useMemo(
    () =>
      cards.filter((card) => {
        if (!matchesType(card.item, type)) {
          return false;
        }
        return matchesEntityFilters(
          card.item,
          { authorId, query, tag },
          (item) => `${item.title} ${item.summary ?? ""} ${item.body ?? ""} ${item.tags.join(" ")}`
        );
      }),
    [authorId, cards, query, tag, type]
  );

  return (
    <>
      <KnowledgeToolbar
        authorId={authorId}
        authors={authorOptions}
        onAuthorChange={setAuthorId}
        onQueryChange={setQuery}
        onTagChange={setTag}
        onTypeChange={setType}
        query={query}
        tag={tag}
        tags={tagOptions}
        type={type}
      />
      <section className="entity-list-grid">
        {visible.map((card) => (
          <KnowledgeCard
            authorName={card.authorName}
            commentCount={card.commentCount}
            currentUserId={currentUserId}
            item={card.item}
            key={card.item.id}
            onSelect={(item) => setSelected({ authorName: card.authorName, item })}
          />
        ))}
        {visible.length === 0 ? <p className="empty-state">{t("empty")}</p> : null}
      </section>
      <KnowledgeDetailDrawer
        authorName={selected?.authorName ?? ""}
        authorNames={authorNames}
        currentUserId={currentUserId}
        item={selected?.item ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
        open={selected !== null}
      />
    </>
  );
}
