<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> I. Spec-First Delivery
  - [PRINCIPLE_2_NAME] -> II. Testable by Design
  - [PRINCIPLE_3_NAME] -> III. Small, Traceable Changes
  - [PRINCIPLE_4_NAME] -> IV. Reliable Automation and Checks
  - [PRINCIPLE_5_NAME] -> V. Clarity, Simplicity, and Security
- Added sections:
  - Engineering Constraints
  - Workflow and Quality Gates
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/commands/*.md (directory not present; no updates required)
- Follow-up TODOs:
  - Confirm if an earlier ratification date exists; adjust if needed.
-->

# Todo SDD Speckit Constitution

## Core Principles

### I. Spec-First Delivery
Every non-trivial change MUST begin with a written specification that defines user
value, acceptance criteria, and explicit scope boundaries before implementation starts.
This prevents ambiguous work and creates a durable record for planning and review.

### II. Testable by Design
Features MUST define independent test scenarios and measurable success criteria as part
of specification and planning artifacts. Implementations SHOULD include automated tests
for critical paths and regressions before merge. This keeps behavior verifiable and
reduces confidence based only on manual checks.

### III. Small, Traceable Changes
Work MUST be broken into small, reviewable increments linked from specification to plan
to tasks to implementation. Each increment MUST preserve a working state and avoid
unrelated refactors. This improves review quality, rollback safety, and delivery speed.

### IV. Reliable Automation and Checks
Automated checks (lint, tests, and task-specific validation) MUST pass before a change
is considered complete. When automation is missing, teams MUST document the gap and add
a follow-up task in the same planning cycle. This protects baseline quality as scope
grows.

### V. Clarity, Simplicity, and Security
Solutions MUST prefer the simplest design that satisfies requirements, use clear naming,
and avoid speculative complexity. Changes MUST not introduce obvious security risks (for
example, hardcoded secrets, unchecked input, or unsafe defaults). Clear and minimal
design lowers maintenance cost and reduces operational risk.

## Engineering Constraints

- Planning artifacts MUST capture language/runtime, dependencies, constraints, and
  performance expectations before implementation.
- Code changes MUST align to the project structure documented in the implementation plan.
- New dependencies SHOULD be justified by concrete feature needs and expected lifecycle.
- Sensitive configuration MUST be externalized from source code and managed via runtime
  environment settings.

## Workflow and Quality Gates

- Specification quality gate: user stories are independently testable and prioritized.
- Plan quality gate: constitution checks are explicitly listed and resolved.
- Tasks quality gate: work is grouped by user story to allow independent delivery.
- Implementation quality gate: tests and linting pass, and acceptance criteria are met.
- Review quality gate: pull requests explain the "why", risks, and validation evidence.

## Governance

This constitution takes precedence over local conventions when they conflict. Amendments
MUST include: (1) a written rationale, (2) impacted template/process updates, and
(3) a version bump based on semantic versioning policy below.

Versioning policy:
- MAJOR: Removal or incompatible redefinition of a principle or governance rule.
- MINOR: New principle/section or materially expanded guidance.
- PATCH: Wording clarifications that do not change expected behavior.

Compliance review expectations:
- Every planning cycle MUST include a constitution check.
- Every implementation cycle MUST verify applicable principle compliance in review.
- Exceptions MUST be time-boxed, documented with rationale, and tracked to closure.

**Version**: 1.0.0 | **Ratified**: 2026-05-07 | **Last Amended**: 2026-05-07
