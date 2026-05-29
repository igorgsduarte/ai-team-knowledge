import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieSet = vi.fn();
const updateUserLocale = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: cookieSet }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/firebase/auth", () => ({
  requireAuthContext: async () => ({ userId: "acme-alice", workspaceId: "acme", email: "alice@teamknowledge.dev" }),
}));

vi.mock("@/lib/repositories/users-repository", () => ({
  usersRepository: { updateUserLocale },
}));

describe("profile locale action", () => {
  beforeEach(() => {
    cookieSet.mockReset();
    updateUserLocale.mockReset();
  });

  it("persists a normalized locale in Firestore and cookie", async () => {
    const { updateProfileLocale } = await import("@/app/actions/profile");

    const result = await updateProfileLocale("en-US");

    expect(result).toEqual({ ok: true, locale: "en" });
    expect(updateUserLocale).toHaveBeenCalledWith("acme-alice", "en");
    expect(cookieSet).toHaveBeenCalledWith("tk_locale", "en", expect.objectContaining({ httpOnly: true, path: "/" }));
  });

  it("rejects unsupported locales", async () => {
    const { updateProfileLocale } = await import("@/app/actions/profile");

    const result = await updateProfileLocale("fr");

    expect(result).toEqual({ ok: false });
    expect(updateUserLocale).not.toHaveBeenCalled();
    expect(cookieSet).not.toHaveBeenCalled();
  });
});
