import "server-only";
import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { AppLocale } from "@/i18n/locales";
import type { WorkspaceMember, WorkspaceMemberRole, WorkspaceMemberStatus } from "@/lib/types/domain";

export interface UserProfile {
  area?: string;
  avatarUrl?: string;
  bio?: string;
  email?: string;
  id: string;
  locale?: AppLocale;
  name?: string;
  updatedAt?: string;
}

export interface WorkspaceUserProfile extends UserProfile {
  role: WorkspaceMemberRole;
  status: WorkspaceMemberStatus;
}

export const usersRepository = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const snapshot = await getFirestoreDb().collection(firestoreCollections.users).doc(userId).get();
    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data() as Omit<UserProfile, "id">;
    return { id: userId, ...data };
  },

  async getUsersByWorkspace(workspaceId: string): Promise<WorkspaceUserProfile[]> {
    const workspaceDoc = await getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId).get();
    if (!workspaceDoc.exists) {
      return [];
    }

    const members = (workspaceDoc.data()?.members ?? []) as WorkspaceMember[];
    const profiles = await Promise.all(
      members.map(async (member) => {
        const profile = await this.getUserProfile(member.userId);
        if (!profile) {
          return null;
        }

        return {
          ...profile,
          role: member.role,
          status: member.status ?? "active",
        } satisfies WorkspaceUserProfile;
      })
    );

    return profiles.filter((profile): profile is WorkspaceUserProfile => Boolean(profile));
  },

  async updateUserLocale(userId: string, locale: AppLocale): Promise<void> {
    await getFirestoreDb()
      .collection(firestoreCollections.users)
      .doc(userId)
      .set({ locale, updatedAt: new Date().toISOString() }, { merge: true });
  },

  async updateProfile(
    userId: string,
    input: Pick<UserProfile, "area" | "bio" | "name">
  ): Promise<void> {
    await getFirestoreDb()
      .collection(firestoreCollections.users)
      .doc(userId)
      .set({ ...input, updatedAt: new Date().toISOString() }, { merge: true });
  },
};
