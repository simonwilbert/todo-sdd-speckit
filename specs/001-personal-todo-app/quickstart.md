# Quickstart: Personal Todo App

**Feature**: 001-personal-todo-app  
**Plan**: [plan.md](./plan.md)

This is the one-page "clone → up → test" walkthrough for the MVP. The repository uses **npm workspaces** (not pnpm). For a high-level overview and BMAD artefact index, see the top-level [README.md](../../README.md).

## Prerequisites

- Docker Desktop or compatible (Compose v2)
- Node.js **20 or 22** (matches CI)
- npm 10+ (bundled with Node)

## 1. Clone and install

```bash
git clone https://github.com/simonwilbert/todo-sdd-speckit.git todo-sdd-speckit
cd todo-sdd-speckit
npm ci
```

## 2. Bring up the stack (`dev` profile)

```bash
cp docker/.env.dev.example docker/.env.dev    # one-time
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d
```

This starts three containers:

- `postgres` (Postgres 16, persistent volume `todo_pgdata_dev`)
- `api` (Express + Prisma; runs `prisma migrate deploy` on start)
- `web` (Vite dev server)

All three declare healthchecks. Wait until `docker compose ps` reports all three as `healthy` — typically 10–30 s on first start (Postgres warms its data dir).

Then open: <http://localhost:5173>

The API is reachable on <http://localhost:3000>. `GET /health` should return `{"status":"ok","version":"..."}`.

## 3. Stop / reset

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down          # stop, keep data
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v       # stop and wipe the dev volume
```

## 4. Run tests

### Contract (OpenAPI)

```bash
npm run contracts:lint
```

### Unit + component (frontend)

```bash
npm run test -w @todo/web
```

Vitest is configured with a **≥70%** coverage gate for the web workspace (see `apps/web/vitest.config.ts`).

### Unit + integration (backend)

Integration tests need Postgres. The `test` profile spins up an ephemeral instance — do not run integration against your `dev` data.

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml up -d postgres
export DATABASE_URL="postgresql://todo:todo@localhost:5433/todo?schema=public"
npm exec --workspace=@todo/api -- prisma migrate deploy
npm run test -w @todo/api
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml down -v
```

(`DATABASE_URL` matches [docker/.env.test.example](../../docker/.env.test.example).)

### End-to-end (Playwright)

Journeys live in `tests/e2e/journeys/`. For full-stack runs, start the API (or use `scripts/run-e2e.sh`, which starts the API when `DATABASE_URL` is set), install browsers once, then:

```bash
npm exec --workspace=@todo/e2e -- playwright install --with-deps chromium   # first run only
export DATABASE_URL="postgresql://todo:todo@localhost:5433/todo?schema=public"
npm run e2e
```

`npm run e2e` forwards arguments to Playwright, for example:

```bash
npm run e2e -- --project=chromium-desktop
```

Each journey file maps 1:1 to a user story:

| Spec file                                            | User story | Spec acceptance scenarios covered |
| ---------------------------------------------------- | ---------- | --------------------------------- |
| `tests/e2e/journeys/us1.capture-revisit.spec.ts`     | US1 (P1)   | AC1–AC4                           |
| `tests/e2e/journeys/us2.complete-toggle.spec.ts`     | US2 (P2)   | AC1–AC4                           |
| `tests/e2e/journeys/us3.delete-undo.spec.ts`         | US3 (P2)   | AC1–AC4                           |
| `tests/e2e/journeys/us4.empty-loading-error.spec.ts` | US4 (P3)   | AC1–AC4                           |
| `tests/e2e/journeys/us5.responsive-a11y.spec.ts`     | US5 (P3)   | AC1–AC4 (axe-core scan included)  |

### Accessibility (axe-core)

Embedded inside the Playwright suite via `@axe-core/playwright`. CI fails on any **critical** or **serious** WCAG 2.1 AA finding on the primary screen (spec SC-005).

### Security checks

```bash
npm audit --omit=dev --audit-level=high
npm run lint
```

## 5. What "done" looks like for the MVP

A change is mergeable when **all** of the following pass in CI on the PR:

- `npm run format:check` and `npm run lint`
- `npm run typecheck`
- `npm run contracts:lint`
- `npm run test -w @todo/web` (coverage ≥70%)
- `npm run test -w @todo/api` (coverage ≥70%, Postgres service in CI)
- Playwright E2E (Chromium desktop project in CI; see workflow)
- `npm audit --omit=dev --audit-level=high`
- Docker image build smoke for `apps/api` and `apps/web`

Plus, per Principle V on every release:

- A11y manual review note in `docs/qa/`
- Security review note in `docs/qa/`
- `docs/ai-mcp-usage-log.md` updated for the change set
- README reflects any user-visible changes

## 6. Where things live

| Concern                              | Location                                             |
| ------------------------------------ | ---------------------------------------------------- |
| Wire types & zod schemas             | `packages/shared/src/`                               |
| API routes & error envelope          | `apps/api/src/routes/`, `apps/api/src/middleware/`   |
| Prisma schema & migrations           | `apps/api/prisma/`                                   |
| React components & React Query hooks | `apps/web/src/components/`, `apps/web/src/services/` |
| E2E journeys                         | `tests/e2e/journeys/`                                |
| Container assets                     | `docker/`                                            |
| BMAD artefacts                       | `specs/001-personal-todo-app/`                       |
| QA reports                           | `docs/qa/`                                           |
| AI / MCP usage log                   | `docs/ai-mcp-usage-log.md`                           |

## Troubleshooting

- **`api` healthcheck never goes green** — usually Postgres is not ready yet. `docker compose logs postgres` should show `database system is ready to accept connections`. The API's startup waits for this, then runs `prisma migrate deploy`.
- **Playwright cannot reach the app** — verify `docker compose` shows `web` and `api` healthy when using the full stack, and that `tests/e2e/playwright.config.ts` `baseURL` matches your profile.
- **Coverage gate failing in CI but not locally** — ensure you run the same `npm run test -w @todo/<workspace>` command as CI, with the same Vitest config.
