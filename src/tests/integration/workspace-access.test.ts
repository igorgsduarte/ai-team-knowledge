import { describe, expect, it, vi } from "vitest";
import { requireWorkspaceAdmin, requireWorkspaceMember } from "@/lib/firebase/workspace-access";
import { WorkspaceAccessErrorCode } from "@/lib/types/workspace-lifecycle";
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

describe("workspace access", () => {
  it("allows members listed on the workspace", async () => {
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ws-1",
        members: [{ role: "member", userId: "user-1" }],
        name: "Acme",
      }),
    });

    const auth: AuthContext = { userId: "user-1", workspaceId: "ws-1" };
    const member = await requireWorkspaceMember(auth, "ws-1");
    expect(member.role).toBe("member");
  });

  it("rejects users who are not members", async () => {
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ws-1",
        members: [{ role: "owner", userId: "owner-1" }],
        name: "Acme",
      }),
    });

    const auth: AuthContext = { userId: "user-2", workspaceId: "ws-1" };
    await expect(requireWorkspaceMember(auth, "ws-1")).rejects.toMatchObject({
      code: WorkspaceAccessErrorCode.NOT_A_MEMBER,
    });
  });

  it("allows workspace admins", async () => {
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ws-1",
        members: [{ role: "admin", userId: "admin-1" }],
        name: "Acme",
      }),
    });

    const auth: AuthContext = { userId: "admin-1", workspaceId: "ws-1" };
    const member = await requireWorkspaceAdmin(auth, "ws-1");
    expect(member.role).toBe("admin");
  });

  it("rejects regular members for admin access", async () => {
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ws-1",
        members: [{ role: "member", userId: "member-1" }],
        name: "Acme",
      }),
    });

    const auth: AuthContext = { userId: "member-1", workspaceId: "ws-1" };
    await expect(requireWorkspaceAdmin(auth, "ws-1")).rejects.toMatchObject({
      code: WorkspaceAccessErrorCode.ADMIN_REQUIRED,
    });
  });
});
