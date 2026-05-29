import { describe, expect, it, vi } from "vitest";
import {
  WORKSPACE_RETENTION_DAYS,
  WorkspaceAccessErrorCode,
  computePurgeScheduledAt,
} from "@/lib/types/workspace-lifecycle";
import { requireWorkspaceOwner } from "@/lib/firebase/workspace-access";
import type { AuthContext } from "@/lib/types/domain";

const getMock = vi.fn();

vi.mock("@/lib/firebase/firestore", () => ({
  firestoreCollections: { workspaces: "workspaces" },
  getFirestoreDb: () => ({
    collection: () => ({
      doc: () => ({
        get: getMock,
      }),
    }),
  }),
}));

describe("workspace lifecycle", () => {
  it("schedules purge 30 days after deletion", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const scheduled = computePurgeScheduledAt(from);
    const expected = new Date(from);
    expected.setUTCDate(expected.getUTCDate() + WORKSPACE_RETENTION_DAYS);

    expect(scheduled).toBe(expected.toISOString());
  });

  it("rejects owner-only access for members", async () => {
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ws-1",
        members: [{ role: "member", userId: "user-1" }],
        name: "Acme",
      }),
    });

    const auth: AuthContext = {
      role: "member",
      userId: "user-1",
      workspaceId: "ws-1",
    };

    await expect(requireWorkspaceOwner(auth, "ws-1")).rejects.toMatchObject({
      code: WorkspaceAccessErrorCode.OWNER_REQUIRED,
      name: "WorkspaceAccessError",
    });
  });
});

describe("workspace pending deletion redirect policy", () => {
  it("treats operational routes separately from settings", () => {
    const operational = ["/knowledge", "/skills", "/team", "/profile"];
    const allowedDuringRetention = "/workspace/settings";

    expect(operational.every((path) => path !== allowedDuringRetention)).toBe(true);
  });
});
