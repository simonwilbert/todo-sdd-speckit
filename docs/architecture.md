# Architecture overview

This document mirrors the **Architecture overview** from [specs/001-personal-todo-app/plan.md](../specs/001-personal-todo-app/plan.md) for contributors who start from `docs/` rather than the feature folder.

- **Frontend (`apps/web`)**: React 18 + Vite, TypeScript strict. State is owned by `@tanstack/react-query` against the backend; local UI state stays in components. A single typed API client (in `services/`) consumes types from `packages/shared`. Routing is minimal (one primary screen for the MVP). Accessibility is enforced via semantic HTML, labelled controls, focus management on create / delete / undo, and an `axe-core` automated scan in CI on every primary screen.

- **Backend (`apps/api`)**: Node.js 22 + Express (Node 20 also validated in CI). Each route validates input with a zod schema imported from `packages/shared`. Errors flow through a single error-handler middleware that emits a consistent envelope (`{ error: { code, message, details? } }`). Persistence uses Prisma; the service layer owns transaction boundaries. `/health` returns liveness + readiness (Postgres ping) and is what docker-compose healthchecks target.

- **Shared types (`packages/shared`)**: Single source of truth for `Todo`, request bodies (`TodoCreate`, `TodoPatch`, `TodoReplace`), and error envelopes. Both the API contract (zod schemas) and the frontend’s React Query hooks import from here, so the wire shape cannot drift between client and server.

- **Database (Postgres 16)**: Run in a container with persistent volume in `dev`, ephemeral volume in `test`. Migrations are Prisma-managed and run on API container start in `dev` / `test`. The MVP table is a single `Todo` model (see [data-model.md](../specs/001-personal-todo-app/data-model.md)).

- **Containerization**: Each app has a multi-stage Dockerfile — a builder stage installs dev deps and produces a build, and a runtime stage copies only the production artifacts and runs as a non-root `USER`. Compose declares healthchecks for all three services and resolves config from a per-profile `.env` file.

- **Environment profiles**: `dev` (developer machine; hot reload, persistent volume, looser CORS), `test` (used by CI / E2E; ephemeral volume), `prod` (shape and hardening deferred — see [prod-profile.md](./prod-profile.md)). Profile is selected by `NODE_ENV` plus a compose override file; no code branches on hostname.

- **Observability (MVP-minimum)**: Structured JSON logs on stderr with a request id. Metrics and tracing are deliberately out of scope for the MVP.

For project directory layout, see **Project Structure** in the same [plan.md](../specs/001-personal-todo-app/plan.md).
