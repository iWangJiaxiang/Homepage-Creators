#!/usr/bin/env python3
"""Validate the bilingual homepage build (Python 3.11+, standard library only).

Usage: python3 scripts/check_build.py [output_directory]
Run after `zola build`; the default output directory is ./public.
Expectations come from this checkout's config and homepage front matter.
Both AVIF-enabled and WebP-only builds are accepted, but MIME types must match
actual image formats and generated raster pictures must have WebP fallbacks.
"""

import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
import tomllib
from urllib.parse import unquote, urljoin, urlsplit


ROOT = Path(__file__).resolve().parents[1]
VOID = set("area base br col embed hr img input link meta param source track wbr".split())
ESCAPED_HTML = re.compile(
    r"</?(?:html|head|body|meta|title|div|span|picture|source|img|a|h[1-6]|p|br)\b[^>]*>",
    re.IGNORECASE,
)


class Node:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def text(self):
        return "".join(child.text() if isinstance(child, Node) else child
                       for child in self.children)

    def find(self, tag):
        for child in self.children:
            if isinstance(child, Node):
                if child.tag == tag:
                    yield child
                yield from child.find(tag)


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]
        self.escaped = []
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)
        if self.stack[-1].tag not in {"script", "style"} and ESCAPED_HTML.search(data):
            self.escaped.append(data.strip()[:100])


def compact(text):
    return "".join(text.split())


def front_matter(path):
    return tomllib.loads(path.read_text(encoding="utf-8").split("+++", 2)[1])


def image_urls(node):
    if node.attrs.get("src"):
        yield node.attrs["src"].strip()
    # The templates emit local URLs with optional width descriptors, not data URIs.
    for candidate in node.attrs.get("srcset", "").split(","):
        if candidate.strip():
            yield candidate.split()[0]


def check_page(output, relative, language, config, content):
    errors = []

    def check(condition, message):
        if not condition:
            errors.append(message)

    path = output / relative
    if not path.is_file():
        return ["missing HTML file (run zola build first)"]
    document = Document(path.read_text(encoding="utf-8"))
    root = document.root
    html = list(root.find("html"))
    check(len(html) == 1 and html[0].attrs.get("lang") == language,
          "expected exactly one <html lang={!r}>".format(language))
    expected_title = config.get("languages", {}).get(language, {}).get("title", config["title"])
    titles = list(root.find("title"))
    check(len(titles) == 1 and titles[0].text().strip() == expected_title,
          "expected one localized title {!r}".format(expected_title))
    check(not document.escaped, "escaped component HTML: " + repr(document.escaped[:3]))

    base = config["base_url"].rstrip("/") + "/"
    page_url = base + ("en/" if language == "en" else "")
    for key in ("og:url", "twitter:url"):
        values = [n.attrs.get("content", "").strip() for n in root.find("meta")
                  if n.attrs.get("property", n.attrs.get("name")) == key]
        check(values == [page_url], "{} must be {!r}, got {!r} (check duplicate base URL)".format(
            key, page_url, values))
    for link in root.find("link"):
        if "canonical" in link.attrs.get("rel", "").split():
            check(link.attrs.get("href") == page_url, "incorrect canonical link URL")

    bodies = list(root.find("body"))
    check(len(bodies) == 1, "expected exactly one body")
    body_text = compact(bodies[0].text()) if bodies else ""
    widgets = content["extra"]["index"]["widgets"]
    if language == config["default_language"]:
        widgets = config.get("extra", {}).get("index", {}).get("widgets", widgets)
    for number, widget in enumerate(widgets, 1):
        value = widget["value"]
        # Use content rather than CSS classes or widget order. Check descriptions
        # as well as titles so navigation labels cannot mask a missing widget.
        fields = [key for key in ("title", "title_1", "title_2", "name", "bio", "bio_1", "bio_2")
                  if value.get(key)]
        for field in fields:
            expected = compact(Document(value[field]).root.text())
            check(expected in body_text,
                  "widget {} ({}) missing {} content".format(number, widget["type"], field))
        for item in value.get("items", []) + [item for column in value.get("columns", [])
                                               for item in column.get("items", [])]:
            expected = compact(Document(item["title"]).root.text())
            check(any(a.attrs.get("href") == item["url"] and expected in compact(a.text())
                      for a in root.find("a")),
                  "widget {} missing item link {!r}".format(number, item["title"]))

    def local_file(url):
        resolved = urlsplit(urljoin(page_url, url))
        if resolved.scheme not in {"http", "https"} or resolved.netloc != urlsplit(base).netloc:
            return None
        url_path = unquote(resolved.path)
        base_path = urlsplit(base).path
        if base_path != "/" and url_path.startswith(base_path):
            url_path = url_path[len(base_path):]
        target = (output / url_path.lstrip("/")).resolve()
        if not target.is_relative_to(output.resolve()):
            check(False, "asset path escapes output directory: " + url)
            return None
        return target

    scripts = [n.attrs["src"] for n in root.find("script") if n.attrs.get("src")]
    local_scripts = [url for url in scripts if local_file(url) is not None]
    check(bool(local_scripts), "no local scripts rendered")
    for url in local_scripts:
        check(local_file(url).is_file(), "missing local script: " + url)

    processed = set()
    for tag in ("img", "source"):
        for node in root.find(tag):
            urls = list(image_urls(node))
            check(bool(urls), "{} has no image URL".format(tag))
            for url in urls:
                target = local_file(url)
                if target is not None:
                    check(target.is_file(), "missing local image: " + url)
                    if "processed_images" in target.parts:
                        processed.add(target)
                if tag == "source":
                    extension = urlsplit(url).path.lower().rsplit(".", 1)[-1]
                    expected_type = {"avif": "image/avif", "webp": "image/webp",
                                     "svg": "image/svg+xml"}.get(extension)
                    check(expected_type is not None and node.attrs.get("type") == expected_type,
                          "source MIME type {!r} does not match {}".format(node.attrs.get("type"), url))
    check(bool(processed), "no /processed_images assets referenced")
    pictures = list(root.find("picture"))
    check(bool(pictures), "no image components (<picture>) rendered")
    for number, picture in enumerate(pictures, 1):
        sources = [url for node in picture.find("source") for url in image_urls(node)]
        images = [url for node in picture.find("img") for url in image_urls(node)]
        check(bool(sources) and bool(images), "picture {} lacks sources or fallback images".format(number))
        # SVG and original AVIF inputs are intentionally passed through by the
        # thumbnail component. Generated raster sources need real WebP fallbacks.
        generated = [url for url in sources if "/processed_images/" in urlsplit(url).path]
        if generated:
            check(all(urlsplit(url).path.endswith(".webp") for url in images),
                  "picture {} must use WebP img/thumbnail/noscript fallbacks".format(number))
            check(any(True for _ in picture.find("noscript")),
                  "picture {} lacks a noscript fallback".format(number))
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", type=Path, default=Path("public"),
                        help="build output directory (default: public)")
    args = parser.parse_args()
    try:
        config = tomllib.loads((ROOT / "config.toml").read_text(encoding="utf-8"))
        failed = False
        for relative, language, content_file in (
            ("index.html", config["default_language"], "_index.md"),
            ("en/index.html", "en", "_index.en.md"),
        ):
            errors = check_page(args.output, relative, language, config,
                                front_matter(ROOT / "content" / content_file))
            failed = failed or bool(errors)
            print("{}: {}".format(args.output / relative, "FAIL" if errors else "OK"))
            for error in errors:
                print("  - " + error)
        return 1 if failed else 0
    except (OSError, ValueError, KeyError) as error:
        print("Build validation error: {}".format(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
