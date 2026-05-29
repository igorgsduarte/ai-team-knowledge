"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { getAgentContent, updateAgent } from "@/app/actions/agents";
import { EntityMarkdownDrawer } from "@/components/ui/entity-markdown-drawer";
import type { Agent } from "@/lib/types/domain";

type AgentDetailDrawerProps = {
  agent: Agent | null;
  authorName: string;
  authorNames: Record<string, string>;
  currentUserId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function AgentDetailDrawer({
  agent,
  authorName,
  authorNames,
  currentUserId,
  onOpenChange,
  open,
}: AgentDetailDrawerProps) {
  const t = useTranslations("Agents");
  const editable = agent?.createdBy === currentUserId;

  const loadContent = useCallback(async () => {
    if (!agent) {
      return null;
    }
    return getAgentContent(agent.id);
  }, [agent]);

  if (!agent) {
    return null;
  }

  return (
    <EntityMarkdownDrawer
      authorName={authorName}
      authorNames={authorNames}
      contentLabel={t("fieldBody")}
      currentUserId={currentUserId}
      entityId={agent.id}
      entityType="agent"
      createdAt={agent.createdAt}
      drawerTitle={editable ? t("drawerEditTitle", { title: agent.name }) : t("drawerViewTitle", { title: agent.name })}
      editable={editable}
      fields={
        <>
          <label>
            {t("fieldName")}
            <input defaultValue={agent.name} name="name" required />
          </label>
          <label>
            {t("fieldTags")}
            <input defaultValue={(agent.tags ?? []).join(", ")} name="tags" />
          </label>
        </>
      }
      loadContent={loadContent}
      loadingLabel={t("loadingContent")}
      onOpenChange={onOpenChange}
      onSave={(formData) => updateAgent(agent.id, formData)}
      open={open}
      previewContent={agent.summary ?? ""}
      saveLabel={t("save")}
      savingLabel={t("saving")}
      tags={agent.tags ?? []}
    />
  );
}
