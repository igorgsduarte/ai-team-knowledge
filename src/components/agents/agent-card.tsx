"use client";

import { KeyboardEvent } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteAgent } from "@/app/actions/agents";
import { EntityCardAuthor } from "@/components/ui/entity-card-author";
import { TagList } from "@/components/ui/tag-list";
import { stripMarkdown } from "@/lib/markdown";
import type { Agent } from "@/lib/types/domain";

type AgentCardProps = {
  agent: Agent;
  authorName: string;
  commentCount: number;
  currentUserId: string;
  onSelect: (agent: Agent) => void;
};

export function AgentCard({ agent, authorName, commentCount, currentUserId, onSelect }: AgentCardProps) {
  const t = useTranslations("Agents");

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(agent);
    }
  }

  return (
    <article
      className="list-card agent-card agent-card-selectable"
      onClick={() => onSelect(agent)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="list-card-header">
        <EntityCardAuthor authorName={authorName} createdAt={agent.createdAt} />
        <div className="board-card-actions">
          {agent.createdBy === currentUserId ? (
            <form
              action={deleteAgent.bind(null, agent.id)}
              onClick={(event) => event.stopPropagation()}
            >
              <button aria-label={t("delete")} className="icon-button" type="submit">
                <Trash2 size={16} />
              </button>
            </form>
          ) : null}
        </div>
      </div>
      <h2 className="board-card-title">{agent.name}</h2>
      <TagList tags={agent.tags ?? []} />
      <p className="board-card-description">
        {stripMarkdown(agent.summary || "") || t("noContent")}
      </p>
      <footer className="board-card-footer">
        <MessageCircle aria-hidden size={16} />
        <span>{t("comments", { count: commentCount })}</span>
      </footer>
    </article>
  );
}
