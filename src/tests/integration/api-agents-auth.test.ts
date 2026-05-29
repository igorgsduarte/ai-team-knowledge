import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
  }),
}));

describe("api agents auth", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 401 when session is missing", async () => {
    const { GET } = await import("@/app/api/workspaces/[workspaceId]/agents/route");
    const response = await GET(new Request("http://localhost/api/workspaces/ws-1/agents"), {
      params: Promise.resolve({ workspaceId: "ws-1" }),
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: "Unauthorized" });
  });
});
