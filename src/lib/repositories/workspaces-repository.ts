import "server-only";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { Workspace, WorkspaceMember, WorkspaceMemberRole, WorkspaceMemberStatus } from "@/lib/types/domain";
import { computePurgeScheduledAt } from "@/lib/types/workspace-lifecycle";
import {
  assertMemberCanBeManaged,
  assertMemberRoleChangeAllowed,
  findWorkspaceMember,
  normalizeMembers,
} from "@/lib/workspace/member-management";

function withDefaultStatus(workspace: Workspace): Workspace {
  return {
    ...workspace,
    status: workspace.status ?? "active",
    members: normalizeMembers(workspace.members ?? []),
  };
}

async function updateMembers(
  workspaceId: string,
  updatedBy: string,
  updater: (members: WorkspaceMember[]) => WorkspaceMember[]
): Promise<Workspace> {
  const ref = getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId);
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  const workspace = snapshot.data() as Omit<Workspace, "id">;
  const members = normalizeMembers(workspace.members ?? []);
  const nextMembers = updater(members);
  const now = new Date().toISOString();

  await ref.set({ members: nextMembers, updatedAt: now, updatedBy }, { merge: true });

  const updated = await workspacesRepository.getById(workspaceId);
  if (!updated) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }
  return updated;
}

export const workspacesRepository = {
  async getById(workspaceId: string): Promise<Workspace | null> {
    const snapshot = await getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId).get();
    if (!snapshot.exists) {
      return null;
    }

    return withDefaultStatus({ id: workspaceId, ...(snapshot.data() as Omit<Workspace, "id">) });
  },

  async updateName(workspaceId: string, name: string, updatedBy: string): Promise<Workspace> {
    const now = new Date().toISOString();
    const ref = getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId);
    await ref.set({ name, updatedAt: now, updatedBy }, { merge: true });
    const workspace = await this.getById(workspaceId);
    if (!workspace) {
      throw new Error("WORKSPACE_NOT_FOUND");
    }
    return workspace;
  },

  async markPendingDeletion(workspaceId: string, updatedBy: string): Promise<Workspace> {
    const now = new Date().toISOString();
    const purgeScheduledAt = computePurgeScheduledAt();
    const ref = getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId);
    await ref.set(
      {
        deletedAt: now,
        purgeScheduledAt,
        status: "pending_deletion",
        updatedAt: now,
        updatedBy,
      },
      { merge: true }
    );

    const workspace = await this.getById(workspaceId);
    if (!workspace) {
      throw new Error("WORKSPACE_NOT_FOUND");
    }
    return workspace;
  },

  async restoreActive(workspaceId: string, updatedBy: string): Promise<Workspace> {
    const now = new Date().toISOString();
    const ref = getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId);
    await ref.set(
      {
        deletedAt: null,
        purgeScheduledAt: null,
        status: "active",
        updatedAt: now,
        updatedBy,
      },
      { merge: true }
    );

    const workspace = await this.getById(workspaceId);
    if (!workspace) {
      throw new Error("WORKSPACE_NOT_FOUND");
    }
    return workspace;
  },

  async countFilesByWorkspace(workspaceId: string): Promise<number> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.files)
      .where("workspaceId", "==", workspaceId)
      .get();
    return snapshot.size;
  },

  async listEligibleForPurge(nowIso: string): Promise<Workspace[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.workspaces)
      .where("status", "==", "pending_deletion")
      .where("purgeScheduledAt", "<=", nowIso)
      .get();

    return snapshot.docs.map((doc) =>
      withDefaultStatus({ id: doc.id, ...(doc.data() as Omit<Workspace, "id">) })
    );
  },

  async updateMemberRole(
    workspaceId: string,
    actor: WorkspaceMember,
    actorUserId: string,
    targetUserId: string,
    role: Extract<WorkspaceMemberRole, "admin" | "member">,
    updatedBy: string
  ): Promise<Workspace> {
    return updateMembers(workspaceId, updatedBy, (members) => {
      const target = findWorkspaceMember(members, targetUserId);
      if (!target) {
        throw new Error("MEMBER_NOT_FOUND");
      }

      assertMemberCanBeManaged(actor, target, actorUserId, targetUserId);
      assertMemberRoleChangeAllowed(actor, role);

      return members.map((member) =>
        member.userId === targetUserId ? { ...member, role } : member
      );
    });
  },

  async setMemberStatus(
    workspaceId: string,
    actor: WorkspaceMember,
    actorUserId: string,
    targetUserId: string,
    status: WorkspaceMemberStatus,
    updatedBy: string
  ): Promise<Workspace> {
    return updateMembers(workspaceId, updatedBy, (members) => {
      const target = findWorkspaceMember(members, targetUserId);
      if (!target) {
        throw new Error("MEMBER_NOT_FOUND");
      }

      assertMemberCanBeManaged(actor, target, actorUserId, targetUserId);

      return members.map((member) =>
        member.userId === targetUserId ? { ...member, status } : member
      );
    });
  },

  async removeMember(
    workspaceId: string,
    actor: WorkspaceMember,
    actorUserId: string,
    targetUserId: string,
    updatedBy: string
  ): Promise<Workspace> {
    return updateMembers(workspaceId, updatedBy, (members) => {
      const target = findWorkspaceMember(members, targetUserId);
      if (!target) {
        throw new Error("MEMBER_NOT_FOUND");
      }

      assertMemberCanBeManaged(actor, target, actorUserId, targetUserId);

      return members.filter((member) => member.userId !== targetUserId);
    });
  },
};
