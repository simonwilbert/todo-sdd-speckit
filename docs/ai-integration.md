# AI integration documentation

**Course deliverable** — Phase 3 / AI Integration Documentation  
**Project**: Personal Todo App (`todo-sdd-speckit`)  
**Framework used**: Spec Kit (spec-driven) with Cursor AI assistance  
**Safety**: Do not paste secrets, tokens, or real credentials into prompts or this log.

---

## Agent usage

| Area                | AI role                                                               | Human role                                          |
| ------------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| Constitution & spec | Drafted/refined `spec.md`, plan, research, OpenAPI from product goals | Approved scope, FRs, success criteria               |
| Task breakdown      | Generated `tasks.md` phases T001–T078 (001) and T001–T012 (002)       | Reordered, marked done, rejected scope creep        |
| Backend             | Routes, Prisma service, zod middleware, integration test scaffolding  | Reviewed error envelopes, migration strategy        |
| Frontend            | Components, React Query hooks, layout/CSS, a11y patterns              | UX copy, focus behaviour, edit flow                 |
| E2E                 | Playwright journeys, route mocks, axe helpers                         | Fixed flaky timing, port 5174 for Playwright vs dev |
| Docker / CI         | Compose healthchecks, GitHub Actions workflow                         | Port/env alignment, audit policy                    |
| QA docs             | Performance/a11y report templates, security review draft              | Verified against actual `npm run ci` / `e2e`        |

**Prompts that worked well**

- “Implement the next unchecked task in `tasks.md` for USn.”
- “Keep constitution gates: coverage, 5 E2E journeys, axe critical/serious = 0.”
- “Match existing code style; no drive-by refactors.”
- “Fix Playwright failures; use `page.route` for `/todos` when mocking.”

**Prompts that worked poorly**

- Vague “make it better” without pointing at `spec.md` or a task ID.
- Asking for large rewrites without updating `spec.md` / `tasks.md` first.

---

## MCP server usage

| Tool                                 | Used?    | How it helped                                       |
| ------------------------------------ | -------- | --------------------------------------------------- |
| **Cursor IDE / built-in agent**      | Yes      | Primary implementation and test authoring           |
| **Postman MCP**                      | No       | API validated via Vitest + Supertest + OpenAPI lint |
| **Chrome DevTools MCP**              | Optional | Manual debugging only; not in CI                    |
| **Playwright (incl. axe)**           | Yes      | E2E and accessibility gates in `tests/e2e/`         |
| **Browser MCP (cursor-ide-browser)** | Optional | Exploratory UI checks during UI polish              |

Contracts are checked with **`npm run contracts:lint`** and integration tests, not Postman MCP.

---

## Test generation

| Area                 | AI contribution                                             | Gaps / human follow-up                                                            |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| API unit/integration | Mocked Prisma smoke tests; Supertest flows for US1–US3, PUT | Integration needs live Postgres; skip when DB down                                |
| Web component        | US1–US5 component tests; Professional UI tests              | Coverage of `apiClient` branches still thin                                       |
| jest-axe             | Shell, form, item a11y tests                                | jsdom ≠ real browser; E2E axe still required                                      |
| Playwright           | All story journeys + perf + mocked a11y                     | Delete flow vs two-step confirm (BMAD lesson); route mocks for `/todos/:id` PATCH |
| Performance budgets  | `performance.spec.ts` from SC-001/003/004 in spec           | Lighthouse on dev server is advisory only                                         |

**Example AI miss (fixed by human):** E2E assumed one-click delete after UI added confirm step (noted in BMAD comparison doc).

---

## Debugging with AI

| Issue                               | AI help                                                  | Resolution                                          |
| ----------------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| Playwright stale Vite bundle        | Diagnosed `reuseExistingServer` / port clash             | Dedicated port **5174** for E2E webServer           |
| US4 timeouts with fetch mock        | Suggested `page.route` instead of `fetch` stub           | Reliable with Vite proxy                            |
| Focus after create while `disabled` | Refactor to `TodoCreateForm` ref + `isSubmitting` effect | Reliable focus on new-task field                    |
| `jest-axe` + Vitest types           | `@types/jest-axe`, `expect.extend` in `vitest.setup.ts`  | `npm run ci` typecheck green                        |
| Integration tests when DB down      | Documented `DATABASE_URL` requirement                    | Use `env -u DATABASE_URL` locally or start Postgres |

---

## Limitations encountered

- **Framework quirks**: Next/Turbopack N/A here; Vite HMR and Playwright port conflicts need human env discipline.
- **Spec drift**: UI features (e.g. inline edit) need spec/task updates or they fall outside traceability.
- **Performance on CI**: Timing budgets use relaxed limits in CI; Lighthouse on dev ≠ production.
- **Full WCAG AA**: Automated gate is **critical/serious axe**; manual review still recommended ([mvp-a11y-review.md](./qa/mvp-a11y-review.md)).
- **Subjective course comparison**: BMAD integration log vs Spec Kit short log — expanded in [bmad-vs-speckit-comparison.md](./bmad-vs-speckit-comparison.md).

**Where human expertise was critical**

- Choosing stack and constitution gates.
- Signing off QA reports and security residual risk.
- Course narrative (BMAD vs Spec Kit) and honest comparison writing.

---

## Session log (append-only summary)

Detailed dated rows: [docs/ai-mcp-usage-log.md](./ai-mcp-usage-log.md).

---

## Related artefacts

- [how-speckit-guided-implementation.md](./how-speckit-guided-implementation.md)
- [course-activity-compliance.md](./course-activity-compliance.md)
- [bmad-vs-speckit-comparison.md](./bmad-vs-speckit-comparison.md)
