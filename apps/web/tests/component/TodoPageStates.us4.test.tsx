import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "../../src/pages/HomePage";

function urlString(input: RequestInfo | URL): string {
  return typeof input === "string"
    ? input
    : input instanceof Request
      ? input.url
      : input.href;
}

function renderHome() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <HomePage />
    </QueryClientProvider>,
  );
}

describe("TodoPageStates (US4)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("shows empty state when the list is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (urlString(input).includes("/todos")) {
          return Response.json([]);
        }
        return new Response(null, { status: 404 });
      }),
    );
    renderHome();
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /no tasks yet/i })).toBeVisible();
    });
    expect(screen.getByRole("button", { name: /add first task/i })).toBeInTheDocument();
  });

  it("shows list loading only after 200 ms when fetch stays slow", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            setTimeout(() => resolve(Response.json([])), 450);
          }),
      ),
    );
    renderHome();
    expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    await waitFor(
      () => {
        expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /no tasks yet/i })).toBeVisible();
    });
  });

  it("shows error banner and Retry refetches successfully", async () => {
    const user = userEvent.setup();
    let n = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (!urlString(input).includes("/todos")) {
          return new Response(null, { status: 404 });
        }
        n += 1;
        if (n === 1) {
          return new Response(JSON.stringify({ error: { message: "Unavailable" } }), {
            status: 503,
          });
        }
        return Response.json([]);
      }),
    );
    renderHome();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeVisible();
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/could not load tasks \(503\)/i);

    await user.click(screen.getByRole("button", { name: /^retry$/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /no tasks yet/i })).toBeVisible();
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("empty-state CTA focuses the new-task field", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (urlString(input).includes("/todos")) {
          return Response.json([]);
        }
        return new Response(null, { status: 404 });
      }),
    );
    renderHome();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add first task/i })).toBeVisible();
    });
    await user.click(screen.getByRole("button", { name: /add first task/i }));
    expect(screen.getByRole("textbox", { name: /^New task$/i })).toHaveFocus();
  });
});
