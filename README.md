# Personal Todo App (Spec Kit)

Full-stack TypeScript monorepo for a **personal todo** MVP: create, list, toggle completion, delete with brief undo, empty/loading/error states, and responsive accessible UI. The feature is specified and tracked under BMAD-style artefacts in `specs/001-personal-todo-app/`.

## Quick links

- **Clone → run → test**: [specs/001-personal-todo-app/quickstart.md](specs/001-personal-todo-app/quickstart.md)
- **Product spec**: [specs/001-personal-todo-app/spec.md](specs/001-personal-todo-app/spec.md)
- **Implementation plan**: [specs/001-personal-todo-app/plan.md](specs/001-personal-todo-app/plan.md)
- **REST contract (OpenAPI 3.1)**: [specs/001-personal-todo-app/contracts/openapi.yaml](specs/001-personal-todo-app/contracts/openapi.yaml)
- **Data model**: [specs/001-personal-todo-app/data-model.md](specs/001-personal-todo-app/data-model.md)
- **Research / decisions**: [specs/001-personal-todo-app/research.md](specs/001-personal-todo-app/research.md)
- **Architecture (mirrored from plan)**: [docs/architecture.md](docs/architecture.md)
- **Constitution (quality gates)**: [.specify/memory/constitution.md](.specify/memory/constitution.md)
- **Professional UI epic (002)**: [specs/002-professional-ui/spec.md](specs/002-professional-ui/spec.md)
- **BMAD vs Spec Kit (comparison brief)**: [docs/bmad-vs-speckit-comparison.md](docs/bmad-vs-speckit-comparison.md)

## Repository layout

| Area                             | Path                       |
| -------------------------------- | -------------------------- |
| React + Vite frontend            | `apps/web/`                |
| Express + Prisma API             | `apps/api/`                |
| Shared types + zod wire schemas  | `packages/shared/`         |
| Playwright E2E journeys          | `tests/e2e/journeys/`      |
| Docker Compose (dev / test)      | `docker/`                  |
| QA and release notes             | `docs/qa/`                 |
| AI / MCP usage log (append-only) | `docs/ai-mcp-usage-log.md` |

## Common commands

```bash
npm ci
npm run ci                 # format, lint, typecheck, all workspace tests
npm run contracts:lint     # validate OpenAPI contract file
npm run e2e                # Playwright (see quickstart for DATABASE_URL / stack)
npm run perf               # Playwright timing budgets (SC-001, SC-003, SC-004)
npm run a11y               # jest-axe (web) + Playwright axe (mocked API)
npm run perf:lighthouse    # Lighthouse snapshot (dev server on :5174)
```

This repository uses **npm workspaces** (`@todo/web`, `@todo/api`, `@todo/shared`, `@todo/e2e`). Node **20 or 22** is supported per CI.

## Contributing

Pull requests should link a user story (`US1`–`US5`) when they deliver story-scoped behaviour, and satisfy the checklist in [`.github/pull_request_template.md`](.github/pull_request_template.md).
