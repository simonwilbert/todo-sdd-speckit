# Test coverage report

**Feature**: 001-personal-todo-app  
**Policy**: Constitution v1.1.0 / SC-007 — **≥70%** meaningful coverage (statements & lines per workspace).

## How to reproduce

```bash
npm ci
# or separately:
npm run test -w @todo/web
npm run test -w @todo/api
npm run test -w @todo/shared
```

Vitest configs: `apps/web/vitest.config.ts`, `apps/api/vitest.config.ts` (thresholds enforced on `npm run test` with `--coverage`).

## Expected outcome (healthy run)

| Workspace      | Typical gate          | Notes                                                            |
| -------------- | --------------------- | ---------------------------------------------------------------- |
| `@todo/web`    | ≥70% lines/statements | Component + a11y tests; `main.tsx` excluded                      |
| `@todo/api`    | ≥70% lines/statements | Unit tests always; integration when `DATABASE_URL` + Postgres up |
| `@todo/shared` | 100% on zod schemas   | Small package                                                    |

**Last captured (2026-05-16, local `npm run ci` web slice):** web ~**82%** statements after a11y tests added; api ~**90%** when integration skipped or passing.

Integration tests require a reachable database. If `DATABASE_URL` points at a stopped server, Vitest may report failed suites — unset `DATABASE_URL` or start Postgres per [quickstart](../../specs/001-personal-todo-app/quickstart.md).

## Gaps (known, non-blocking MVP)

- `apps/web/src/services/apiClient.ts` — error branches partially covered (E2E/integration exercise happy paths).
- `apps/api` PUT/replace paths — covered by integration tests when DB available.

## Relation to other QA artefacts

- E2E count and mapping: [test-strategy.md](../../specs/001-personal-todo-app/test-strategy.md)
- Overall QA summary: [mvp-qa-report.md](./mvp-qa-report.md)
- Course compliance: [course-activity-compliance.md](../course-activity-compliance.md)
