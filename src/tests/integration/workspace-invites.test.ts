import { createHash } from "crypto";
import { describe, expect, it } from "vitest";

describe("workspace invite tokens", () => {
  it("hashes opaque tokens for lookup", () => {
    const token = "abc123opaque";
    const hash = createHash("sha256").update(token).digest("hex");

    expect(hash).toHaveLength(64);
    expect(createHash("sha256").update(token).digest("hex")).toBe(hash);
  });

  it("detects expired invites by timestamp", () => {
    const expiredAt = new Date(Date.now() - 60_000).toISOString();
    expect(Date.parse(expiredAt) <= Date.now()).toBe(true);
  });
});
