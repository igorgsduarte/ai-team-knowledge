"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { renameWorkspace } from "@/app/actions/workspace-settings";
import type { WorkspaceStats } from "@/app/actions/workspace-settings";

export function WorkspaceSettingsPanel({ stats }: { stats: WorkspaceStats }) {
  const t = useTranslations("WorkspaceSettings");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="content-card space-y-4">
      <h2>{t("generalTitle")}</h2>
      <form
        action={(formData) => {
          startTransition(async () => {
            await renameWorkspace(formData);
          });
        }}
        className="space-y-3"
      >
        <div>
          <label className="text-sm font-medium" htmlFor="workspace-name">
            {t("nameLabel")}
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            defaultValue={stats.name}
            id="workspace-name"
            name="name"
            required
          />
        </div>
        <button className="primary-button" disabled={isPending} type="submit">
          {isPending ? t("saving") : t("saveName")}
        </button>
      </form>
      <div className="stats-grid">
        <p>{t("fileCount", { count: stats.fileCount })}</p>
        <p>{t("memberCount", { count: stats.memberCount })}</p>
        <p>{t("status", { status: stats.status })}</p>
      </div>
    </section>
  );
}
