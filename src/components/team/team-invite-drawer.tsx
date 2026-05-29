"use client";

import { FormEvent, KeyboardEvent, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { sendWorkspaceInvites } from "@/app/actions/team-members";
import { Drawer } from "@/components/ui/drawer";
import type { WorkspaceInviteRole } from "@/lib/types/workspace-lifecycle";

type TeamInviteDrawerProps = {
  actorRole: "admin" | "owner";
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function TeamInviteDrawer({ actorRole }: TeamInviteDrawerProps) {
  const t = useTranslations("Team");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<WorkspaceInviteRole>("member");
  const [pending, startTransition] = useTransition();

  function resetForm() {
    setEmailInput("");
    setEmails([]);
    setRole("member");
  }

  function addEmail(raw: string) {
    const email = raw.trim().toLowerCase();
    if (!email || !isValidEmail(email) || emails.includes(email)) {
      return;
    }
    setEmails((current) => [...current, email]);
    setEmailInput("");
  }

  function onEmailKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addEmail(emailInput);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pendingEmail = emailInput.trim();
    const nextEmails = [...emails];
    if (pendingEmail && isValidEmail(pendingEmail) && !nextEmails.includes(pendingEmail.toLowerCase())) {
      nextEmails.push(pendingEmail.toLowerCase());
    }

    if (nextEmails.length === 0) {
      return;
    }

    startTransition(async () => {
      await sendWorkspaceInvites({ emails: nextEmails, role });
      resetForm();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button className="primary-button" onClick={() => setOpen(true)} type="button">
        <Plus aria-hidden size={16} />
        {t("sendInvite")}
      </button>
      <Drawer
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            resetForm();
          }
        }}
        open={open}
        title={t("inviteDrawerTitle")}
      >
        <form className="drawer-form" onSubmit={onSubmit}>
          <label>
            {t("inviteEmailLabel")}
            <input
              onBlur={() => addEmail(emailInput)}
              onChange={(event) => setEmailInput(event.target.value)}
              onKeyDown={onEmailKeyDown}
              placeholder={t("inviteEmailPlaceholder")}
              type="email"
              value={emailInput}
            />
          </label>
          <label>
            {t("inviteRoleLabel")}
            <select
              onChange={(event) => setRole(event.target.value as WorkspaceInviteRole)}
              value={role}
            >
              <option value="member">{t("role.member")}</option>
              {actorRole === "owner" ? <option value="admin">{t("role.admin")}</option> : null}
            </select>
          </label>
          {emails.length > 0 ? (
            <ul className="invite-email-list">
              {emails.map((email) => (
                <li className="invite-email-chip" key={email}>
                  <span>{email}</span>
                  <button
                    aria-label={t("removeEmail", { email })}
                    className="icon-button"
                    onClick={() => setEmails((current) => current.filter((entry) => entry !== email))}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? t("sendingInvites") : t("sendInvites", { count: emails.length || 1 })}
          </button>
        </form>
      </Drawer>
    </>
  );
}
