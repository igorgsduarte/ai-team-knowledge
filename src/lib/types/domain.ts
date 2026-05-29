export type ID = string;

export type KnowledgeType = "link" | "article";
export type UserSkillLevel = "beginner" | "intermediate" | "advanced";

export type WorkspaceMemberRole = "owner" | "admin" | "member";
export type WorkspaceMemberStatus = "active" | "inactive";

export interface WorkspaceMember {
  userId: ID;
  role: WorkspaceMemberRole;
  status?: WorkspaceMemberStatus;
}

export type WorkspaceStatus = "active" | "pending_deletion";

export interface Workspace {
  id: ID;
  name: string;
  status?: WorkspaceStatus;
  deletedAt?: string;
  purgeScheduledAt?: string;
  updatedBy?: ID;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
}

export interface KnowledgeItem {
  id: ID;
  workspaceId: ID;
  title: string;
  body?: string;
  summary?: string;
  type?: KnowledgeType;
  url?: string;
  tags: string[];
  createdBy: ID;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: ID;
  workspaceId: ID;
  name: string;
  prompt?: string;
  description?: string;
  tags?: string[];
  category?: string;
  createdBy: ID;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: ID;
  workspaceId: ID;
  name: string;
  summary?: string;
  tags?: string[];
  createdBy: ID;
  createdAt: string;
  updatedAt: string;
}

export interface UserSkill {
  id: ID;
  workspaceId: ID;
  userId: ID;
  skillId: ID;
  level: UserSkillLevel;
}

export interface Comment {
  id: ID;
  workspaceId: ID;
  entityType: "agent" | "knowledge" | "skill";
  entityId: ID;
  body: string;
  createdBy: ID;
  createdAt: string;
}

export interface FileMetadata {
  id: ID;
  workspaceId: ID;
  entityType: "context" | "knowledge" | "skill" | "agents";
  entityId: ID;
  path: string;
  version: number;
  authorId: ID;
  contentHash: string;
  contentType: string;
  createdAt: string;
}

export interface AuthContext {
  userId: ID;
  workspaceId: ID;
  email?: string;
  role?: WorkspaceMember["role"];
}
