# Performance & accessibility automation report

**Last updated**: 2026-05-16  
**Spec reference**: [001 SC-001, SC-003, SC-004, SC-005](../../specs/001-personal-todo-app/spec.md)

## Commands

| Goal                          | Command                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| Timing budgets (Playwright)   | `npm run perf`                                                       |
| Component + mocked-screen axe | `npm run a11y`                                                       |
| Lighthouse (advisory)         | `npm run perf:lighthouse` (dev server on :5174)                      |
| Full US5 (DB + responsive)    | `DATABASE_URL=… npm run e2e -- journeys/us5.responsive-a11y.spec.ts` |

## Playwright timing (mocked API, 2026-05-16)

Mobile viewport (390×844), `chromium-desktop` project, budgets from `tests/e2e/helpers/performance.ts`.

| Criterion                  | Budget (local / CI) | Measured        |
| -------------------------- | ------------------- | --------------- |
| SC-004 Primary interactive | 2 s / 4 s           | ~0.8 s **Pass** |
| SC-001 Capture task        | 5 s / 8 s           | ~1.0 s **Pass** |
| SC-003 Toggle feedback     | 1 s / 2 s           | ~0.9 s **Pass** |

## Lighthouse (dev server, 2026-05-16)

**URL**: http://127.0.0.1:5174/ — raw: [lighthouse-latest.json](./lighthouse-latest.json)

| Category      | Score (0–100) |
| ------------- | ------------- |
| Performance   | 59            |
| Accessibility | 100           |

Lighthouse performance on **Vite dev** is not representative of production; use Playwright budgets for gates.

## Component axe (jest-axe, 2026-05-16)

| Surface                | File                                      | Result |
| ---------------------- | ----------------------------------------- | ------ |
| App shell (empty list) | `apps/web/tests/a11y/shell.a11y.test.tsx` | Pass   |
| TodoCreateForm         | same                                      | Pass   |
| TodoItem               | same                                      | Pass   |

## Playwright axe (mocked API, 2026-05-16)

`a11y-primary-screens.spec.ts` — empty home and home with one task: **zero critical/serious** violations.

## Notes

- See [mvp-a11y-review.md](./mvp-a11y-review.md) for manual WCAG follow-up.
- Re-capture Lighthouse: `npm run perf:lighthouse`
