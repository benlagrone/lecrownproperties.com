#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${IMAGE_TAG:-lecrown-properties-site:smoke}"
HOST_PORT="${HOST_PORT:-18080}"
CONTAINER_NAME="lecrown-properties-site-smoke-${HOST_PORT}"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
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

trap cleanup EXIT

docker build -t "$IMAGE_TAG" .
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run -d --rm \
  --name "$CONTAINER_NAME" \
  -p "127.0.0.1:${HOST_PORT}:8080" \
  "$IMAGE_TAG" >/dev/null

if ! wait_for_http "http://127.0.0.1:${HOST_PORT}/"; then
  docker logs "$CONTAINER_NAME" || true
  echo "Timed out waiting for container to serve HTTP"
  exit 1
fi

curl -fsSI "http://127.0.0.1:${HOST_PORT}/" >/dev/null
curl -fsSI "http://127.0.0.1:${HOST_PORT}/contact?lang=zh" >/dev/null
curl -fsS "http://127.0.0.1:${HOST_PORT}/health" >/dev/null
curl -fsS "http://127.0.0.1:${HOST_PORT}/data/site.en.json" >/dev/null
curl -fsS "http://127.0.0.1:${HOST_PORT}/data/site.zh.json" >/dev/null
curl -fsSI "http://127.0.0.1:${HOST_PORT}/assets/logo-mark.svg" >/dev/null

echo "Container smoke test ok"
