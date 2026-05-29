"use client";

import { ExternalLink, MessageCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteKnowledge } from "@/app/actions/knowledge";
import { RelativeTime } from "@/components/ui/relative-time";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { UserAvatar } from "@/components/ui/user-avatar";
import { stripMarkdown } from "@/lib/markdown";
import type { KnowledgeItem, KnowledgeType } from "@/lib/types/domain";

type KnowledgeCardProps = {
  authorName: string;
  commentCount: number;
  item: KnowledgeItem;
};

export function KnowledgeCard({ authorName, commentCount, item }: KnowledgeCardProps) {
  const t = useTranslations("Knowledge");
  const type: KnowledgeType = item.type ?? "article";

  return (
    <article className="list-card knowledge-card">
      <div className="list-card-header">
        <div className="board-card-author">
          <UserAvatar name={authorName} />
          <div>
            <p className="font-semibold">{authorName}</p>
            <RelativeTime date={item.createdAt} />
          </div>
        </div>
        <div className="board-card-actions">
          <StatusBadge
            kind="knowledge"
            label={type === "link" ? t("typeLink") : t("typeArticle")}
            value={type}
          />
          <form action={deleteKnowledge.bind(null, item.id)}>
            <button aria-label={t("delete")} className="icon-button" type="submit">
              <Trash2 size={16} />
            </button>
          </form>
        </div>
      </div>
      <h2 className="board-card-title">{item.title}</h2>
      <TagList tags={item.tags} />
      <p className="board-card-description">
        {stripMarkdown(item.summary || item.body || "") || t("noContent")}
      </p>
      {type === "link" && item.url ? (
        <a className="knowledge-link" href={item.url} rel="noreferrer" target="_blank">
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
