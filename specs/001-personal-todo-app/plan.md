# Implementation Plan: Personal Todo App

**Branch**: `main` (formerly `001-personal-todo-app`) | **Date**: 2026-05-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personal-todo-app/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a minimal but complete personal Todo app (create / view / complete / delete
with brief undo, persistence across sessions, graceful empty / loading / error
states, responsive WCAG 2.1 AA UI) as a full-stack TypeScript monorepo: a
React + Vite frontend driven by React Query, a Node.js + Express REST API, and
PostgreSQL via Prisma. Shared TypeScript types define the wire contract for
`/todos` and `/health`. The stack ships as multi-stage non-root Docker images
orchestrated by docker-compose with healthchecks and `dev` / `test` env
profiles. QA layers (Vitest unit / component, Vitest + Supertest integration,
Playwright E2E) and CI gates (≥70% coverage, ≥5 Playwright journeys, a11y,
security scan, container healthchecks) are wired in from the first increment per
the v1.1.0 constitution.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) on Node.js 22 LTS; React 18.x
**Primary Dependencies**: Vite 5+, React 18, @tanstack/react-query 5, Express 4, Prisma 5, zod (request/response validation), Vitest, @testing-library/react, Supertest, Playwright
**Storage**: PostgreSQL 16 (containerized; per-profile databases for `dev` and `test`)
**Testing**: Vitest + @testing-library/react (frontend unit & component), Vitest + Supertest (API integration against a live Postgres in the `test` profile), Playwright (E2E user journeys against the docker-compose stack)
**Target Platform**: Modern evergreen web browsers (Chrome, Firefox, Safari, Edge — current and previous major); services run as Linux containers (amd64 + arm64)
**Project Type**: Web application — TypeScript monorepo with a frontend app, a backend API, and a shared types package
**Performance Goals**: Spec SC-001 (capture-to-confirm <5 s on mid-range mobile), SC-003 (UI reflects state changes <1 s), SC-004 (primary screen interactive <2 s); API: `/todos` p95 <200 ms under single-user load; container healthchecks pass within 30 s of start.
**Constraints**: WCAG 2.1 AA (zero critical/serious findings on primary screens); ≥70% meaningful coverage; ≥5 Playwright user-journey tests passing on main; no hardcoded secrets — config via env vars selected by env profile (`dev`, `test`); containers run as a non-root user; CSP, input validation, and dependency vulnerability scan must pass before merge.
**Scale/Scope**: Single personal user per device for the MVP; up to a few hundred tasks per user without UI degradation; local-per-device persistence (no cross-device sync, no accounts) — data model must remain forward-compatible with adding accounts and sync later.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Evaluation against constitution v1.1.0:

| #   | Principle                                            | Gate criteria                                                                                                                                                                                        | Initial status                                                                                                                                                                                                                                                                                                                       | Post-design status |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| I   | Spec-First Delivery (BMAD-Anchored)                  | PRD / spec, architecture, API contracts, stories with acceptance criteria exist and are version-controlled before implementation                                                                     | PASS — `spec.md` published with 5 prioritized user stories and 15 testable FRs; architecture (this plan), data model, and API contract (`contracts/openapi.yaml`) produced in Phase 1                                                                                                                                                | PASS               |
| II  | Testable by Design (QA from Day One, NON-NEGOTIABLE) | Unit + integration + E2E tests mandatory; ≥70% meaningful coverage; ≥5 Playwright journeys; tests fail before implementation where TDD applies; every acceptance criterion maps to ≥1 automated test | PASS — Vitest (unit & component) on frontend, Vitest + Supertest (integration) on backend against real Postgres, Playwright (E2E) for 5+ journeys mapped 1-per-user-story; coverage gate enforced in CI                                                                                                                              | PASS               |
| III | Small, Traceable, PRD-Linked Changes                 | Tasks grouped by BMAD story; commits / PRs reference the story                                                                                                                                       | PASS — `/speckit-tasks` will group tasks by US1…US5; PR template will require story linkage                                                                                                                                                                                                                                          | PASS               |
| IV  | Reliable Automation and Checks                       | Lint, type-check, unit / integration / E2E tests, a11y, security scan, container build all run in CI                                                                                                 | PASS — single CI workflow runs ESLint + `tsc --noEmit` + Vitest (with coverage) + Supertest + Playwright + axe-core a11y scan + `pnpm audit` (or equivalent) + container build & healthcheck verification                                                                                                                            | PASS               |
| V   | Clarity, Simplicity, Security, Accessibility         | WCAG 2.1 AA verified by tooling + manual review; per-release security review; BMAD artifacts + QA report + README + AI/MCP usage log version-controlled                                              | PASS (with follow-ups) — UI uses semantic landmarks, labeled controls, focus management, sufficient contrast; security review covers input validation (zod), parameterised Prisma queries, CSP headers, dependency scan, secret handling; README and `docs/ai-mcp-usage-log.md` to be created during implementation (see Follow-ups) | PASS               |
| VI  | Containerized and Deployable by Default              | Dockerfile per long-running service; top-level `docker-compose.yml`; healthchecks on every service; env profiles (`dev`, `test`, `prod`) via env vars; CI builds the deployable artifact             | PASS — multi-stage Dockerfiles for `apps/web` and `apps/api` (final stage `USER node`), Postgres uses official image, `docker/docker-compose.yml` orchestrates all three with `healthcheck:` blocks; `dev` and `test` profiles in scope for MVP, `prod` profile shape defined but full prod hardening deferred to a later increment  | PASS               |

**Initial gate result**: PASS — no principle violations. No entries required in
Complexity Tracking. Proceed to Phase 0.

**Follow-ups recorded** (do not block the gate; will be addressed as explicit
tasks during `/speckit-tasks`):

- F1. Create top-level `README.md` aligned with Principle V and Release gate.
- F2. Create append-only `docs/ai-mcp-usage-log.md` and back-fill entries for the
  constitution, spec, and plan steps that were AI-assisted.
- F3. Define the `prod` profile end-to-end (TLS termination, secret backend,
  external Postgres) in a follow-up increment after MVP user stories ship.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-todo-app/
├── spec.md              # /speckit-specify output (already produced)
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── openapi.yaml     #   REST contract for /todos and /health
├── checklists/
│   └── requirements.md  # Spec quality checklist (already produced)
└── tasks.md             # Phase 2 output (/speckit-tasks - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
apps/
├── web/                          # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Presentational + container components
│   │   ├── pages/                # Route-level views
│   │   ├── services/             # React Query hooks + typed API client
│   │   └── lib/                  # Cross-cutting helpers (a11y, formatting)
│   ├── tests/
│   │   ├── unit/                 # Pure-function & hook tests (Vitest)
│   │   └── component/            # @testing-library/react component tests
│   ├── Dockerfile                # Multi-stage; final stage non-root
│   ├── index.html
│   └── vite.config.ts
└── api/                          # Node.js + Express backend
    ├── src/
    │   ├── routes/               # /todos, /health
    │   ├── services/             # Business logic, transaction boundaries
    │   ├── middleware/           # Validation (zod), error handler, request-id
    │   ├── db/                   # Prisma client wrapper
    │   └── server.ts             # Express bootstrap + healthcheck wiring
    ├── prisma/
    │   ├── schema.prisma         # Todo model (see data-model.md)
    │   └── migrations/
    ├── tests/
    │   ├── unit/                 # Pure-function tests (Vitest)
    │   └── integration/          # Supertest against live Postgres (test profile)
    ├── Dockerfile                # Multi-stage; final stage non-root
    └── tsconfig.json

packages/
└── shared/                       # Shared TypeScript types (wire contract)
    ├── src/
    │   ├── todo.ts               # Todo, TodoCreate, TodoUpdate, TodoPatch
    │   └── api.ts                # Envelope types, error shape
    └── package.json

tests/
└── e2e/                          # Playwright user-journey tests
    ├── playwright.config.ts
    └── journeys/                 # One spec per prioritized user story (≥5)
        ├── us1.capture-revisit.spec.ts
        ├── us2.complete-toggle.spec.ts
        ├── us3.delete-undo.spec.ts
        ├── us4.empty-loading-error.spec.ts
        └── us5.responsive-a11y.spec.ts

docker/
├── docker-compose.yml            # Orchestrates web + api + postgres
├── docker-compose.dev.yml        # Overrides for `dev` profile
└── docker-compose.test.yml       # Overrides for `test` profile (used by CI)

docs/
├── README.md                     # Project README (Principle V follow-up F1)
├── architecture.md               # Mirrors §"Architecture overview" in this plan
├── ai-mcp-usage-log.md           # Append-only AI/MCP log (follow-up F2)
└── qa/                           # QA reports + a11y + security review per release

.github/
└── workflows/
    └── ci.yml                    # Lint, types, unit, integration, E2E, a11y, sec, container build
```

**Structure Decision**: TypeScript monorepo with two workspaces under `apps/`
(`web`, `api`) and one library workspace under `packages/shared` for the wire
contract. Playwright lives at the repo root under `tests/e2e/` so it can drive
the full docker-compose stack without belonging to either app. Docker assets and
compose overrides live under `docker/`. Package manager: `pnpm` workspaces
(default; can be swapped for npm or yarn workspaces without affecting the
constitution gates).

## Architecture overview

This section is referenced by the BMAD architecture document (Principle I) and
mirrored into `docs/architecture.md` during implementation.

- **Frontend (`apps/web`)**: React 18 + Vite, TypeScript strict. State is owned
  by `@tanstack/react-query` against the backend; local UI state stays in
  components. A single typed API client (in `services/`) consumes types from
  `packages/shared`. Routing is minimal (one primary screen for the MVP).
  Accessibility is enforced via semantic HTML, labelled controls, focus
  management on create / delete / undo, and an `axe-core` automated scan in CI
  on every primary screen.
- **Backend (`apps/api`)**: Node.js 22 + Express. Each route validates input and
  output with a zod schema imported from `packages/shared`. Errors flow through
  a single error-handler middleware that emits a consistent envelope
  (`{ error: { code, message, details? } }`). Persistence uses Prisma; the
  service layer owns transaction boundaries. `/health` returns liveness +
  readiness (Postgres ping) and is what docker-compose's healthcheck targets.
- **Shared types (`packages/shared`)**: Single source of truth for `Todo`,
  request bodies, and error envelopes. Both the API contract (zod schemas) and
  the frontend's React Query hooks import from here, so the wire shape cannot
  drift between client and server.
- **Database (Postgres 16)**: Run in a container with persistent volume in
  `dev`, ephemeral volume in `test`. Migrations are Prisma-managed and run on
  API container start in `dev` / `test`. The MVP table is a single `todos`
  table (see `data-model.md`).
- **Containerization**: Each app has a multi-stage Dockerfile — a builder stage
  installs dev deps and produces a build, and a runtime stage copies only the
  production artifacts and runs as a non-root `USER`. Compose declares
  healthchecks for all three services and resolves config from a per-profile
  `.env` file. Image base digests are pinned in CI.
- **Environment profiles**: `dev` (developer machine; hot reload, persistent
  volume, looser CORS), `test` (used by CI / E2E; ephemeral volume, fixtures
  seeded), `prod` (defined in shape but full hardening deferred per follow-up
  F3). Profile is selected by `NODE_ENV` plus a compose override file; no code
  branches on hostname.
- **Observability (MVP-minimum)**: Structured JSON logs on stderr with a request
  id. Metrics and tracing are deliberately out of scope for the MVP.

## Phase 0 output

See [research.md](./research.md). Phase 0 carried no `NEEDS CLARIFICATION`
items because the user's plan input fully constrained the technology choices.
`research.md` records decisions, rationales, and the alternatives that were
considered and rejected for each major choice (frontend, backend, ORM,
validation, testing, containerization).

## Phase 1 outputs

- [data-model.md](./data-model.md) — Single entity (`Todo`) with fields,
  validation rules, and state transitions; forward-compatibility notes for a
  later `user_id` column.
- [contracts/openapi.yaml](./contracts/openapi.yaml) — REST contract for
  `/todos` (GET, POST), `/todos/{id}` (PATCH, PUT, DELETE), and `/health`
  with a single consistent error envelope.
- [quickstart.md](./quickstart.md) — One-page "clone → up → test" walkthrough
  using docker-compose with the `dev` profile, plus the commands a contributor
  runs locally for unit / component / integration / E2E tests.

## Post-design Constitution re-check

Re-running each gate against the produced Phase 1 artifacts:

- **I** — Architecture, data model, and API contracts are now version-controlled
  alongside the spec and stories. PASS.
- **II** — Five Playwright journey files are enumerated (one per user story),
  satisfying the ≥5 gate. Unit and integration test directories are wired in
  both apps. Coverage threshold is enforced by Vitest config (to be created
  during `/speckit-tasks`). PASS.
- **III** — Tasks will be grouped by US1…US5 in the next step; the directory
  layout already separates per-story Playwright specs. PASS.
- **IV** — CI workflow path (`.github/workflows/ci.yml`) is named and its
  responsibilities are enumerated. PASS.
- **V** — A11y, security review obligations, and the documentation set (README,
  BMAD artifacts, QA, AI/MCP log) are recorded as explicit follow-ups F1 / F2.
  PASS, with follow-ups tracked.
- **VI** — Dockerfiles, compose overrides, healthchecks, and the `dev` / `test`
  profile split are explicit in the structure. PASS, with `prod` shape deferred
  per follow-up F3.

**Post-design gate result**: PASS. Proceed to `/speckit-tasks`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations to justify. The MVP intentionally:

- Uses a single relational database (not a cache + queue + DB) — appropriate
  for single-user CRUD with persistence.
- Uses Prisma as the only data-access path (no parallel raw SQL layer) —
  parameterised queries by construction satisfy Principle V's input-handling
  expectations.
- Defers `prod` hardening, accounts, and sync to follow-up increments rather
  than over-building the MVP.
