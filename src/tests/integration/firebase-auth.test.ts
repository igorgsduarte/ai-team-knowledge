import { beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

function setAdminEnv(): void {
  process.env.FIREBASE_PROJECT_ID = "team-ai-knowledge-app";
  process.env.FIREBASE_CLIENT_EMAIL = "firebase-adminsdk@test.iam.gserviceaccount.com";
  process.env.FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n";
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "team-ai-knowledge-app.firebasestorage.app";
}

describe("firebase admin setup", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  it("loads admin config from env", async () => {
    setAdminEnv();
    const { firebaseAdmin } = await import("@/lib/firebase/admin");

    expect(firebaseAdmin.ready).toBe(true);
    expect(firebaseAdmin.projectId).toBe("team-ai-knowledge-app");
  });

  it("reports admin as not ready when credentials are missing", async () => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;

    const { firebaseAdmin } = await import("@/lib/firebase/admin");
    expect(firebaseAdmin.ready).toBe(false);
  });
});
