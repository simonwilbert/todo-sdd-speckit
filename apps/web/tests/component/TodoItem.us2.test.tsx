import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "@todo/shared";
import { TodoItem } from "../../src/components/TodoItem";

const baseTodo: Todo = {
  id: "00000000-0000-4000-8000-000000000001",
  text: "Buy oat milk",
  completed: false,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

describe("TodoItem (US2)", () => {
  it("associates checkbox with task text for screen readers", () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={baseTodo} onToggleCompleted={onToggle} isToggling={false} />);
    expect(screen.getByRole("checkbox", { name: /buy oat milk/i })).toBeInTheDocument();
  });

  it("calls onToggleCompleted when checkbox is toggled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<TodoItem todo={baseTodo} onToggleCompleted={onToggle} isToggling={false} />);
    await user.click(screen.getByRole("checkbox", { name: /buy oat milk/i }));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("applies completed styling when todo.completed is true", () => {
    const onToggle = vi.fn();
    const todo = { ...baseTodo, completed: true };
    render(<TodoItem todo={todo} onToggleCompleted={onToggle} isToggling={false} />);
    const text = screen.getByText("Buy oat milk");
    expect(text).toHaveClass("todo-item__text--completed");
  });

  it("disables checkbox while toggling", () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={baseTodo} onToggleCompleted={onToggle} isToggling />);
    expect(screen.getByRole("checkbox", { name: /buy oat milk/i })).toBeDisabled();
  });
});
