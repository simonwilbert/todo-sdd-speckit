export type TodoEmptyStateProps = {
  onAddFirstTask: () => void;
};

export function TodoEmptyState({ onAddFirstTask }: TodoEmptyStateProps) {
  return (
    <section className="todo-empty-state" aria-labelledby="empty-heading">
      <h3 id="empty-heading">No tasks yet</h3>
      <p className="todo-empty-state__hint">
        Add anything you want to remember. You can mark items complete or delete them when
        you are done.
      </p>
      <button type="button" className="todo-empty-state__cta" onClick={onAddFirstTask}>
        Add your first task
      </button>
    </section>
  );
}
