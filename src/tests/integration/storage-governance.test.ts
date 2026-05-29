import { describe, expect, it } from "vitest";
import {
  buildStoragePath,
  parseStoragePath,
  validateStoragePath,
} from "@/lib/firebase/storage-policy";
import {
  StorageGovernanceError,
  StorageGovernanceErrorCode,
} from "@/lib/types/workspace-lifecycle";

describe("storage governance policy", () => {
  it("builds a canonical path for a governed entity", () => {
    const path = buildStoragePath("wA", "knowledge", "k1", 1);

    expect(path).toBe("workspaces/wA/knowledge/k1/v1.md");
    expect(parseStoragePath(path)).toEqual({
      entityId: "k1",
      entityType: "knowledge",
      version: 1,
      workspaceId: "wA",
    });
  });

  it("rejects paths that belong to another workspace", () => {
    const path = buildStoragePath("wB", "skill", "s1", 2);

    expect(() => validateStoragePath(path, "wA")).toThrow(StorageGovernanceError);
    expect(() => validateStoragePath(path, "wA")).toThrow(
      expect.objectContaining({ code: StorageGovernanceErrorCode.WORKSPACE_MISMATCH })
    );
  });

  it("rejects invalid entity types", () => {
    expect(() => buildStoragePath("wA", "boards" as "knowledge", "b1", 1)).toThrow(
      StorageGovernanceError
    );
    expect(() => buildStoragePath("wA", "boards" as "knowledge", "b1", 1)).toThrow(
      expect.objectContaining({ code: StorageGovernanceErrorCode.INVALID_ENTITY_TYPE })
    );
  });

  it("rejects path traversal segments", () => {
    expect(() => parseStoragePath("workspaces/wA/knowledge/../evil/v1.md")).toThrow(
      expect.objectContaining({ code: StorageGovernanceErrorCode.PATH_TRAVERSAL })
    );
  });
});
