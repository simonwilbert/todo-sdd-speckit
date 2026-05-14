---
description: "Task list for Personal Todo App (001-personal-todo-app)"
---

# Tasks: Personal Todo App

**Input**: Design documents from `/specs/001-personal-todo-app/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md), [contracts/openapi.yaml](./contracts/openapi.yaml), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: **MANDATORY** per [constitution v1.1.0](../../.specify/memory/constitution.md) Principle II and [spec.md](./spec.md) FR-015 / SC-006 / SC-007. Every user story phase includes failing tests first (TDD where applicable), then implementation. Do not remove or defer test tasks.

**Organization**: Tasks are grouped by user story (US1–US5) after shared setup and foundational infrastructure. IDs are sequential; `[P]` means parallelizable (different files, no ordering dependency within the same checkpoint).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel within the same phase checkpoint
- **[USn]**: Maps to **User Story n** in [spec.md](./spec.md)

## Path Conventions

Per [plan.md](./plan.md): `apps/web/`, `apps/api/`, `packages/shared/`, `tests/e2e/`, `docker/`, `docs/`, `.github/workflows/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo skeleton, toolchain, and empty workspaces so Foundational work can compile.

- [x] T001 Create root `pnpm-workspace.yaml` including `apps/*` and `packages/*` at repository root
- [x] T002 Create root `package.json` with `private: true`, npm `workspaces`, `type: "module"`, and aggregate scripts (`lint`, `typecheck`, `test`) at repository root
- [x] T003 [P] Create root `.npmrc` with `engine-strict=true` and Node engine note at repository root
- [x] T004 [P] Create root `eslint.config.js` (flat config) for TypeScript + React at repository root
- [x] T005 [P] Create root `prettier.config.cjs` and `.prettierignore` at repository root
- [x] T006 [P] Create root `tsconfig.base.json` (strict, `moduleResolution` consistent with Vite + Node) at repository root
- [x] T007 Create `packages/shared/package.json` and `packages/shared/tsconfig.json` extending `tsconfig.base.json`
- [x] T008 [P] Create `apps/api/package.json`, `apps/api/tsconfig.json`, and placeholder `apps/api/src/server.ts`
- [x] T009 [P] Create `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/vite.config.ts`, and `apps/web/index.html`
- [x] T010 Create `packages/shared/src/index.ts` as a barrel (re-export modules as they land) at `packages/shared/src/index.ts`
- [x] T011 Run `npm install` at repository root (generates `package-lock.json`; use **pnpm 8+ on Node 22** if `pnpm install` fails with `ERR_INVALID_THIS` on older pnpm)

**Checkpoint**: `pnpm -r exec tsc --version` works from repo root (may not typecheck clean until Foundational).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared wire contract, database schema, API shell, test runners, containers, and CI — **no user story is shippable until this phase completes**.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [x] T012 Implement TypeScript wire types for `Todo`, `TodoCreate`, `TodoPatch`, `TodoReplace`, and `Health` in `packages/shared/src/todo.ts` matching `specs/001-personal-todo-app/contracts/openapi.yaml`
- [x] T013 Implement zod schemas and parsers for the same shapes plus `Error` envelope in `packages/shared/src/schemas/todo.zod.ts`
- [x] T014 Re-export types and schemas from `packages/shared/src/index.ts`
- [x] T015 Create Prisma datasource + `Todo` model in `apps/api/prisma/schema.prisma` per `specs/001-personal-todo-app/data-model.md`
- [x] T016 Generate initial SQL migration under `apps/api/prisma/migrations/` for the `Todo` model
- [x] T017 Implement Prisma client singleton reading `DATABASE_URL` in `apps/api/src/db/client.ts`
- [x] T018 Implement `X-Request-Id` middleware in `apps/api/src/middleware/requestId.ts`
- [x] T019 Implement centralized JSON error handler (`{ error: { code, message, details? } }`) in `apps/api/src/middleware/errorHandler.ts`
- [x] T020 Implement zod validation helpers for body and params in `apps/api/src/middleware/validate.ts`
- [x] T021 Implement `GET /health` with Postgres readiness check in `apps/api/src/routes/health.ts`
- [x] T022 Create `apps/api/src/routes/todos.ts` exporting an Express `Router` (route handlers filled in user-story phases)
- [x] T023 Wire CORS, `express.json()`, routes (`/health`, `/todos`), and error middleware in `apps/api/src/server.ts`
- [x] T024 Configure Vitest + coverage threshold (≥70%) for API in `apps/api/vitest.config.ts`
- [x] T025 Configure Vitest + jsdom + Testing Library + coverage threshold (≥70%) for web in `apps/web/vitest.config.ts`
- [x] T026 Create three-service `docker/docker-compose.yml` (`postgres`, `api`, `web`) with healthchecks at `docker/docker-compose.yml`
- [x] T027 Add `docker/docker-compose.dev.yml` overrides (volumes, `dev` env files, published ports) at `docker/docker-compose.dev.yml`
- [x] T028 Add `docker/docker-compose.test.yml` overrides (ephemeral Postgres, `test` profile) at `docker/docker-compose.test.yml`
- [x] T029 Add `docker/.env.dev.example` and `docker/.env.test.example` documenting `DATABASE_URL`, `VITE_API_URL`, and ports under `docker/`
- [x] T030 Create multi-stage non-root `apps/api/Dockerfile` (builder + runtime `USER node`)
- [x] T031 [P] Create multi-stage non-root `apps/web/Dockerfile` (build static assets + serve via production-grade static server stage)
- [x] T032 Create `.github/workflows/ci.yml` running `pnpm install`, `pnpm -r lint`, `pnpm -r typecheck`, API integration tests (against `test` compose Postgres), web unit/component tests, `pnpm audit --prod`, and Docker build smoke at `.github/workflows/ci.yml`
- [x] T033 Create Playwright config with `baseURL`, compose-backed `webServer`, and mobile + desktop projects in `tests/e2e/playwright.config.ts`
- [x] T034 Add `pnpm run e2e` script at repository root `package.json` invoking Playwright from `tests/e2e/`

**Checkpoint**: `docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up` starts all services healthy; `GET http://localhost:3000/health` returns `{"status":"ok"}`; `pnpm -r typecheck` passes.

---

## Phase 3: User Story 1 — Capture and revisit tasks (Priority: P1) 🎯 MVP

**Goal**: Create and list todos via REST; UI lists todos and creates new ones; data survives reload (spec US1).

**Independent Test**: Add a task, reload the browser, same task and order — covered by `tests/e2e/journeys/us1.capture-revisit.spec.ts`.

### Tests for User Story 1 (write first; confirm RED where TDD applies)

- [x] T035 [P] [US1] Add failing API integration tests for `GET /todos` (empty) and `POST /todos` + persistence in `apps/api/tests/integration/todos.us1.test.ts`
- [x] T036 [P] [US1] Add failing component tests for `TodoCreateForm` validation (empty / whitespace / max length) in `apps/web/tests/component/TodoCreateForm.us1.test.tsx`
- [x] T037 [P] [US1] Add failing Playwright journey in `tests/e2e/journeys/us1.capture-revisit.spec.ts` per `specs/001-personal-todo-app/quickstart.md`

### Implementation for User Story 1

- [x] T038 [US1] Implement `listTodos` and `createTodo` in `apps/api/src/services/todoService.ts` using Prisma
- [x] T039 [US1] Implement `GET /todos` and `POST /todos` with zod validation and ordering (`createdAt DESC`) in `apps/api/src/routes/todos.ts`
- [x] T040 [US1] Implement typed `fetch` API client in `apps/web/src/services/apiClient.ts` using `import.meta.env.VITE_API_URL`
- [x] T041 [US1] Implement React Query hooks `useTodosQuery` and `useCreateTodoMutation` in `apps/web/src/services/todoQueries.ts`
- [x] T042 [US1] Build `TodoCreateForm` and `TodoList` in `apps/web/src/components/TodoCreateForm.tsx` and `apps/web/src/components/TodoList.tsx`
- [x] T043 [US1] Compose `HomePage` in `apps/web/src/pages/HomePage.tsx` and wire `App.tsx` + `main.tsx` in `apps/web/src/App.tsx` and `apps/web/src/main.tsx`

**Checkpoint**: US1 acceptance scenarios 1–4 in [spec.md](./spec.md) pass manually; T035–T037 tests GREEN.

---

## Phase 4: User Story 2 — Mark complete / incomplete (Priority: P2)

**Goal**: Toggle `completed` with PATCH; visual distinction; survives reload (spec US2).

**Independent Test**: Toggle complete → incomplete → reload preserves state — `tests/e2e/journeys/us2.complete-toggle.spec.ts`.

### Tests for User Story 2

- [x] T044 [P] [US2] Add failing API integration tests for `PATCH /todos/:id` toggling `completed` in `apps/api/tests/integration/todos.us2.test.ts`
- [x] T045 [P] [US2] Add failing component tests for `TodoItem` toggle a11y + styles in `apps/web/tests/component/TodoItem.us2.test.tsx`
- [x] T046 [P] [US2] Add failing Playwright journey in `tests/e2e/journeys/us2.complete-toggle.spec.ts`

### Implementation for User Story 2

- [x] T047 [US2] Extend `todoService` with `updateTodoPatch` in `apps/api/src/services/todoService.ts`
- [x] T048 [US2] Implement `PATCH /todos/:id` in `apps/api/src/routes/todos.ts` with partial zod schema
- [x] T049 [US2] Add `useToggleTodoMutation` and wire `TodoItem` checkbox in `apps/web/src/components/TodoItem.tsx` (used from `TodoList.tsx`)

**Checkpoint**: US2 acceptance scenarios pass; T044–T046 GREEN.

---

## Phase 5: User Story 3 — Delete with brief undo (Priority: P2)

**Goal**: `DELETE /todos/:id`; UI removes row immediately; short undo restores row + server state (spec US3).

**Independent Test**: Delete → undo within window → reload shows task — `tests/e2e/journeys/us3.delete-undo.spec.ts`.

### Tests for User Story 3

- [x] T050 [P] [US3] Add failing API integration tests for `DELETE /todos/:id` and 404 semantics in `apps/api/tests/integration/todos.us3.test.ts`
- [x] T051 [P] [US3] Add failing component tests for delete + undo timer behavior in `apps/web/tests/component/TodoDeleteUndo.us3.test.tsx`
- [x] T052 [P] [US3] Add failing Playwright journey in `tests/e2e/journeys/us3.delete-undo.spec.ts`

### Implementation for User Story 3

- [x] T053 [US3] Implement `deleteTodo` in `apps/api/src/services/todoService.ts` and `DELETE /todos/:id` in `apps/api/src/routes/todos.ts`
- [x] T054 [US3] Implement optimistic delete + undo snackbar (timer-bound) in `apps/web/src/components/TodoDeleteUndo.tsx` and integrate from `apps/web/src/components/TodoList.tsx`

**Checkpoint**: US3 acceptance scenarios pass; T050–T052 GREEN.

---

## Phase 6: User Story 4 — Empty, loading, error states (Priority: P3)

**Goal**: Empty state CTA, loading >200 ms, clear persistence errors + retry, no silent divergence (spec US4).

**Independent Test**: Empty list copy; slow network skeleton; kill API and assert error UI — `tests/e2e/journeys/us4.empty-loading-error.spec.ts`.

### Tests for User Story 4

- [x] T055 [P] [US4] Add failing component tests for empty / pending / error UI branches in `apps/web/tests/component/TodoPageStates.us4.test.tsx`
- [x] T056 [P] [US4] Add failing Playwright journey in `tests/e2e/journeys/us4.empty-loading-error.spec.ts`

### Implementation for User Story 4

- [x] T057 [US4] Implement `TodoEmptyState` component in `apps/web/src/components/TodoEmptyState.tsx`
- [x] T058 [US4] Wire React Query `isPending` / `isError` / `refetch` states in `apps/web/src/pages/HomePage.tsx`
- [x] T059 [US4] Implement `QueryErrorBanner` with retry action in `apps/web/src/components/QueryErrorBanner.tsx`

**Checkpoint**: US4 acceptance scenarios pass; T055–T056 GREEN.

---

## Phase 7: User Story 5 — Responsive + accessible (Priority: P3)

**Goal**: Mobile + desktop layouts; WCAG 2.1 AA (axe: zero critical/serious); keyboard operability (spec US5 + constitution).

**Independent Test**: Resize viewports; tab through controls; axe scan — `tests/e2e/journeys/us5.responsive-a11y.spec.ts`.

### Tests for User Story 5

- [x] T060 [P] [US5] Add Playwright + `@axe-core/playwright` helper in `tests/e2e/helpers/a11y.ts`
- [x] T061 [P] [US5] Add failing Playwright journey covering mobile + desktop widths + axe assertions in `tests/e2e/journeys/us5.responsive-a11y.spec.ts`

### Implementation for User Story 5

- [x] T062 [US5] Add responsive layout, landmarks (`main`, labels), and focus-visible styles in `apps/web/src/App.tsx` and `apps/web/src/styles/layout.css`
- [x] T063 [US5] Add security headers middleware (CSP, HSTS-ready shape, `X-Content-Type-Options`) in `apps/api/src/middleware/securityHeaders.ts` and register in `apps/api/src/server.ts`
- [x] T064 [US5] Audit and fix focus order / live regions for create, toggle, delete, undo in `apps/web/src/components/TodoCreateForm.tsx` and `apps/web/src/components/TodoItem.tsx`

**Checkpoint**: US5 acceptance scenarios pass; T061 GREEN with axe thresholds from [spec.md](./spec.md) SC-005.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, contract completeness, constitution follow-ups F1–F3, and quickstart validation.

- [x] T065 Create top-level `README.md` with project overview, link to `specs/001-personal-todo-app/quickstart.md`, and BMAD artefact index at repository root
- [x] T066 Create `docs/architecture.md` mirroring the Architecture overview from `specs/001-personal-todo-app/plan.md` at `docs/architecture.md`
- [x] T067 Create append-only `docs/ai-mcp-usage-log.md` and record AI/MCP usage for planning and implementation sessions at `docs/ai-mcp-usage-log.md`
- [x] T068 [P] Write MVP QA summary (test commands, coverage numbers, Playwright list) in `docs/qa/mvp-qa-report.md`
- [x] T069 [P] Write MVP accessibility review notes (manual checks beyond axe) in `docs/qa/mvp-a11y-review.md`
- [x] T070 [P] Write MVP security review notes (threats considered, mitigations, `pnpm audit` outcome) in `docs/qa/mvp-security-review.md`
- [x] T071 Add failing integration tests for `PUT /todos/:id` full replace per OpenAPI in `apps/api/tests/integration/todos.put.test.ts`
- [x] T072 Implement `PUT /todos/:id` using `TodoReplace` zod schema in `apps/api/src/routes/todos.ts` and `apps/api/src/services/todoService.ts`
- [x] T073 Document deferred `prod` profile hardening (TLS, secrets backend, external DB) in `docs/prod-profile.md` per plan follow-up F3
- [x] T074 Execute every command path in `specs/001-personal-todo-app/quickstart.md` and fix discrepancies in `docker/` or docs
- [x] T075 Add `.github/pull_request_template.md` requiring `US#` linkage and checklist for constitution gates at `.github/pull_request_template.md`
- [x] T076 [P] Add `package.json` workspace metadata for `@app/e2e` or root Playwright deps so `pnpm run e2e` is reproducible CI-local at `tests/e2e/package.json` (if not hoisted at root)
- [x] T077 Ensure OpenAPI file stays in sync: add CI step or script `pnpm run contracts:lint` validating `specs/001-personal-todo-app/contracts/openapi.yaml` in `.github/workflows/ci.yml` or `package.json`
- [x] T078 Tag release candidate and verify docker-compose `test` profile runs full CI suite green on a clean machine

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**.
- **Phase 3–7 (US1–US5)**: Each depends on Phase 2. Recommended order: **US1 → US2 → US3 → US4 → US5** (P1 before P2 before P3) to minimise integration risk; US4/US5 can overlap US2/US3 only after their prerequisites exist in `main`.
- **Phase 8 (Polish)**: Depends on US1–US5 being feature-complete for MVP scope.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories — **MVP slice**.
- **US2 (P2)**: Depends on US1 list + item UI existing (needs todos in DB/UI).
- **US3 (P2)**: Depends on US1; integrates cleanly with US2 completion state.
- **US4 (P3)**: Cross-cuts UI for all prior stories — run after US1–US3 hooks exist.
- **US5 (P3)**: Cross-cuts presentation — run after primary components exist (typically after US1–US4).

### Within Each User Story

- Integration / component / Playwright tests (T035–T037, etc.) **before** or **in lockstep with** implementation tasks — confirm RED then GREEN.
- API service layer (`todoService`) before route handlers.
- Route handlers before frontend mutations consuming them.

### Parallel Opportunities

- All `[P]` tasks within the same story's test block may run in parallel (separate files).
- `T003`–`T006` (linting / formatting / base TS) parallel during Setup.
- `T030`–`T031` (Dockerfiles) parallel during Foundational.
- `T068`–`T070` (QA docs) parallel during Polish.

---

## Parallel Example: User Story 1

```bash
# After Phase 2 checkpoint, launch US1 tests together (expect RED until T038–T043 land):
pnpm vitest run apps/api/tests/integration/todos.us1.test.ts
pnpm vitest run apps/web/tests/component/TodoCreateForm.us1.test.tsx
pnpm exec playwright test tests/e2e/journeys/us1.capture-revisit.spec.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) — **STOP**: demo create + reload persistence.
3. Run quickstart dev path for US1 scenarios only.

### Incremental Delivery

1. US1 → validate independently → merge.
2. US2 → validate → merge.
3. US3 → validate → merge.
4. US4 → validate → merge.
5. US5 → validate → merge.
6. Phase 8 polish + release.

### Parallel Team Strategy

- Developer A: US1 backend (T038–T039) while Developer B: US1 frontend (T040–T042) after T035 is agreed (contract stable).
- Developer C: Phase 2 Docker/CI (T026–T032) in parallel with shared package T012–T014 once `tsconfig.base.json` exists.

---

## Notes

- Every task line uses the checklist format: `- [ ] Tnnn …` with a concrete file path.
- Constitution gates: ≥70% coverage, ≥5 Playwright journeys (T037, T046, T052, T056, T061), WCAG AA (T061 + T069), security headers + audit (T032, T063, T070), non-root Docker (T030–T031), healthchecks (T026).
- **Follow-ups F1–F3** from [plan.md](./plan.md): addressed by **T065–T067** (F1/F2) and **T073** (F3).

---

## Task Summary

| Metric                     | Value |
| -------------------------- | ----: |
| **Total tasks**            |    78 |
| **Phase 1 (Setup)**        |    11 |
| **Phase 2 (Foundational)** |    23 |
| **US1**                    |     9 |
| **US2**                    |     6 |
| **US3**                    |     5 |
| **US4**                    |     5 |
| **US5**                    |     5 |
| **Phase 8 (Polish)**       |    14 |
| **Parallel `[P]` tasks**   |    28 |

**Suggested MVP scope**: Complete through **T043** (Phases 1–3) then stop for a demo; constitution requires completing through at least **T061** before calling the feature release-ready.

**Suggested commit message**:

```
tasks: add dependency-ordered tasks.md for Personal Todo App (001)

78 tasks across setup, foundational infra, US1-US5 (tests-first),
and polish including README, architecture, AI/MCP log, QA reports,
PUT parity, prod profile doc, PR template, and contract CI check.
```
