import type { Todo } from "@todo/shared";
import { useEffect, useRef, useState } from "react";

export type TodoItemProps = {
  todo: Todo;
  onToggleCompleted: (completed: boolean) => void;
  isToggling: boolean;
  onRequestDelete: () => void;
};

export function TodoItem({
  todo,
  onToggleCompleted,
  isToggling,
  onRequestDelete,
}: TodoItemProps) {
  const prevId = useRef(todo.id);
  const prevCompleted = useRef(todo.completed);
  const [toggleAnnouncement, setToggleAnnouncement] = useState("");

  useEffect(() => {
    if (prevId.current !== todo.id) {
      prevId.current = todo.id;
      prevCompleted.current = todo.completed;
      setToggleAnnouncement("");
      return undefined;
    }
    if (prevCompleted.current !== todo.completed) {
      setToggleAnnouncement(
        todo.completed ? "Task marked complete." : "Task marked not done.",
      );
      const t = window.setTimeout(() => setToggleAnnouncement(""), 1500);
      prevCompleted.current = todo.completed;
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [todo.id, todo.completed]);

  return (
    <li className="todo-item">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {toggleAnnouncement}
      </p>
      <div className="todo-item__row">
        <label className="todo-item__label">
          <input
            type="checkbox"
            checked={todo.completed}
            disabled={isToggling}
            onChange={(e) => onToggleCompleted(e.target.checked)}
          />
          <span
            className={
              todo.completed
                ? "todo-item__text todo-item__text--completed"
                : "todo-item__text"
            }
          >
            {todo.text}
          </span>
        </label>
        <button
          type="button"
          className="todo-item__delete"
          aria-label={`Delete task: ${todo.text}`}
          onClick={(e) => {
            e.preventDefault();
            onRequestDelete();
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
