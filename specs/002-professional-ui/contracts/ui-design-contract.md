# UI design contract: Professional UI refresh (002)

Human- and agent-readable contract for **which CSS variables exist** and **which surfaces use them**. Implementation MUST keep names stable or version this document when renaming.

## 1. Required CSS variables (`:root`)

All variables below MUST be defined in `apps/web/src/styles/tokens.css` (or successor path named in `plan.md`).

### Colour (example set — implement with WCAG-AA-validated values)

| Variable                 | Role                            |
| ------------------------ | ------------------------------- |
| `--color-canvas`         | Page background                 |
| `--color-surface`        | Cards / elevated panels         |
| `--color-surface-subtle` | Muted panels / list background  |
| `--color-border`         | Default borders                 |
| `--color-text-primary`   | Primary reading text            |
| `--color-text-secondary` | Supporting text                 |
| `--color-text-muted`     | Placeholders / hints            |
| `--color-accent`         | Primary actions                 |
| `--color-accent-hover`   | Primary action hover            |
| `--color-danger`         | Destructive emphasis (if used)  |
| `--color-focus-ring`     | `:focus-visible` outline / ring |

### Typography

| Variable                | Role             |
| ----------------------- | ---------------- |
| `--font-sans`           | UI font stack    |
| `--font-size-title`     | Page title       |
| `--font-size-body`      | Task text / body |
| `--font-size-small`     | Meta / hints     |
| `--font-weight-medium`  | Labels / buttons |
| `--line-height-tight`   | Headings         |
| `--line-height-relaxed` | Long task text   |

### Space & shape

| Variable      | Role                      |
| ------------- | ------------------------- |
| `--space-*`   | Monotonic spacing scale   |
| `--radius-sm` | Inputs                    |
| `--radius-md` | Cards / list rows         |
| `--shadow-sm` | Optional subtle elevation |

## 2. Surface → variable binding (MUST)

| Surface (from data-model) | Background                              | Text                     | Border / notes               |
| ------------------------- | --------------------------------------- | ------------------------ | ---------------------------- |
| `app-shell`               | `--color-canvas`                        | `--color-text-primary`   | —                            |
| `main-content`            | transparent or `--color-surface-subtle` | `--color-text-primary`   | —                            |
| `list`                    | `--color-surface-subtle`                | `--color-text-primary`   | optional `--color-border`    |
| `list-row` (default)      | `--color-surface`                       | `--color-text-primary`   | `--color-border`             |
| `list-row` (completed)    | same or subtler                         | `--color-text-secondary` | strikethrough via CSS        |
| `primary-action`          | `--color-accent`                        | on-accent (white/near)   | hover `--color-accent-hover` |
| `input-field`             | `--color-surface`                       | `--color-text-primary`   | `--color-border`             |
| `empty-state`             | inherits                                | `--color-text-secondary` | CTA uses `primary-action`    |
| `banner-error`            | tokenized danger/muted surface          | `--color-text-primary`   | clear border                 |
| `toast-undo`              | `--color-surface` or inverted           | `--color-text-primary`   | elevated `--shadow-sm`       |

**Contrast**: Every text/background pair in the default theme MUST meet **WCAG 2.1 AA** (4.5:1 body, 3:1 large/UI where applicable).

## 3. Copy tone (FR-104)

- Imperative, short buttons: e.g. “Add task”, “Retry”, “Undo”.
- Empty state: one clear sentence + single CTA; avoid filler or jokes unless product later requests a voice.
- Errors: explain what failed + what to do next; no blameful tone.

## 4. Contract tests

- **Automated**: axe critical/serious = 0 on primary screens (Playwright).
- **Manual**: design QA checklist in `plan.md` success criteria SC-103 (also recorded under `docs/qa/` when implemented).
