import type { Todo } from "@todo/shared";

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
  return (
    <li className="todo-item">
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
