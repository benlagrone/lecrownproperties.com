#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/compose.yaml"
NGINX_FILE="$ROOT_DIR/nginx.conf"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "compose.yaml not found at $COMPOSE_FILE"
  exit 1
fi

if [[ ! -f "$NGINX_FILE" ]]; then
  echo "nginx.conf not found at $NGINX_FILE"
  exit 1
fi

if ! grep -q '127.0.0.1:18033:8080' "$COMPOSE_FILE"; then
  echo "Expected host port mapping 127.0.0.1:18033:8080 not found in compose.yaml"
  exit 1
fi

if ! grep -q 'proxy_pass http://127.0.0.1:18033;' "$NGINX_FILE"; then
  echo "Expected reverse proxy upstream http://127.0.0.1:18033 not found in nginx.conf"
  exit 1
fi

if ! grep -q 'lecrown-properties-site' "$COMPOSE_FILE"; then
  echo "Expected service/image naming lecrown-properties-site not found in compose.yaml"
  exit 1
fi

echo "Deploy contract ok"
