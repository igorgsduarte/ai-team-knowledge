"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createKnowledge } from "@/app/actions/knowledge";
import { Drawer } from "@/components/ui/drawer";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

export function KnowledgeCreateDrawer() {
  const t = useTranslations("Knowledge");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    formData.set("body", body);
    startTransition(async () => {
      await createKnowledge(formData);
      setBody("");
      setOpen(false);
    });
  }

  return (
    <>
      <button className="primary-button" onClick={() => setOpen(true)} type="button">
        {t("newEntry")}
      </button>
      <Drawer onOpenChange={setOpen} open={open} title={t("drawerTitle")}>
        <form action={onSubmit} className="drawer-form">
          <label>
            {t("fieldTitle")}
            <input name="title" placeholder={t("titlePlaceholder")} required />
          </label>
          <label>
            {t("fieldBody")}
            <MarkdownEditor onChange={setBody} value={body} />
          </label>
          <label>
            {t("fieldType")}
            <select defaultValue="article" name="type">
              <option value="article">{t("typeArticle")}</option>
              <option value="link">{t("typeLink")}</option>
            </select>
          </label>
          <label>
            {t("fieldUrl")}
            <input name="url" placeholder="https://" type="url" />
          </label>
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
