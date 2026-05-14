import { useEffect, useId, useState } from "react";
import { QueryErrorBanner } from "../components/QueryErrorBanner.js";
import { TodoCreateForm } from "../components/TodoCreateForm.js";
import { TodoEmptyState } from "../components/TodoEmptyState.js";
import { TodoList } from "../components/TodoList.js";
import { useCreateTodoMutation, useTodosQuery } from "../services/todoQueries.js";

export function HomePage() {
  const taskInputId = useId();
  const todosQuery = useTodosQuery();
  const createMutation = useCreateTodoMutation();
  const [showDelayedListLoading, setShowDelayedListLoading] = useState(false);

  useEffect(() => {
    if (!todosQuery.isPending) {
      setShowDelayedListLoading(false);
      return;
    }
    const t = window.setTimeout(() => setShowDelayedListLoading(true), 200);
    return () => window.clearTimeout(t);
  }, [todosQuery.isPending]);

  const loadErrorMessage =
    todosQuery.error instanceof Error
      ? todosQuery.error.message
      : "Tasks could not be loaded. Start the API and try again.";

  const serverError =
    createMutation.isError && createMutation.error instanceof Error
      ? createMutation.error.message
      : null;

  const todos = todosQuery.data ?? [];
  const listReady = todosQuery.status === "success";
  const showEmpty = listReady && todos.length === 0;
  const showTodoList = listReady && todos.length > 0;

  return (
    <section className="home-page" aria-label="Task list and entry">
      {todosQuery.isError ? (
        <QueryErrorBanner
          message={loadErrorMessage}
          onRetry={() => void todosQuery.refetch()}
        />
      ) : null}

      <TodoCreateForm
        textInputId={taskInputId}
        onCreate={async (t) => {
          await createMutation.mutateAsync(t);
        }}
        isSubmitting={createMutation.isPending}
        serverError={serverError}
      />

      {todosQuery.isPending && showDelayedListLoading ? (
        <p role="status" className="todo-list-loading" aria-live="polite">
          Loading tasks…
        </p>
      ) : null}

      {showEmpty ? (
        <TodoEmptyState
          onAddFirstTask={() => {
            document.getElementById(taskInputId)?.focus();
          }}
        />
      ) : null}

      {showTodoList ? <TodoList todos={todos} /> : null}
    </section>
  );
}
