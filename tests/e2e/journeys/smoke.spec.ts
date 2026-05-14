import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /personal todo/i })).toBeVisible();
  });
});
