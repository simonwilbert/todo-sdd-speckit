# MVP QA summary (001-personal-todo-app)

**Date**: 2026-05-14  
**Scope**: Release-candidate verification after Phases 1–8 per [tasks.md](../../specs/001-personal-todo-app/tasks.md).

## Commands run (local / CI parity)

| Step                   | Command                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| Install                | `npm ci`                                                                    |
| Aggregate quality gate | `npm run ci` (Prettier, ESLint, `tsc`, Vitest in all workspaces with tests) |
| OpenAPI                | `npm run contracts:lint`                                                    |
| Prod-deps audit        | `npm audit --omit=dev --audit-level=high`                                   |

## Coverage

Vitest enforces **≥70%** global thresholds for `@todo/web` and `@todo/api` (see each app’s `vitest.config.ts`). `npm run ci` must pass for merge.

## Playwright journeys (≥5)

All specs under `tests/e2e/journeys/`:

1. `us1.capture-revisit.spec.ts` — US1
2. `us2.complete-toggle.spec.ts` — US2
3. `us3.delete-undo.spec.ts` — US3
4. `us4.empty-loading-error.spec.ts` — US4
5. `us5.responsive-a11y.spec.ts` — US5 (includes axe critical/serious gate)
6. `performance.spec.ts` — SC-001 / SC-003 / SC-004 timing (mocked API)
7. `a11y-primary-screens.spec.ts` — SC-005 axe on primary screens (mocked API)

## Performance & accessibility automation

See [performance-report.md](./performance-report.md). Root scripts: `npm run perf`, `npm run a11y`, `npm run perf:lighthouse`.

CI currently runs `npm run e2e -- --project=chromium-desktop` for speed; mobile project runs locally or when invoked explicitly.

## Result

- **Audit (production deps)**: `0` high/critical findings at time of report (`npm audit --omit=dev --audit-level=high`).
- **Contract**: `npm run contracts:lint` validates `specs/001-personal-todo-app/contracts/openapi.yaml` structurally.

## Release candidate (T078)

- **`npm run ci`**: Passed on the machine that produced this report (2026-05-14).
- **`test` profile Postgres**: `docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml up -d postgres` with `DATABASE_URL=postgresql://todo:todo@localhost:5433/todo?schema=public`, then `prisma migrate deploy` and `PUT /todos/:id` integration tests — all green.
- **Git tag**: After committing Phase 8, create an annotated tag on that commit, for example:  
  `git tag -a v0.1.0-rc.1 -m "Release candidate: Personal Todo App MVP (001)"`  
  then `git push origin v0.1.0-rc.1` if your process publishes tags.

## Course activity alignment

Full mapping to assignment steps and success criteria: [course-activity-compliance.md](../course-activity-compliance.md).

| QA deliverable | Report                                             |
| -------------- | -------------------------------------------------- |
| Coverage       | [coverage-report.md](./coverage-report.md)         |
| Performance    | [performance-report.md](./performance-report.md)   |
| Accessibility  | [mvp-a11y-review.md](./mvp-a11y-review.md)         |
| Security       | [mvp-security-review.md](./mvp-security-review.md) |
| AI integration | [ai-integration.md](../ai-integration.md)          |

**Verify locally**: `npm run verify` (no DB) · `npm run verify:full` (with `DATABASE_URL` + E2E).

## Follow-ups

- Optionally extend CI to run `chromium-mobile` for US5 viewport coverage on every PR (trade-off: runtime).
- Run `npm run verify:full` before submission if graders require full E2E with database.
