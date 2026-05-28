import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import BoardPage from "@/pages/board";
import KnowledgePage from "@/pages/knowledge";
import KnowledgeDetailPage from "@/pages/knowledge-detail";
import SkillsPage from "@/pages/skills";
import SkillDetailPage from "@/pages/skill-detail";
import TeamPage from "@/pages/team";
import ProfilePage from "@/pages/profile";
import WorkspaceNewPage from "@/pages/workspace-new";
import Layout from "@/components/layout";
import { WorkspaceProvider, useWorkspace } from "@/context/workspace";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  baseTheme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(265 70% 60%)",
    colorForeground: "hsl(260 10% 92%)",
    colorMutedForeground: "hsl(260 8% 55%)",
    colorDanger: "hsl(0 62% 50%)",
    colorBackground: "hsl(240 12% 7%)",
    colorInput: "hsl(240 12% 10%)",
    colorInputForeground: "hsl(260 10% 92%)",
    colorNeutral: "hsl(260 8% 16%)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-sm",
    card: "!shadow-none !border-0 !rounded-none",
    footer: "!shadow-none !border-0 !rounded-none",
    headerTitle: "text-2xl font-bold tracking-tight",
    headerSubtitle: "text-sm",
    footerActionLink: "text-sm font-medium text-primary hover:text-primary/90",
    formButtonPrimary: "w-full",
    formFieldInput: "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
    socialButtonsBlockButton: "w-full border",
    logoBox: "mb-6 flex justify-center",
    logoImage: "h-12 w-auto",
    footerAction: "flex items-center justify-center gap-2",
    main: "w-full",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { hasNoWorkspace, isLoading } = useWorkspace();
  const [location] = useLocation();
  if (isLoading) return null;
  if (hasNoWorkspace && location !== "/workspace/new") {
    return <Redirect to="/workspace/new" />;
  }
  return <>{children}</>;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <WorkspaceGuard>
          <Layout>
            <Component />
          </Layout>
        </WorkspaceGuard>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function WorkspaceNewRoute() {
  return (
    <>
      <Show when="signed-in"><WorkspaceNewPage /></Show>
      <Show when="signed-out"><Redirect to="/" /></Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <WorkspaceProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/workspace/new" component={WorkspaceNewRoute} />
            <Route path="/dashboard"><ProtectedRoute component={DashboardPage} /></Route>
            <Route path="/board"><ProtectedRoute component={BoardPage} /></Route>
            <Route path="/knowledge/:id"><ProtectedRoute component={KnowledgeDetailPage} /></Route>
            <Route path="/knowledge"><ProtectedRoute component={KnowledgePage} /></Route>
            <Route path="/skills/:id"><ProtectedRoute component={SkillDetailPage} /></Route>
            <Route path="/skills"><ProtectedRoute component={SkillsPage} /></Route>
            <Route path="/team"><ProtectedRoute component={TeamPage} /></Route>
            <Route path="/profile"><ProtectedRoute component={ProfilePage} /></Route>
            <Route component={NotFound} />
          </Switch>
        </WorkspaceProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
