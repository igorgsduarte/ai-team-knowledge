"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const t = useTranslations("Shell");
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <button className="sidebar-action" type="button" onClick={signOut} disabled={loading}>
      <span aria-hidden="true"><LogOut size={16} strokeWidth={2.4} /></span>
      <strong>{loading ? t("nav.loggingOut") : t("nav.logout")}</strong>
    </button>
  );
}
