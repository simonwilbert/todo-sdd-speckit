import type { Todo } from "@todo/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { deleteTodoRequest } from "../services/apiClient.js";
import { todosQueryKey, usePatchTodoMutation } from "../services/todoQueries.js";
import { TodoDeleteUndo } from "./TodoDeleteUndo.js";
import { TodoItem } from "./TodoItem.js";

const UNDO_MS = 5000;

function sortTodosDesc(a: Todo, b: Todo): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export type TodoListProps = {
  todos: Todo[];
  /** Called when a task is removed from the list (optimistic delete) and after server delete completes. */
  onFocusNewTaskInput?: () => void;
};

export function TodoList({ todos, onFocusNewTaskInput }: TodoListProps) {
  const queryClient = useQueryClient();
  const patchTodo = usePatchTodoMutation();
  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null);
  const pendingRef = useRef<Todo | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const flushPendingServerDelete = useCallback(
    async (todo: Todo) => {
      try {
        await deleteTodoRequest(todo.id);
        await queryClient.invalidateQueries({ queryKey: todosQueryKey });
        setDeleteError(null);
        onFocusNewTaskInput?.();
      } catch (e) {
        await queryClient.invalidateQueries({ queryKey: todosQueryKey });
        setDeleteError(e instanceof Error ? e.message : "Could not delete task");
      }
    },
    [queryClient, onFocusNewTaskInput],
  );

  const handleRequestDelete = useCallback(
    (todo: Todo) => {
      setDeleteError(null);
      onFocusNewTaskInput?.();
      if (pendingRef.current) {
        const prev = pendingRef.current;
        pendingRef.current = null;
        setPendingDelete(null);
        void flushPendingServerDelete(prev);
      }

      pendingRef.current = todo;
      queryClient.setQueryData<Todo[]>(todosQueryKey, (old) => {
        const list = old ?? [];
        return list.filter((t) => t.id !== todo.id);
      });
      setPendingDelete(todo);
    },
    [flushPendingServerDelete, onFocusNewTaskInput, queryClient],
  );

  const handleUndo = useCallback(() => {
    const todo = pendingRef.current;
    pendingRef.current = null;
    setPendingDelete(null);
    if (!todo) return;
    queryClient.setQueryData<Todo[]>(todosQueryKey, (old) => {
      const list = old ?? [];
      if (list.some((t) => t.id === todo.id)) return list;
      return [...list, todo].sort(sortTodosDesc);
    });
  }, [queryClient]);

  const handleExpire = useCallback(() => {
    const todo = pendingRef.current;
    pendingRef.current = null;
    setPendingDelete(null);
    if (!todo) return;
    void flushPendingServerDelete(todo);
  }, [flushPendingServerDelete]);

  return (
    <>
      {deleteError ? (
        <p role="alert" className="field-error">
          {deleteError}
        </p>
      ) : null}
      <ul className="todo-list" aria-label="Tasks">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isToggling={
              patchTodo.isPending &&
              patchTodo.variables?.id === todo.id &&
              patchTodo.variables.patch.completed !== undefined
            }
            isUpdatingText={
              patchTodo.isPending &&
              patchTodo.variables?.id === todo.id &&
              patchTodo.variables.patch.text !== undefined
            }
            onToggleCompleted={(completed) =>
              patchTodo.mutate({ id: todo.id, patch: { completed } })
            }
            onUpdateText={async (text) => {
              await patchTodo.mutateAsync({ id: todo.id, patch: { text } });
            }}
            onRequestDelete={() => handleRequestDelete(todo)}
          />
        ))}
      </ul>
      {pendingDelete ? (
        <TodoDeleteUndo
          key={pendingDelete.id}
          dismissMs={UNDO_MS}
          taskPreview={pendingDelete.text}
          onUndo={handleUndo}
          onExpire={handleExpire}
        />
      ) : null}
    </>
  );
}
