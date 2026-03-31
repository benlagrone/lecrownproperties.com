#!/usr/bin/env python3

from __future__ import annotations

import runpy
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


if __name__ == "__main__":
    sys.argv[0] = str(ROOT / "server.py")
    runpy.run_path(str(ROOT / "server.py"), run_name="__main__")
