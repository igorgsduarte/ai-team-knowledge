import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { TeamPageClient } from "@/components/team/team-page-client";
import { listWorkspaceInvites } from "@/app/actions/workspace-invites";
import { getAuthContext } from "@/lib/firebase/auth";
import { requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { usersRepository } from "@/lib/repositories/users-repository";
import type { WorkspaceMemberRole } from "@/lib/types/domain";

export default async function TeamPage() {
  const common = await getTranslations("Common");
  const auth = await getAuthContext();
  if (!auth?.workspaceId) {
    return (
      <AppShell section="team">
        <p>{common("unauthenticated")}</p>
      </AppShell>
    );
  }

  const actor = await requireWorkspaceMember(auth);
  const members = await usersRepository.getUsersByWorkspace(auth.workspaceId);
  const canManage = actor.role === "owner" || actor.role === "admin";
  const invites = canManage ? await listWorkspaceInvites() : [];

  return (
    <AppShell section="team">
      <div className="content-stack space-y-6">
        <TeamPageClient
          actorRole={actor.role as WorkspaceMemberRole}
          actorUserId={auth.userId}
          canManage={canManage}
          invites={invites}
          members={members}
        />
      </div>
    </AppShell>
  );
}
