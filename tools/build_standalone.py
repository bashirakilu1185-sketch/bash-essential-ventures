#!/usr/bin/env python3
"""
Build a single-file, fully offline copy of the EL BASH SMART TECH HUB storefront.

Everything (CSS, JS, fonts, every product/category/hero image) is embedded into
one .html file, so it opens straight from a download folder, a USB stick or an
email attachment with no server and no internet.

This is the same kind of build that produced the live Netlify deployment:
  - CSS and JS are inlined
  - fonts become data: URIs
  - every image becomes a data: URI, exposed through window.BASH_IMAGE_MANIFEST
    (WebP + JPEG), which assets/js/main.js resolves before local paths

Usage:
    python3 tools/build_standalone.py
    python3 tools/build_standalone.py --out dist/storefront.html
"""

import argparse
import base64
import json
import mimetypes
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(path, binary=False):
    p = os.path.join(ROOT, path)
    with open(p, "rb" if binary else "r", **({} if binary else {"encoding": "utf-8"})) as f:
        return f.read()


def data_uri(path):
    raw = read(path, binary=True)
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    if path.endswith(".woff2"):
        mime = "font/woff2"
    return "data:%s;base64,%s" % (mime, base64.b64encode(raw).decode("ascii"))


def collect_images():
    """Map every image path referenced by the project to its data URIs.

    A logical path such as assets/img/products/cable.webp gets both a WebP and a
    JPEG data URI so <picture> can offer both formats.
    """
    manifest = {}
    img_root = os.path.join(ROOT, "assets", "img")
    for dirpath, _dirnames, filenames in os.walk(img_root):
        for name in sorted(filenames):
            if not name.lower().endswith((".webp", ".jpg", ".jpeg")):
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), ROOT).replace(os.sep, "/")
            base = re.sub(r"\.(webp|jpe?g)$", "", rel, flags=re.I)
            webp = base + ".webp"
            jpg = base + ".jpg"
            entry = {}
            if os.path.exists(os.path.join(ROOT, webp)):
                entry["webp"] = data_uri(webp)
            if os.path.exists(os.path.join(ROOT, jpg)):
                entry["jpg"] = data_uri(jpg)
            if entry:
                manifest[rel] = entry
                # also register the sibling extension so either path resolves
                if rel.endswith(".webp"):
                    manifest[base + ".jpg"] = entry
                elif rel.endswith(".jpg"):
                    manifest[base + ".webp"] = entry
    return dict(sorted(manifest.items()))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="standalone/el-bash-smart-tech-hub.html")
    args = ap.parse_args()

    html = read("index.html")

    # ---- CSS -> inline <style> -------------------------------------------
    css = read("assets/css/styles.css")
    css = css.replace("url('../fonts/sora-var.woff2')", "url('%s')" % data_uri("assets/fonts/sora-var.woff2"))
    css = css.replace("url('../fonts/inter-var.woff2')", "url('%s')" % data_uri("assets/fonts/inter-var.woff2"))

    html = html.replace(
        '<link rel="stylesheet" href="assets/css/styles.css">',
        "<style>\n%s\n</style>" % css,
    )

    # ---- images ----------------------------------------------------------
    manifest = collect_images()
    def inline_attr(m):
        attr, path = m.group(1), m.group(2)
        entry = manifest.get(path)
        if not entry:
            return m.group(0)
        return '%s="%s"' % (attr, entry.get(attr if attr == "srcset" else "jpg") or entry.get("jpg"))

    # hero <picture>: point sources at embedded data URIs, add manifest hook
    def hero_picture(m):
        block = m.group(0)
        for path, attr in (("assets/img/hero-showcase-sm.webp", "srcset"),
                           ("assets/img/hero-showcase.webp", "srcset"),
                           ("assets/img/hero-showcase.jpg", "src")):
            entry = manifest.get(path, {})
            val = entry.get("webp") if path.endswith(".webp") else entry.get("jpg")
            if val:
                block = block.replace('%s="%s"' % (attr, path), '%s="%s"' % (attr, val))
        return block

    html = re.sub(r"<picture>.*?</picture>", hero_picture, html, flags=re.S)

    # any remaining plain src/srcset references to local images -> data URIs
    for path, entry in manifest.items():
        val = entry.get("jpg") or entry.get("webp")
        html = html.replace('src="%s"' % path, 'src="%s"' % val)
        webp = entry.get("webp")
        if webp:
            html = html.replace('srcset="%s"' % path, 'srcset="%s"' % webp)

    # preload hints point at files the standalone build has already inlined,
    # so they would be dead requests — drop them.
    html = re.sub(r'<link rel="preload"[^>]*>\s*\n?', "", html)

    # small icon / vector assets (favicons, brand logo) -> data URIs
    for rel in ("assets/img/favicon.svg", "assets/brand/logo.svg",
                "assets/img/apple-touch-icon.png", "assets/img/og-image.jpg"):
        if os.path.exists(os.path.join(ROOT, rel)):
            html = html.replace('href="%s"' % rel, 'href="%s"' % data_uri(rel))

    # ---- JS -> inline <script> -------------------------------------------
    manifest_js = (
        "<script>\n"
        "/* Embedded images for offline use - generated by tools/build_standalone.py */\n"
        "window.BASH_IMAGE_MANIFEST = %s;\n"
        "</script>\n" % json.dumps(manifest)
    )
    products_js = "<script>\n%s\n</script>\n" % read("assets/js/products.js")
    main_js = "<script>\n%s\n</script>\n" % read("assets/js/main.js")

    html = html.replace('<script src="assets/js/products.js"></script>', manifest_js + products_js.rstrip("\n"))
    html = html.replace('<script src="assets/js/main.js"></script>', main_js.rstrip("\n"))

    # ---- output ----------------------------------------------------------
    out = os.path.join(ROOT, args.out)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)

    size = os.path.getsize(out) / (1024 * 1024)
    print("built %s (%.2f MB, %d embedded image paths)" % (args.out, size, len(manifest)))
    leftovers = re.findall(r'(?:src|href)="(assets/[^"]+)"', html)
    if leftovers:
        print("warning: unresolved local references:", sorted(set(leftovers))[:8], file=sys.stderr)


if __name__ == "__main__":
    main()
