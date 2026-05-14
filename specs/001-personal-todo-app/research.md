# Phase 0 Research: Personal Todo App

**Feature**: 001-personal-todo-app
**Plan**: [plan.md](./plan.md)
**Spec**: [spec.md](./spec.md)
**Constitution**: [v1.1.0](../../.specify/memory/constitution.md)

## Method

The user's plan input explicitly constrained the major technology choices, so
Phase 0 carries **zero open `NEEDS CLARIFICATION` items**. Each section below
records (a) the decision, (b) the rationale grounded in this project's
constitution and spec, and (c) the alternatives that were considered and
rejected. The output is the canonical "why" for the architecture in `plan.md`
and is referenced from the BMAD architecture artifact.

## Decisions

### D1. Repository shape — TypeScript monorepo with `pnpm` workspaces

- **Decision**: Single repository organised as a `pnpm` workspace with
  `apps/web`, `apps/api`, and `packages/shared`. Playwright E2E lives at the
  repo root under `tests/e2e/`.
- **Rationale**: The user requires shared types for the wire contract; a
  monorepo lets the frontend and backend import the same TypeScript types
  without publishing an intermediate package. `pnpm`'s strict, content-
  addressed `node_modules` keeps install reproducible — important for
  Principle VI's "container images MUST be reproducible". Cross-workspace
  scripts (`pnpm -r test`, `pnpm -r lint`) keep CI wiring trivial.
- **Alternatives considered**:
  - **Two repos (frontend, backend) + a published shared types package** —
    rejected because it adds publish steps and version drift for zero MVP
    benefit; the user explicitly asked for shared types.
  - **`npm` or `yarn` workspaces** — viable, but `pnpm`'s deterministic
    hoisting and faster CI installs better serve Principle VI. The plan does
    not bake `pnpm` into the constitution; swapping is a one-line PR.
  - **Nx / Turborepo orchestration on top of workspaces** — rejected for the
    MVP; pure workspaces are enough. Revisit if build times become a problem.

### D2. Frontend stack — React 18 + Vite + React Query

- **Decision**: React 18 with Vite as the dev server / bundler.
  `@tanstack/react-query` v5 is the only data-fetching / cache layer. Routing
  is intentionally minimal (the MVP is essentially one screen).
- **Rationale**:
  - User input mandates this stack.
  - React Query encodes the spec's loading / error states as first-class
    primitives (`isPending`, `isError`, `refetch`), which materially helps
    satisfy US4 (Graceful empty / loading / error states) without bespoke
    state machinery.
  - Vite's dev server gives the spec's "feels polished" feedback loop and
    keeps the production build minimal — relevant to SC-004 (interactive
    within 2 s on mid-range mobile).
- **Alternatives considered**:
  - **Redux Toolkit / Zustand for global state** — rejected: there is no
    meaningful client-side state beyond server cache, ephemeral form state,
    and a short undo timer. Adding a store would violate Principle V
    (simplicity).
  - **Next.js / Remix** — rejected for the MVP: the spec is a single screen
    with no SSR, auth, or SEO requirements; a meta-framework would be
    over-fit.

### D3. Backend stack — Node.js 22 + Express + zod

- **Decision**: Node.js 22 LTS, Express 4 for routing, zod for request and
  response schema validation. Errors flow through a single error-handler
  middleware emitting a consistent envelope (see `contracts/openapi.yaml`).
- **Rationale**:
  - User input mandates Node.js + Express. zod is the de-facto choice for
    schema-first validation in TypeScript and lets the same schema live in
    `packages/shared` and run on both client and server — a direct path to
    "shared types for API contracts" from the user input.
  - A single error envelope satisfies the user's "consistent error
    responses" requirement and Principle V's clarity expectation.
- **Alternatives considered**:
  - **Fastify** — viable and slightly faster, but the user explicitly named
    Express. Performance for a single-user CRUD is not the bottleneck.
  - **NestJS** — rejected: too much framework for a MVP that has one
    resource and ~6 endpoints.
  - **`express-validator` or hand-rolled validation** — rejected: zod's type
    inference means request body types and response types are derived from
    the schema, eliminating drift between runtime checks and TypeScript
    types.

### D4. Data layer — PostgreSQL 16 + Prisma 5

- **Decision**: Postgres 16 as the system of record, accessed exclusively
  through Prisma. Schema and migrations live under `apps/api/prisma/`.
- **Rationale**:
  - User input mandates Postgres + Prisma. Prisma's parameterised queries
    satisfy Principle V's input-handling expectation by construction (no
    raw SQL strings concatenating user input).
  - A single ORM path (no parallel raw SQL) is recorded in plan.md's
    Complexity Tracking as deliberate simplicity.
  - The `Todo` table layout from the user input (UUID id, text, completed
    boolean, createdAt / updatedAt) is compatible with later extensions
    (e.g., a nullable `user_id` column once accounts arrive) without a
    breaking migration. See `data-model.md` for the schema.
- **Alternatives considered**:
  - **SQLite for the MVP** — rejected: the user explicitly chose Postgres,
    and Postgres in a container is the simpler upgrade path to the
    eventual production posture.
  - **Drizzle ORM** — viable, but the user explicitly named Prisma.
  - **Raw `pg` + a query builder** — rejected: more boilerplate, more
    opportunity for SQL-injection mistakes, no migration tooling out of
    the box.

### D5. Testing strategy — Vitest + Testing Library + Supertest + Playwright

- **Decision**:
  - Frontend unit + component tests: Vitest + `@testing-library/react`.
  - Backend unit tests: Vitest.
  - Backend integration tests: Vitest + Supertest against a live Postgres
    in the `test` profile.
  - E2E tests: Playwright driving the full docker-compose stack — one spec
    per prioritized user story (US1…US5) to satisfy the constitution's
    "≥5 Playwright journeys" gate.
- **Rationale**:
  - User input mandates this exact split. It matches Principle II's
    "unit + integration + E2E" requirement.
  - Mapping E2E specs 1:1 to user stories satisfies Principle III
    (PRD-linked traceability) and gives each story an obvious independent
    acceptance signal.
  - Coverage is enforced via Vitest's `--coverage` and a CI step that fails
    below 70% per Principle II.
- **Alternatives considered**:
  - **Jest** — rejected: Vitest is the user's choice and integrates
    natively with the Vite tooling already in scope.
  - **Mock the database in integration tests** — rejected: integration
    tests that don't hit a real Postgres can't catch migration / query /
    constraint regressions, which is the entire point of having an
    integration layer.
  - **Cypress** — viable for E2E, but the user explicitly named
    Playwright; Playwright also has better mobile-emulation tooling for
    US5.

### D6. Accessibility tooling — semantic HTML + axe-core in CI

- **Decision**: Author the UI with semantic landmarks (`main`, `nav`,
  `header`), labelled form controls, visible focus, and live-region
  announcements for create / complete / delete / undo. Wire `axe-core` (via
  `@axe-core/playwright`) into the Playwright suite and fail CI on any
  critical or serious finding.
- **Rationale**: Principle V mandates WCAG 2.1 AA verified by automated
  tooling and at least one manual review per release. Running axe inside the
  Playwright suite means the existing E2E run already produces the a11y
  signal — no separate pipeline stage to maintain.
- **Alternatives considered**:
  - **Lighthouse CI** — viable for additional coverage but Playwright +
    axe gives more deterministic, page-level assertions for the same cost.
  - **Manual a11y review only** — rejected: contradicts Principle IV
    (reliable automation).

### D7. Containerisation — multi-stage Dockerfiles, non-root, healthchecks

- **Decision**: Two multi-stage Dockerfiles (`apps/web` and `apps/api`).
  Each ends in a runtime stage that copies only production artifacts and
  declares `USER node` (or a project-owned non-root user). `docker-compose`
  declares healthchecks on all three services and selects per-profile env
  files. Base image digests are pinned in CI.
- **Rationale**: Directly satisfies Principle VI bullets (Dockerfile per
  service, compose orchestration, healthchecks, env profiles, CI-built
  artifact, non-root). Multi-stage builds keep the runtime image small,
  which speeds up CI healthcheck convergence.
- **Alternatives considered**:
  - **Single Dockerfile that builds both apps** — rejected: violates the
    "Dockerfile per long-running service" expectation and conflates
    deployment lifecycles.
  - **Distroless final stage** — viable and slightly more secure, but adds
    debugging friction for the MVP. Recorded as a possible follow-up when
    the `prod` profile is hardened.

### D8. Environment profile model — `NODE_ENV` + compose overrides

- **Decision**: Three profiles — `dev`, `test`, `prod` — selected by
  `NODE_ENV` plus a matching `docker-compose.<profile>.yml` override.
  Configuration values come from per-profile `.env` files, never from
  code branches on hostname or container name.
- **Rationale**: Matches Principle VI's "environment profiles selected via
  environment variables, never via code branching on hostnames". The
  override-file pattern keeps each profile diff small and reviewable.
- **Alternatives considered**:
  - **Separate `docker-compose.<profile>.yml` files with no shared base** —
    rejected: duplication invites drift between profiles.
  - **In-app config service that fetches from a remote store** — rejected:
    out of MVP scope; revisit during `prod` hardening.

### D9. Security posture for the MVP

- **Decision**: For the MVP, security obligations are:
  - All request bodies validated by zod before reaching service logic.
  - Prisma is the only data-access path (no raw SQL with user input).
  - CSP header on the frontend; CORS scoped to the configured frontend
    origin on the backend.
  - No secrets in source; all secrets come from env vars selected by
    profile.
  - Dependency vulnerability scan (`pnpm audit` or `npm audit`) wired into
    CI and gating merges.
  - Container final stage runs as a non-root user.
  - Per-release security review documented in `docs/qa/` per Principle V.
- **Rationale**: The MVP has no authentication and no PII beyond the user's
  task text, so the surface area is small. The choices above eliminate the
  obvious classes of issue (injection, XSS, secret leakage, vulnerable
  deps, root containers) without introducing speculative complexity.
- **Alternatives considered**:
  - **Add auth / accounts now** — explicitly out of scope per user input
    and spec; deferred and made forward-compatible via the data model.
  - **SAST scanner in CI from day one** — viable; tentatively deferred to a
    follow-up because the MVP code surface is small and `pnpm audit` plus
    zod cover the immediate risk vectors. Reconsider before adding auth.

## Open items

None. All technology choices are decided. Documentation follow-ups (README,
AI/MCP usage log, `prod`-profile hardening) are tracked in `plan.md`'s
"Follow-ups recorded" section and will be turned into explicit tasks in
`/speckit-tasks`.
