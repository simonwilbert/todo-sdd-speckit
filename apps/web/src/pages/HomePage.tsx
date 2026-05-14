import { TodoCreateForm } from "../components/TodoCreateForm.js";
import { TodoList } from "../components/TodoList.js";
import { useCreateTodoMutation, useTodosQuery } from "../services/todoQueries.js";

export function HomePage() {
  const todosQuery = useTodosQuery();
  const createMutation = useCreateTodoMutation();

  if (todosQuery.isPending) {
    return <p>Loading tasks…</p>;
  }

  if (todosQuery.isError) {
    return (
      <section aria-live="polite">
        <p>Could not load tasks. Check that the API is running and try again.</p>
      </section>
    );
  }

  const serverError =
    createMutation.isError && createMutation.error instanceof Error
      ? createMutation.error.message
      : null;

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Your tasks</h2>
      <TodoCreateForm
        onCreate={async (t) => {
          await createMutation.mutateAsync(t);
        }}
        isSubmitting={createMutation.isPending}
        serverError={serverError}
      />
      <TodoList todos={todosQuery.data ?? []} />
    </section>
  );
}
