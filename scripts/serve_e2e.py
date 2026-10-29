"""Build with local asset URLs and serve an isolated production output for E2E."""
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Browser tests report failed requests; suppress successful asset noise.
        if len(args) < 2 or str(args[1]) not in ("200", "304"):
            super().log_message(format, *args)


with tempfile.TemporaryDirectory(prefix="homepage-e2e-") as directory:
    output = Path(directory) / "public"
    subprocess.run([
        os.environ.get("ZOLA", "zola"), "build",
        "--base-url", "http://127.0.0.1:4173",
        "--output-dir", str(output),
    ], cwd=ROOT, check=True)
    server = ThreadingHTTPServer(
        ("127.0.0.1", 4173), functools.partial(Handler, directory=str(output))
    )
    try:
        server.serve_forever()
    finally:
        server.server_close()
