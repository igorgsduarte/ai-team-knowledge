"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/app/actions/profile";
import { Drawer } from "@/components/ui/drawer";
import type { UserProfile } from "@/lib/repositories/users-repository";

type ProfileEditDrawerProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  profile: UserProfile;
};

export function ProfileEditDrawer({ onOpenChange, open, profile }: ProfileEditDrawerProps) {
  const t = useTranslations("Profile");
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProfile(formData);
      onOpenChange(false);
    });
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open} title={t("editDrawerTitle")}>
      <form action={onSubmit} className="drawer-form">
        <label>
          {t("fieldName")}
          <input defaultValue={profile.name} name="name" required />
        </label>
        <label>
          {t("fieldArea")}
          <input defaultValue={profile.area} name="area" />
        </label>
        <label>
          {t("fieldBio")}
          <textarea defaultValue={profile.bio} name="bio" rows={5} />
        </label>
        <button className="primary-button" disabled={pending} type="submit">
          {pending ? t("saving") : t("saveProfile")}
        </button>
      </form>
    </Drawer>
  );
}
