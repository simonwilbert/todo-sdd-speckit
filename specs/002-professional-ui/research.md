# Research: Professional UI refresh (002)

## R1 — Styling approach (tokens vs utility framework)

**Decision**: Use **CSS custom properties** on `:root` (and optionally a small set of component-scoped variables) in a dedicated `tokens.css`, consumed by existing plain CSS and component class names.

**Rationale**: The repo already ships **plain CSS** (`layout.css`) without Tailwind or CSS-in-JS. Tokens give a single source of truth for colour and spacing, support future dark mode without a framework migration, and keep bundle size predictable.

**Alternatives considered**:

- **Tailwind CSS** — Strong utility workflow; rejected for this epic because it introduces build/tooling churn and a large new convention surface for a visual-only increment.
- **CSS-in-JS (e.g. styled-components)** — Rejected; unnecessary for static theme values and adds runtime cost.
- **Sass variables** — Rejected; project does not use Sass today; native CSS variables avoid another preprocessor.

## R2 — Typography

**Decision**: Prefer **system UI stack** (`system-ui`, `Segoe UI`, `Roboto`, …) with a clear modular scale (e.g. `--font-size-step-*` or named steps for title, body, small).

**Rationale**: Spec assumes no licensed font package; system fonts load instantly and read as modern when paired with spacing and weight discipline.

**Alternatives considered**: Self-hosted **Inter** or **Source Sans** — acceptable follow-up; out of scope unless added explicitly (adds font files and preload policy).

## R3 — Motion

**Decision**: Use only **subtle transitions** (e.g. focus ring, opacity on non-critical elements) and gate any motion longer than ~150 ms behind **`prefers-reduced-motion: reduce`** (disable or replace with instant state).

**Rationale**: Matches spec edge cases and WCAG 2.2 guidance spirit without banning useful focus feedback.

## R4 — Light vs dark

**Decision**: **Light mode only** for this epic’s deliverable; document tokens so a later epic can add `.theme-dark` or `prefers-color-scheme` without renaming variables.

**Rationale**: Spec assumptions default to light-only unless extended; shipping both modes doubles contrast QA work.

## R5 — Verification strategy

**Decision**: Lean on **existing Playwright + axe** journeys from 001 plus **targeted component tests** that assert critical labels and roles survive the redesign (no brittle pixel snapshots in MVP).

**Rationale**: Constitution requires E2E and a11y automation; pixel-diff services are not yet in repo and are optional follow-up.
