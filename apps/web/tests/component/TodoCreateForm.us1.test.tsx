import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TODO_TEXT_MAX_LENGTH } from "@todo/shared";
import { TodoCreateForm } from "../../src/components/TodoCreateForm";

describe("TodoCreateForm (US1)", () => {
  it("does not call onCreate for empty submission and shows a message", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<TodoCreateForm onCreate={onCreate} isSubmitting={false} />);
    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(/short description/i);
  });

  it("does not call onCreate for whitespace-only text", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<TodoCreateForm onCreate={onCreate} isSubmitting={false} />);
    await user.type(screen.getByRole("textbox", { name: /^New task$/i }), "   ");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(/short description/i);
  });

  it("shows validation when text exceeds max length", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<TodoCreateForm onCreate={onCreate} isSubmitting={false} />);
    const input = screen.getByRole("textbox", { name: /^New task$/i });
    fireEvent.change(input, { target: { value: "a".repeat(TODO_TEXT_MAX_LENGTH + 1) } });
    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(/500 characters/i);
  });
});
