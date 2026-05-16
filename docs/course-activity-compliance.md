# Course activity compliance — Spec-Driven Todo App

Maps the **AINE / BMAD-style activity requirements** to evidence in **this repository** (implemented with **Spec Kit**, not BMAD personas).

**Last reviewed**: 2026-05-16

---

## Success criteria (official table)

| Criterion              | Target                            | Status                   | Evidence                                                                                                                                                                                   |
| ---------------------- | --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phase 1–2 deliverables | Documented learnings              | **Met**                  | [how-speckit-guided-implementation.md](./how-speckit-guided-implementation.md), [bmad-vs-speckit-comparison.md](./bmad-vs-speckit-comparison.md), [ai-integration.md](./ai-integration.md) |
| Working application    | Full CRUD + undo + states         | **Met**                  | `apps/web`, `apps/api`; [quickstart](../specs/001-personal-todo-app/quickstart.md)                                                                                                         |
| Test coverage          | ≥70% meaningful                   | **Met**                  | Vitest thresholds; [qa/coverage-report.md](./qa/coverage-report.md); `npm run ci`                                                                                                          |
| E2E tests              | ≥5 Playwright passing             | **Met**                  | 8 journey specs under `tests/e2e/journeys/`; US1–US5 + smoke/perf/a11y                                                                                                                     |
| Docker deployment      | `docker compose up`               | **Met**                  | [docker/docker-compose.yml](../docker/docker-compose.yml)                                                                                                                                  |
| Accessibility          | Zero **critical** WCAG violations | **Met** (automated gate) | axe in US5 + `a11y-primary-screens.spec.ts`; jest-axe                                                                                                                                      |
| Documentation          | README + AI log                   | **Met**                  | [README.md](../README.md), [ai-integration.md](./ai-integration.md), [ai-mcp-usage-log.md](./ai-mcp-usage-log.md)                                                                          |

---

## Step 1 — Initialize and generate specifications

| Requirement         | Spec Kit / repo evidence                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Project brief & PRD | [project-brief.md](../specs/001-personal-todo-app/project-brief.md), [spec.md](../specs/001-personal-todo-app/spec.md)                                 |
| Architecture        | [plan.md](../specs/001-personal-todo-app/plan.md), [architecture.md](./architecture.md), [data-model.md](../specs/001-personal-todo-app/data-model.md) |
| Stories + AC        | US1–US5 in `spec.md`; tasks in [tasks.md](../specs/001-personal-todo-app/tasks.md)                                                                     |
| Test strategy       | [test-strategy.md](../specs/001-personal-todo-app/test-strategy.md)                                                                                    |

---

## Step 2 — Build with QA from day one

| Component                   | Status  | Evidence                                                        |
| --------------------------- | ------- | --------------------------------------------------------------- |
| Project setup + test infra  | **Met** | Vitest (web, api, shared), Playwright `@todo/e2e`, `npm run ci` |
| Backend + integration tests | **Met** | `apps/api/tests/`                                               |
| Frontend + component tests  | **Met** | `apps/web/tests/component/`, `apps/web/tests/a11y/`             |
| E2E all journeys            | **Met** | `us1`–`us5`, `us4` empty/loading/error                          |

---

## Step 3 — Docker Compose

| Task                                | Status  | Evidence                                                          |
| ----------------------------------- | ------- | ----------------------------------------------------------------- |
| Dockerfiles (multi-stage, non-root) | **Met** | `apps/api/Dockerfile`, `apps/web/Dockerfile`                      |
| docker-compose orchestration        | **Met** | `docker/docker-compose.yml` (+ dev/test overrides)                |
| Health checks                       | **Met** | Compose healthchecks + `GET /health`                              |
| dev/test profiles                   | **Met** | `docker-compose.dev.yml`, `docker-compose.test.yml`, env examples |

---

## Step 4 — QA activities

| QA task             | Status  | Evidence                                                                                          |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| Test coverage       | **Met** | [qa/coverage-report.md](./qa/coverage-report.md)                                                  |
| Performance testing | **Met** | [qa/performance-report.md](./qa/performance-report.md), `npm run perf`, `npm run perf:lighthouse` |
| Accessibility       | **Met** | [qa/mvp-a11y-review.md](./qa/mvp-a11y-review.md), `npm run a11y`, US5 axe                         |
| Security review     | **Met** | [qa/mvp-security-review.md](./qa/mvp-security-review.md), CI `npm audit`                          |

---

## Deliverables checklist

- [x] Specification artefacts (brief, architecture, stories, test strategy, OpenAPI)
- [x] Working Todo app (frontend + backend)
- [x] Unit, integration, E2E suites
- [x] Dockerfiles + docker-compose
- [x] QA reports (coverage, performance, accessibility, security)
- [x] How the framework guided implementation
- [x] AI integration documentation
- [x] Framework comparison (BMAD vs Spec Kit)

---

## Quick verification commands

```bash
npm ci
npm run verify              # ci + contracts + perf + a11y (no DB)
DATABASE_URL=postgresql://todo:todo@localhost:5433/todo?schema=public npm run verify:full
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d
```

Adjust `DATABASE_URL` to match your Postgres port (see [quickstart](../specs/001-personal-todo-app/quickstart.md)).
