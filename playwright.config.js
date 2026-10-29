const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
    locale: 'zh-CN',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-chromium', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'small-mobile-chromium', use: { viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true } },
    { name: 'tablet-portrait-chromium', use: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true } },
    { name: 'tablet-landscape-chromium', use: { viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true } },
    { name: 'wide-desktop-chromium', use: { viewport: { width: 1920, height: 1080 } } },
  ],
  webServer: {
    command: 'python3 scripts/serve_e2e.py',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
