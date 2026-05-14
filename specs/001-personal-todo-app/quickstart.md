# Quickstart: Personal Todo App

**Feature**: 001-personal-todo-app
**Plan**: [plan.md](./plan.md)

This is the one-page "clone → up → test" walkthrough for the MVP. It is
written for someone who has Docker + `pnpm` installed and nothing else.
Anything not described here belongs in the (future) top-level `README.md`.

## Prerequisites

- Docker Desktop or compatible (Compose v2)
- Node.js 22 LTS
- `pnpm` (`corepack enable && corepack prepare pnpm@latest --activate`)

## 1. Clone and install

```bash
git clone <repo-url> todo-sdd-speckit
cd todo-sdd-speckit
pnpm install
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

All three declare healthchecks. Wait until `docker compose ps` reports all
three as `healthy` — typically 10–30 s on first start (Postgres warms its
data dir).

Then open: <http://localhost:5173>

The API is reachable on <http://localhost:3000>. `GET /health` should
return `{"status":"ok","version":"..."}`.

## 3. Stop / reset

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down          # stop, keep data
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down -v       # stop and wipe the dev volume
```

## 4. Run tests

### Unit + component (frontend)

```bash
pnpm --filter @app/web test           # watch mode
pnpm --filter @app/web test --run     # one-shot, used by CI
pnpm --filter @app/web coverage       # produces lcov; must be ≥70%
```

### Unit + integration (backend)

Integration tests need a Postgres. The `test` profile spins up an
ephemeral one — do not run integration against your `dev` data.

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml up -d postgres
pnpm --filter @app/api test --run
pnpm --filter @app/api coverage
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml down -v
```

### End-to-end (Playwright)

Drives the full `test`-profile stack. There must be ≥5 journey specs and all
must pass on `main` (Principle II gate).

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml up -d --wait
pnpm playwright install --with-deps    # first run only
pnpm --filter @app/e2e test            # runs every journey
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml down -v
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

Embedded inside the Playwright suite via `@axe-core/playwright`. CI fails on
any critical or serious WCAG 2.1 AA finding on the primary screen
(spec SC-005).

### Security checks

```bash
pnpm audit --prod              # dependency vulnerability scan; CI gating
pnpm -r run lint               # ESLint with security-relevant rules
```

## 5. What "done" looks like for the MVP

A change is mergeable when **all** of the following pass in CI on the PR:

- `pnpm -r run lint`
- `pnpm -r run typecheck` (`tsc --noEmit`)
- `pnpm --filter @app/web test --run` (with coverage ≥70%)
- `pnpm --filter @app/api test --run` (with coverage ≥70%)
- Playwright E2E across all 5+ journey specs
- `pnpm audit --prod` (no high / critical advisories)
- `docker compose up --wait` succeeds end-to-end (all healthchecks green)

Plus, per Principle V on every release:

- A11y manual review note added to `docs/qa/` for the release.
- Security review note added to `docs/qa/` for the release.
- `docs/ai-mcp-usage-log.md` updated for the change set.
- README (top-level) reflects any user-visible changes.

## 6. Where things live

| Concern                              | Location                                                                                                                                                  |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wire types & zod schemas             | `packages/shared/src/`                                                                                                                                    |
| API routes & error envelope          | `apps/api/src/routes/`, `apps/api/src/middleware/`                                                                                                        |
| Prisma schema & migrations           | `apps/api/prisma/`                                                                                                                                        |
| React components & React Query hooks | `apps/web/src/components/`, `apps/web/src/services/`                                                                                                      |
| E2E journeys                         | `tests/e2e/journeys/`                                                                                                                                     |
| Container assets                     | `docker/`                                                                                                                                                 |
| BMAD artefacts                       | `specs/001-personal-todo-app/` (spec, plan, research, data-model, contracts, quickstart, checklists) and `docs/architecture.md` (mirrored from `plan.md`) |
| QA reports                           | `docs/qa/`                                                                                                                                                |
| AI / MCP usage log                   | `docs/ai-mcp-usage-log.md`                                                                                                                                |

## Troubleshooting

- **`api` healthcheck never goes green** — usually Postgres isn't ready yet.
  `docker compose logs postgres` should show `database system is ready to
accept connections`. The API's startup waits for this, then runs
  `prisma migrate deploy`.
- **Playwright cannot reach the app** — verify
  `docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml ps`
  shows `web` and `api` healthy, and that `tests/e2e/playwright.config.ts`
  is pointing at the right `baseURL` for the profile in use.
- **Coverage gate failing in CI but not locally** — ensure you ran
  `pnpm --filter @app/<name> coverage` (not just `test --run`), and that
  the same Vitest config is used in both environments.
