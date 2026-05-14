import type { APIRequestContext, Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { expectNoCriticalOrSeriousAxeViolations } from "../helpers/a11y";

const API_BASE = process.env.PLAYWRIGHT_API_URL ?? "http://127.0.0.1:3000";

async function clearAllTodos(request: APIRequestContext) {
  const res = await request.get(`${API_BASE}/todos`);
  if (!res.ok()) return;
  const todos = (await res.json()) as { id: string }[];
  for (const t of todos) {
    await request.delete(`${API_BASE}/todos/${encodeURIComponent(t.id)}`);
  }
}

async function expectMinTouchTarget(locator: Locator, minPx = 44) {
  const box = await locator.boundingBox();
  expect(box, "element should be visible for bounding box").not.toBeNull();
  expect(box!.width, "touch target width").toBeGreaterThanOrEqual(minPx - 0.5);
  expect(box!.height, "touch target height").toBeGreaterThanOrEqual(minPx - 0.5);
}

async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, "no horizontal overflow").toBeLessThanOrEqual(clientWidth + 2);
}

test.describe("US5 — responsive layout and accessibility", () => {
  test.beforeAll(async ({ request }) => {
    if (!process.env.DATABASE_URL) return;
    await clearAllTodos(request);
  });

  test.beforeEach(async ({ request }) => {
    if (!process.env.DATABASE_URL) return;
    await clearAllTodos(request);
  });

  test("mobile: empty home has no critical/serious axe issues, touch targets, no horizontal scroll", async ({
    page,
  }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /your tasks|personal todo/i }),
    ).toBeVisible({
      timeout: 60_000,
    });

    await expectNoHorizontalOverflow(page);
    await expectMinTouchTarget(page.getByRole("button", { name: /add task/i }));
    await expectMinTouchTarget(
      page.getByRole("button", { name: /add (your )?first task/i }),
    );

    await expectNoCriticalOrSeriousAxeViolations(page);
  });

  test("mobile: with a task, primary controls meet touch target minimum and axe passes", async ({
    page,
  }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByLabel(/new task/i)).toBeVisible({ timeout: 60_000 });

    const label = "US5 a11y row";
    await page.getByLabel(/new task/i).fill(label);
    await page.getByRole("button", { name: /add task/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: 15_000,
      },
    );

    await expectNoHorizontalOverflow(page);
    await expectMinTouchTarget(
      page.getByRole("checkbox", { name: new RegExp(label, "i") }),
    );
    await expectMinTouchTarget(
      page.getByRole("button", { name: new RegExp(`Delete task: ${label}`, "i") }),
    );

    await expectNoCriticalOrSeriousAxeViolations(page);
  });

  test("desktop: layout and axe on home with a task", async ({ page }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByLabel(/new task/i)).toBeVisible({ timeout: 60_000 });

    const label = "US5 desktop row";
    await page.getByLabel(/new task/i).fill(label);
    await page.getByRole("button", { name: /add task/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: 15_000,
      },
    );

    await expectNoHorizontalOverflow(page);
    await expectNoCriticalOrSeriousAxeViolations(page);
  });

  test("keyboard: tab reaches add task, new task field, and task row controls", async ({
    page,
  }) => {
    test.skip(
      !process.env.DATABASE_URL,
      "Requires DATABASE_URL and API (see npm run e2e / CI)",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByLabel(/new task/i)).toBeVisible({ timeout: 60_000 });

    const label = "US5 keyboard row";
    await page.getByLabel(/new task/i).fill(label);
    await page.getByRole("button", { name: /add task/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: 15_000,
      },
    );

    await page.getByRole("textbox", { name: /^new task$/i }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: /add task/i })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("checkbox", { name: new RegExp(label, "i") }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: new RegExp(`Delete task: ${label}`, "i") }),
    ).toBeFocused();
  });
});
