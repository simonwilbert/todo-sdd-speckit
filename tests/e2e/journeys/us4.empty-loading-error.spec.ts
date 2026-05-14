import { expect, test, type Page, type Route } from "@playwright/test";

function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

async function stubTodosGet(page: Page, handler: (route: Route) => void | Promise<void>) {
  await page.context().route(
    (url) => normalizePathname(url.pathname) === "/todos",
    async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue();
        return;
      }
      await handler(route);
    },
  );
}

test.describe("US4 — empty, loading, and error states", () => {
  test.afterEach(async ({ context }) => {
    await context.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("empty list shows empty state and CTA focuses new-task field", async ({
    page,
  }) => {
    await stubTodosGet(page, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 60_000,
    });
    await page.getByRole("button", { name: /add your first task/i }).click();
    await expect(page.getByRole("textbox", { name: /^new task$/i })).toBeFocused();
  });

  test("slow list load shows loading message after 200 ms", async ({ page }) => {
    await stubTodosGet(page, async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    });

    await page.goto("/");
    await expect(page.getByText(/loading your saved tasks/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("list error shows alert and Retry loads empty state", async ({ page }) => {
    let getCount = 0;
    await stubTodosGet(page, async (route) => {
      getCount += 1;
      if (getCount === 1) {
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

    await page.goto("/");
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^retry$/i }).click();
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("alert")).not.toBeVisible();
  });
});
