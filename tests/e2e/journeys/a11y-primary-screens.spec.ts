import { expect, test, type Page } from "@playwright/test";
import { expectNoCriticalOrSeriousAxeViolations } from "../helpers/a11y.js";

async function routeTodosEmpty(page: Page) {
  await page.route(/\/todos(\/.*)?$/, async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    });
  });
}

async function routeTodosOneRow(page: Page) {
  await page.route(/\/todos(\/.*)?$/, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "00000000-0000-4000-8000-0000000000bb",
            text: "A11y sample row",
            completed: false,
            createdAt: "2026-05-16T12:00:00.000Z",
            updatedAt: "2026-05-16T12:00:00.000Z",
          },
        ]),
      });
      return;
    }
    await route.continue();
  });
}

/**
 * SC-005 axe gate on primary screens without requiring DATABASE_URL
 * (network mocks only — complements US5 DB-backed journeys).
 */
test.describe("Accessibility — primary screens (mocked API)", () => {
  test("empty home: zero critical/serious axe violations", async ({ page }) => {
    await routeTodosEmpty(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /your tasks/i })).toBeVisible({
      timeout: 15_000,
    });
    await expectNoCriticalOrSeriousAxeViolations(page);
  });

  test("home with one task: zero critical/serious axe violations", async ({ page }) => {
    await routeTodosOneRow(page);
    await page.goto("/");
    await expect(page.getByText("A11y sample row")).toBeVisible({ timeout: 15_000 });
    await expectNoCriticalOrSeriousAxeViolations(page);
  });
});
