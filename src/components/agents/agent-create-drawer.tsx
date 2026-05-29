"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createAgent } from "@/app/actions/agents";
import { Drawer } from "@/components/ui/drawer";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

export function AgentCreateDrawer() {
  const t = useTranslations("Agents");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    formData.set("body", body);
    startTransition(async () => {
      await createAgent(formData);
      setBody("");
      setOpen(false);
    });
  }

  return (
    <>
      <button className="primary-button" onClick={() => setOpen(true)} type="button">
        {t("newAgent")}
      </button>
      <Drawer onOpenChange={setOpen} open={open} size="wide" title={t("drawerCreateTitle")}>
        <form action={onSubmit} className="drawer-form">
          <label>
            {t("fieldName")}
            <input name="name" placeholder={t("namePlaceholder")} required />
          </label>
          <div className="entity-drawer-field">
            <span className="entity-drawer-field-label">{t("fieldBody")}</span>
            <MarkdownEditor onChange={setBody} value={body} />
          </div>
          <label>
            {t("fieldTags")}
            <input name="tags" placeholder={t("tagsPlaceholder")} />
          </label>
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? t("saving") : t("publish")}
          </button>
        </form>
      </Drawer>
    </>
  );
}
