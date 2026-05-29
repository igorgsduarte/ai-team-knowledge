import "server-only";
import { createHash, randomBytes } from "crypto";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { WorkspaceMember } from "@/lib/types/domain";
import type { WorkspaceInvite } from "@/lib/types/workspace-lifecycle";

const INVITE_TTL_DAYS = 7;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function expiresAtFromNow(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + INVITE_TTL_DAYS);
  return date.toISOString();
}

export const workspaceInvitesRepository = {
  async createInvite(input: {
    workspaceId: string;
    email: string;
    invitedBy: string;
    role?: WorkspaceInvite["role"];
  }): Promise<{ invite: WorkspaceInvite; token: string }> {
    const token = randomBytes(32).toString("hex");
    const now = new Date().toISOString();
    const invite: WorkspaceInvite = {
      id: crypto.randomUUID(),
      workspaceId: input.workspaceId,
      email: normalizeEmail(input.email),
      tokenHash: hashToken(token),
      invitedBy: input.invitedBy,
      role: input.role ?? "member",
      expiresAt: expiresAtFromNow(),
      createdAt: now,
    };

    await getFirestoreDb().collection(firestoreCollections.workspaceInvites).doc(invite.id).set(invite);
    return { invite, token };
  },

  async findByToken(token: string): Promise<WorkspaceInvite | null> {
    const tokenHash = hashToken(token);
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.workspaceInvites)
      .where("tokenHash", "==", tokenHash)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as WorkspaceInvite;
  },

  async listPendingByWorkspace(workspaceId: string): Promise<WorkspaceInvite[]> {
    const snapshot = await getFirestoreDb()
      .collection(firestoreCollections.workspaceInvites)
      .where("workspaceId", "==", workspaceId)
      .get();

    const now = Date.now();
    return snapshot.docs
      .map((doc) => doc.data() as WorkspaceInvite)
      .filter((invite) => !invite.acceptedAt && !invite.revokedAt && Date.parse(invite.expiresAt) > now);
  },

  async revokeInvite(workspaceId: string, inviteId: string): Promise<void> {
    const ref = getFirestoreDb().collection(firestoreCollections.workspaceInvites).doc(inviteId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return;
    }

    const invite = snapshot.data() as WorkspaceInvite;
    if (invite.workspaceId !== workspaceId) {
      return;
    }

    await ref.set({ revokedAt: new Date().toISOString() }, { merge: true });
  },

  async acceptInvite(input: {
    token: string;
    userId: string;
    email?: string;
  }): Promise<{ workspaceId: string; member: WorkspaceMember }> {
    const invite = await this.findByToken(input.token);
    if (!invite || invite.revokedAt || invite.acceptedAt) {
      throw new Error("INVITE_INVALID");
    }

    if (Date.parse(invite.expiresAt) <= Date.now()) {
      throw new Error("INVITE_EXPIRED");
    }

    if (input.email && normalizeEmail(input.email) !== invite.email) {
      throw new Error("INVITE_EMAIL_MISMATCH");
    }

    const workspaceRef = getFirestoreDb().collection(firestoreCollections.workspaces).doc(invite.workspaceId);
    const workspaceSnapshot = await workspaceRef.get();
    if (!workspaceSnapshot.exists) {
      throw new Error("WORKSPACE_NOT_FOUND");
    }

    const workspace = workspaceSnapshot.data() as { members: WorkspaceMember[] };
    const members = workspace.members ?? [];
    const inviteRole = invite.role ?? "member";
    if (!members.some((member) => member.userId === input.userId)) {
      members.push({ userId: input.userId, role: inviteRole, status: "active" });
      await workspaceRef.set({ members, updatedAt: new Date().toISOString() }, { merge: true });
    }

    await getFirestoreDb()
      .collection(firestoreCollections.workspaceInvites)
      .doc(invite.id)
      .set({ acceptedAt: new Date().toISOString() }, { merge: true });

    return { workspaceId: invite.workspaceId, member: { userId: input.userId, role: inviteRole, status: "active" } };
  },
};
