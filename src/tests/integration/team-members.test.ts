import { describe, expect, it } from "vitest";
import {
  assertMemberCanBeManaged,
  assertMemberRoleChangeAllowed,
} from "@/lib/workspace/member-management";
import type { WorkspaceMember } from "@/lib/types/domain";

function workspaceMembers(): WorkspaceMember[] {
  return [
    { role: "owner", status: "active", userId: "owner-1" },
    { role: "admin", status: "active", userId: "admin-1" },
    { role: "member", status: "active", userId: "member-1" },
  ];
}

describe("team member management rules", () => {
  it("allows owner to promote members to admin", () => {
    const actor = workspaceMembers()[0];
    const target = workspaceMembers()[2];

    expect(() =>
      assertMemberCanBeManaged(actor, target, actor.userId, target.userId)
    ).not.toThrow();
    expect(() => assertMemberRoleChangeAllowed(actor, "admin")).not.toThrow();
  });

  it("blocks admin from promoting another member to admin", () => {
    const actor = workspaceMembers()[1];

    expect(() => assertMemberRoleChangeAllowed(actor, "admin")).toThrow(
      "ADMIN_CANNOT_PROMOTE_TO_ADMIN"
    );
  });

  it("blocks admin from managing another admin", () => {
    const actor = workspaceMembers()[1];
    const target = workspaceMembers()[1];

    expect(() =>
      assertMemberCanBeManaged(actor, target, "admin-1", "admin-1")
    ).toThrow("SELF_MODIFICATION_NOT_ALLOWED");
  });

  it("blocks modifying the workspace owner", () => {
    const actor = workspaceMembers()[0];
    const target = workspaceMembers()[0];

    expect(() =>
      assertMemberCanBeManaged(actor, target, actor.userId, target.userId)
    ).toThrow("OWNER_CANNOT_BE_MODIFIED");
  });

  it("blocks admin from changing another admin", () => {
    const actor: WorkspaceMember = { role: "admin", status: "active", userId: "admin-1" };
    const target: WorkspaceMember = { role: "admin", status: "active", userId: "admin-2" };

    expect(() =>
      assertMemberCanBeManaged(actor, target, actor.userId, target.userId)
    ).toThrow("ADMIN_CANNOT_MANAGE_ADMIN");
  });
});
