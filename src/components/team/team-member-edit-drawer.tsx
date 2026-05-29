"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateWorkspaceMemberProfile } from "@/app/actions/team-members";
import { Drawer } from "@/components/ui/drawer";
import type { WorkspaceUserProfile } from "@/lib/repositories/users-repository";

type TeamMemberEditDrawerProps = {
  member: WorkspaceUserProfile | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function TeamMemberEditDrawer({ member, onOpenChange, open }: TeamMemberEditDrawerProps) {
  const t = useTranslations("Team");
  const profileT = useTranslations("Profile");
  const [pending, startTransition] = useTransition();

  if (!member) {
    return null;
  }

  function onSubmit(formData: FormData) {
    if (!member) {
      return;
    }

    const targetId = member.id;
    startTransition(async () => {
      await updateWorkspaceMemberProfile(targetId, {
        area: String(formData.get("area") || ""),
        bio: String(formData.get("bio") || ""),
        name: String(formData.get("name") || ""),
      });
      onOpenChange(false);
    });
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open} title={t("editDrawerTitle")}>
      <form action={onSubmit} className="drawer-form">
        <label>
          {profileT("fieldName")}
          <input defaultValue={member.name} name="name" required />
        </label>
        <label>
          {profileT("fieldArea")}
          <input defaultValue={member.area} name="area" />
        </label>
        <label>
          {profileT("fieldBio")}
          <textarea defaultValue={member.bio} name="bio" rows={5} />
        </label>
        <button className="primary-button" disabled={pending} type="submit">
          {pending ? profileT("saving") : profileT("saveProfile")}
        </button>
      </form>
    </Drawer>
  );
}
