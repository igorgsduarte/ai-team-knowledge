import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = cookieStore.get(name);
      return value ? { value } : undefined;
    },
  }),
}));

const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

vi.mock("@/lib/firebase/admin", () => ({
  isFirebaseAdminConfigured: () => true,
  getFirebaseAdminAuth: () => ({
    verifySessionCookie: vi.fn().mockRejectedValue(new Error("invalid session")),
  }),
}));

vi.mock("@/lib/firebase/workspace-access", () => ({
  resolveWorkspaceRole: vi.fn().mockResolvedValue("member"),
}));

describe("app layout auth redirect", () => {
  beforeEach(() => {
    vi.resetModules();
    cookieStore.clear();
    redirectMock.mockClear();
    process.env.ALLOW_INSECURE_DEV_AUTH = "false";
    vi.stubEnv("NODE_ENV", "production");
  });

  it("redirects to clear-session route when auth is invalid", async () => {
    cookieStore.set("__session", "expired");
    cookieStore.set("tk_user_id", "user-1");
    cookieStore.set("tk_workspace_id", "ws-1");

    const layout = (await import("@/app/(app)/layout")).default;

    await expect(layout({ children: null })).rejects.toThrow("REDIRECT:/api/auth/clear-session");
  });
});
