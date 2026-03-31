#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM_PORT="${UPSTREAM_PORT:-18181}"
APP_PORT="${APP_PORT:-18182}"
REQUEST_PAYLOAD='{"parcel":{"locator":{"parcel_id":"123-ABC"},"market":"tx-statewide"},"modes":["data_center"],"include_report":true,"include_ai_summary":false}'

MOCK_LOG="$(mktemp)"
APP_LOG="$(mktemp)"
FIRST_HEADERS="$(mktemp)"
SECOND_HEADERS="$(mktemp)"
FIRST_BODY="$(mktemp)"

cleanup() {
  if [[ -n "${APP_PID:-}" ]]; then
    kill "$APP_PID" >/dev/null 2>&1 || true
    wait "$APP_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "${MOCK_PID:-}" ]]; then
    kill "$MOCK_PID" >/dev/null 2>&1 || true
    wait "$MOCK_PID" >/dev/null 2>&1 || true
  fi
  rm -f "$MOCK_LOG" "$APP_LOG" "$FIRST_HEADERS" "$SECOND_HEADERS" "$FIRST_BODY"
}

wait_for_http() {
  local url="$1"

  for _ in {1..30}; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  return 1
}

dump_logs() {
  echo "--- mock server log ---"
  cat "$MOCK_LOG" || true
  echo "--- app server log ---"
  cat "$APP_LOG" || true
}

trap cleanup EXIT

python3 "$ROOT_DIR/scripts/mock_gridscope_api.py" "$UPSTREAM_PORT" >"$MOCK_LOG" 2>&1 &
MOCK_PID=$!

GRIDSCOPE_EXTERNAL_API_URL="http://127.0.0.1:${UPSTREAM_PORT}" \
GRIDSCOPE_EXTERNAL_API_KEY="test-key" \
GRIDSCOPE_EXTERNAL_API_AUTH_MODE="header" \
GRIDSCOPE_EXTERNAL_API_HEADER_NAME="X-API-Key" \
python3 "$ROOT_DIR/server.py" "$APP_PORT" --host 127.0.0.1 >"$APP_LOG" 2>&1 &
APP_PID=$!

if ! wait_for_http "http://127.0.0.1:${APP_PORT}/health"; then
  dump_logs
  echo "Timed out waiting for the app server"
  exit 1
fi

curl -fsS \
  -D "$FIRST_HEADERS" \
  -o "$FIRST_BODY" \
  -X POST \
  -H 'Content-Type: application/json' \
  -d "$REQUEST_PAYLOAD" \
  "http://127.0.0.1:${APP_PORT}/api/gridscope/evaluate"

if ! grep -qi '^X-Cache: MISS' "$FIRST_HEADERS"; then
  dump_logs
  echo "Expected first GridScope proxy response to be a cache miss"
  exit 1
fi

python3 - "$FIRST_BODY" <<'PY'
import json
import sys

with open(sys.argv[1], "r", encoding="utf-8") as handle:
    payload = json.load(handle)

required_fields = {
    "normalized_parcel",
    "shared_facts",
    "mode_evaluations",
    "report_id",
    "evaluation_id",
}
missing = sorted(required_fields - payload.keys())
if missing:
    raise SystemExit(f"missing fields: {missing}")

if "internal_debug" in payload:
    raise SystemExit("internal_debug should have been filtered out")
PY

curl -fsS \
  -D "$SECOND_HEADERS" \
  -o /dev/null \
  -X POST \
  -H 'Content-Type: application/json' \
  -d "$REQUEST_PAYLOAD" \
  "http://127.0.0.1:${APP_PORT}/api/gridscope/evaluate"

if ! grep -qi '^X-Cache: HIT' "$SECOND_HEADERS"; then
  dump_logs
  echo "Expected second GridScope proxy response to be a cache hit"
  exit 1
fi

echo "GridScope proxy smoke test ok"
