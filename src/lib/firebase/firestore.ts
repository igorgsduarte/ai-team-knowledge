import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export function getFirestoreDb() {
  return getFirebaseAdminDb();
}

export const firestoreCollections = {
  users: "users",
  workspaces: "workspaces",
  memberships: "memberships",
  boards: "boards",
  knowledge: "knowledge",
  skills: "skills",
  userSkills: "userSkills",
  comments: "comments",
  files: "files",
  agents: "agents",
  mcpKeys: "mcp_keys",
  mcpWorkspaceSettings: "mcp_workspace_settings",
} as const;
