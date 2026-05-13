<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - II. Testable by Design -> II. Testable by Design (QA from Day One, NON-NEGOTIABLE)
    (expanded: mandatory unit/integration/E2E, >=70% meaningful coverage, >=5 Playwright journeys)
  - III. Small, Traceable Changes -> III. Small, Traceable, PRD-Linked Changes
    (clarified: traceability anchored to PRD via BMAD stories/acceptance criteria)
  - V. Clarity, Simplicity, and Security -> V. Clarity, Simplicity, Security, and Accessibility
    (expanded: WCAG 2.1 AA, per-release security review, README + AI/MCP usage log)
- Added principles:
  - VI. Containerized and Deployable by Default
- Modified sections:
  - Engineering Constraints (added: BMAD artifact set, a11y/security tooling in CI,
    container reproducibility, environment profiles, AI/MCP usage log)
  - Workflow and Quality Gates (added: QA, a11y, security, container-health,
    coverage, Playwright gates; new release gate)
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/tasks-template.md (flipped Tests note from OPTIONAL to
    MANDATORY under this constitution)
  - ⚠ .specify/templates/plan-template.md (Constitution Check section to enumerate
    new gates: coverage >=70%, Playwright >=5, WCAG AA, security review,
    container healthchecks - filled per-feature by /speckit-plan)
  - ⚠ .specify/templates/spec-template.md (add explicit a11y + security + QA
    acceptance hooks per Principle V - to be applied at next /speckit-specify)
  - ✅ .specify/templates/commands/*.md (directory not present; no updates required)
- Runtime guidance:
  - ⚠ README.md (does not exist; Principle V mandates a project README)
- Follow-up TODOs:
  - TODO(README): create top-level README aligned with Principle V and the
    Workflow / Release gates.
  - TODO(AI_MCP_LOG): establish a versioned location and format for the AI/MCP
    usage log (suggested: docs/ai-mcp-usage-log.md, append-only per change set).
-->

# Todo SDD Speckit Constitution

## Core Principles

### I. Spec-First Delivery (BMAD-Anchored)
All non-trivial work MUST be derived from a written Product Requirements Document
(PRD) and the resulting BMAD artifacts: PRD, architecture document, API contracts,
and user stories with explicit acceptance criteria. Implementation MUST NOT begin
until the relevant specification, architecture, and contract artifacts are agreed
and version-controlled. Rationale: anchoring all work to the PRD creates a single
source of truth and a durable audit trail from intent to delivery.

### II. Testable by Design (QA from Day One, NON-NEGOTIABLE)
Quality assurance MUST begin in the first delivery increment, not at the end.
Every feature MUST include automated unit, integration, and end-to-end (E2E) tests
prior to merge. The repository MUST sustain **at least 70% meaningful test
coverage** (lines and branches; trivial accessors may be excluded with documented
rationale) and **at least 5 Playwright user-journey tests** covering the
highest-priority user stories. Tests MUST be written and observed to FAIL before
implementation where TDD applies, and every acceptance criterion from a BMAD story
MUST map to at least one automated test. Rationale: QA from day one prevents
quality debt and keeps every increment demonstrably correct.

### III. Small, Traceable, PRD-Linked Changes
Work MUST be broken into small, reviewable increments, each linked back to a
specific BMAD story and acceptance criterion. Each increment MUST leave the system
in a working, deployable state and MUST NOT bundle unrelated refactors. Commits,
pull requests, and tasks MUST reference the story they implement. Rationale:
traceability from PRD → story → task → commit → test enables effective review,
safe rollback, and reliable incremental delivery.

### IV. Reliable Automation and Checks
Automated lint, type checks, unit tests, integration tests, E2E tests, accessibility
checks, security scans, and container builds MUST pass before a change is
considered complete. When automation is missing for a required check, the gap MUST
be recorded as a follow-up task in the same planning cycle and remediated within
the next increment. Rationale: automation is the only scalable way to enforce the
other principles as the codebase grows.

### V. Clarity, Simplicity, Security, and Accessibility
Solutions MUST prefer the simplest design that satisfies the PRD, use clear
naming, and avoid speculative complexity. Every release MUST satisfy:

- **Accessibility**: WCAG 2.1 Level AA for all user-facing UI, verified by
  automated tooling on every CI run and by at least one documented manual review
  per release.
- **Security**: a documented per-release security review covering authentication,
  authorization, input validation, dependency vulnerabilities, secret handling,
  and transport security. No hardcoded secrets; sensitive configuration MUST live
  in environment configuration only.
- **Documentation**: BMAD artifacts (PRD, architecture, API contracts, stories),
  QA reports, a project README, and an AI/MCP usage log MUST be kept current and
  version-controlled alongside the code.

Rationale: clarity, security, accessibility, and honest documentation of AI
assistance are baseline expectations, not optional polish.

### VI. Containerized and Deployable by Default
The application MUST be runnable end-to-end via container tooling from a clean
checkout. Specifically:

- A `Dockerfile` MUST exist for every long-running service.
- A top-level `docker-compose.yml` (or equivalent) MUST orchestrate the full
  stack for local development and for CI.
- Every service container MUST declare a healthcheck, and CI MUST verify those
  healthchecks pass.
- Environment-specific configuration MUST be expressed as **environment
  profiles** (e.g., `dev`, `test`, `prod`) selected via environment variables,
  never via code branching on hostnames or ad-hoc detection.
- The deployable artifact MUST be produced by CI from the same Dockerfiles used
  locally; promotion from developer machines is not a delivery path.

Rationale: "works on my machine" is not a delivery state. Containerization with
healthchecks and explicit profiles makes deployability a property of the
repository, not of any individual environment.

## Engineering Constraints

- The repository MUST contain BMAD artifacts at minimum: PRD, architecture
  document, API contracts (e.g., OpenAPI or equivalent), and stories with
  acceptance criteria.
- Planning artifacts MUST capture language/runtime, dependencies, constraints,
  and performance expectations before implementation.
- Code changes MUST align to the project structure documented in the
  implementation plan.
- New dependencies MUST be justified by concrete feature needs, expected
  lifecycle, license compatibility, and a security / maintenance posture review.
- Sensitive configuration MUST be externalized from source code and managed via
  environment profiles and a secret store appropriate to the deployment target.
- Accessibility tooling (e.g., axe-core, Lighthouse, or equivalent) and security
  tooling (e.g., dependency vulnerability scanner, SAST) MUST be wired into CI
  and gate merges.
- Container images MUST be reproducible, pinned to specific base-image digests
  where practical, and rebuilt by CI rather than promoted from developer
  machines.
- An AI/MCP usage log MUST record, per change set: which AI assistants and MCP
  servers contributed, the high-level intent given to them, and a human
  reviewer.

## Workflow and Quality Gates

- **Specification gate**: PRD and BMAD stories exist, are independently testable,
  and are prioritized; architecture and API contracts are explicit and
  version-controlled.
- **Plan gate**: Constitution checks for this project are explicitly listed and
  resolved, including the coverage, Playwright, accessibility, security, and
  containerization gates below.
- **Tasks gate**: Work is grouped by BMAD story to allow independent delivery;
  unit, integration, and E2E test tasks and accessibility / security tasks are
  present and not deferred to a final phase.
- **Implementation gate**: Lint, type checks, unit tests, integration tests, E2E
  tests, accessibility checks, dependency security scan, and container build all
  pass; coverage is at least **70%**; at least **5 Playwright** journeys are
  green; container healthchecks pass under docker-compose.
- **Review gate**: Pull requests explain the "why", link back to the BMAD story,
  enumerate risks, attach validation evidence (test output, a11y / security
  report summaries), and confirm the AI/MCP usage log is updated.
- **Release gate**: README, BMAD artifacts, QA report, accessibility report,
  security review, and AI/MCP usage log are present and current for the release.

## Governance

This constitution takes precedence over local conventions when they conflict.
Amendments MUST include: (1) a written rationale, (2) impacted template / process
updates, and (3) a version bump based on the semantic versioning policy below.

Versioning policy:

- MAJOR: Removal or incompatible redefinition of a principle or governance rule.
- MINOR: New principle / section or materially expanded guidance.
- PATCH: Wording clarifications that do not change expected behavior.

Compliance review expectations:

- Every planning cycle MUST include a constitution check.
- Every implementation cycle MUST verify applicable principle compliance in
  review.
- Every release MUST include the artifacts required by Principle V.
- Exceptions MUST be time-boxed, documented with rationale, recorded in the
  AI/MCP usage log when AI-assisted, and tracked to closure.

**Version**: 1.1.0 | **Ratified**: 2026-05-07 | **Last Amended**: 2026-05-13
