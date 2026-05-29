import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/auth/clear-session/route";

describe("clear-session route", () => {
  it("clears auth cookies and redirects to the public home page", async () => {
    const request = new Request("http://localhost:3000/api/auth/clear-session", {
      headers: {
        cookie: "__session=stale; tk_user_id=user-1; tk_workspace_id=ws-1",
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
    expect(response.cookies.get("__session")?.value).toBe("");
    expect(response.cookies.get("tk_user_id")?.value).toBe("");
    expect(response.cookies.get("tk_workspace_id")?.value).toBe("");
  });
});
