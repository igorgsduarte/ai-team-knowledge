import { test, expect } from "@playwright/test";

const demoEmail = "demo@teamknowledge.dev";
const demoPassword = process.env.DEMO_USER_PASSWORD || "TeamKnowledge@2024";

const routes = [
  { path: "/knowledge", snapshot: "knowledge.png", heading: /knowledge|conhecimento|conocimiento/i },
  { path: "/skills", snapshot: "skills.png", heading: /skills/i },
  { path: "/team", snapshot: "team.png", heading: /gestão|management|gestión|time|team/i },
  { path: "/profile", snapshot: "profile.png", heading: /perfil|profile|mi perfil/i },
] as const;

async function signInDemo(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.locator("#email").fill(demoEmail);
  await page.locator("#password").fill(demoPassword);
  await page.getByRole("button", { name: /entrar|sign in/i }).click();
  await page.waitForURL("**/knowledge");
}

test.describe("screenshots UI parity", () => {
  test.beforeEach(async ({ page }) => {
    await signInDemo(page);
  });

  for (const route of routes) {
    test(`${route.path} matches visual baseline`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(route.heading);

      await expect(page).toHaveScreenshot(route.snapshot, { fullPage: true });
    });
  }

  test("dashboard redirects to knowledge", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/knowledge$/);
  });

  test("board redirects to knowledge", async ({ page }) => {
    await page.goto("/board");
    await expect(page).toHaveURL(/\/knowledge$/);
  });
});
