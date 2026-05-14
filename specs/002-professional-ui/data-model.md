# Data model: Presentation layer (002)

This feature does **not** change the `Todo` persistence model from [001](../001-personal-todo-app/data-model.md). Below are **conceptual presentation entities** for design consistency.

## Design token

A named **role** resolved to a concrete CSS value at runtime (via custom property). Tokens are grouped:

| Group      | Examples (conceptual)                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Colour     | background canvas, surface card, border subtle, text primary / secondary / muted, accent primary, accent hover, danger, focus ring |
| Typography | font family stack, sizes for title / body / small / label, weights, line heights                                                   |
| Space      | scale steps (e.g. 4 / 8 / 12 / 16 / 24 / 32 px or rem)                                                                             |
| Radius     | sm / md / lg for inputs, cards, chips                                                                                              |
| Elevation  | none / sm / md (shadow or border-only per design direction)                                                                        |

**Validation**: Contrast pairs for text-on-background MUST meet WCAG AA for default theme. Document pairs in the UI contract.

## Surface

A **screen region** that MUST map to token roles (not raw hex in component files):

| Surface ID         | Description                                   |
| ------------------ | --------------------------------------------- |
| `app-shell`        | Outer page background and max-width container |
| `main-content`     | Primary column for list + form                |
| `list`             | Task list container                           |
| `list-row`         | Single todo row (default / completed states)  |
| `primary-action`   | Primary button (e.g. Add task)                |
| `secondary-action` | Text button / icon button (delete, etc.)      |
| `input-field`      | Text input for new task                       |
| `empty-state`      | Zero-data illustration / copy block           |
| `banner-error`     | Query / persistence error callout             |
| `toast-undo`       | Snackbar / undo affordance                    |

## State (presentation only)

- **Row**: `default` | `completed` (distinct typography/colour, still readable).
- **Focus**: visible focus ring using `focus-visible` and token `--color-focus-ring`.

## Relationships

- Many **components** → map to one **surface** each for background and border.
- **Tokens** → many **surfaces** (shared roles reduce drift).
