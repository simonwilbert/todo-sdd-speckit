import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TodoDeleteUndo } from "../../src/components/TodoDeleteUndo";

describe("TodoDeleteUndo (US3)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows undo and calls onUndo when Undo is activated", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    const onExpire = vi.fn();

    render(
      <TodoDeleteUndo
        dismissMs={60_000}
        taskPreview="My task"
        onUndo={onUndo}
        onExpire={onExpire}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/removed/i);
    await user.click(screen.getByRole("button", { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it("calls onExpire after dismissMs when Undo is not used", () => {
    vi.useFakeTimers();
    const onUndo = vi.fn();
    const onExpire = vi.fn();

    render(
      <TodoDeleteUndo
        dismissMs={4000}
        taskPreview="Other"
        onUndo={onUndo}
        onExpire={onExpire}
      />,
    );

    vi.advanceTimersByTime(3999);
    expect(onExpire).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(onUndo).not.toHaveBeenCalled();
  });
});
