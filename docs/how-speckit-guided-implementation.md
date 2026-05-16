# How Spec Kit guided this implementation

This project satisfies the **same course activity** as the BMAD workflow, using **Spec Kit** commands and artefacts instead of persona agents.

## Step 1 — Specifications (BMAD: PM, Architect, stories, test strategy)

| BMAD activity                 | What we did with Spec Kit                                                                                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Refine PRD / project brief    | [specs/001-personal-todo-app/spec.md](../specs/001-personal-todo-app/spec.md) + [project-brief.md](../specs/001-personal-todo-app/project-brief.md)                                                                                      |
| Architecture                  | `/speckit-plan` → [plan.md](../specs/001-personal-todo-app/plan.md), [research.md](../specs/001-personal-todo-app/research.md), [data-model.md](../specs/001-personal-todo-app/data-model.md), [docs/architecture.md](./architecture.md) |
| API contracts                 | `contracts/openapi.yaml` + `npm run contracts:lint`                                                                                                                                                                                      |
| Stories + acceptance criteria | Five user stories in `spec.md`; phased work in [tasks.md](../specs/001-personal-todo-app/tasks.md) via `/speckit-tasks`                                                                                                                  |
| Test strategy                 | [test-strategy.md](../specs/001-personal-todo-app/test-strategy.md)                                                                                                                                                                      |
| Quality bar                   | [.specify/memory/constitution.md](../.specify/memory/constitution.md) v1.1.0                                                                                                                                                             |

Feature **002** (professional UI) repeated the same pipeline under `specs/002-professional-ui/`.

## Step 2 — Build with QA integrated

| Component     | Implementation                                       | QA integrated                               |
| ------------- | ---------------------------------------------------- | ------------------------------------------- |
| Project setup | npm workspaces, ESLint, Prettier, Vitest, Playwright | `npm run ci` from first phases; tasks T001+ |
| Backend       | Express + Prisma, zod, `/todos`, `/health`           | Unit + integration tests per route          |
| Frontend      | React + Vite + React Query                           | Component tests per story; jest-axe         |
| E2E           | `tests/e2e/journeys/*`                               | One journey file per US; axe in US5         |

Work followed **tasks.md** checkboxes (specify → plan → tasks → implement), equivalent to BMAD story-driven delivery.

## Step 3 — Docker Compose

- Multi-stage Dockerfiles: `apps/api/Dockerfile`, `apps/web/Dockerfile` (non-root runtime).
- Compose: [docker/docker-compose.yml](../docker/docker-compose.yml) (+ `docker-compose.dev.yml`, `docker-compose.test.yml`).
- Healthchecks on postgres, api, web; `/health` on API.
- Profiles via compose overrides and env files (`docker/.env.dev.example`).

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d
```

## Step 4 — QA activities

| QA task            | Evidence                                                                         |
| ------------------ | -------------------------------------------------------------------------------- |
| Test coverage ≥70% | Vitest thresholds; [docs/qa/coverage-report.md](./qa/coverage-report.md)         |
| Performance        | [docs/qa/performance-report.md](./qa/performance-report.md), `npm run perf`      |
| Accessibility      | axe Playwright + jest-axe; [docs/qa/mvp-a11y-review.md](./qa/mvp-a11y-review.md) |
| Security review    | [docs/qa/mvp-security-review.md](./qa/mvp-security-review.md)                    |

## AI throughout

Documented in [docs/ai-integration.md](./ai-integration.md) (course deliverable) and the append-only [docs/ai-mcp-usage-log.md](./ai-mcp-usage-log.md).

## Framework comparison

[docs/bmad-vs-speckit-comparison.md](./bmad-vs-speckit-comparison.md) — written for the assignment’s “Framework Comparison” section.
