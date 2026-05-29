"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Pencil,
  Trash2,
  UserCog,
  UserMinus,
  UserPlus,
} from "lucide-react";
import {
  removeWorkspaceMember,
  setWorkspaceMemberStatus,
  updateWorkspaceMemberRole,
} from "@/app/actions/team-members";
import type { WorkspaceMemberRole, WorkspaceMemberStatus } from "@/lib/types/domain";
import type { WorkspaceUserProfile } from "@/lib/repositories/users-repository";

type TeamMemberActionsMenuProps = {
  actorRole: WorkspaceMemberRole;
  actorUserId: string;
  canManage: boolean;
  member: WorkspaceUserProfile;
  onEdit: () => void;
};

function canManageTarget(
  actorRole: WorkspaceMemberRole,
  actorUserId: string,
  member: WorkspaceUserProfile
): boolean {
  if (member.role === "owner") {
    return false;
  }

  if (member.id === actorUserId) {
    return false;
  }

  if (actorRole === "admin" && member.role === "admin") {
    return false;
  }

  return true;
}

export function TeamMemberActionsMenu({
  actorRole,
  actorUserId,
  canManage,
  member,
  onEdit,
}: TeamMemberActionsMenuProps) {
  const t = useTranslations("Team");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (!canManage || !canManageTarget(actorRole, actorUserId, member)) {
    return null;
  }

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      setOpen(false);
      router.refresh();
    });
  }

  function onRoleChange(role: Extract<WorkspaceMemberRole, "admin" | "member">) {
    run(() => updateWorkspaceMemberRole(member.id, role));
  }

  function onStatusChange(status: WorkspaceMemberStatus) {
    run(() => setWorkspaceMemberStatus(member.id, status));
  }

  function onRemove() {
    if (!window.confirm(t("deleteConfirm", { name: member.name || member.email || member.id }))) {
      return;
    }

    run(() => removeWorkspaceMember(member.id));
  }

  const canPromoteAdmin = actorRole === "owner";

  return (
    <div className="team-row-menu" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("actionsMenu")}
        className="icon-button"
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <MoreVertical size={16} />
      </button>
      {open ? (
        <div className="dropdown-menu" role="menu">
          <button
            className="dropdown-menu-item"
            disabled={pending}
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            role="menuitem"
            type="button"
          >
            <Pencil size={16} />
            {t("editMember")}
          </button>
          {canPromoteAdmin ? (
            <button
              className="dropdown-menu-item"
              disabled={pending || member.role === "admin"}
              onClick={() => onRoleChange("admin")}
              role="menuitem"
              type="button"
            >
              <UserCog size={16} />
              {t("makeAdmin")}
            </button>
          ) : null}
          <button
            className="dropdown-menu-item"
            disabled={pending || member.role === "member"}
            onClick={() => onRoleChange("member")}
            role="menuitem"
            type="button"
          >
            <UserCog size={16} />
            {t("makeMember")}
          </button>
          {member.status === "inactive" ? (
            <button
              className="dropdown-menu-item"
              disabled={pending}
              onClick={() => onStatusChange("active")}
              role="menuitem"
              type="button"
            >
              <UserPlus size={16} />
              {t("activateMember")}
            </button>
          ) : (
            <button
              className="dropdown-menu-item"
              disabled={pending}
              onClick={() => onStatusChange("inactive")}
              role="menuitem"
              type="button"
            >
              <UserMinus size={16} />
              {t("deactivateMember")}
            </button>
          )}
          <button
            className="dropdown-menu-item dropdown-menu-item--danger"
            disabled={pending}
            onClick={onRemove}
            role="menuitem"
            type="button"
          >
            <Trash2 size={16} />
            {t("deleteMember")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
