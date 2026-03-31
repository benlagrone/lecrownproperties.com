#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


EXPECTED_KEY = os.getenv("GRIDSCOPE_EXTERNAL_API_KEY", "test-key")
EXPECTED_AUTH_MODE = os.getenv("GRIDSCOPE_EXTERNAL_API_AUTH_MODE", "header").strip().lower()
EXPECTED_HEADER_NAME = os.getenv("GRIDSCOPE_EXTERNAL_API_HEADER_NAME", "X-API-Key")


class MockGridScopeHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "MockGridScope/1.0"
    sys_version = ""

    def do_POST(self) -> None:  # noqa: N802
        if urlsplit(self.path).path != "/v1/evaluate":
            self.send_json(404, {"error": "not_found"})
            return

        if not self.is_authorized():
            self.send_json(401, {"message": "missing or invalid API credentials"})
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        payload = json.loads(self.rfile.read(content_length).decode("utf-8"))

        response = {
            "normalized_parcel": payload.get("parcel", {}),
            "shared_facts": {
                "market": payload.get("parcel", {}).get("market"),
                "requested_modes": payload.get("modes", []),
            },
            "mode_evaluations": [
                {
                    "mode": "data_center",
                    "score": 0.87,
                    "summary": "Suitable for additional diligence.",
                }
            ],
            "report_id": "report-123",
            "evaluation_id": "evaluation-456",
            "internal_debug": {
                "headers": dict(self.headers.items()),
            },
        }
        self.send_json(200, response)

    def is_authorized(self) -> bool:
        if EXPECTED_AUTH_MODE in {"bearer", "authorization", "auth"}:
            return self.headers.get("Authorization") == f"Bearer {EXPECTED_KEY}"
        return self.headers.get(EXPECTED_HEADER_NAME) == EXPECTED_KEY

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run a mock GridScope evaluation API.")
    parser.add_argument("port", nargs="?", default=18181, type=int)
    args = parser.parse_args()

    server = ThreadingHTTPServer(("127.0.0.1", args.port), MockGridScopeHandler)
    print(f"Mock GridScope API serving on http://127.0.0.1:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
