import { beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

function setPublicEnv(): void {
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "api-key";
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "team-ai-knowledge-app.firebaseapp.com";
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "team-ai-knowledge-app";
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "team-ai-knowledge-app.firebasestorage.app";
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "4802621617";
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:4802621617:web:4aa3bc953d5f4b20fdf290";
}

describe("firebase client config", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  it("loads when required public envs are set", async () => {
    setPublicEnv();
    const { firebaseClientApp } = await import("@/lib/firebase/client");
    expect(firebaseClientApp).toBeTruthy();
  });

  it("does not initialize client app when public env is missing", async () => {
    setPublicEnv();
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const { firebaseClientApp, isFirebaseClientConfigured } = await import("@/lib/firebase/client");
    expect(isFirebaseClientConfigured()).toBe(false);
    expect(firebaseClientApp).toBeNull();
  });
});
