# Implementation Plan: Professional UI refresh

**Branch**: `002-professional-ui` (suggested) | **Date**: 2026-05-14 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-professional-ui/spec.md`  
**Depends on**: [001 Personal Todo App](../001-personal-todo-app/plan.md) — behaviour, API, and E2E journeys live there; this feature changes **presentation and copy** only unless a follow-up explicitly extends scope.

## Summary

Deliver a **unified, contemporary visual system** for the existing React + Vite todo app (`apps/web`): CSS custom properties (design tokens) for colour, typography, spacing, radii, and elevation; updated global layout and component-level styles; professional, concise copy; responsive behaviour at ≤390 px and ≥1280 px; and respect for `prefers-reduced-motion`. **No OpenAPI or Prisma changes** are in scope. Automated **axe** checks (critical/serious = 0) and existing Playwright journeys must remain green after styling changes.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18, Node 20/22 for tooling  
**Primary Dependencies**: Vite 6, plain CSS (extend existing `apps/web/src/styles/layout.css` pattern); optional small additions only if justified in `research.md`  
**Storage**: N/A (no persistence changes)  
**Testing**: Vitest + Testing Library (`apps/web/tests/`); Playwright `tests/e2e/journeys/*` (re-run for regressions); `@axe-core/playwright` thresholds unchanged  
**Target Platform**: Evergreen browsers; primary viewports ≤390 px and ≥1280 px per spec  
**Project Type**: Web application — frontend-only increment in monorepo `apps/web/`  
**Performance Goals**: No meaningful regression to SC-003/SC-004 spirit from 001 (UI stays interactive; avoid heavy paint or layout thrash)  
**Constraints**: WCAG 2.1 AA (zero critical/serious axe on primary screens); ≥70% coverage maintained; ≥5 Playwright journeys unchanged in count and passing  
**Scale/Scope**: Single epic, one P1 user story (US1); light + dark **out of scope** unless promoted in a later spec revision (default **light** polish only)

## Constitution Check

Evaluation against constitution v1.1.0:

| #   | Principle                      | Gate for this feature                                                                                            | Status |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------ |
| I   | Spec-First                     | `specs/002-professional-ui/spec.md` + this plan + UI contract artefacts version-controlled before implementation | PASS   |
| II  | Testable by Design             | Component tests for restyled surfaces; all existing Playwright journeys + axe thresholds pass after change       | PASS   |
| III | Small, Traceable Changes       | Tasks reference FR-101–FR-107 and US1; PRs link to this epic                                                     | PASS   |
| IV  | Reliable Automation            | `npm run ci` + `npm run e2e` (with `DATABASE_URL` when required) remain required gates                           | PASS   |
| V   | Clarity, Simplicity, Security… | A11y bar preserved; no new attack surface (still no `dangerouslySetInnerHTML`); copy stays user-respectful       | PASS   |
| VI  | Containerized by Default       | No change to Docker images required for MVP of this epic; compose paths unchanged                                | PASS   |

**Gate result**: PASS. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/002-professional-ui/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Presentation / token model
├── quickstart.md        # How to verify the redesign locally
├── contracts/           # UI design contract (tokens + surfaces)
└── tasks.md             # /speckit-tasks output
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/HomePage.tsx
│   ├── components/          # TodoCreateForm, TodoList, TodoItem, …
│   └── styles/
│       ├── layout.css       # Existing shell + a11y utilities
│       └── tokens.css       # NEW: design tokens (:root custom properties)
└── tests/
    └── component/           # New/extended tests for US1

tests/e2e/journeys/          # Re-run; extend only if new assertions needed
```

**Structure Decision**: All implementation stays under **`apps/web`** for CSS and components. Tokens live in a dedicated stylesheet imported before or alongside `layout.css` so components can consume variables without adopting a new CSS framework.

## Phase 0 output

See [research.md](./research.md).

## Phase 1 outputs

- [data-model.md](./data-model.md) — Conceptual presentation entities (tokens, surfaces).
- [contracts/ui-design-contract.md](./contracts/ui-design-contract.md) — Named token roles and which UI regions MUST use them.
- [quickstart.md](./quickstart.md) — Local verification and regression commands.

## Post-design Constitution re-check

Artifacts above satisfy Principle I and give Principle II concrete test anchors. Proceed to `/speckit-tasks`.

## Complexity Tracking

No violations.
