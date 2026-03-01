# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homepage-Creators is a Zola static site generator theme that creates beautiful personal homepage websites, inspired by Apple's design aesthetic. It is a port of the HeoWeb static theme.

- **Repository**: https://github.com/iWangJiaxiang/Homepage-Creators
- **Demo**: https://jiaxiang.wang
- **License**: AGPL
- **Min Zola Version**: 0.19.2

## Common Commands

```bash
# Local development (serves at localhost:1111 with live reload)
zola serve

# Production build (outputs to public/ folder)
zola build

# VS Code task also available: "zola serve"
```

## Architecture

### Template System
- **Engine**: Tera (Zola's templating language)
- **Entry point**: `templates/index.html` - iterates over widgets defined in `config.toml`
- **Base template**: `templates/base.html` - defines HTML structure with head, nav, content, footer blocks
- **Macros**: `templates/_macros.html` - contains reusable template functions for images, thumbnails, and widget rendering

### Widget System
Widgets are modular components defined in `config.toml` under `[[extra.index.widgets]]`. The widget type determines which partial template is rendered:

| Widget Type | Template | Purpose |
|-------------|----------|---------|
| `header` | `partial/widget/header.html` | Hero/landing section with title, bio, cover image |
| `author` | `partial/widget/author.html` | Author introduction with avatar and bio |
| `product-single` | `partial/widget/product-single.html` | Single project/product showcase |
| `product-list` | `partial/widget/product-list.html` | Grid of multiple projects/products |
| `event` | `partial/widget/event.html` | Timeline/event display with background image |

Widget rendering is handled by the `render_widget` macro in `_macros.html`, which dispatches to the appropriate partial based on the widget type.

### Configuration
Configuration is split between `config.toml` (global) and front-matter `[extra]` in content files (per-language):

**`config.toml`** (language-agnostic):
- `[extra.site]` - Site metadata (logo, email, ICP/security filing numbers)
- `[extra.other]` - Feature flags (AVIF enable)
- `[extra.i18n_detect]` - Language detection prompt dictionary (all languages)
- `[[extra.index.widgets]]` - **Legacy**: page content (kept for backward compatibility)
- `[extra.nav]` - **Legacy**: navigation menus (kept for backward compatibility)

**`content/_index.md` / `content/_index.en.md`** (per-language):
- `[extra.i18n]` - UI strings (learn_more, hot, new, etc.)
- `[extra.nav]` - Navigation menus for this language
- `[[extra.index.widgets]]` - Page content widgets for this language

### Internationalization (i18n)

The theme supports multiple languages via a **front-matter driven** architecture:

```
content/
  _index.md        ← Default language (zh), widgets + nav + i18n strings in [extra]
  _index.en.md     ← English version, same structure
  _index.xx.md     ← Add more languages by creating new files
```

**How it works:**
- Each `_index.[lang].md` contains all translatable content in its `[extra]` front-matter
- Templates read from `section.extra` to get language-specific data
- `config.toml` holds only language-agnostic settings

**Backward compatibility:** If `config.extra.index.widgets` exists in `config.toml` (legacy mode), the default language page uses it instead of `section.extra`. This ensures users upgrading to the new theme version don't break their existing setup.

**Adding a new language:**
1. Register the language in `config.toml`: `[languages.xx]`
2. Create `content/_index.xx.md` with translated `[extra]` content (copy structure from `_index.en.md`)
3. Add a language detection entry in `config.toml`: `[extra.i18n_detect.xx]`

**Language detection:** The theme includes `i18n.js` which detects the user's browser language and shows a suggestion banner if a matching translation is available. The detection dictionary is configured globally in `config.toml` under `[extra.i18n_detect]`.

### Static Assets
- `static/main.css` - All styles
- `static/js/main.js` - Main JavaScript (parallax effects, progressive image loading)
- `static/js/i18n.js` - Language detection and switch suggestion
- `static/js/simpleParallax.min.js` - Parallax library
- `static/img/` - Image assets (logos, covers)
- `static/iconfont/` - Icon font (icomoon)

### Image Processing
The theme includes built-in image optimization:
- Automatic AVIF/WebP format conversion (controlled by `config.extra.other.avif_enable`)
- Progressive loading with blur-up effect via `img_progressive_loading` macro
- Responsive srcset generation for multiple viewport sizes
- Thumbnails generated at build time via Tera's `resize_image` filter

## Deployment

GitHub Actions workflow (`.github/workflows/build-gh-pages.yml`) automatically builds and deploys to GitHub Pages on pushes to main branch using the `shalzz/zola-deploy-action`.

## Project Relationship

This theme is used as a Git submodule by the parent project at `G:\Work Space\jiaxiang.wang\` (separate git repository). When developing the theme:
1. Make changes in this repository
2. Test locally with `zola serve`
3. Update the submodule reference in the parent project to test integration
