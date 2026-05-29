import { describe, expect, it } from "vitest";
import { getSafeRedirect } from "@/lib/security/redirect";
import { mcpConnectSchema } from "@/lib/validation/mcp";
import { signInSchema } from "@/lib/validation/auth";

describe("validation schemas", () => {
  it("rejects malicious redirect targets", () => {
    expect(getSafeRedirect("https://evil.com")).toBe("/knowledge");
    expect(getSafeRedirect("//evil.com")).toBe("/knowledge");
    expect(getSafeRedirect("/invite/token")).toBe("/invite/token");
  });

  it("rejects invalid sign-in payloads", () => {
    const result = signInSchema.safeParse({
      email: "<script>@example.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid mcp connect payloads", () => {
    const result = mcpConnectSchema.safeParse({
      apiKey: "short",
      workspaceId: "",
    });

    expect(result.success).toBe(false);
  });
});
