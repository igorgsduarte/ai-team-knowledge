"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createBoard } from "@/app/actions/boards";
import { Drawer } from "@/components/ui/drawer";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

export function BoardCreateDrawer() {
  const t = useTranslations("Board");
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    formData.set("description", description);
    startTransition(async () => {
      await createBoard(formData);
      setDescription("");
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
            {t("fieldDescription")}
            <MarkdownEditor onChange={setDescription} value={description} />
          </label>
          <label>
            {t("fieldStatus")}
            <select defaultValue="learning" name="status">
              <option value="learning">{t("statusLearning")}</option>
              <option value="doing">{t("statusDoing")}</option>
              <option value="done">{t("statusDone")}</option>
            </select>
          </label>
          <label>
            {t("fieldTags")}
            <input name="tags" placeholder={t("tagsPlaceholder")} />
          </label>
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? t("saving") : t("saveEntry")}
          </button>
        </form>
      </Drawer>
    </>
  );
}
