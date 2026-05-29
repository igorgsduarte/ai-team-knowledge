import { MessageCircle, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { deleteBoard } from "@/app/actions/boards";
import { RelativeTime } from "@/components/ui/relative-time";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagList } from "@/components/ui/tag-list";
import { UserAvatar } from "@/components/ui/user-avatar";
import { stripMarkdown } from "@/lib/markdown";
import type { Board, BoardStatus } from "@/lib/types/domain";
import type { UserProfile } from "@/lib/repositories/users-repository";

type BoardCardProps = {
  author: UserProfile | null;
  board: Board;
  commentCount: number;
};

const statusKeys: Record<BoardStatus, string> = {
  learning: "statusLearning",
  doing: "statusDoing",
  done: "statusDone",
};

export async function BoardCard({ author, board, commentCount }: BoardCardProps) {
  const t = await getTranslations("Board");
  const status = board.status ?? "learning";
  const authorName = author?.name || t("unknownAuthor");

  return (
    <article className="list-card board-card">
      <div className="list-card-header">
        <div className="board-card-author">
          <UserAvatar name={authorName} />
          <div>
            <p className="font-semibold">{authorName}</p>
            <RelativeTime date={board.createdAt} />
          </div>
        </div>
        <div className="board-card-actions">
          <StatusBadge kind="board" label={t(statusKeys[status])} value={status} />
          <form action={deleteBoard.bind(null, board.id)}>
            <button aria-label={t("delete")} className="icon-button" type="submit">
              <Trash2 size={16} />
            </button>
          </form>
        </div>
      </div>
      <h2 className="board-card-title">{board.title}</h2>
      <TagList tags={board.tags ?? []} />
      <p className="board-card-description">{stripMarkdown(board.description || "") || t("noDescription")}</p>
      <footer className="board-card-footer">
        <MessageCircle aria-hidden size={16} />
        <span>{t("comments", { count: commentCount })}</span>
      </footer>
    </article>
  );
}
