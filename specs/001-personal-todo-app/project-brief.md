# Project brief — Personal Todo App (PRD input)

**Feature**: 001-personal-todo-app  
**Role in course activity**: This repository uses **Spec Kit** instead of BMAD personas, but the same inputs apply: a written product definition drives architecture, stories, tests, and implementation.

## Product summary

Build a **simple, fast, reliable personal Todo application**: create, view, complete, and delete tasks with changes reflected immediately in the UI. Tasks persist across sessions. The app handles empty, loading, and error states gracefully and works on mobile and desktop. Quality is enforced from day one (automated tests, accessibility, security, containers).

## Primary users

A single **personal user** per device (no accounts in MVP).

## In-scope capabilities

| Area        | Capability                                                     |
| ----------- | -------------------------------------------------------------- |
| Capture     | Add tasks with validation (non-empty, max length)              |
| List        | Show all tasks with completion state and stable order          |
| Complete    | Toggle complete / incomplete                                   |
| Delete      | Delete with short undo window                                  |
| Persistence | Postgres-backed API; survives reload                           |
| States      | Empty, delayed loading, error + retry                          |
| Quality     | WCAG 2.1 AA bar, ≥70% coverage, ≥5 E2E journeys, Docker deploy |

## Out of scope (MVP)

- User accounts, sync, categories, search, task text editing (original MVP); see [spec.md](./spec.md) for current scope including any follow-on epics.

## Authoritative specification

The full PRD-shaped document is **[spec.md](./spec.md)** (user stories US1–US5, functional requirements FR-001–FR-015, success criteria SC-001–SC-008).

## Spec Kit artefact map (replaces BMAD Step 1 outputs)

| Course step (BMAD)  | Spec Kit equivalent in this repo                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Project brief & PRD | This file + [spec.md](./spec.md)                                                                           |
| Architecture        | [plan.md](./plan.md), [docs/architecture.md](../../docs/architecture.md), [data-model.md](./data-model.md) |
| Stories + AC        | User stories in [spec.md](./spec.md); tasks in [tasks.md](./tasks.md)                                      |
| Test strategy       | [test-strategy.md](./test-strategy.md)                                                                     |
| API contracts       | [contracts/openapi.yaml](./contracts/openapi.yaml)                                                         |

## How implementation was guided

See [docs/how-speckit-guided-implementation.md](../../docs/how-speckit-guided-implementation.md) and [docs/bmad-vs-speckit-comparison.md](../../docs/bmad-vs-speckit-comparison.md).
