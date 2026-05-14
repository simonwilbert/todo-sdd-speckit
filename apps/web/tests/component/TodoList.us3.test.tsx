import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Todo } from "@todo/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TodoList } from "../../src/components/TodoList";
import { todosQueryKey } from "../../src/services/todoQueries";

const todo: Todo = {
  id: "00000000-0000-4000-8000-0000000000aa",
  text: "To remove",
  completed: true,
  createdAt: "2025-01-02T00:00:00.000Z",
  updatedAt: "2025-01-02T00:00:00.000Z",
};

function TodoListWithQueryCache() {
  const { data } = useQuery({
    queryKey: todosQueryKey,
    queryFn: async () => [],
    enabled: false,
  });
  return <TodoList todos={data ?? []} />;
}

function renderTodoList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  client.setQueryData(todosQueryKey, [todo]);
  return render(
    <QueryClientProvider client={client}>
      <TodoListWithQueryCache />
    </QueryClientProvider>,
  );
}

describe("TodoList (US3)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof Request
              ? input.url
              : input.href;
        const method = init?.method ?? "GET";
        if (method === "GET" && /\/todos$/i.test(url.split("?")[0].replace(/\/$/, ""))) {
          return Response.json([]);
        }
        if (method === "DELETE" && url.includes(todo.id)) {
          return new Response(null, { status: 204 });
        }
        return new Response(
          JSON.stringify({ error: { message: "unexpected", code: "x" } }),
          {
            status: 400,
          },
        );
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("removes row optimistically and restores on undo without DELETE", async () => {
    const user = userEvent.setup();
    renderTodoList();

    await user.click(screen.getByRole("button", { name: /delete task: to remove/i }));
    const list = screen.getByRole("list", { name: /tasks/i });
    expect(
      within(list).queryByRole("checkbox", { name: /to remove/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo/i })).toBeVisible();
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /undo/i }));
    expect(screen.getByText("To remove")).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("calls DELETE after undo window expires", async () => {
    vi.useFakeTimers();
    renderTodoList();

    fireEvent.click(screen.getByRole("button", { name: /delete task: to remove/i }));
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(vi.mocked(fetch)).toHaveBeenCalled();
    const [firstUrl, firstInit] = vi.mocked(fetch).mock.calls[0]!;
    expect(firstUrl).toEqual(expect.stringContaining(todo.id));
    expect(firstInit).toMatchObject({ method: "DELETE" });
  });
});
