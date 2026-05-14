import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/App";

function renderWithQuery(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("App", () => {
  it("renders shell and loads task list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof Request
              ? input.url
              : input.href;
        if (url.includes("/todos")) {
          return Response.json([]);
        }
        return new Response(null, { status: 404 });
      }),
    );

    try {
      renderWithQuery(<App />);
      expect(screen.getByRole("heading", { name: /^your tasks$/i })).toBeVisible();
      await waitFor(() => {
        expect(screen.getByRole("textbox", { name: /^New task$/i })).toBeVisible();
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
