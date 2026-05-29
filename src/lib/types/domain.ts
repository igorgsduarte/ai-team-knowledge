export type ID = string;

export type BoardStatus = "learning" | "doing" | "done";
export type KnowledgeType = "link" | "article";
export type UserSkillLevel = "beginner" | "intermediate" | "advanced";

export interface WorkspaceMember {
  userId: ID;
  role: "owner" | "admin" | "member";
}

export interface Workspace {
  id: ID;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
}

export interface Board {
  id: ID;
  workspaceId: ID;
  title: string;
  description?: string;
  status?: BoardStatus;
  tags?: string[];
  createdBy: ID;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeItem {
  id: ID;
  workspaceId: ID;
  title: string;
  body: string;
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
  prompt: string;
  description?: string;
  tags?: string[];
  category?: string;
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
  entityType: "board" | "knowledge" | "skill";
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

export interface AgentsDocumentVersion {
  id: ID;
  workspaceId: ID;
  version: number;
  status: "draft" | "published";
  authorId: ID;
  storagePath: string;
  createdAt: string;
}

export interface AuthContext {
  userId: ID;
  workspaceId: ID;
  email?: string;
  role?: WorkspaceMember["role"];
}
