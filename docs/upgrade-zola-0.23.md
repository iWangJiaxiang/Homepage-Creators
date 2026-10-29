# Zola 0.23 upgrade / 升级指南

## 中文

本主题现在要求 **Zola 0.23.6+**（升级时核实的最新稳定版）。升级主题子模块时，请同时升级本地 Zola、CI 和托管平台的 `ZOLA_VERSION`，不要只更新模板。

### 配置和自定义模板

- 删除旧的 `[markdown] highlight_code = false`：默认不启用语法高亮。如果需要高亮，使用新的 `[markdown.highlighting]` 配置，例如 `theme = "github-dark"`。旧的 `highlight_theme` 等配置不再适用。
- Zola 0.23 使用 Tera 2；旧 `{% macro %}`、`{% import %}` 和 `namespace::macro(...)` 已移除。自定义模板需迁移为 `{% component %}` 和 `{{ <component_name arg={value} /> }}`。组件上下文需通过参数传递。主题组件集中于 `templates/_components.html` 和 widget 模板，使用 `site.*` 命名空间；覆写旧 `_macros.html` 的站点需同步迁移。
- 检查自定义模板中的多层可选字段，使用 `?.` 避免访问未定义的父字段。
- `get_section` / `get_page` 使用不带语言后缀的标准路径和 `lang` 参数，不再传入 `_index.en.md` 之类的路径。
- Markdown 内容现在也会进行模板渲染；如果正文包含演示用 Tera 代码，使用 `{% raw %}...{% endraw %}` 包裹，或配置 `skip_content_templating`。
- 原有 `config.extra.index.widgets`（默认语言）和 `section.extra` 多语言配置仍受支持，无需重写页面数据。

### 依赖和部署

- jQuery：3.6.0 → 4.0.0；事件绑定改为 `.on()`。
- simpleParallax：5.6.2 → 7.0.0，使用 vanilla UMD 版本；浏览器构造器为 `SimpleParallax`。不需要 React 或 npm 构建步骤。浏览器需支持新版上游库要求的现代 JavaScript 特性。
- 前端依赖来源、校验值和 MIT 许可证见 [`static/libs/README.md`](../static/libs/README.md)。
- CI 直接下载并校验 Zola 0.23.6 的官方二进制，替代未提供对应最新 Zola 版本的旧部署容器。
- 推送和 PR 自动检查/构建；部署保持为仅 `main` 分支手动触发，产物仍写入 `gh-pages`。

### 本地验证

```sh
zola --version # 0.23.6
zola check --skip-external-links
zola build
python3 scripts/check_build.py
python3 scripts/check_templates.py
zola serve
```

检查中文 `/`、英文 `/en/`、语言切换、导航、渐进式图片和视差效果。`--skip-external-links` 避免外部网站可用性影响构建检查；需要完整外链检查时运行 `zola check`。

## English

This theme now requires **Zola 0.23.6+**, the latest stable version verified for this upgrade. Upgrade local Zola, CI and hosting `ZOLA_VERSION` together with the theme.

- Remove `[markdown] highlight_code = false`; highlighting is disabled by default. Opt in using `[markdown.highlighting]` with a theme such as `github-dark`.
- Migrate custom Tera macros/imports to Tera 2 components and pass their context as parameters. Use optional chaining for nested optional fields.
- Pass canonical paths plus `lang` to `get_section` / `get_page`, rather than language-suffixed paths.
- Markdown is now templated too. Wrap literal template examples in raw blocks or configure `skip_content_templating`.
- Legacy default-language widgets in `config.extra` and multilingual front-matter data remain supported.
- jQuery is now 4.0.0 and simpleParallax is 7.0.0 (vanilla UMD, browser global `SimpleParallax`). No React or npm build is required. See the vendored dependency README for provenance and licenses.
- CI verifies the official Zola binary checksum and builds pushes/PRs. Only a manual workflow run on `main` deploys to the existing `gh-pages` branch.
- Run the commands above, then inspect both languages, navigation and image effects. External links are intentionally skipped in CI.

## Browser tests / 浏览器测试

已新增 Playwright + Chromium 无头浏览器测试，安装和运行方式见[浏览器测试指南](browser-testing.md)。测试依赖不参与生产站点构建。

## Upstream references

- [Zola 0.23.6 release](https://github.com/getzola/zola/releases/tag/v0.23.6)
- [Zola changelog](https://github.com/getzola/zola/blob/v0.23.6/CHANGELOG.md)
- [Tera 2 migration guide](https://github.com/Keats/tera/blob/master/MIGRATION.md)
