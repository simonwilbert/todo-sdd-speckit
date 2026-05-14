import { expect, test } from "@playwright/test";

test.describe("US3 — delete with undo", () => {
  test("delete shows undo; undo restores row; letting timer expire removes task on reload", async ({
    page,
  }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.goto("/");
    await expect(page.getByLabel(/new task/i)).toBeVisible({ timeout: 60_000 });

    const label = "US3 delete undo";
    await page.getByLabel(/new task/i).fill(label);
    await page.getByRole("button", { name: /add task/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: 15_000,
      },
    );

    await page
      .getByRole("button", { name: new RegExp(`Delete task: ${label}`, "i") })
      .click();
    await expect(
      page.getByRole("list", { name: /tasks/i }).getByText(label),
    ).not.toBeVisible();
    await expect(page.getByRole("button", { name: /undo/i })).toBeVisible();

    await page.getByRole("button", { name: /undo/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: 15_000,
      },
    );
    await expect(page.getByRole("button", { name: /undo/i })).not.toBeVisible();

    await page
      .getByRole("button", { name: new RegExp(`Delete task: ${label}`, "i") })
      .click();
    await expect(page.getByRole("button", { name: /undo/i })).toBeVisible();
    await expect(
      page.getByRole("list", { name: /tasks/i }).getByText(label),
    ).not.toBeVisible();

    await expect(page.getByRole("button", { name: /undo/i })).not.toBeVisible({
      timeout: 7000,
    });

    await page.reload();
    await expect(
      page.getByRole("list", { name: /tasks/i }).getByText(label),
    ).not.toBeVisible({
      timeout: 15_000,
    });
  });
});
