import Link from "next/link";
import { ReactNode } from "react";
import { BookOpen, Bot, Settings, Sparkles, User, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthContext } from "@/lib/firebase/auth";

type AppSection =
  | "agents"
  | "knowledge"
  | "skills"
  | "team"
  | "profile"
  | "workspaceSettings";

const items = [
  { href: "/knowledge", key: "knowledge", icon: BookOpen },
  { href: "/skills", key: "skills", icon: Sparkles },
  { href: "/agents", key: "agents", icon: Bot },
  { href: "/team", key: "team", icon: Users },
] as const;

export async function AppShell({
  children,
  section,
  workspaceName,
}: {
  children: ReactNode;
  section: AppSection;
  workspaceName?: string;
}) {
  const shell = await getTranslations("Shell");
  const auth = await getAuthContext();
  const displayName = workspaceName ?? "Workspace";

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/knowledge">
          <span className="app-brand-mark">TK</span>
          <span>{shell("brand")}</span>
        </Link>

        <div className="workspace-switcher">
          <span className="workspace-icon">A</span>
          <div>
            <p>{displayName}</p>
            <span>{shell("workspaceActive")}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const Icon = item.icon;
            const active = section === item.key;
            return (
              <Link className={active ? "active" : undefined} href={item.href} key={item.href}>
                <Icon aria-hidden size={16} strokeWidth={2.4} />
                <strong>{shell(`nav.${item.key}`)}</strong>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {auth?.role === "owner" ? (
            <Link
              className={section === "workspaceSettings" ? "active" : undefined}
              href="/workspace/settings"
            >
              <Settings aria-hidden size={16} strokeWidth={2.4} />
              <strong>{shell("nav.workspaceSettings")}</strong>
            </Link>
          ) : null}
          <Link className={section === "profile" ? "active" : undefined} href="/profile">
            <User aria-hidden size={16} strokeWidth={2.4} />
            <strong>{shell("nav.profile")}</strong>
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}
