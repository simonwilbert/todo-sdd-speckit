import { expect, test } from "@playwright/test";

test.describe("US2 — mark complete and persist", () => {
  test("toggle complete, reload, toggle incomplete, reload", async ({ page }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.goto("/");
    await expect(page.getByLabel(/new task/i)).toBeVisible({ timeout: 60_000 });

    const label = "US2 persist toggle";
    await page.getByLabel(/new task/i).fill(label);
    await page.getByRole("button", { name: /add task/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: 15_000,
      },
    );

    const checkbox = page.getByRole("checkbox", { name: new RegExp(label, "i") });
    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    await page.reload();
    await expect(
      page.getByRole("checkbox", { name: new RegExp(label, "i") }),
    ).toBeChecked({
      timeout: 15_000,
    });

    await page.getByRole("checkbox", { name: new RegExp(label, "i") }).click();
    await expect(
      page.getByRole("checkbox", { name: new RegExp(label, "i") }),
    ).not.toBeChecked();

    await page.reload();
    await expect(
      page.getByRole("checkbox", { name: new RegExp(label, "i") }),
    ).not.toBeChecked({
      timeout: 15_000,
    });
  });
});
