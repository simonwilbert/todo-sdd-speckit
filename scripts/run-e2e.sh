#!/usr/bin/env bash
# Start API when DATABASE_URL is set (so Playwright can hit /todos via Vite proxy),
# wait for /health, then run Playwright. Forwards all args to playwright test.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

cleanup() {
  if [[ -n "${API_PID:-}" ]] && kill -0 "${API_PID}" 2>/dev/null; then
    kill "${API_PID}" 2>/dev/null || true
    wait "${API_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

if [[ -n "${DATABASE_URL:-}" ]]; then
  npm run build -w @todo/shared
  (cd apps/api && exec npx tsx src/server.ts) &
  API_PID=$!
  for _ in $(seq 1 90); do
    if curl -sf "http://127.0.0.1:3000/health" >/dev/null; then
      break
    fi
    sleep 1
  done
  curl -sf "http://127.0.0.1:3000/health" >/dev/null
fi

exec npm run playwright -w @todo/e2e -- "$@"
