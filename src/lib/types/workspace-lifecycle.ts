import type { FileMetadata } from "@/lib/types/domain";

export type StorageGovernedEntityType = FileMetadata["entityType"];

export const StorageGovernanceErrorCode = {
  INVALID_ENTITY_TYPE: "STORAGE_INVALID_ENTITY_TYPE",
  INVALID_PATH: "STORAGE_INVALID_PATH",
  PATH_TRAVERSAL: "STORAGE_PATH_TRAVERSAL",
  WORKSPACE_MISMATCH: "STORAGE_WORKSPACE_MISMATCH",
} as const;

export type StorageGovernanceErrorCode =
  (typeof StorageGovernanceErrorCode)[keyof typeof StorageGovernanceErrorCode];

export class StorageGovernanceError extends Error {
  readonly code: StorageGovernanceErrorCode;

  constructor(code: StorageGovernanceErrorCode, message: string) {
    super(message);
    this.name = "StorageGovernanceError";
    this.code = code;
  }
}

export type WorkspaceFileAccessPolicy = {
  clientDirectAccess: false;
  signedUrlsToClient: false;
};

export const WORKSPACE_FILE_ACCESS_POLICY: WorkspaceFileAccessPolicy = {
  clientDirectAccess: false,
  signedUrlsToClient: false,
};

export const WorkspaceAccessErrorCode = {
  ADMIN_REQUIRED: "WORKSPACE_ADMIN_REQUIRED",
  NOT_A_MEMBER: "WORKSPACE_NOT_A_MEMBER",
  OWNER_REQUIRED: "WORKSPACE_OWNER_REQUIRED",
  WORKSPACE_MISMATCH: "WORKSPACE_MISMATCH",
  WORKSPACE_NOT_ACTIVE: "WORKSPACE_NOT_ACTIVE",
  WORKSPACE_NOT_FOUND: "WORKSPACE_NOT_FOUND",
} as const;

export type WorkspaceAccessErrorCode =
  (typeof WorkspaceAccessErrorCode)[keyof typeof WorkspaceAccessErrorCode];

export class WorkspaceAccessError extends Error {
  readonly code: WorkspaceAccessErrorCode;

  constructor(code: WorkspaceAccessErrorCode, message: string) {
    super(message);
    this.name = "WorkspaceAccessError";
    this.code = code;
  }
}

export type WorkspaceStatus = "active" | "pending_deletion";

export const WORKSPACE_RETENTION_DAYS = 30;

export function computePurgeScheduledAt(from: Date = new Date()): string {
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + WORKSPACE_RETENTION_DAYS);
  return date.toISOString();
}

export type WorkspaceInviteRole = "admin" | "member";

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  tokenHash: string;
  invitedBy: string;
  role?: WorkspaceInviteRole;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export type ParsedStoragePath = {
  entityId: string;
  entityType: StorageGovernedEntityType;
  version: number;
  workspaceId: string;
};
