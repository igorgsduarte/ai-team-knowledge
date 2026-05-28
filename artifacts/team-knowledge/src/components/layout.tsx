import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { BookOpen, LayoutDashboard, MessageSquare, Users, Award, UserCircle, LogOut, Building2, ChevronsUpDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWorkspace } from "@/context/workspace";

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const { workspaces, currentWorkspaceId, setCurrentWorkspaceId } = useWorkspace();
  const [, setLocation] = useLocation();

  const current = workspaces.find((w: any) => w.id === currentWorkspaceId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group">
          <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="flex-1 font-semibold text-sm truncate">{current?.name ?? "Selecionar workspace"}</span>
          <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1.5" align="start">
        <div className="space-y-0.5">
          {workspaces.map((w: any) => (
            <button
              key={w.id}
              onClick={() => { setCurrentWorkspaceId(w.id); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center shrink-0">
                <Building2 className="w-3 h-3 text-primary" />
              </div>
              <span className="flex-1 truncate">{w.name}</span>
              {w.id === currentWorkspaceId && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
        <div className="border-t mt-1.5 pt-1.5">
          <button
            onClick={() => { setOpen(false); setLocation("/workspace/new"); }}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-sm text-muted-foreground"
          >
            <Plus className="w-3.5 h-3.5" /> Novo workspace
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Board", href: "/board", icon: MessageSquare },
    { name: "Knowledge", href: "/knowledge", icon: BookOpen },
    { name: "Skills", href: "/skills", icon: Award },
    { name: "Team", href: "/team", icon: Users },
  ];

  const isActive = (href: string) => location === href || (href !== "/dashboard" && location.startsWith(href));

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r">
        <div className="flex h-16 shrink-0 items-center px-5 gap-3 border-b">
          <img src={`${basePath}/logo.svg`} alt="TeamKnowledge Logo" className="h-7 w-auto" />
          <span className="font-semibold text-base">TeamKnowledge</span>
        </div>

        <div className="px-3 pt-3 pb-1">
          <WorkspaceSwitcher />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-2 space-y-0.5">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn("mr-3 h-4 w-4 flex-shrink-0", active ? "text-primary" : "text-muted-foreground")}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="border-t p-3 flex flex-col space-y-0.5">
          <Link
            href="/profile"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              location === "/profile"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <UserCircle className="mr-3 h-4 w-4" />
            {user?.firstName || "Perfil"}
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground h-9 px-3 text-sm"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <main className="md:pl-64 flex-1">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
