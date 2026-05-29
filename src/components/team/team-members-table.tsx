"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { revokeWorkspaceInvite } from "@/app/actions/workspace-invites";
import { RelativeTime } from "@/components/ui/relative-time";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { TeamMemberActionsMenu } from "@/components/team/team-member-actions-menu";
import { TeamMemberEditDrawer } from "@/components/team/team-member-edit-drawer";
import type { WorkspaceUserProfile } from "@/lib/repositories/users-repository";
import type { WorkspaceMemberRole } from "@/lib/types/domain";
import type { WorkspaceInvite } from "@/lib/types/workspace-lifecycle";

type TeamMembersTableProps = {
  actorRole: WorkspaceMemberRole;
  actorUserId: string;
  canManage: boolean;
  invites: WorkspaceInvite[];
  members: WorkspaceUserProfile[];
  query: string;
};

function roleLabelKey(role: WorkspaceMemberRole): "role.admin" | "role.member" | "role.owner" {
  if (role === "owner") {
    return "role.owner";
  }
  if (role === "admin") {
    return "role.admin";
  }
  return "role.member";
}

export function TeamMembersTable({
  actorRole,
  actorUserId,
  canManage,
  invites,
  members,
  query,
}: TeamMembersTableProps) {
  const t = useTranslations("Team");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editMember, setEditMember] = useState<WorkspaceUserProfile | null>(null);

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return members;
    }

    return members.filter((member) => {
      const name = (member.name || "").toLowerCase();
      const email = (member.email || "").toLowerCase();
      return name.includes(normalized) || email.includes(normalized);
    });
  }, [members, query]);

  return (
    <>
      <section className="app-card team-table-card">
        <div className="team-table-wrap">
          <table className="team-table">
            <thead>
              <tr>
                <th>{t("columnUser")}</th>
                <th>{t("columnRole")}</th>
                <th>{t("columnStatus")}</th>
                <th>{t("columnLastActive")}</th>
                {canManage ? <th className="team-table-actions-head">{t("columnActions")}</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const name = member.name || member.email || t("unknownMember");
                return (
                  <tr className="team-table-row" key={member.id}>
                    <td>
                      <div className="team-table-user">
                        <UserAvatar name={name} size="md" />
                        <div>
                          <p className="team-table-name">{name}</p>
                          <p className="team-table-email">{member.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td>{t(roleLabelKey(member.role))}</td>
                    <td>
                      <StatusBadge
                        kind="member"
                        label={member.status === "inactive" ? t("status.inactive") : t("status.active")}
                        value={member.status}
                      />
                    </td>
                    <td>
                      {member.updatedAt ? (
                        <RelativeTime date={member.updatedAt} />
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    {canManage ? (
                      <td className="team-table-actions-cell">
                        <TeamMemberActionsMenu
                          actorRole={actorRole}
                          actorUserId={actorUserId}
                          canManage={canManage}
                          member={member}
                          onEdit={() => setEditMember(member)}
                        />
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              {filteredMembers.length === 0 ? (
                <tr>
                  <td className="team-table-empty" colSpan={canManage ? 5 : 4}>
                    {t("emptyMembers")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {canManage && invites.length > 0 ? (
        <section className="app-card team-pending-invites">
          <h2>{t("pendingInvitesTitle")}</h2>
          <ul className="team-pending-invites-list">
            {invites.map((invite) => (
              <li key={invite.id}>
                <div className="team-pending-invite-meta">
                  <span>{invite.email}</span>
                  <span className="muted">{t(`role.${invite.role ?? "member"}`)}</span>
                </div>
                <button
                  className="text-button"
                  disabled={pending}
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
        </section>
      ) : null}

      <TeamMemberEditDrawer
        member={editMember}
        onOpenChange={(open) => {
          if (!open) {
            setEditMember(null);
          }
        }}
        open={Boolean(editMember)}
      />
    </>
  );
}
