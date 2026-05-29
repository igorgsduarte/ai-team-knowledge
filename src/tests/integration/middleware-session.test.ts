import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

function createRequest(path: string, cookies: Record<string, string> = {}): NextRequest {
  const request = new NextRequest(`http://localhost${path}`);

  for (const [name, value] of Object.entries(cookies)) {
    request.cookies.set(name, value);
  }

  return request;
}

describe("middleware session redirect", () => {
  it("redirects private routes to home when session cookie is missing", () => {
    const response = middleware(
      createRequest("/knowledge", {
        tk_user_id: "user-1",
        tk_workspace_id: "ws-1",
      })
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
    expect(response.cookies.get("__session")?.value).toBe("");
    expect(response.cookies.get("tk_user_id")?.value).toBe("");
  });

  it("allows private routes when session cookies are present", () => {
    const response = middleware(
      createRequest("/knowledge", {
        __session: "session-token",
        tk_user_id: "user-1",
        tk_workspace_id: "ws-1",
      })
    );

    expect(response.headers.get("location")).toBeNull();
  });
});
