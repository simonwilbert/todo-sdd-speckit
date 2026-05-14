import type { Todo } from "@todo/shared";
import { TodoItem } from "./TodoItem.js";
import { useToggleTodoMutation } from "../services/todoQueries.js";

export type TodoListProps = {
  todos: Todo[];
};

export function TodoList({ todos }: TodoListProps) {
  const toggle = useToggleTodoMutation();

  return (
    <ul aria-label="Tasks">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isToggling={toggle.isPending && toggle.variables?.id === todo.id}
          onToggleCompleted={(completed) => toggle.mutate({ id: todo.id, completed })}
        />
      ))}
    </ul>
  );
}
