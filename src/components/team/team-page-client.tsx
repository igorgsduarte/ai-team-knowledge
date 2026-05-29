"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/page-header";
import { TeamInviteDrawer } from "@/components/team/team-invite-drawer";
import { TeamMembersTable } from "@/components/team/team-members-table";
import type { WorkspaceUserProfile } from "@/lib/repositories/users-repository";
import type { WorkspaceMemberRole } from "@/lib/types/domain";
import type { WorkspaceInvite } from "@/lib/types/workspace-lifecycle";

type TeamPageClientProps = {
  actorRole: WorkspaceMemberRole;
  actorUserId: string;
  canManage: boolean;
  invites: WorkspaceInvite[];
  members: WorkspaceUserProfile[];
};

export function TeamPageClient({
  actorRole,
  actorUserId,
  canManage,
  invites,
  members,
}: TeamPageClientProps) {
  const t = useTranslations("Team");
  const [query, setQuery] = useState("");

  return (
    <>
      <PageHeader
        actions={canManage ? <TeamInviteDrawer actorRole={actorRole === "owner" ? "owner" : "admin"} /> : undefined}
        subtitle={t("subtitle")}
        title={t("pageTitle")}
      />
      <div className="team-toolbar">
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          type="search"
          value={query}
        />
      </div>
      <TeamMembersTable
        actorRole={actorRole}
        actorUserId={actorUserId}
        canManage={canManage}
        invites={invites}
        members={members}
        query={query}
      />
    </>
  );
}
