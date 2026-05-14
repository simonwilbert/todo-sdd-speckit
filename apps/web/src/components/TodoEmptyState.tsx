export type TodoEmptyStateProps = {
  onAddFirstTask: () => void;
};

export function TodoEmptyState({ onAddFirstTask }: TodoEmptyStateProps) {
  return (
    <section className="todo-empty-state" aria-labelledby="empty-heading">
      <h3 id="empty-heading">No tasks yet</h3>
      <p className="todo-empty-state__hint">
        Capture what you need to do here. Mark items complete or remove them when you are
        finished.
      </p>
      <button type="button" className="todo-empty-state__cta" onClick={onAddFirstTask}>
        Add first task
      </button>
    </section>
  );
}
