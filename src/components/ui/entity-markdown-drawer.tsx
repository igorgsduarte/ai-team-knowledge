"use client";

import { ReactNode, useEffect, useState, useTransition } from "react";
import { Drawer } from "@/components/ui/drawer";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import { RelativeTime } from "@/components/ui/relative-time";
import { TagList } from "@/components/ui/tag-list";
import { EntityCommentsSection } from "@/components/ui/entity-comments-section";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { Comment } from "@/lib/types/domain";

type EntityMarkdownDrawerProps = {
  authorNames?: Record<string, string>;
  currentUserId?: string;
  entityId?: string;
  entityType?: Comment["entityType"];
  authorName: string;
  contentLabel: string;
  createdAt: string;
  drawerTitle: string;
  editable: boolean;
  extra?: ReactNode;
  fields?: ReactNode;
  loadContent: () => Promise<string | null>;
  loadingLabel: string;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: FormData) => Promise<void>;
  open: boolean;
  previewContent?: string;
  saveLabel: string;
  savingLabel: string;
  tags: string[];
};

export function EntityMarkdownDrawer({
  authorName,
  authorNames,
  contentLabel,
  createdAt,
  currentUserId,
  drawerTitle,
  editable,
  entityId,
  entityType,
  extra,
  fields,
  loadContent,
  loadingLabel,
  onOpenChange,
  onSave,
  open,
  previewContent = "",
  saveLabel,
  savingLabel,
  tags,
}: EntityMarkdownDrawerProps) {
  const [content, setContent] = useState(previewContent);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    setContent(previewContent);
    setLoading(true);
    void loadContent()
      .then((next) => {
        if (next !== null) {
          setContent(next);
        }
      })
      .catch(() => {
        setContent(previewContent);
      })
      .finally(() => setLoading(false));
  }, [loadContent, open, previewContent]);

  function handleSubmit(formData: FormData) {
    formData.set("body", content);
    startTransition(async () => {
      await onSave(formData);
      onOpenChange(false);
    });
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open} size="wide" title={drawerTitle}>
      <div className="entity-drawer">
        <div className="entity-drawer-meta">
          <div className="board-card-author">
            <UserAvatar name={authorName} />
            <div>
              <p className="font-semibold">{authorName}</p>
              <RelativeTime date={createdAt} />
            </div>
          </div>
          <TagList tags={tags} />
        </div>

        {extra}

        {editable ? (
          <form action={handleSubmit} className="drawer-form">
            {fields}
            <div className="entity-drawer-field">
              <span className="entity-drawer-field-label">{contentLabel}</span>
              <MarkdownEditor onChange={setContent} value={content} />
            </div>
            <button className="primary-button" disabled={pending || loading} type="submit">
              {pending ? savingLabel : saveLabel}
            </button>
          </form>
        ) : (
          <div className="entity-drawer-view">
            {loading ? <p className="muted">{loadingLabel}</p> : <MarkdownViewer value={content} />}
          </div>
        )}

        {entityType && entityId && currentUserId && authorNames ? (
          <EntityCommentsSection
            authorNames={authorNames}
            currentUserId={currentUserId}
            entityId={entityId}
            entityType={entityType}
          />
        ) : null}
      </div>
    </Drawer>
  );
}
