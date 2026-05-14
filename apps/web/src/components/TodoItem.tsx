import type { Todo } from "@todo/shared";

export type TodoItemProps = {
  todo: Todo;
  onToggleCompleted: (completed: boolean) => void;
  isToggling: boolean;
};

export function TodoItem({ todo, onToggleCompleted, isToggling }: TodoItemProps) {
  return (
    <li className="todo-item">
      <label className="todo-item__row">
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
    </li>
  );
}
