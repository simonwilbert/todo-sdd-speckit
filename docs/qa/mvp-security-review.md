# MVP security review notes

**Date**: 2026-05-14  
**Feature**: 001-personal-todo-app

## Threats considered (MVP scope)

| Area                | Risk                                 | Mitigation in repo                                                                                          |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Injection**       | SQL injection                        | Prisma ORM (parameterised queries); no raw SQL for todo CRUD.                                               |
| **Input abuse**     | Oversized or malformed JSON / fields | `express.json` size limit; zod `.strict()` on bodies; UUID param schema for `:id`.                          |
| **XSS**             | Stored script in todo text           | React text binding (no `dangerouslySetInnerHTML`); API returns JSON only.                                   |
| **Transport**       | Cleartext in production              | TLS **out of scope** for local MVP; `docs/prod-profile.md` tracks edge TLS + optional HSTS (`ENABLE_HSTS`). |
| **Clickjacking**    | UI embedded in malicious frame       | `X-Frame-Options: DENY` (or equivalent) via security headers middleware.                                    |
| **MIME sniffing**   | Content-type confusion               | `X-Content-Type-Options: nosniff`.                                                                          |
| **Dependency CVEs** | Vulnerable packages                  | CI `npm audit --omit=dev --audit-level=high`; local gate same command.                                      |
| **Secrets**         | DB password in git                   | `.env` files gitignored; examples only under `docker/*.example`.                                            |

## `npm audit` (production dependencies)

Command: `npm audit --omit=dev --audit-level=high`  
**Outcome at report time**: **0 vulnerabilities** reported.

## Residual items (not blocking MVP)

- Full **CSP** tuning for production asset hosts.
- **Rate limiting** and authn/z — not required for single-user local MVP; revisit if exposed to the internet.
