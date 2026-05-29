import { afterEach, describe, expect, it } from "vitest";
import {
  formatStorageBucketNotFoundError,
  getConfiguredStorageBucketName,
  isStorageBucketNotFoundError,
  listStorageBucketCandidates,
  normalizeStorageBucketName,
  StorageBucketNotFoundError,
  storageBucketSetupUrl,
} from "@/lib/firebase/storage-bucket";

describe("storage bucket helpers", () => {
  const envBackup = { ...process.env };

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it("normalizes gs:// and storage.googleapis.com URLs", () => {
    expect(normalizeStorageBucketName("gs://my-app.appspot.com")).toBe("my-app.appspot.com");
    expect(normalizeStorageBucketName("https://storage.googleapis.com/my-app.firebasestorage.app/")).toBe(
      "my-app.firebasestorage.app"
    );
  });

  it("lists configured bucket before project defaults", () => {
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "custom-bucket";
    process.env.FIREBASE_PROJECT_ID = "team-ai-knowledge-app";

    expect(listStorageBucketCandidates("team-ai-knowledge-app")).toEqual([
      "custom-bucket",
      "team-ai-knowledge-app.firebasestorage.app",
      "team-ai-knowledge-app.appspot.com",
    ]);
  });

  it("reads configured bucket from server override", () => {
    process.env.FIREBASE_STORAGE_BUCKET = "server-bucket";
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "public-bucket";

    expect(getConfiguredStorageBucketName()).toBe("server-bucket");
  });

  it("builds setup URL and not-found message", () => {
    const url = storageBucketSetupUrl("team-ai-knowledge-app");
    const message = formatStorageBucketNotFoundError("team-ai-knowledge-app", [
      "team-ai-knowledge-app.firebasestorage.app",
    ]);

    expect(url).toContain("team-ai-knowledge-app/storage");
    expect(message).toContain("FIREBASE_STORAGE_BUCKET_NOT_FOUND");
    expect(message).toContain(url);
  });

  it("identifies StorageBucketNotFoundError", () => {
    const error = new StorageBucketNotFoundError("team-ai-knowledge-app", ["a.appspot.com"]);

    expect(isStorageBucketNotFoundError(error)).toBe(true);
    expect(isStorageBucketNotFoundError(new Error("other"))).toBe(false);
  });
});
