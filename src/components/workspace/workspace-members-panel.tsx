"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createWorkspaceInvite, revokeWorkspaceInvite } from "@/app/actions/workspace-invites";
import type { WorkspaceMember } from "@/lib/types/domain";
import type { WorkspaceInvite } from "@/lib/types/workspace-lifecycle";

export function WorkspaceMembersPanel({
  invites,
  members,
}: {
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
}) {
  const t = useTranslations("WorkspaceSettings");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <section className="content-card space-y-4">
      <h2>{t("membersTitle")}</h2>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.userId}>
            {member.userId} — {member.role}
          </li>
        ))}
      </ul>
      <form
        action={(formData) => {
          startTransition(async () => {
            await createWorkspaceInvite(formData);
            router.refresh();
          });
        }}
        className="space-y-3"
      >
        <div>
          <label className="text-sm font-medium" htmlFor="invite-email">
            {t("inviteEmailLabel")}
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            id="invite-email"
            name="email"
            required
            type="email"
          />
        </div>
        <button className="primary-button" disabled={isPending} type="submit">
          {t("sendInvite")}
        </button>
      </form>
      {invites.length > 0 ? (
        <ul className="space-y-2">
          {invites.map((invite) => (
            <li className="flex items-center justify-between gap-3" key={invite.id}>
              <span>{invite.email}</span>
              <button
                className="text-sm"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await revokeWorkspaceInvite(invite.id);
                    router.refresh();
                  });
                }}
                type="button"
              >
                {t("revokeInvite")}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
