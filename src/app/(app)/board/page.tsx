import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { BoardCard } from "@/components/board/board-card";
import { BoardCreateDrawer } from "@/components/board/board-create-drawer";
import { PageHeader } from "@/components/page-header";
import { getAuthContext } from "@/lib/firebase/auth";
import { boardsRepository } from "@/lib/repositories/boards-repository";
import { commentsRepository } from "@/lib/repositories/comments-repository";
import { usersRepository } from "@/lib/repositories/users-repository";

export default async function Page() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Board");
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return (
      <AppShell section="board">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const boards = await boardsRepository.list(auth.workspaceId);
  const members = await usersRepository.getUsersByWorkspace(auth.workspaceId);
  const memberMap = new Map(members.map((member) => [member.id, member]));

  const cards = await Promise.all(
    boards.map(async (board) => ({
      board,
      author: memberMap.get(board.createdBy) ?? null,
      commentCount: (await commentsRepository.listByEntity(auth.workspaceId, "board", board.id)).length,
    }))
  );

  return (
    <AppShell section="board">
      <div className="content-stack space-y-6">
        <PageHeader actions={<BoardCreateDrawer />} subtitle={t("subtitle")} title={t("pageTitle")} />
        <section className="two-column board-grid">
          {cards.map(({ author, board, commentCount }) => (
            <BoardCard author={author} board={board} commentCount={commentCount} key={board.id} />
          ))}
          {cards.length === 0 ? <p className="empty-state">{t("empty")}</p> : null}
        </section>
      </div>
    </AppShell>
  );
}
