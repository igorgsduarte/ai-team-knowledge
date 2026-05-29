import {
  StorageGovernanceError,
  StorageGovernanceErrorCode,
  type ParsedStoragePath,
  type StorageGovernedEntityType,
} from "@/lib/types/workspace-lifecycle";

export const STORAGE_WORKSPACE_PREFIX = "workspaces";

const GOVERNED_ENTITY_TYPES: ReadonlySet<StorageGovernedEntityType> = new Set([
  "agents",
  "context",
  "knowledge",
  "skill",
]);

const STORAGE_PATH_PATTERN =
  /^workspaces\/([^/]+)\/(agents|context|knowledge|skill)\/([^/]+)\/v(\d+)\.md$/;

function assertSegment(value: string, label: string): void {
  if (!value || value.includes("/") || value.includes("..")) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.INVALID_PATH,
      `${label} is invalid for storage path`
    );
  }
}

export function isGovernedEntityType(value: string): value is StorageGovernedEntityType {
  return GOVERNED_ENTITY_TYPES.has(value as StorageGovernedEntityType);
}

export function assertGovernedEntityType(entityType: string): StorageGovernedEntityType {
  if (!isGovernedEntityType(entityType)) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.INVALID_ENTITY_TYPE,
      `entity type "${entityType}" is not governed`
    );
  }

  return entityType;
}

export function buildStoragePath(
  workspaceId: string,
  entityType: StorageGovernedEntityType,
  entityId: string,
  version: number
): string {
  assertSegment(workspaceId, "workspaceId");
  assertGovernedEntityType(entityType);
  assertSegment(entityId, "entityId");

  if (!Number.isInteger(version) || version < 1) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.INVALID_PATH,
      "version must be a positive integer"
    );
  }

  return `${STORAGE_WORKSPACE_PREFIX}/${workspaceId}/${entityType}/${entityId}/v${version}.md`;
}

export function assertSafeStoragePath(path: string): void {
  if (path.includes("..") || path.includes("//") || path.startsWith("/")) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.PATH_TRAVERSAL,
      "storage path contains unsafe segments"
    );
  }
}

export function parseStoragePath(path: string): ParsedStoragePath {
  assertSafeStoragePath(path);

  const match = path.match(STORAGE_PATH_PATTERN);
  if (!match) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.INVALID_PATH,
      "storage path does not match governed layout"
    );
  }

  const [, workspaceId, entityType, entityId, versionText] = match;
  const entityTypeValue = assertGovernedEntityType(entityType);
  const version = Number(versionText);

  if (!Number.isInteger(version) || version < 1) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.INVALID_PATH,
      "storage path version is invalid"
    );
  }

  return {
    entityId,
    entityType: entityTypeValue,
    version,
    workspaceId,
  };
}

export function validateStoragePath(path: string, expectedWorkspaceId: string): ParsedStoragePath {
  const parsed = parseStoragePath(path);

  if (parsed.workspaceId !== expectedWorkspaceId) {
    throw new StorageGovernanceError(
      StorageGovernanceErrorCode.WORKSPACE_MISMATCH,
      "storage path belongs to a different workspace"
    );
  }

  return parsed;
}
