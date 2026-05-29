"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createComment, deleteComment, listComments, updateComment } from "@/app/actions/comments";
import { EntityCardAuthor } from "@/components/ui/entity-card-author";
import type { Comment } from "@/lib/types/domain";

type EntityCommentsSectionProps = {
  authorNames: Record<string, string>;
  currentUserId: string;
  entityId: string;
  entityType: Comment["entityType"];
};

export function EntityCommentsSection({
  authorNames,
  currentUserId,
  entityId,
  entityType,
}: EntityCommentsSectionProps) {
  const t = useTranslations("Common");
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const loadComments = useCallback(async () => {
    if (!entityId) {
      setComments([]);
      return;
    }
    setLoading(true);
    try {
      const next = await listComments(entityType, entityId);
      setComments(next);
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) {
      return;
    }
    const formData = new FormData();
    formData.set("entityType", entityType);
    formData.set("entityId", entityId);
    formData.set("body", body);
    startTransition(async () => {
      await createComment(formData);
      setDraft("");
      await loadComments();
    });
  }

  function handleUpdate(commentId: string) {
    const body = editingBody.trim();
    if (!body) {
      return;
    }
    startTransition(async () => {
      await updateComment(commentId, body);
      setEditingId(null);
      setEditingBody("");
      await loadComments();
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      await deleteComment(commentId);
      await loadComments();
    });
  }

  return (
    <section className="entity-comments-section">
      <h3 className="entity-comments-title">{t("commentsTitle")}</h3>

      <form className="entity-comments-form" onSubmit={handleCreate}>
        <textarea
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("commentPlaceholder")}
          rows={3}
          value={draft}
        />
        <button className="primary-button" disabled={pending || !draft.trim()} type="submit">
          {pending ? t("saving") : t("commentSubmit")}
        </button>
      </form>

      {loading ? <p className="muted text-sm">{t("loading")}</p> : null}
      {!loading && comments.length === 0 ? <p className="muted text-sm">{t("commentEmpty")}</p> : null}

      <ul className="entity-comments-list">
        {comments.map((comment) => {
          const authorName = authorNames[comment.createdBy] ?? t("unknownAuthor");
          const isAuthor = comment.createdBy === currentUserId;
          const isEditing = editingId === comment.id;

          return (
            <li className="entity-comment-item" key={comment.id}>
              <EntityCardAuthor authorName={authorName} createdAt={comment.createdAt} />
              {isEditing ? (
                <div className="entity-comment-edit">
                  <textarea
                    onChange={(event) => setEditingBody(event.target.value)}
                    rows={3}
                    value={editingBody}
                  />
                  <div className="entity-comment-actions">
                    <button
                      className="primary-button"
                      disabled={pending || !editingBody.trim()}
                      onClick={() => handleUpdate(comment.id)}
                      type="button"
                    >
                      {pending ? t("saving") : t("commentSave")}
                    </button>
                    <button
                      className="pill-link"
                      onClick={() => {
                        setEditingId(null);
                        setEditingBody("");
                      }}
                      type="button"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="entity-comment-body">{comment.body}</p>
                  {isAuthor ? (
                    <div className="entity-comment-actions">
                      <button
                        className="pill-link"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingBody(comment.body);
                        }}
                        type="button"
                      >
                        {t("commentEdit")}
                      </button>
                      <button
                        className="pill-link"
                        disabled={pending}
                        onClick={() => handleDelete(comment.id)}
                        type="button"
                      >
                        {t("commentDelete")}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
