"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { addUserSkill } from "@/app/actions/user-skills";

type AddSkillButtonProps = {
  skillId: string;
};

export function AddSkillButton({ skillId }: AddSkillButtonProps) {
  const t = useTranslations("Skills");
  const [pending, startTransition] = useTransition();

  function onAdd() {
    const formData = new FormData();
    formData.set("skillId", skillId);
    formData.set("level", "intermediate");
    startTransition(async () => {
      await addUserSkill(formData);
    });
  }

  return (
    <button className="pill-link" disabled={pending} onClick={onAdd} type="button">
      {pending ? t("adding") : t("addToProfile")}
    </button>
  );
}
