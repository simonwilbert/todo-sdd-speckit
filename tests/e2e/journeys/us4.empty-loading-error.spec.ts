import { expect, test, type Page } from "@playwright/test";

/** Patch list GET /todos before app loads (works with any host:port and Vite proxy). */
async function mockListTodosEmpty(page: Page) {
  await page.addInitScript(() => {
    const orig = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const u =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : input.href;
      const method =
        init?.method ??
        (typeof input !== "string" && input instanceof Request ? input.method : "GET");
      const url = new URL(u, window.location.origin);
      const path = url.pathname.replace(/\/+$/, "") || "/";
      if (method === "GET" && path === "/todos") {
        return new Response("[]", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return orig(input, init);
    };
  });
}

async function mockListTodosDelayedEmpty(page: Page, delayMs: number) {
  await page.addInitScript((ms) => {
    const orig = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const u =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : input.href;
      const method =
        init?.method ??
        (typeof input !== "string" && input instanceof Request ? input.method : "GET");
      const url = new URL(u, window.location.origin);
      const path = url.pathname.replace(/\/+$/, "") || "/";
      if (method === "GET" && path === "/todos") {
        await new Promise((r) => setTimeout(r, ms));
        return new Response("[]", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return orig(input, init);
    };
  }, delayMs);
}

async function mockListTodosFailThenEmpty(page: Page) {
  await page.addInitScript(() => {
    let n = 0;
    const orig = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const u =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : input.href;
      const method =
        init?.method ??
        (typeof input !== "string" && input instanceof Request ? input.method : "GET");
      const url = new URL(u, window.location.origin);
      const path = url.pathname.replace(/\/+$/, "") || "/";
      if (method === "GET" && path === "/todos") {
        n += 1;
        if (n <= 2) {
          return new Response(
            JSON.stringify({ error: { message: "Persistence unavailable" } }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        return new Response("[]", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return orig(input, init);
    };
  });
}

test.describe("US4 — empty, loading, and error states", () => {
  test("empty list shows empty state and CTA focuses new-task field", async ({
    page,
  }) => {
    await mockListTodosEmpty(page);

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 60_000,
    });
    await page.getByRole("button", { name: /add your first task/i }).click();
    await expect(page.getByRole("textbox", { name: /^new task$/i })).toBeFocused();
  });

  test("slow list load shows loading message after 200 ms", async ({ page }) => {
    await mockListTodosDelayedEmpty(page, 800);

    await page.goto("/");
    await expect(page.getByText(/loading your saved tasks/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("list error shows alert and Retry loads empty state", async ({ page }) => {
    await mockListTodosFailThenEmpty(page);

    await page.goto("/");
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^retry$/i }).click();
    await expect(page.getByRole("heading", { name: /no tasks yet/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("alert")).not.toBeVisible();
  });
});
