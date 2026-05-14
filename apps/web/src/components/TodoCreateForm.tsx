import { TODO_TEXT_MAX_LENGTH } from "@todo/shared";
import { type FormEvent, useId, useState } from "react";

export type TodoCreateFormProps = {
  onCreate: (text: string) => Promise<void>;
  isSubmitting: boolean;
  serverError?: string | null;
};

export function TodoCreateForm({
  onCreate,
  isSubmitting,
  serverError,
}: TodoCreateFormProps) {
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const fieldId = useId();
  const errorId = useId();

  const validationMessage = localError ?? serverError ?? null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const trimmed = text.trim();
    if (!trimmed) {
      setLocalError("Enter a task before adding.");
      return;
    }
    if (trimmed.length > TODO_TEXT_MAX_LENGTH) {
      setLocalError(`Tasks cannot be longer than ${TODO_TEXT_MAX_LENGTH} characters.`);
      return;
    }
    try {
      await onCreate(trimmed);
      setText("");
    } catch {
      /* mutation / request errors surface via serverError */
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} aria-labelledby={`${fieldId}-legend`}>
      <fieldset>
        <legend id={`${fieldId}-legend`} className="sr-only">
          Task entry form
        </legend>
        <label htmlFor={fieldId}>New task</label>
        <input
          id={fieldId}
          name="text"
          type="text"
          maxLength={TODO_TEXT_MAX_LENGTH}
          value={text}
          disabled={isSubmitting}
          onChange={(ev) => {
            setText(ev.target.value);
            setLocalError(null);
          }}
          aria-invalid={validationMessage ? true : undefined}
          aria-describedby={validationMessage ? errorId : undefined}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add task"}
        </button>
      </fieldset>
      {validationMessage ? (
        <p id={errorId} role="status" className="field-error">
          {validationMessage}
        </p>
      ) : null}
    </form>
  );
}
