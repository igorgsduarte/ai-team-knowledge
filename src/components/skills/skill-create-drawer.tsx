"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createSkill } from "@/app/actions/skills";
import { Drawer } from "@/components/ui/drawer";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

export function SkillCreateDrawer() {
  const t = useTranslations("Skills");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    formData.set("description", description);
    startTransition(async () => {
      await createSkill(formData);
      setDescription("");
      setOpen(false);
    });
  }

  return (
    <>
      <button className="primary-button" onClick={() => setOpen(true)} type="button">
        {t("newSkill")}
      </button>
      <Drawer onOpenChange={setOpen} open={open} size="wide" title={t("drawerTitle")}>
        <form action={onSubmit} className="drawer-form">
          <label>
            {t("fieldName")}
            <input name="name" placeholder={t("namePlaceholder")} required />
          </label>
          <div className="entity-drawer-field">
            <span className="entity-drawer-field-label">{t("fieldPrompt")}</span>
            <MarkdownEditor onChange={setDescription} value={description} />
          </div>
          <label>
            {t("fieldTags")}
            <input name="tags" placeholder={t("tagsPlaceholder")} />
          </label>
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? t("saving") : t("add")}
          </button>
        </form>
      </Drawer>
    </>
  );
}
