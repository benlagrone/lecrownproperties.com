#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${1:-}"
REMOTE_DIR="${REMOTE_DIR:-~/workspace/lecrownproperties}"
SSH_PASSWORD="${SSH_PASSWORD:-}"
SSH_PORT="${SSH_PORT:-22}"

SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new)

if [[ -n "$SSH_PASSWORD" ]]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "sshpass is required when SSH_PASSWORD is set"
    exit 1
  fi
  export SSHPASS="$SSH_PASSWORD"
  SSH_CMD=(sshpass -e ssh "${SSH_OPTS[@]}")
  RSYNC_SSH=(sshpass -e ssh "${SSH_OPTS[@]}")
else
  SSH_CMD=(ssh "${SSH_OPTS[@]}")
  RSYNC_SSH=(ssh "${SSH_OPTS[@]}")
fi

if [[ -z "$REMOTE_HOST" ]]; then
  echo "Usage: $0 user@server"
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required for deploy-contabo.sh"
  exit 1
fi

echo "Ensuring remote directory exists at ${REMOTE_HOST}:${REMOTE_DIR}"
"${SSH_CMD[@]}" "$REMOTE_HOST" "mkdir -p $REMOTE_DIR"

echo "Syncing project files"
rsync -az --delete \
  -e "$(printf '%q ' "${RSYNC_SSH[@]}")" \
  --exclude .DS_Store \
  --exclude .git \
  --exclude .github \
  --exclude .playwright-cli \
  --exclude __pycache__ \
  --exclude output \
  --exclude '*.pyc' \
  ./ "$REMOTE_HOST:$REMOTE_DIR/"

echo "Verifying deploy contract and starting container"
"${SSH_CMD[@]}" "$REMOTE_HOST" "cd $REMOTE_DIR && bash scripts/verify-deploy-contract.sh && if [ -f .env.gridscope.local ]; then docker compose --env-file .env.gridscope.local -p lecrownproperties -f compose.yaml up -d --build && docker compose --env-file .env.gridscope.local -p lecrownproperties -f compose.yaml ps; else docker compose -p lecrownproperties -f compose.yaml up -d --build && docker compose -p lecrownproperties -f compose.yaml ps; fi"

echo "Deployment complete"
