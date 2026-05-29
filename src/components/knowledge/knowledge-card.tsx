"use client";

import { ExternalLink, MessageCircle, Trash2 } from "lucide-react";
import { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { deleteKnowledge } from "@/app/actions/knowledge";
import { EntityCardAuthor } from "@/components/ui/entity-card-author";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { stripMarkdown } from "@/lib/markdown";
import type { KnowledgeItem, KnowledgeType } from "@/lib/types/domain";

type KnowledgeCardProps = {
  authorName: string;
  commentCount: number;
  currentUserId: string;
  item: KnowledgeItem;
  onSelect: (item: KnowledgeItem) => void;
};

export function KnowledgeCard({ authorName, commentCount, currentUserId, item, onSelect }: KnowledgeCardProps) {
  const t = useTranslations("Knowledge");
  const type: KnowledgeType = item.type ?? "article";

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(item);
    }
  }

  return (
    <article
      className="list-card knowledge-card knowledge-card-selectable"
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="list-card-header">
        <EntityCardAuthor authorName={authorName} createdAt={item.createdAt} />
        <div className="board-card-actions">
          <StatusBadge
            kind="knowledge"
            label={type === "link" ? t("typeLink") : t("typeArticle")}
            value={type}
          />
          {item.createdBy === currentUserId ? (
            <form
              action={deleteKnowledge.bind(null, item.id)}
              onClick={(event) => event.stopPropagation()}
            >
              <button aria-label={t("delete")} className="icon-button" type="submit">
                <Trash2 size={16} />
              </button>
            </form>
          ) : null}
        </div>
      </div>
      <h2 className="board-card-title">{item.title}</h2>
      <TagList tags={item.tags} />
      <p className="board-card-description">
        {stripMarkdown(item.summary || item.body || "") || t("noContent")}
      </p>
      {type === "link" && item.url ? (
        <a
          className="knowledge-link"
          href={item.url}
          onClick={(event) => event.stopPropagation()}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={14} />
          {item.url}
        </a>
      ) : null}
      <footer className="board-card-footer">
        <MessageCircle aria-hidden size={16} />
        <span>{t("comments", { count: commentCount })}</span>
      </footer>
    </article>
  );
}
