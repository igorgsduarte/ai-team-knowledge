"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  requestWorkspaceDeletion,
  restoreWorkspace,
  type WorkspaceStats,
} from "@/app/actions/workspace-settings";

export function WorkspaceDangerZone({ stats }: { stats: WorkspaceStats }) {
  const t = useTranslations("WorkspaceSettings");
  const router = useRouter();
  const [confirmName, setConfirmName] = useState("");
  const [isPending, startTransition] = useTransition();

  if (stats.status === "pending_deletion") {
    return (
      <section className="content-card space-y-4">
        <h2>{t("dangerTitle")}</h2>
        <p>{t("pendingDeletion", { date: stats.purgeScheduledAt ?? "" })}</p>
        <button
          className="primary-button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await restoreWorkspace();
              router.refresh();
            });
          }}
          type="button"
        >
          {t("restoreWorkspace")}
        </button>
      </section>
    );
  }

  return (
    <section className="content-card space-y-4">
      <h2>{t("dangerTitle")}</h2>
      <p>{t("deleteDescription")}</p>
      <input
        className="w-full rounded border px-3 py-2"
        onChange={(event) => setConfirmName(event.target.value)}
        placeholder={stats.name}
        value={confirmName}
      />
      <button
        className="primary-button"
        disabled={isPending || confirmName !== stats.name}
        onClick={() => {
          startTransition(async () => {
            await requestWorkspaceDeletion();
            router.refresh();
          });
        }}
        type="button"
      >
        {t("deleteWorkspace")}
      </button>
    </section>
  );
}
