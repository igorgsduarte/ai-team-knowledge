import { firestoreCollections, getFirestoreDb } from "@/lib/firebase/firestore";
import type { AppLocale } from "@/i18n/locales";

export interface UserProfile {
  area?: string;
  avatarUrl?: string;
  bio?: string;
  email?: string;
  id: string;
  locale?: AppLocale;
  name?: string;
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

  async getUsersByWorkspace(workspaceId: string): Promise<UserProfile[]> {
    const workspaceDoc = await getFirestoreDb().collection(firestoreCollections.workspaces).doc(workspaceId).get();
    if (!workspaceDoc.exists) {
      return [];
    }

    const members = (workspaceDoc.data()?.members ?? []) as Array<{ userId: string }>;
    const profiles = await Promise.all(members.map((member) => this.getUserProfile(member.userId)));
    return profiles.filter((profile): profile is UserProfile => Boolean(profile));
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
