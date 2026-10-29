"""Build isolated compatibility fixtures with Zola (stdlib only)."""
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
ZOLA = os.environ.get("ZOLA", "zola")


def main():
    with tempfile.TemporaryDirectory(prefix="homepage-templates-") as directory:
        fixture = Path(directory)
        for name in ("templates", "content", "static"):
            shutil.copytree(ROOT / name, fixture / name)
        base = (ROOT / "config.toml").read_text(encoding="utf-8")

        def build(label, config):
            (fixture / "config.toml").write_text(config, encoding="utf-8")
            subprocess.run([ZOLA, "build"], cwd=fixture, check=True)
            print(f"PASS: {label}")

        def html(lang=""):
            return (fixture / "public" / lang / "index.html").read_text(encoding="utf-8")

        build("multilingual frontmatter", base)
        assert "了解更多" in html() and "Learn More" in html("en")
        assert "image/avif" in html()

        build("AVIF disabled", base.replace("avif_enable = true", "avif_enable = false"))
        assert "image/avif" not in html() and "image/webp" in html()

        legacy = '''
[[extra.index.widgets]]
type = "header"
[extra.index.widgets.value]
title_1 = "LEGACY_WIDGET_TEST"
title_2 = "Legacy"
bio_1 = "One"
bio_2 = "Two"
about_url = "https://example.com"
cover = "/img/logo.svg"
links = []
[extra.nav.center]
menus = [{name="LEGACY_NAV_TEST",url="https://example.com"}]
'''
        build("legacy widgets and navigation", base + legacy)
        assert "LEGACY_WIDGET_TEST" in html() and "LEGACY_NAV_TEST" in html()
        assert "LEGACY_WIDGET_TEST" not in html("en")
        assert "LEGACY_NAV_TEST" not in html("en")

        config = re.sub(r"\[extra.analytics.umami\].*?(?=\[extra.other\])", "", base, flags=re.S)
        config = re.sub(r"\[extra.other\].*?(?=\[extra.i18n_detect.zh\])", "", config, flags=re.S)
        for path in (fixture / "content").glob("*.md"):
            text = re.sub(r"\[extra.i18n\].*?(?=\[extra.nav.message\])", "", path.read_text(encoding="utf-8"), flags=re.S)
            path.write_text(text, encoding="utf-8")
        build("missing optional settings and translations", config)
        assert "More" in html() and "All rights reserved." in html()

        for path in (fixture / "content").glob("*.md"):
            path.write_text('+++\ntemplate = "index.html"\n+++\n', encoding="utf-8")
        build("minimal frontmatter", config)
    print("All template compatibility checks passed.")


if __name__ == "__main__":
    main()
