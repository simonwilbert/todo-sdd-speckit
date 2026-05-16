import type { Todo } from "@todo/shared";
import { TODO_TEXT_MAX_LENGTH } from "@todo/shared";
import { useEffect, useRef, useState } from "react";

export type TodoItemProps = {
  todo: Todo;
  onToggleCompleted: (completed: boolean) => void;
  isToggling: boolean;
  onRequestDelete: () => void;
  onUpdateText: (text: string) => Promise<void>;
  isUpdatingText: boolean;
};

function PencilIcon() {
  return (
    <svg
      className="todo-item__icon-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="todo-item__icon-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
    </svg>
  );
}

export function TodoItem({
  todo,
  onToggleCompleted,
  isToggling,
  onRequestDelete,
  onUpdateText,
  isUpdatingText,
}: TodoItemProps) {
  const prevId = useRef(todo.id);
  const prevCompleted = useRef(todo.completed);
  const [toggleAnnouncement, setToggleAnnouncement] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prevId.current !== todo.id) {
      prevId.current = todo.id;
      prevCompleted.current = todo.completed;
      setToggleAnnouncement("");
      setIsEditing(false);
      setDraft(todo.text);
      return undefined;
    }
    if (!isEditing) {
      setDraft(todo.text);
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
  }, [todo.id, todo.text, todo.completed, isEditing]);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  async function commitEdit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed.length > TODO_TEXT_MAX_LENGTH) {
      setDraft(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed === todo.text) {
      setIsEditing(false);
      return;
    }
    try {
      await onUpdateText(trimmed);
      setIsEditing(false);
    } catch {
      setDraft(todo.text);
      setIsEditing(false);
    }
  }

  function cancelEdit() {
    setDraft(todo.text);
    setIsEditing(false);
  }

  const checkboxDisabled = isEditing || isToggling;
  const checkboxLabel = `Complete task: ${todo.text}`;

  return (
    <li className="todo-item">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {toggleAnnouncement}
      </p>
      <div className="todo-item__row">
        <div className="todo-item__check-wrap">
          <input
            type="checkbox"
            className="todo-item__checkbox"
            checked={todo.completed}
            disabled={checkboxDisabled}
            onChange={(e) => onToggleCompleted(e.target.checked)}
            aria-label={checkboxLabel}
          />
        </div>
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            className="todo-item__edit-input"
            maxLength={TODO_TEXT_MAX_LENGTH}
            value={draft}
            disabled={isUpdatingText}
            aria-label={`Edit text: ${todo.text}`}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => void commitEdit()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void commitEdit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                cancelEdit();
              }
            }}
          />
        ) : (
          <span
            className={
              todo.completed
                ? "todo-item__text todo-item__text--completed"
                : "todo-item__text"
            }
          >
            {todo.text}
          </span>
        )}
        <div className="todo-item__actions">
          {!isEditing ? (
            <button
              type="button"
              className="todo-item__icon-btn todo-item__icon-btn--edit"
              aria-label={`Edit task: ${todo.text}`}
              disabled={isToggling}
              title="Edit task"
              onClick={() => {
                setDraft(todo.text);
                setIsEditing(true);
              }}
            >
              <PencilIcon />
            </button>
          ) : null}
          <button
            type="button"
            className="todo-item__icon-btn todo-item__icon-btn--delete"
            aria-label={`Delete task: ${todo.text}`}
            title="Delete task"
            onMouseDown={(e) => {
              if (isEditing) {
                e.preventDefault();
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              if (isEditing) {
                cancelEdit();
              }
              onRequestDelete();
            }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
}
