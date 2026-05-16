import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../../src/App";
import { TodoCreateForm } from "../../src/components/TodoCreateForm";
import { TodoItem } from "../../src/components/TodoItem";
import type { Todo } from "@todo/shared";

function renderWithQuery(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const sampleTodo: Todo = {
  id: "00000000-0000-4000-8000-000000000001",
  text: "Review accessibility",
  completed: false,
  createdAt: "2026-05-16T12:00:00.000Z",
  updatedAt: "2026-05-16T12:00:00.000Z",
};

describe("Accessibility (jest-axe / Vitest)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("App shell has no axe violations when list is empty", async () => {
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

    const { container } = renderWithQuery(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("TodoCreateForm has no axe violations", async () => {
    const { container } = render(
      <TodoCreateForm
        onCreate={vi.fn().mockResolvedValue(undefined)}
        isSubmitting={false}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("TodoItem has no axe violations", async () => {
    const { container } = render(
      <ul>
        <TodoItem
          todo={sampleTodo}
          isToggling={false}
          isUpdatingText={false}
          onToggleCompleted={vi.fn()}
          onRequestDelete={vi.fn()}
          onUpdateText={vi.fn().mockResolvedValue(undefined)}
        />
      </ul>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
