## Summary

What does this PR change and why?

## User story

Link the primary story this work satisfies (delete unused lines):

- [ ] US1 — Capture and revisit tasks
- [ ] US2 — Mark complete / incomplete
- [ ] US3 — Delete with brief undo
- [ ] US4 — Empty, loading, error states
- [ ] US5 — Responsive + accessible
- [ ] Phase 8 / cross-cutting (docs, contract, infra)

**Story ID(s):** <!-- e.g. US2 -->

## Constitution gates (self-check)

- [ ] `npm run ci` passes locally (format, lint, typecheck, workspace tests with coverage ≥70% where configured)
- [ ] API integration tests that need Postgres were run with `DATABASE_URL` set (or rely on CI)
- [ ] Playwright journeys touched by this change were run where applicable (`npm run e2e` with stack / env per [quickstart](specs/001-personal-todo-app/quickstart.md))
- [ ] No new high/critical `npm audit --omit=dev` issues for production dependencies
- [ ] User-visible behaviour reflected in README or [quickstart](specs/001-personal-todo-app/quickstart.md) when commands or URLs change
- [ ] OpenAPI contract updated in lockstep with API behaviour (`npm run contracts:lint`)

## Notes for reviewers

<!-- risks, follow-ups, screenshots -->
