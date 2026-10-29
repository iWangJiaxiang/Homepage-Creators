const { test: base, expect } = require('@playwright/test');

// Observe the real site: do not mock image requests or suppress browser errors.
const test = base.extend({
  browserHealth: [async ({ page, baseURL }, use, testInfo) => {
    const errors = [];
    const origin = new URL(baseURL).origin;
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('response', response => {
      if (new URL(response.url()).origin === origin && response.status() >= 400) {
        errors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
    page.on('requestfailed', request => {
      if (new URL(request.url()).origin === origin) {
        errors.push(`requestfailed: ${request.url()} (${request.failure()?.errorText})`);
      }
    });
    await use();
    await testInfo.attach('browser-health', {
      body: Buffer.from(JSON.stringify(errors, null, 2)),
      contentType: 'application/json',
    });
    expect(errors, 'No JavaScript errors, console errors, or failed local requests').toEqual([]);
  }, { auto: true }],
});

const languages = [
  { path: '/', lang: 'zh', featured: '推荐文章', home: '主页', blog: '博客' },
  { path: '/en/', lang: 'en', featured: 'Featured Posts', home: 'Home', blog: 'Blog' },
];

async function screenshot(page, testInfo, name, fullPage = false) {
  await testInfo.attach(name, {
    body: await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage, animations: 'disabled' }),
    contentType: 'image/png',
  });
}

async function dismissLanguageNotice(page) {
  const banner = page.locator('#lang-detect-banner');
  if (await banner.isVisible()) await page.locator('#lang-detect-dismiss').click();
}

async function expectNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectLoaded(image) {
  await expect.poll(() => image.evaluate(element =>
    element.complete && element.naturalWidth > 0 && element.naturalHeight > 0 &&
    !!element.currentSrc && !element.currentSrc.startsWith('data:')
  ), { message: 'Real progressive image decodes successfully' }).toBe(true);
  await expect(image).toHaveClass(/\bloaded\b/);
  await expect(image.locator('..')).toHaveClass(/\bloaded\b/);
}

for (const language of languages) {
  test.describe(`${language.lang} homepage`, () => {
    test('renders translated content, loads progressive images on scroll, and fits the viewport', async ({ page }, testInfo) => {
      await page.goto(language.path);
      await expect(page.locator('html')).toHaveAttribute('lang', new RegExp(`^${language.lang}(?:-|$)`));
      await expect(page.locator('.title-group')).toContainText('Jiaxiang Wang');
      await expect(page.getByText(language.featured, { exact: true })).toBeVisible();
      await expectNoOverflow(page);
      await screenshot(page, testInfo, 'initial-viewport');

      // Responsive CSS intentionally hides decorative cards on smaller screens.
      const images = page.locator('img.progressive-content:visible');
      expect(await images.count()).toBeGreaterThan(5);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await expectLoaded(image);
        await expectNoOverflow(page);
      }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expectNoOverflow(page);
      await screenshot(page, testInfo, 'loaded-full-page', true);
    });

    test('internal navigation scrolls to its target and the logo returns to the top', async ({ page }, testInfo) => {
      await page.goto(language.path);
      await dismissLanguageNotice(page);
      const compactNav = await page.locator('#nav-menu').isVisible();
      if (compactNav) await page.locator('#nav-menu').click();
      const navigation = page.locator(compactNav ? '#menu-list' : '.nav-center');
      await navigation.getByText(language.blog, { exact: true }).click();
      const target = page.locator(`[id="${language.blog}"]`).first();
      await expect.poll(() => target.evaluate(element => Math.abs(element.getBoundingClientRect().top - 60)), {
        message: 'Navigation scrolls the selected section below the fixed navigation',
      }).toBeLessThan(5);
      if (compactNav) await expect(page.locator('body')).not.toHaveClass(/show-menu/);
      await screenshot(page, testInfo, 'internal-navigation');
      await page.locator('.site-logo').click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
    });

    test('parallax changes the actual image transform when scrolling', async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(language.path);
      await dismissLanguageNotice(page);
      const image = page.locator('.banner-pic-img .progressive-content').first();
      await image.scrollIntoViewIfNeeded();
      await expectLoaded(image);
      const transform = () => image.evaluate(element => getComputedStyle(element).transform);
      await expect.poll(transform).not.toBe('none');
      // Let the configured two-second parallax transition settle before comparing.
      await page.waitForTimeout(2200);
      const before = await transform();
      await page.evaluate(() => window.scrollBy(0, -180));
      await expect.poll(transform, { timeout: 5000 }).not.toBe(before);
      await screenshot(page, testInfo, 'parallax-scrolled');
    });

    test('reduced motion leaves parallax images untransformed while scrolling', async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(language.path);
      await dismissLanguageNotice(page);
      const image = page.locator('.banner-pic-img .progressive-content').first();
      await image.scrollIntoViewIfNeeded();
      await expectLoaded(image);
      const transform = () => image.evaluate(element => getComputedStyle(element).transform);
      await expect.poll(transform).toBe('none');
      await page.evaluate(() => window.scrollBy(0, -180));
      await page.waitForTimeout(250);
      await expect.poll(transform).toBe('none');
      await screenshot(page, testInfo, 'reduced-motion');
    });
  });
}

test('language switch works through the desktop dropdown or mobile menu in both directions', async ({ page }, testInfo) => {
  await page.goto('/');
  for (const destination of [{ path: '/en/', lang: 'en' }, { path: '/', lang: 'zh' }]) {
    await dismissLanguageNotice(page);
    if (await page.locator('#nav-menu').isVisible()) {
      await page.locator('#nav-menu').click();
      await expect(page.locator('body')).toHaveClass(/show-menu/);
      await screenshot(page, testInfo, `language-menu-${destination.lang}`);
      await page.locator(`.lang-mobile-group a[href="${destination.path}"]`).click();
    } else {
      await page.locator('#lang-switch-btn').click();
      await expect(page.locator('#lang-dropdown')).toHaveClass(/open/);
      await screenshot(page, testInfo, `language-menu-${destination.lang}`);
      await page.locator(`#lang-dropdown-menu a[href="${destination.path}"]`).click();
    }
    await expect(page).toHaveURL(new RegExp(`${destination.path}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', new RegExp(`^${destination.lang}(?:-|$)`));
    await expectNoOverflow(page);
  }
});

test('responsive breakpoint boundaries and orientation changes remain usable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One resize sweep covers CSS boundaries');
  for (const path of ['/', '/en/']) {
    await page.goto(path);
    await dismissLanguageNotice(page);
    for (const width of [374, 375, 376, 767, 768, 769, 1024, 1199, 1200, 1201, 768]) {
      await page.setViewportSize({ width, height: width <= 768 ? 1024 : 768 });
      await expectNoOverflow(page);
      if (width <= 768) {
        await expect(page.locator('#nav-menu')).toBeVisible();
        await page.locator('#nav-menu').click();
        await expect(page.locator('body')).toHaveClass(/show-menu/);
        await expect(page.locator('.lang-mobile-group a').first()).toBeVisible();
        await page.locator('#nav-menu').click();
        await expect(page.locator('body')).not.toHaveClass(/show-menu/);
      } else {
        await expect(page.locator('.nav-center')).toBeVisible();
        await page.locator('#lang-switch-btn').click();
        await expect(page.locator('#lang-dropdown')).toHaveClass(/open/);
        await page.locator('#lang-switch-btn').click();
      }
    }
  }
});

test.describe('English browser language detection', () => {
  test.use({ locale: 'en-US' });

  test('offers English on the Chinese page and persists dismissal across reload and navigation', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page.locator('#lang-detect-banner')).toBeVisible();
    await expect(page.locator('#lang-detect-text')).not.toBeEmpty();
    await expect(page.locator('#lang-detect-action')).toHaveAttribute('href', '/en/');
    await expect(page.locator('body')).toHaveClass(/lang-banner-active/);
    await expectNoOverflow(page);
    await screenshot(page, testInfo, 'language-detection');
    await page.locator('#lang-detect-dismiss').click();
    await expect(page.locator('#lang-detect-banner')).toBeHidden();
    await expect(page.locator('body')).not.toHaveClass(/lang-banner-active/);
    expect(await page.evaluate(() => sessionStorage.getItem('lang-detect-dismissed'))).toBe('1');
    await page.reload();
    await expect(page.locator('#lang-detect-banner')).toBeHidden();
    await page.goto('/en/');
    await expect(page.locator('#lang-detect-banner')).toBeHidden();
    await page.goto('/');
    await expect(page.locator('#lang-detect-banner')).toBeHidden();
  });

  test('detection action opens English, where no mismatch notice is shown', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lang-detect-action').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#lang-detect-banner')).toBeHidden();
  });
});
