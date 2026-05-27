import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { BookOpen, LayoutDashboard, MessageSquare, Users, Award, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r">
        <div className="flex h-16 shrink-0 items-center px-6">
          <img src={`${basePath}/logo.svg`} alt="TeamKnowledge Logo" className="h-8 w-auto" />
          <span className="ml-3 font-semibold text-lg">TeamKnowledge</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="border-t p-4 flex flex-col space-y-2">
          <Link
            href="/profile"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              location === "/profile"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <UserCircle className="mr-3 h-5 w-5" />
            {user?.firstName || "Profile"}
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
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
