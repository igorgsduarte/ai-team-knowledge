"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AgentCard } from "@/components/agents/agent-card";
import { AgentDetailDrawer } from "@/components/agents/agent-detail-drawer";
import { EntityListToolbar } from "@/components/ui/entity-list-toolbar";
import { collectAuthors, collectTags, matchesEntityFilters } from "@/lib/entity-list-filters";
import type { Agent } from "@/lib/types/domain";

type AgentsPageClientProps = {
  authorNames: Record<string, string>;
  cards: Array<{
    agent: Agent;
    commentCount: number;
  }>;
  currentUserId: string;
};

export function AgentsPageClient({ authorNames, cards, currentUserId }: AgentsPageClientProps) {
  const t = useTranslations("Agents");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [selected, setSelected] = useState<Agent | null>(null);

  const agents = useMemo(() => cards.map((card) => card.agent), [cards]);
  const tagOptions = useMemo(() => collectTags(agents), [agents]);
  const authorOptions = useMemo(
    () => collectAuthors(agents, authorNames, t("unknownAuthor")),
    [agents, authorNames, t]
  );

  const visible = useMemo(
    () =>
      cards.filter((card) =>
        matchesEntityFilters(
          card.agent,
          { authorId, query, tag },
          (agent) => `${agent.name} ${agent.summary ?? ""} ${(agent.tags ?? []).join(" ")}`
        )
      ),
    [authorId, cards, query, tag]
  );

  return (
    <>
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
          <AgentCard
            agent={card.agent}
            authorName={authorNames[card.agent.createdBy] ?? t("unknownAuthor")}
            commentCount={card.commentCount}
            currentUserId={currentUserId}
            key={card.agent.id}
            onSelect={setSelected}
          />
        ))}
        {visible.length === 0 ? <p className="empty-state">{t("empty")}</p> : null}
      </section>
      <AgentDetailDrawer
        agent={selected}
        authorName={selected ? authorNames[selected.createdBy] ?? t("unknownAuthor") : ""}
        authorNames={authorNames}
        currentUserId={currentUserId}
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
