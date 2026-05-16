# Test strategy — Personal Todo App

**Feature**: 001-personal-todo-app  
**Aligns with**: Constitution v1.1.0 Principle II; course activity “Test Strategy” and QA-from-day-one.

## Goals

- Every user story (US1–US5) is **independently testable**.
- Every acceptance criterion in [spec.md](./spec.md) maps to **at least one automated test**.
- Gates run in **CI** and locally via `npm run ci`, `npm run e2e`, `npm run verify`.

## Test layers

| Layer           | Tooling                       | Location                                            | What it proves                           |
| --------------- | ----------------------------- | --------------------------------------------------- | ---------------------------------------- |
| **Unit**        | Vitest                        | `apps/api/tests/unit/`, `packages/shared/tests/`    | Validation, middleware, serializers      |
| **Component**   | Vitest + Testing Library      | `apps/web/tests/component/`, `apps/web/tests/a11y/` | UI behaviour, labels, jest-axe           |
| **Integration** | Vitest + Supertest + Postgres | `apps/api/tests/integration/`                       | Real HTTP + DB (when `DATABASE_URL` set) |
| **E2E**         | Playwright                    | `tests/e2e/journeys/`                               | Full journeys per story + perf + a11y    |
| **Contract**    | swagger-parser                | `npm run contracts:lint`                            | OpenAPI valid                            |

## E2E journeys (≥5 required — SC-006)

| Spec file                         | Story          | Scenarios                               |
| --------------------------------- | -------------- | --------------------------------------- |
| `us1.capture-revisit.spec.ts`     | US1            | Create, reload, persistence             |
| `us2.complete-toggle.spec.ts`     | US2            | Toggle complete, reload                 |
| `us3.delete-undo.spec.ts`         | US3            | Delete, undo, expire                    |
| `us4.empty-loading-error.spec.ts` | US4            | Empty, loading, error/retry             |
| `us5.responsive-a11y.spec.ts`     | US5            | Viewports, touch targets, keyboard, axe |
| `performance.spec.ts`             | SC-001/003/004 | Timing budgets (mocked API)             |
| `a11y-primary-screens.spec.ts`    | SC-005         | axe on primary screens (mocked API)     |
| `smoke.spec.ts`                   | Smoke          | Home renders                            |

## Accessibility (SC-005)

- **Automated**: `@axe-core/playwright` (US5, `a11y-primary-screens.spec.ts`); **jest-axe** on shell and key components.
- **Manual**: [docs/qa/mvp-a11y-review.md](../../docs/qa/mvp-a11y-review.md).
- **Advisory**: `npm run perf:lighthouse` (accessibility category).

## Performance (SC-001, SC-003, SC-004)

- **Automated**: `tests/e2e/journeys/performance.spec.ts` with budgets in `tests/e2e/helpers/performance.ts`.
- **Advisory**: Lighthouse via `npm run perf:lighthouse`; results in [docs/qa/performance-report.md](../../docs/qa/performance-report.md).

## Coverage (SC-007)

- **Threshold**: ≥70% statements/lines per workspace (`apps/web`, `apps/api` vitest configs).
- **Report**: [docs/qa/coverage-report.md](../../docs/qa/coverage-report.md); produced by `npm run ci`.

## Security

- Automated: zod strict schemas, Prisma parameterisation, security headers middleware, `npm audit` in CI.
- Documented: [docs/qa/mvp-security-review.md](../../docs/qa/mvp-security-review.md).

## When to run what

```bash
npm run ci                    # format, lint, typecheck, Vitest+coverage
npm run contracts:lint
npm run test:a11y -w @todo/web
npm run perf                  # timing (no DB)
npm run a11y                  # jest-axe + mocked axe E2E
DATABASE_URL=… npm run e2e    # full journeys + US5 with DB
npm run verify                # ci + contracts + perf + a11y (see package.json)
npm run verify:full           # verify + e2e (needs DB + Playwright)
```

## Traceability

Task IDs in [tasks.md](./tasks.md) reference user stories (US1–US5) and constitution gates. PR template links story scope to changes.
