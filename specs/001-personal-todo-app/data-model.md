# Phase 1 Data Model: Personal Todo App

**Feature**: 001-personal-todo-app
**Plan**: [plan.md](./plan.md)
**Spec**: [spec.md](./spec.md)
**Source of truth**: this document. The Prisma schema in
`apps/api/prisma/schema.prisma` is the implementation projection.

## Overview

The MVP has a single entity, `Todo`, persisted in PostgreSQL via Prisma. The
schema is intentionally narrow so that adding multi-user accounts later
(see "Forward-compatibility notes") is a non-breaking addition rather than a
migration that rewrites existing rows.

## Entities

### `Todo`

A single to-do item belonging to the personal user. See spec §"Key Entities"
for the conceptual definition; this section is the schema-level projection.

#### Fields

| Field         | Type                       | Required | Default          | Notes |
|---------------|----------------------------|----------|------------------|-------|
| `id`          | `uuid` (v4)                | yes      | generated server-side | Stable identity. Never reused. Returned to clients as the canonical handle. |
| `text`        | `string` (1 – 500 chars, after trim) | yes | — | The user-supplied task text. Trimmed on the server. Must not be empty after trim (FR-001, FR-012). |
| `completed`   | `boolean`                  | yes      | `false`          | Toggle state for US2. Reversible. |
| `createdAt`   | `timestamptz`              | yes      | `now()`          | Used for ordering (newest first by default) and audit. Immutable after creation. |
| `updatedAt`   | `timestamptz`              | yes      | `now()` on insert and on every mutation | Used for reconciliation across parallel sessions (spec edge case "user opens the app two or more times in parallel"). |

#### Validation rules

These are enforced by zod on the wire **and** by the database where possible.
The same zod schemas live in `packages/shared` so the frontend and backend
agree on them.

- `id`
  - On `POST /todos`: must NOT be supplied by the client; the server
    generates it. Requests that include `id` are rejected with `400`.
  - On `PATCH` / `PUT` / `DELETE /todos/{id}`: must be a valid UUID v4
    string in the path. Invalid UUID → `400`. Unknown id → `404`.
- `text`
  - Must be a string.
  - After trimming leading / trailing whitespace, must have length in
    `[1, 500]`. Empty-after-trim → `400` (FR-001). Length > 500 after trim
    → `400` with explicit `details.maxLength = 500` (FR-012; "no silent
    truncation").
  - Server treats `text` as user content and never interpolates it into
    HTML, SQL, or shell. Frontend renders it as text only. (FR-013.)
- `completed`
  - Must be a boolean. `null` / missing on `PATCH` is allowed (means
    "do not change"). On `POST` and `PUT`, defaults / requires `false`
    respectively per the contract — see `contracts/openapi.yaml`.
- `createdAt`
  - Server-assigned at insert; never accepted from the client.
- `updatedAt`
  - Server-assigned at insert and on every mutation; never accepted from
    the client.

#### Indexes

- Primary key on `id`.
- B-tree index on `createdAt DESC` to back the default list ordering
  efficiently as the table grows (spec assumes up to a few hundred tasks
  per device for the MVP; the index is cheap insurance).

#### State transitions

```
created ──toggle──▶ completed ──toggle──▶ created ──toggle──▶ completed ...
   │                     │
   └──delete──▶ pending-undo (UI-only, time-bounded) ──undo──▶ created
                                                  └──expire──▶ deleted (DB row removed)
```

- The DB only models two states for `completed`: `false` and `true`.
- "pending-undo" is a UI-only state in the spec (US3 acceptance scenario 1
  and 2). Implementations may achieve it by holding the row in the database
  and rendering it as removed in the UI, or by deleting and storing it
  ephemerally on the client. Either approach is acceptable provided the
  spec's acceptance criteria are met; the choice is recorded in the
  task-level design notes during `/speckit-tasks`.

## Prisma schema (canonical projection)

The implementation projection lives at `apps/api/prisma/schema.prisma`.
For traceability the canonical text is reproduced here; if these two ever
diverge, `data-model.md` is the source of truth.

```prisma
// apps/api/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id        String   @id @default(uuid()) @db.Uuid
  text      String   @db.VarChar(500)
  completed Boolean  @default(false)
  createdAt DateTime @default(now()) @db.Timestamptz(6)
  updatedAt DateTime @updatedAt        @db.Timestamptz(6)

  @@index([createdAt(sort: Desc)])
  @@map("todos")
}
```

Notes:
- `@db.VarChar(500)` enforces the 500-char ceiling at the DB layer as
  defence-in-depth; zod still validates first so the response is a
  structured `400` rather than a generic DB error.
- `@db.Uuid` keeps the column native UUID, not text.
- `@@map("todos")` keeps the SQL table name conventional and decoupled
  from the model name.

## Forward-compatibility notes

The MVP is single-user-per-device with no accounts. The schema is designed
so that the following changes are additive and non-breaking:

- **Adding accounts**: add a nullable `userId String? @db.Uuid` plus a
  `User` model in a later migration. Existing rows stay valid with
  `userId = NULL` (meaning "owned by the local device user", to be
  migrated explicitly when accounts launch).
- **Adding sync timestamps**: the existing `updatedAt` column is already
  the source of truth for last-writer-wins reconciliation.
- **Adding soft delete**: a nullable `deletedAt timestamptz` can be added
  without touching reads (filter `deletedAt IS NULL`).

These extensions are explicitly **out of scope** for the MVP; they are
documented here only to demonstrate that the MVP shape does not paint
us into a corner (per spec §"Key Entities").

## Mapping to FRs and acceptance criteria

| FR / SC | Mechanism in the data model |
|---------|------------------------------|
| FR-001, FR-012 (text validation, no silent truncation) | zod schema in `packages/shared` + `VarChar(500)` in Postgres |
| FR-002 (display tasks) | `Todo` rows ordered by `createdAt DESC` via index |
| FR-003 (toggle complete) | `completed` boolean, mutable via PATCH |
| FR-004 (delete + undo) | DB DELETE on undo expiry; "pending-undo" is UI-only |
| FR-005 (persist across sessions) | Postgres with persistent volume in `dev` profile |
| FR-013 (escape user content) | `text` stored as text; rendered as text only on the frontend; no HTML interpolation |
| US2 AC-3 (completion survives reload) | `completed` is persisted, not client-only |
| Edge case (parallel sessions) | `updatedAt` enables last-writer-wins reconciliation on reload |
