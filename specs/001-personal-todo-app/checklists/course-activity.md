# Course activity checklist

**Purpose**: Confirm the repo meets the **Spec-Driven / BMAD-style course** deliverables.  
**Cross-reference**: [docs/course-activity-compliance.md](../../../docs/course-activity-compliance.md)

## Specifications (Step 1)

- [x] Project brief / PRD — [project-brief.md](../project-brief.md), [spec.md](../spec.md)
- [x] Architecture — [plan.md](../plan.md), [docs/architecture.md](../../../docs/architecture.md)
- [x] Stories with acceptance criteria — US1–US5 in [spec.md](../spec.md)
- [x] Test strategy — [test-strategy.md](../test-strategy.md)
- [x] API contract — [contracts/openapi.yaml](../contracts/openapi.yaml)

## Implementation + QA (Step 2)

- [x] Monorepo structure (web, api, shared, e2e)
- [x] Vitest unit/component tests
- [x] API integration tests (with `DATABASE_URL`)
- [x] ≥5 Playwright E2E journeys (US1–US5)
- [x] CRUD + undo + empty/loading/error UI

## Docker (Step 3)

- [x] Multi-stage Dockerfiles, non-root
- [x] docker-compose with postgres + api + web
- [x] Healthchecks and `/health`
- [x] dev/test compose profiles

## QA reports (Step 4)

- [x] Coverage — [docs/qa/coverage-report.md](../../../docs/qa/coverage-report.md)
- [x] Performance — [docs/qa/performance-report.md](../../../docs/qa/performance-report.md)
- [x] Accessibility — [docs/qa/mvp-a11y-review.md](../../../docs/qa/mvp-a11y-review.md), automated axe
- [x] Security — [docs/qa/mvp-security-review.md](../../../docs/qa/mvp-security-review.md)

## Documentation deliverables

- [x] README with setup — [README.md](../../../README.md)
- [x] AI integration doc — [docs/ai-integration.md](../../../docs/ai-integration.md)
- [x] AI session log — [docs/ai-mcp-usage-log.md](../../../docs/ai-mcp-usage-log.md)
- [x] How Spec Kit guided work — [docs/how-speckit-guided-implementation.md](../../../docs/how-speckit-guided-implementation.md)
- [x] BMAD vs Spec Kit comparison — [docs/bmad-vs-speckit-comparison.md](../../../docs/bmad-vs-speckit-comparison.md)

**Result**: All items checked for submission readiness (re-verify with `npm run verify` / `verify:full` before hand-in).
