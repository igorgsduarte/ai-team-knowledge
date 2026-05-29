import { describe, expect, it } from "vitest";
import { buildSummary } from "@/lib/markdown";

describe("entity content helpers", () => {
  it("builds a summary capped at 240 characters", () => {
    const long = "word ".repeat(80).trim();
    const summary = buildSummary(long);

    expect(summary.length).toBeLessThanOrEqual(241);
    expect(summary.endsWith("…")).toBe(true);
  });

  it("returns short content unchanged", () => {
    expect(buildSummary("Hello world")).toBe("Hello world");
  });
});
