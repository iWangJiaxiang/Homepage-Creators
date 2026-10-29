# Vendored JavaScript dependencies

Versions verified against the npm registry `latest` dist-tags on 2026-10-27.
These are unmodified official npm distribution files, served locally; no npm,
React, bundler, or module loader is required by the website.

| Dependency | Version | Local distribution | Upstream file | License |
| --- | --- | --- | --- | --- |
| [jQuery](https://jquery.com/) | 4.0.0 | `static/libs/jquery/jquery.min.js` | `package/dist/jquery.min.js` | MIT; [local license](jquery/LICENSE.txt) |
| [simpleParallax.js](https://github.com/geosigno/simpleParallax.js) | 7.0.0 | `static/js/simpleParallax.min.js` | `package/dist/vanilla/simpleParallaxVanilla.umd.js` | MIT; [local license](simple-parallax-js/LICENSE) |

## Official sources and verification

- jQuery version metadata: <https://registry.npmjs.org/jquery/latest>
- jQuery archive: <https://registry.npmjs.org/jquery/-/jquery-4.0.0.tgz>
- simpleParallax version metadata: <https://registry.npmjs.org/simple-parallax-js/latest>
- simpleParallax archive: <https://registry.npmjs.org/simple-parallax-js/-/simple-parallax-js-7.0.0.tgz>
- simpleParallax upstream usage: <https://github.com/geosigno/simpleParallax.js/blob/v7.0.0/README.md>

Each downloaded archive was checked against the registry's SHA-512 `dist.integrity`
before extracting the distribution and its license. SHA-256 of the vendored scripts:

```text
39a546ea9ad97f8bfaf5d3e0e8f8556adb415e470e59007ada9759dce472adaa  static/libs/jquery/jquery.min.js
cc3592bdd6874947e634b50a9d838a2bce65db75fe4e672cb2f9f078a062dfcf  static/js/simpleParallax.min.js
```

## Integration notes

- Keep the existing classic-script order in `templates/partial/layout/head.html`:
  jQuery, simpleParallax, then `main.js`.
- simpleParallax's package default is the **React** implementation. The vendored
  file is explicitly the **vanilla UMD** distribution, retained at the existing
  local URL. Version 7 exposes `window.SimpleParallax` (capital S); `main.js` uses
  that constructor and retains the existing animation options.
- Menu click binding uses jQuery's `.on('click', handler)` rather than the removed
  `.click(handler)` event shorthand in jQuery 4.
- These upstream bundles target modern browsers. Vanilla means direct browser
  scripts without React, not legacy-browser compatibility; the simpleParallax
  bundle contains modern JavaScript syntax and uses `matchMedia` and
  `IntersectionObserver`.

## Validation

- Both bundles and `main.js` pass `node --check`.
- A temporary jsdom smoke test loaded the actual classic scripts in order and
  checked jQuery 4.0.0, the vanilla `SimpleParallax` global (without React),
  DOM-ready initialization, menu opening/closing, and language dropdown
  opening/closing, with reduced motion both enabled and disabled.
- jsdom does not validate visual animation or real browser layout; those require
  a browser check.
