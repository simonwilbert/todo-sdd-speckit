import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "@todo/shared";
import { TodoCreateForm } from "../../src/components/TodoCreateForm";
import { TodoItem } from "../../src/components/TodoItem";

describe("Professional UI (002 US1)", () => {
  it("TodoCreateForm keeps accessible names and primary actions", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <TodoCreateForm onCreate={onCreate} isSubmitting={false} />,
    );

    expect(container.querySelector(".todo-create-form")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /^New task$/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /^Add task$/i })).toBeVisible();

    await user.click(screen.getByRole("button", { name: /^Add task$/i }));
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(/short description/i);
  });

  it("TodoItem exposes checkbox and delete with stable labels", () => {
    const todo: Todo = {
      id: "00000000-0000-4000-8000-000000000001",
      text: "Review design tokens",
      completed: false,
      createdAt: "2026-05-14T12:00:00.000Z",
      updatedAt: "2026-05-14T12:00:00.000Z",
    };
    render(
      <ul>
        <TodoItem
          todo={todo}
          isToggling={false}
          onToggleCompleted={vi.fn()}
          onRequestDelete={vi.fn()}
        />
      </ul>,
    );

    expect(screen.getByRole("checkbox", { name: /review design tokens/i })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /delete task: review design tokens/i }),
    ).toBeVisible();
  });
});
