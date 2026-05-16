# Personal Todo App (Spec Kit)

Full-stack TypeScript monorepo for a **personal todo** MVP: create, list, toggle completion, delete with brief undo, empty/loading/error states, and responsive accessible UI. Built with **Spec-Driven Development** (Spec Kit) to meet the course activity requirements (BMAD-equivalent artefacts, QA from day one, Docker deployment).

## Course / assignment deliverables

| Deliverable                              | Location                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Compliance matrix** (success criteria) | [docs/course-activity-compliance.md](docs/course-activity-compliance.md)                     |
| **How Spec Kit guided implementation**   | [docs/how-speckit-guided-implementation.md](docs/how-speckit-guided-implementation.md)       |
| **AI integration documentation**         | [docs/ai-integration.md](docs/ai-integration.md)                                             |
| **BMAD vs Spec Kit comparison**          | [docs/bmad-vs-speckit-comparison.md](docs/bmad-vs-speckit-comparison.md)                     |
| **Project brief (PRD)**                  | [specs/001-personal-todo-app/project-brief.md](specs/001-personal-todo-app/project-brief.md) |
| **Test strategy**                        | [specs/001-personal-todo-app/test-strategy.md](specs/001-personal-todo-app/test-strategy.md) |
| **QA reports**                           | [docs/qa/](docs/qa/) (coverage, performance, a11y, security)                                 |

## Quick start

```bash
npm ci
cp docker/.env.dev.example docker/.env.dev   # one-time
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d
# Open http://localhost:5173 when healthy
```

Full steps: [specs/001-personal-todo-app/quickstart.md](specs/001-personal-todo-app/quickstart.md)

## Spec Kit artefacts (feature 001)

- **Product spec**: [specs/001-personal-todo-app/spec.md](specs/001-personal-todo-app/spec.md)
- **Implementation plan**: [specs/001-personal-todo-app/plan.md](specs/001-personal-todo-app/plan.md)
- **REST contract**: [specs/001-personal-todo-app/contracts/openapi.yaml](specs/001-personal-todo-app/contracts/openapi.yaml)
- **Tasks** (implementation checklist): [specs/001-personal-todo-app/tasks.md](specs/001-personal-todo-app/tasks.md)
- **Architecture**: [docs/architecture.md](docs/architecture.md)
- **Constitution**: [.specify/memory/constitution.md](.specify/memory/constitution.md)

Optional UI epic: [specs/002-professional-ui/spec.md](specs/002-professional-ui/spec.md)

## Repository layout

| Area                  | Path                       |
| --------------------- | -------------------------- |
| React + Vite frontend | `apps/web/`                |
| Express + Prisma API  | `apps/api/`                |
| Shared types + zod    | `packages/shared/`         |
| Playwright E2E        | `tests/e2e/journeys/`      |
| Docker Compose        | `docker/`                  |
| QA reports            | `docs/qa/`                 |
| AI log (append-only)  | `docs/ai-mcp-usage-log.md` |

## Commands

```bash
npm run ci                 # format, lint, typecheck, Vitest + coverage (≥70%)
npm run contracts:lint     # OpenAPI validation
npm run e2e                # Playwright (set DATABASE_URL for full stack)
npm run perf               # SC-001/003/004 timing (mocked API)
npm run a11y               # jest-axe + Playwright axe (mocked)
npm run perf:lighthouse    # Lighthouse snapshot (dev on :5174)
npm run verify             # ci + contracts + perf + a11y
npm run verify:full        # verify + E2E (needs DATABASE_URL + Postgres)
```

Node **20 or 22** (npm workspaces: `@todo/web`, `@todo/api`, `@todo/shared`, `@todo/e2e`).

## Success criteria (summary)

| Criterion     | Target               | How we verify                         |
| ------------- | -------------------- | ------------------------------------- |
| Working app   | CRUD + undo + states | Manual + E2E US1–US4                  |
| Coverage      | ≥70%                 | `npm run ci`                          |
| E2E           | ≥5 journeys          | US1–US5 Playwright specs              |
| Docker        | compose up           | `docker/docker-compose.yml`           |
| Accessibility | 0 critical axe       | US5, `a11y-primary-screens`, jest-axe |

Details: [docs/course-activity-compliance.md](docs/course-activity-compliance.md)

## Contributing

Pull requests should link a user story (`US1`–`US5`) when story-scoped; see [`.github/pull_request_template.md`](.github/pull_request_template.md).
