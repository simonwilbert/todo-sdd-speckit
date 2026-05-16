import { expect, test, type Page } from "@playwright/test";
import { elapsedMs, perfBudgetMs } from "../helpers/performance.js";

const SAMPLE_TODO = {
  id: "00000000-0000-4000-8000-000000000099",
  text: "Perf sample task",
  completed: false,
  createdAt: "2026-05-16T12:00:00.000Z",
  updatedAt: "2026-05-16T12:00:00.000Z",
};

async function routeTodosMutable(page: Page) {
  let todos: (typeof SAMPLE_TODO)[] = [];
  await page.route(/\/todos(\/.*)?$/, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(todos),
      });
      return;
    }
    if (method === "POST") {
      const body = route.request().postDataJSON() as { text: string };
      const created = {
        id: "00000000-0000-4000-8000-0000000000aa",
        text: body.text,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      todos = [created];
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created),
      });
      return;
    }
    await route.continue();
  });
}

async function routeTodosEmpty(page: Page) {
  await routeTodosMutable(page);
}

async function routeTodosWithSample(page: Page) {
  let todo = { ...SAMPLE_TODO };
  await page.route(/\/todos(\/.*)?$/, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([todo]),
      });
      return;
    }
    if (method === "PATCH") {
      const patch = route.request().postDataJSON() as { completed?: boolean };
      todo = {
        ...todo,
        completed: patch.completed ?? todo.completed,
        updatedAt: new Date().toISOString(),
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(todo),
      });
      return;
    }
    if (method === "POST") {
      const body = route.request().postDataJSON() as { text: string };
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "00000000-0000-4000-8000-0000000000aa",
          text: body.text,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      return;
    }
    await route.continue();
  });
}

test.describe("Performance — spec success criteria (mocked API)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("SC-004: primary screen interactive within budget", async ({ page }) => {
    await routeTodosEmpty(page);
    const start = Date.now();
    await page.goto("/");
    await expect(page.getByRole("textbox", { name: /^new task$/i })).toBeVisible({
      timeout: perfBudgetMs.primaryInteractive,
    });
    expect(elapsedMs(start)).toBeLessThanOrEqual(perfBudgetMs.primaryInteractive);
  });

  test("SC-001: capture new task within budget", async ({ page }) => {
    await routeTodosMutable(page);
    await page.goto("/");
    await expect(page.getByRole("textbox", { name: /^new task$/i })).toBeVisible({
      timeout: 15_000,
    });

    const label = "SC-001 perf task";
    const start = Date.now();
    await page.getByRole("textbox", { name: /^new task$/i }).fill(label);
    await page.getByRole("button", { name: /add task/i }).click();
    await expect(page.getByRole("list", { name: /tasks/i }).getByText(label)).toBeVisible(
      {
        timeout: perfBudgetMs.captureTask,
      },
    );
    expect(elapsedMs(start)).toBeLessThanOrEqual(perfBudgetMs.captureTask);
  });

  test("SC-003: toggle complete reflects within budget", async ({ page }) => {
    await routeTodosWithSample(page);
    await page.goto("/");
    const checkbox = page.getByRole("checkbox", {
      name: new RegExp(SAMPLE_TODO.text, "i"),
    });
    await expect(checkbox).toBeVisible({ timeout: 15_000 });

    const start = Date.now();
    await checkbox.click();
    await expect(checkbox).toBeChecked({ timeout: perfBudgetMs.stateChange + 500 });
    expect(elapsedMs(start)).toBeLessThanOrEqual(perfBudgetMs.stateChange);
  });
});
