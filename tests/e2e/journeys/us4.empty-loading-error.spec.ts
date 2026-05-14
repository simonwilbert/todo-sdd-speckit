import { expect, test, type Page } from "@playwright/test";

/** Intercept GET /todos at the network layer (reliable with Vite dev proxy). */
async function routeTodosEmpty(page: Page) {
  await page.route("**/todos", async (route) => {
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

async function routeTodosDelayedEmpty(page: Page, delayMs: number) {
  await page.route("**/todos", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    await new Promise((r) => setTimeout(r, delayMs));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    });
  });
}

async function routeTodosFailThenEmpty(page: Page) {
  let n = 0;
  await page.route("**/todos", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    n += 1;
    if (n <= 2) {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Persistence unavailable" } }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    });
  });
}

test.describe("US4 — empty, loading, and error states", () => {
  test("empty list shows empty state and CTA focuses new-task field", async ({
    page,
  }) => {
    await routeTodosEmpty(page);

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 60_000,
    });
    await page.getByRole("button", { name: /add (your )?first task/i }).click();
    await expect(page.getByRole("textbox", { name: /^new task$/i })).toBeFocused();
  });

  test("slow list load shows loading message after 200 ms", async ({ page }) => {
    await routeTodosDelayedEmpty(page, 800);

    await page.goto("/");
    await expect(page.getByText(/loading (your saved tasks|tasks)/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("list error shows alert and Retry loads empty state", async ({ page }) => {
    await routeTodosFailThenEmpty(page);

    await page.goto("/");
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^retry$/i }).click();
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("alert")).not.toBeVisible();
  });
});
