"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { UserProfile } from "@/lib/repositories/users-repository";
import { ProfileEditDrawer } from "@/components/profile/profile-edit-drawer";
import { UserAvatar } from "@/components/ui/user-avatar";

type ProfileInfoCardProps = {
  profile: UserProfile;
};

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  const t = useTranslations("Profile");
  const [open, setOpen] = useState(false);
  const name = profile.name || t("defaultName");

  return (
    <section className="app-card profile-info-card">
      <UserAvatar name={name} size="lg" />
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="muted">{profile.area || t("defaultArea")}</p>
        <p className="text-sm">{profile.email}</p>
        <p className="profile-bio">{profile.bio || t("defaultBio")}</p>
        <button className="primary-button" onClick={() => setOpen(true)} type="button">
          {t("edit")}
        </button>
      </div>
      <ProfileEditDrawer onOpenChange={setOpen} open={open} profile={profile} />
    </section>
  );
}
