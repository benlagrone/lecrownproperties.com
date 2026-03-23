#!/usr/bin/env python3

from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent.parent


class SPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):  # noqa: D401
        parsed = urlparse(self.path)
        requested = Path(self.translate_path(parsed.path))

        if requested.exists():
            return super().send_head()

        self.path = "/index.html"
        return super().send_head()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Serve the static site with SPA fallback routing.",
    )
    parser.add_argument("port", nargs="?", default=4173, type=int)
    args = parser.parse_args()

    server = ThreadingHTTPServer(("127.0.0.1", args.port), SPARequestHandler)
    print(f"Serving {ROOT} on http://127.0.0.1:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
