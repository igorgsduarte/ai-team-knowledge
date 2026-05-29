import { describe, expect, it } from "vitest";
import { buildStoragePath } from "@/lib/firebase/storage";

describe("workspace isolation", () => {
  it("builds storage path namespaced by workspace", () => {
    const pathA = buildStoragePath("wA", "knowledge", "k1", 1);
    const pathB = buildStoragePath("wB", "knowledge", "k1", 1);

    expect(pathA).toContain("workspaces/wA/");
    expect(pathB).toContain("workspaces/wB/");
    expect(pathA).not.toBe(pathB);
  });
});
