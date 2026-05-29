"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { publishAgents } from "@/app/actions/agents";
import { Drawer } from "@/components/ui/drawer";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { stripMarkdown } from "@/lib/markdown";

type AgentsEditDrawerProps = {
  initialContent: string;
};

export function AgentsEditDrawer({ initialContent }: AgentsEditDrawerProps) {
  const t = useTranslations("Profile");
  const [content, setContent] = useState(initialContent);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onPublish() {
    startTransition(async () => {
      await publishAgents(content);
      setOpen(false);
    });
  }

  return (
    <section className="app-card agents-card">
      <div className="agents-card-header">
        <h2 className="font-semibold">{t("agentsTitle")}</h2>
        <button className="pill-link" onClick={() => setOpen(true)} type="button">
          {t("agentsEdit")}
        </button>
      </div>
      <p className="agents-preview">{stripMarkdown(content).slice(0, 220) || t("agentsEmpty")}</p>
      <Drawer onOpenChange={setOpen} open={open} title={t("agentsDrawerTitle")}>
        <div className="drawer-form">
          <MarkdownEditor onChange={setContent} value={content} />
          <button className="primary-button" disabled={pending} onClick={onPublish} type="button">
            {pending ? t("saving") : t("agentsPublish")}
          </button>
        </div>
      </Drawer>
    </section>
  );
}
