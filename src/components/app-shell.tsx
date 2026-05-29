import Link from "next/link";
import { ReactNode } from "react";
import { BookOpen, Kanban, Sparkles, User, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SignOutButton } from "@/components/sign-out-button";

type AppSection =
  | "board"
  | "knowledge"
  | "skills"
  | "team"
  | "profile"
  | "knowledgeDetail"
  | "skillDetail";

const items = [
  { href: "/board", key: "board", icon: Kanban },
  { href: "/knowledge", key: "knowledge", icon: BookOpen },
  { href: "/skills", key: "skills", icon: Sparkles },
  { href: "/team", key: "team", icon: Users },
] as const;

export async function AppShell({ children, section }: { children: ReactNode; section: AppSection }) {
  const shell = await getTranslations("Shell");

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/board">
          <span className="app-brand-mark">TK</span>
          <span>{shell("brand")}</span>
        </Link>

        <div className="workspace-switcher">
          <span className="workspace-icon">A</span>
          <div>
            <p>Acme</p>
            <span>{shell("workspaceActive")}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const Icon = item.icon;
            const active = section === item.key || (item.key === "knowledge" && section === "knowledgeDetail") || (item.key === "skills" && section === "skillDetail");
            return (
              <Link className={active ? "active" : undefined} href={item.href} key={item.href}>
                <Icon aria-hidden size={16} strokeWidth={2.4} />
                <strong>{shell(`nav.${item.key}`)}</strong>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
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
