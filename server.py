#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import posixpath
import threading
import time
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
EXACT_STATIC_FILES = {"index.html", "app.js", "styles.css"}
STATIC_DIRS = {"assets", "components", "data"}
HEALTH_PATH = "/health"
EVALUATE_PATH = "/api/gridscope/evaluate"
DEFAULT_TIMEOUT_MS = 15_000
DEFAULT_CACHE_TTL_SECONDS = 300
DEFAULT_MAX_BODY_BYTES = 64 * 1024
DEFAULT_MAX_RESPONSE_BYTES = 2 * 1024 * 1024
ALLOWED_RESPONSE_FIELDS = (
    "normalized_parcel",
    "shared_facts",
    "mode_evaluations",
    "report_id",
    "evaluation_id",
)


def parse_env_file(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("export "):
            stripped = stripped[7:].strip()
        if "=" not in stripped:
            continue

        key, value = stripped.split("=", 1)
        key = key.strip()
        if not key or key in os.environ:
            continue

        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        os.environ[key] = value


def env_int(name: str, default: int) -> int:
    raw_value = os.getenv(name, "").strip()
    if not raw_value:
        return default

    try:
        parsed = int(raw_value)
    except ValueError:
        return default
    return parsed if parsed > 0 else default


def normalize_auth_mode(raw_value: str) -> str:
    value = raw_value.strip().lower()
    if value in {"bearer", "authorization", "auth"}:
        return "bearer"
    return "header"


def extract_error_message(raw_body: bytes) -> str | None:
    if not raw_body:
        return None

    try:
        payload = json.loads(raw_body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        text = raw_body.decode("utf-8", errors="ignore").strip()
        return text[:200] or None

    if isinstance(payload, dict):
        for key in ("message", "detail", "error", "title"):
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()[:200]
    return None


@dataclass(frozen=True)
class GridScopeConfig:
    base_url: str
    api_key: str
    auth_mode: str
    header_name: str
    timeout_ms: int
    cache_ttl_seconds: int
    max_body_bytes: int
    max_response_bytes: int

    @property
    def configured(self) -> bool:
        return bool(self.base_url and self.api_key)

    @property
    def evaluate_url(self) -> str:
        return f"{self.base_url}/v1/evaluate"

    @classmethod
    def from_env(cls) -> "GridScopeConfig":
        auth_mode = normalize_auth_mode(os.getenv("GRIDSCOPE_EXTERNAL_API_AUTH_MODE", "header"))
        header_name = os.getenv("GRIDSCOPE_EXTERNAL_API_HEADER_NAME", "X-API-Key").strip() or "X-API-Key"

        if auth_mode == "bearer":
            header_name = "Authorization"

        return cls(
            base_url=os.getenv("GRIDSCOPE_EXTERNAL_API_URL", "").strip().rstrip("/"),
            api_key=os.getenv("GRIDSCOPE_EXTERNAL_API_KEY", "").strip(),
            auth_mode=auth_mode,
            header_name=header_name,
            timeout_ms=env_int("GRIDSCOPE_EXTERNAL_API_TIMEOUT_MS", DEFAULT_TIMEOUT_MS),
            cache_ttl_seconds=env_int(
                "GRIDSCOPE_EXTERNAL_API_CACHE_TTL_SECONDS",
                DEFAULT_CACHE_TTL_SECONDS,
            ),
            max_body_bytes=env_int("GRIDSCOPE_EXTERNAL_API_MAX_BODY_BYTES", DEFAULT_MAX_BODY_BYTES),
            max_response_bytes=env_int(
                "GRIDSCOPE_EXTERNAL_API_MAX_RESPONSE_BYTES",
                DEFAULT_MAX_RESPONSE_BYTES,
            ),
        )

    def auth_headers(self) -> dict[str, str]:
        if self.auth_mode == "bearer":
            return {"Authorization": f"Bearer {self.api_key}"}
        return {self.header_name: self.api_key}


@dataclass
class CacheEntry:
    body: bytes
    expires_at: float


class ResponseCache:
    def __init__(self) -> None:
        self._entries: dict[str, CacheEntry] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> bytes | None:
        now = time.monotonic()
        with self._lock:
            entry = self._entries.get(key)
            if entry is None:
                return None
            if entry.expires_at <= now:
                self._entries.pop(key, None)
                return None
            return entry.body

    def set(self, key: str, body: bytes, ttl_seconds: int) -> None:
        if ttl_seconds <= 0:
            return

        with self._lock:
            self._entries[key] = CacheEntry(
                body=body,
                expires_at=time.monotonic() + ttl_seconds,
            )


@dataclass
class AppState:
    gridscope: GridScopeConfig
    cache: ResponseCache


class AppRequestHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "LeCrownProperties/1.0"
    sys_version = ""

    @property
    def app_state(self) -> AppState:
        return self.server.app_state  # type: ignore[attr-defined]

    def do_GET(self) -> None:  # noqa: N802
        self.handle_read_request(include_body=True)

    def do_HEAD(self) -> None:  # noqa: N802
        self.handle_read_request(include_body=False)

    def do_OPTIONS(self) -> None:  # noqa: N802
        path = urlsplit(self.path).path
        if path == EVALUATE_PATH:
            self.send_response(204)
            self.send_common_headers()
            self.send_header("Allow", "OPTIONS, POST")
            self.send_header("Access-Control-Allow-Methods", "OPTIONS, POST")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        self.send_error_json(404, "not_found", "Route not found.")

    def do_POST(self) -> None:  # noqa: N802
        path = urlsplit(self.path).path
        if path != EVALUATE_PATH:
            self.send_error_json(404, "not_found", "Route not found.")
            return

        self.handle_gridscope_evaluate()

    def handle_read_request(self, *, include_body: bool) -> None:
        path = urlsplit(self.path).path

        if path == HEALTH_PATH:
            self.send_json(
                200,
                {
                    "status": "ok",
                    "gridscope_configured": self.app_state.gridscope.configured,
                },
                include_body=include_body,
                extra_headers={"Cache-Control": "no-store"},
            )
            return

        if path == EVALUATE_PATH:
            self.send_error_json(
                405,
                "method_not_allowed",
                "Use POST for this route.",
                include_body=include_body,
                extra_headers={"Allow": "OPTIONS, POST"},
            )
            return

        static_path = resolve_static_path(path)
        if static_path is None:
            self.send_error_json(404, "not_found", "Route not found.", include_body=include_body)
            return

        self.serve_static_file(static_path, include_body=include_body)

    def handle_gridscope_evaluate(self) -> None:
        config = self.app_state.gridscope
        if not config.configured:
            self.send_error_json(
                503,
                "gridscope_unavailable",
                "GridScope integration is not configured.",
            )
            return

        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_error_json(
                415,
                "unsupported_media_type",
                "Content-Type must be application/json.",
            )
            return

        raw_body = self.read_request_body(config.max_body_bytes)
        if raw_body is None:
            return

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error_json(400, "invalid_json", "Request body must be valid JSON.")
            return

        if not isinstance(payload, dict):
            self.send_error_json(400, "invalid_request", "Request body must be a JSON object.")
            return

        if "parcel" not in payload:
            self.send_error_json(400, "invalid_request", "Request body must include parcel.")
            return

        cache_key = hashlib.sha256(
            json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8"),
        ).hexdigest()

        cached_body = self.app_state.cache.get(cache_key)
        if cached_body is not None:
            self.send_response_bytes(
                200,
                cached_body,
                content_type="application/json; charset=utf-8",
                extra_headers={
                    "Cache-Control": "no-store",
                    "X-Cache": "HIT",
                },
            )
            return

        upstream_status, upstream_payload = fetch_gridscope_evaluation(payload, config)
        if upstream_status != 200:
            self.send_json(
                upstream_status,
                upstream_payload,
                extra_headers={"Cache-Control": "no-store", "X-Cache": "BYPASS"},
            )
            return

        filtered_payload = filter_gridscope_response(upstream_payload)
        if filtered_payload is None:
            self.send_error_json(
                502,
                "invalid_upstream_response",
                "GridScope returned an unexpected response shape.",
                extra_headers={"Cache-Control": "no-store", "X-Cache": "BYPASS"},
            )
            return

        response_body = json.dumps(filtered_payload, separators=(",", ":")).encode("utf-8")
        self.app_state.cache.set(cache_key, response_body, config.cache_ttl_seconds)
        self.send_response_bytes(
            200,
            response_body,
            content_type="application/json; charset=utf-8",
            extra_headers={
                "Cache-Control": "no-store",
                "X-Cache": "MISS",
            },
        )

    def serve_static_file(self, file_path: Path, *, include_body: bool) -> None:
        try:
            body = file_path.read_bytes()
        except FileNotFoundError:
            self.send_error_json(404, "not_found", "Route not found.", include_body=include_body)
            return

        content_type, encoding = mimetypes.guess_type(file_path.name)
        if encoding:
            content_type = "application/octet-stream"
        elif file_path.suffix == ".js":
            content_type = "text/javascript; charset=utf-8"
        elif file_path.suffix == ".json":
            content_type = "application/json; charset=utf-8"
        elif file_path.suffix == ".svg":
            content_type = "image/svg+xml"
        elif file_path.suffix in {".html", ".css"}:
            content_type = f"text/{'html' if file_path.suffix == '.html' else 'css'}; charset=utf-8"
        else:
            content_type = content_type or "application/octet-stream"

        self.send_response_bytes(
            200,
            body,
            content_type=content_type,
            include_body=include_body,
            extra_headers={"Cache-Control": static_cache_control(file_path)},
        )

    def read_request_body(self, max_body_bytes: int) -> bytes | None:
        content_length = self.headers.get("Content-Length", "").strip()
        if not content_length:
            self.send_error_json(411, "length_required", "Content-Length header is required.")
            return None

        try:
            length = int(content_length)
        except ValueError:
            self.send_error_json(400, "invalid_request", "Content-Length must be an integer.")
            return None

        if length < 0 or length > max_body_bytes:
            self.send_error_json(413, "payload_too_large", "Request body is too large.")
            return None

        body = self.rfile.read(length)
        if len(body) != length:
            self.send_error_json(400, "invalid_request", "Request body was truncated.")
            return None
        return body

    def send_error_json(
        self,
        status: int,
        error_code: str,
        message: str,
        *,
        include_body: bool = True,
        extra_headers: dict[str, str] | None = None,
    ) -> None:
        self.send_json(
            status,
            {"error": error_code, "message": message},
            include_body=include_body,
            extra_headers=extra_headers,
        )

    def send_json(
        self,
        status: int,
        payload: dict[str, Any],
        *,
        include_body: bool = True,
        extra_headers: dict[str, str] | None = None,
    ) -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response_bytes(
            status,
            body,
            content_type="application/json; charset=utf-8",
            include_body=include_body,
            extra_headers=extra_headers,
        )

    def send_response_bytes(
        self,
        status: int,
        body: bytes,
        *,
        content_type: str,
        include_body: bool = True,
        extra_headers: dict[str, str] | None = None,
    ) -> None:
        self.send_response(status)
        self.send_common_headers()
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()
        if include_body:
            self.wfile.write(body)

    def send_common_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("X-XSS-Protection", "1; mode=block")


def resolve_static_path(request_path: str) -> Path | None:
    normalized = posixpath.normpath(unquote(request_path))
    if normalized in {".", "/"}:
        return ROOT / "index.html"

    relative_path = normalized.lstrip("/")
    if not relative_path:
        return ROOT / "index.html"

    path_parts = Path(relative_path).parts
    top_level = path_parts[0]

    if top_level in EXACT_STATIC_FILES and len(path_parts) == 1:
        candidate = ROOT / relative_path
        return candidate if candidate.is_file() else None

    if top_level in STATIC_DIRS:
        base_dir = (ROOT / top_level).resolve()
        candidate = (ROOT / relative_path).resolve()
        if not str(candidate).startswith(f"{base_dir}{os.sep}") and candidate != base_dir:
            return None
        return candidate if candidate.is_file() else None

    if "." in Path(relative_path).name:
        return None

    return ROOT / "index.html"


def static_cache_control(file_path: Path) -> str:
    relative_path = file_path.relative_to(ROOT)
    top_level = relative_path.parts[0]
    if top_level == "assets":
        return "public, max-age=2592000"
    if top_level == "components":
        return "public, max-age=86400"
    if top_level == "data":
        return "public, max-age=300"
    return "no-cache"


def fetch_gridscope_evaluation(
    payload: dict[str, Any],
    config: GridScopeConfig,
) -> tuple[int, dict[str, Any]]:
    request_body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    request = Request(
        config.evaluate_url,
        data=request_body,
        method="POST",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            **config.auth_headers(),
        },
    )

    try:
        with urlopen(request, timeout=config.timeout_ms / 1000) as response:
            raw_body = response.read(config.max_response_bytes + 1)
            if len(raw_body) > config.max_response_bytes:
                return (
                    502,
                    {
                        "error": "upstream_response_too_large",
                        "message": "GridScope response exceeded the configured size limit.",
                    },
                )

            try:
                payload = json.loads(raw_body.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                return (
                    502,
                    {
                        "error": "invalid_upstream_response",
                        "message": "GridScope did not return valid JSON.",
                    },
                )

            if not isinstance(payload, dict):
                return (
                    502,
                    {
                        "error": "invalid_upstream_response",
                        "message": "GridScope returned an unexpected response shape.",
                    },
                )

            return 200, payload
    except HTTPError as error:
        raw_body = error.read(config.max_response_bytes + 1)
        message = extract_error_message(raw_body)
        if error.code in {400, 404, 422}:
            return (
                400,
                {
                    "error": "invalid_request",
                    "message": message or "GridScope rejected the evaluation request.",
                },
            )
        if error.code in {408, 504}:
            return (
                504,
                {
                    "error": "upstream_timeout",
                    "message": "GridScope did not respond before the timeout.",
                },
            )
        if error.code in {401, 403}:
            return (
                502,
                {
                    "error": "upstream_auth_error",
                    "message": "GridScope authentication failed.",
                },
            )
        return (
            502,
            {
                "error": "upstream_error",
                "message": message or "GridScope evaluation failed.",
            },
        )
    except TimeoutError:
        return (
            504,
            {
                "error": "upstream_timeout",
                "message": "GridScope did not respond before the timeout.",
            },
        )
    except URLError:
        return (
            502,
            {
                "error": "upstream_unreachable",
                "message": "GridScope is unreachable from this server.",
            },
        )


def filter_gridscope_response(payload: dict[str, Any]) -> dict[str, Any] | None:
    filtered = {
        key: payload[key]
        for key in ALLOWED_RESPONSE_FIELDS
        if key in payload
    }

    if "mode_evaluations" not in filtered:
        return None
    return filtered


def build_server(host: str, port: int) -> ThreadingHTTPServer:
    server = ThreadingHTTPServer((host, port), AppRequestHandler)
    server.app_state = AppState(  # type: ignore[attr-defined]
        gridscope=GridScopeConfig.from_env(),
        cache=ResponseCache(),
    )
    return server


def main() -> None:
    parse_env_file(ROOT / ".env.gridscope.local")

    parser = argparse.ArgumentParser(
        description="Serve the LeCrown SPA and same-origin GridScope API proxy.",
    )
    parser.add_argument("port", nargs="?", default=env_int("PORT", 4173), type=int)
    parser.add_argument("--host", default=os.getenv("HOST", "127.0.0.1"))
    args = parser.parse_args()

    httpd = build_server(args.host, args.port)
    print(f"Serving {ROOT} on http://{args.host}:{args.port}")
    if httpd.app_state.gridscope.configured:  # type: ignore[attr-defined]
        print("GridScope proxy enabled at /api/gridscope/evaluate")
    else:
        print("GridScope proxy disabled until server-side env is configured")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
