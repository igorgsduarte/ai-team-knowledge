import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/identity-toolkit", () => ({
  authenticateWithPassword: vi.fn().mockRejectedValue(new Error("invalid credentials")),
}));

describe("api auth smoke", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 401 for invalid sign-in credentials", async () => {
    const { POST } = await import("@/app/api/auth/sign-in/route");
    const request = new Request("http://localhost/api/auth/sign-in", {
      body: JSON.stringify({ email: "user@example.com", password: "password123" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const response = await POST(request as never);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Credenciais inválidas.",
    });
  });

  it("returns 400 for invalid sign-in payload", async () => {
    const { POST } = await import("@/app/api/auth/sign-in/route");
    const request = new Request("http://localhost/api/auth/sign-in", {
      body: JSON.stringify({ email: "not-an-email", password: "short" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);
  });
});
