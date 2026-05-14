import { expect, test } from "@playwright/test";

test.describe("US1 — capture and revisit", () => {
  test("add task, reload, task persists", async ({ page }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /personal todo/i })).toBeVisible();
    await expect(page.getByLabel(/new task/i)).toBeVisible({ timeout: 60_000 });

    await page.getByLabel(/new task/i).fill("Buy milk");
    await page.getByRole("button", { name: /add task/i }).click();

    await expect(
      page.getByRole("list", { name: /tasks/i }).getByText("Buy milk"),
    ).toBeVisible({
      timeout: 15_000,
    });

    await page.reload();
    await expect(
      page.getByRole("list", { name: /tasks/i }).getByText("Buy milk"),
    ).toBeVisible({
      timeout: 15_000,
    });
  });
});
