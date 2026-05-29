"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { acceptWorkspaceInvite } from "@/app/actions/workspace-invites";

export function AcceptInviteForm({ token }: { token: string }) {
  const t = useTranslations("WorkspaceSettings");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="primary-button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await acceptWorkspaceInvite(token);
          router.push("/knowledge");
          router.refresh();
        });
      }}
      type="button"
    >
      {isPending ? t("acceptingInvite") : t("acceptInvite")}
    </button>
  );
}
