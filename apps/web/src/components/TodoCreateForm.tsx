import { TODO_TEXT_MAX_LENGTH } from "@todo/shared";
import { type FormEvent, useId, useState } from "react";

export type TodoCreateFormProps = {
  onCreate: (text: string) => Promise<void>;
  isSubmitting: boolean;
  serverError?: string | null;
  /** When set, used for the text field id (e.g. focus from empty-state CTA). */
  textInputId?: string;
};

export function TodoCreateForm({
  onCreate,
  isSubmitting,
  serverError,
  textInputId: textInputIdProp,
}: TodoCreateFormProps) {
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const generatedFieldId = useId();
  const fieldId = textInputIdProp ?? generatedFieldId;
  const errorId = useId();
  const addedLiveId = useId();
  const [addedAnnouncement, setAddedAnnouncement] = useState("");

  const validationMessage = localError ?? serverError ?? null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const trimmed = text.trim();
    if (!trimmed) {
      setLocalError("Add a short description before continuing.");
      return;
    }
    if (trimmed.length > TODO_TEXT_MAX_LENGTH) {
      setLocalError(`Tasks cannot be longer than ${TODO_TEXT_MAX_LENGTH} characters.`);
      return;
    }
    try {
      await onCreate(trimmed);
      setText("");
      setAddedAnnouncement(`Task added: ${trimmed}`);
      window.setTimeout(() => setAddedAnnouncement(""), 4000);
    } catch {
      /* mutation / request errors surface via serverError */
    }
  }

  return (
    <form
      className="todo-create-form"
      onSubmit={(e) => void handleSubmit(e)}
      aria-labelledby={`${fieldId}-legend`}
    >
      <fieldset>
        <legend id={`${fieldId}-legend`} className="sr-only">
          New task form
        </legend>
        <label htmlFor={fieldId}>New task</label>
        <div className="todo-create-form__row">
          <input
            id={fieldId}
            className="todo-create-form__input"
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
          <button
            className="todo-create-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding…" : "Add task"}
          </button>
        </div>
      </fieldset>
      {validationMessage ? (
        <p id={errorId} role="status" className="field-error">
          {validationMessage}
        </p>
      ) : null}
      <p id={addedLiveId} className="sr-only" aria-live="polite" aria-atomic="true">
        {addedAnnouncement}
      </p>
    </form>
  );
}
