---
description: "Task list for Professional UI refresh (002-professional-ui)"
---

# Tasks: Professional UI refresh

**Input**: Design documents from `/specs/002-professional-ui/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-design-contract.md](./contracts/ui-design-contract.md), [quickstart.md](./quickstart.md)

**Tests**: **MANDATORY** per [constitution v1.1.0](../../.specify/memory/constitution.md) Principle II. This epic is presentation-only: automated coverage is **component tests** (Vitest + Testing Library) plus **existing Playwright journeys** and **axe** thresholds from 001. No new API integration tests.

**Organization**: One user story (**US1** in this spec). Phases: foundation → US1 (tests + implementation) → polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel within the same checkpoint
- **[USn]**: User story **n** in [spec.md](./spec.md) for feature 002

## Path Conventions

Per [plan.md](./plan.md): `apps/web/src/`, `apps/web/tests/`, `tests/e2e/journeys/`, `docs/qa/`, `docs/ai-mcp-usage-log.md`.

---

## Phase 1: Design foundation (blocking)

**Purpose**: Token file and import order so all later CSS can reference variables.

- [x] T001 Create `apps/web/src/styles/tokens.css` implementing required variables from `specs/002-professional-ui/contracts/ui-design-contract.md`
- [x] T002 Import `tokens.css` before `layout.css` in the web app entry (`apps/web/src/main.tsx` or equivalent global style entry)

**Checkpoint**: Dev server runs; `:root` variables visible in computed styles inspector.

---

## Phase 2: User Story 1 — Professional visual system (Priority: P1)

**Goal**: Clean, extremely modern, responsive UI and copy tone across primary surfaces (FR-101–FR-107).

**Independent Test**: Same as [spec.md](./spec.md) User Story 1 — narrow + wide viewports, four acceptance scenarios, axe critical/serious = 0.

### Tests for User Story 1 (write first where TDD helps)

- [x] T003 [P] [US1] Add failing component tests that pin critical a11y labels/roles after class changes in `apps/web/tests/component/ProfessionalUi.us1.test.tsx` (cover `TodoCreateForm` + `TodoItem` minimum)

### Implementation for User Story 1

- [x] T004 [US1] Refactor `apps/web/src/styles/layout.css` to consume tokens (shell, skip link, focus-visible, responsive breakpoints)
- [x] T005 [US1] Apply tokenized surfaces to `apps/web/src/App.tsx` (landmarks unchanged; classes / wrappers only)
- [x] T006 [US1] Restyle `apps/web/src/components/TodoCreateForm.tsx` and related selectors toward contract surfaces (`input-field`, `primary-action`)
- [x] T007 [US1] Restyle `apps/web/src/components/TodoList.tsx`, `TodoItem.tsx`, `TodoDeleteUndo.tsx`, `TodoEmptyState.tsx`, `QueryErrorBanner.tsx` for `list`, `list-row`, `toast-undo`, `empty-state`, `banner-error`
- [x] T008 [US1] Copy tone pass (FR-104) across user-visible strings in those components and `apps/web/src/pages/HomePage.tsx`
- [x] T009 [US1] Add motion rules respecting `prefers-reduced-motion` in `apps/web/src/styles/layout.css` or `tokens.css`

### Verification for User Story 1

- [x] T010 [US1] Run `npm run ci` green locally
- [x] T011 [US1] With `DATABASE_URL` and stack per [quickstart.md](./quickstart.md), run `npm run e2e` green (all journey specs; axe thresholds unchanged)

**Checkpoint**: SC-101–SC-102 satisfied; SC-103 checklist walkthrough completed by implementer.

---

## Phase 3: Polish & traceability

- [x] T012 Record design QA checklist outcome in `docs/qa/mvp-design-002-signoff.md` (or extend existing QA doc) and append one line to `docs/ai-mcp-usage-log.md` for the 002 implementation merge

---

## Dependencies & Execution Order

- **Phase 1** completes before **Phase 2**.
- **T003** before or in lockstep with **T004–T009** (tests fail then pass).
- **T010–T011** after implementation tasks **T004–T009**.
- **Phase 3** after verification green.

### Parallel opportunities

- **T003** can start once **T001–T002** exist (tests import components with new token classes).
- **T006** and **T007** can be parallelized by two developers if they coordinate on shared token tweaks.

### Parallel example

```bash
# After T001–T002, run component tests while styling:
npm run test -w @todo/web -- ProfessionalUi.us1
```

---

## Implementation strategy

1. Land **Phase 1** (tokens + import) in one small PR.
2. Land **US1** in one PR or split **layout shell** then **components** — always keep `npm run ci` green.
3. Run full **e2e** before merge to main.

---

## Task summary

| Metric               | Value |
| -------------------- | ----: |
| **Total tasks**      |    12 |
| **Phase 1**          |     2 |
| **US1 (Phase 2)**    |     9 |
| **Polish (Phase 3)** |     1 |

**Suggested commit message**:

```
feat(ui-002): professional design tokens and component surfaces

Implements 002 US1 against contracts/ui-design-contract.md; preserves axe gates.
```
