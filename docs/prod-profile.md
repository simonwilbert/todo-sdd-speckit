# Production profile (deferred)

This note captures **follow-up F3** from [specs/001-personal-todo-app/plan.md](../specs/001-personal-todo-app/plan.md): the MVP ships `dev` and `test` compose profiles; **full production hardening** is intentionally deferred to a later increment.

When you promote this stack to `prod`, plan for at least:

1. **TLS termination** — HTTPS at the edge (reverse proxy or cloud load balancer); no plain-text client credentials in transit.
2. **Secrets backend** — database URLs, API keys, and signing material from a managed secret store (not committed `.env` files); rotation policy.
3. **External Postgres** — managed database with backups, connection limits, and network isolation from the application tier; migrations run as an explicit release step or init job, not only on container boot if that risks concurrent writers.
4. **HSTS and CSP** — API already supports optional `Strict-Transport-Security` when `ENABLE_HSTS=true`; tune Content-Security-Policy for the real web origin(s) instead of dev-friendly defaults.
5. **Observability** — structured logs to a collector, RED metrics, and tracing IDs propagated across services (out of scope for MVP).

Until then, treat `docker/docker-compose.yml` as **local / CI** orchestration only, not a production topology.
