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

vi.mock("@/lib/firebase/admin", () => ({
  isFirebaseAdminConfigured: () => true,
  getFirebaseAdminAuth: () => ({
    verifySessionCookie: vi.fn().mockRejectedValue(new Error("invalid session")),
  }),
}));

vi.mock("@/lib/firebase/workspace-access", () => ({
  resolveWorkspaceRole: vi.fn().mockResolvedValue("member"),
}));

describe("auth context fallback", () => {
  beforeEach(() => {
    vi.resetModules();
    cookieStore.clear();
    process.env.ALLOW_INSECURE_DEV_AUTH = "false";
    vi.stubEnv("NODE_ENV", "production");
  });

  it("does not authenticate with tk_user_id alone in production", async () => {
    cookieStore.set("tk_user_id", "user-1");
    cookieStore.set("tk_workspace_id", "ws-1");

    const { verifySessionOptional } = await import("@/lib/dal/session");
    await expect(verifySessionOptional()).resolves.toBeNull();
  });

  it("allows insecure dev auth only when explicitly enabled", async () => {
    cookieStore.set("tk_user_id", "user-1");
    cookieStore.set("tk_workspace_id", "ws-1");
    process.env.ALLOW_INSECURE_DEV_AUTH = "true";
    vi.stubEnv("NODE_ENV", "development");

    const { verifySessionOptional } = await import("@/lib/dal/session");
    const auth = await verifySessionOptional();

    expect(auth).toMatchObject({ userId: "user-1", workspaceId: "ws-1" });
  });
});
