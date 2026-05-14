import { useEffect, useRef } from "react";

export type TodoDeleteUndoProps = {
  /** Time until the server delete is committed. */
  dismissMs: number;
  /** Included for assistive tech (task title). */
  taskPreview: string;
  onUndo: () => void;
  /** Called when the undo window ends without undo. */
  onExpire: () => void;
};

export function TodoDeleteUndo({
  dismissMs,
  taskPreview,
  onUndo,
  onExpire,
}: TodoDeleteUndoProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onExpire, dismissMs);
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dismissMs, onExpire]);

  const handleUndo = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onUndo();
  };

  return (
    <div role="status" aria-live="polite" className="todo-delete-undo">
      <span className="todo-delete-undo__message">
        Task removed.
        <span className="sr-only"> {taskPreview}</span>{" "}
        <button type="button" className="todo-delete-undo__undo" onClick={handleUndo}>
          Undo
        </button>
      </span>
    </div>
  );
}
