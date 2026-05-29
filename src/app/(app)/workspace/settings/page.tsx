import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { WorkspaceDangerZone } from "@/components/workspace/workspace-danger-zone";
import { WorkspaceMembersPanel } from "@/components/workspace/workspace-members-panel";
import { WorkspaceSettingsPanel } from "@/components/workspace/workspace-settings-panel";
import { getWorkspaceStats } from "@/app/actions/workspace-settings";
import { listWorkspaceInvites } from "@/app/actions/workspace-invites";
import { getAuthContext } from "@/lib/firebase/auth";
import { workspacesRepository } from "@/lib/repositories/workspaces-repository";

export default async function WorkspaceSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const t = await getTranslations("WorkspaceSettings");
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/sign-in");
  }

  if (auth.role !== "owner") {
    return (
      <AppShell section="workspaceSettings">
        <p>{t("forbidden")}</p>
      </AppShell>
    );
  }

  const stats = await getWorkspaceStats();
  const workspace = await workspacesRepository.getById(auth.workspaceId);
  const invites = await listWorkspaceInvites();
  const params = await searchParams;

  return (
    <AppShell section="workspaceSettings" workspaceName={workspace?.name}>
      <div className="content-stack space-y-6">
        <PageHeader subtitle={t("subtitle")} title={t("pageTitle")} />
        {params.pending ? <p className="banner-warning">{t("pendingBanner")}</p> : null}
        <WorkspaceSettingsPanel stats={stats} />
        <WorkspaceMembersPanel invites={invites} members={workspace?.members ?? []} />
        <WorkspaceDangerZone stats={stats} />
      </div>
    </AppShell>
  );
}
