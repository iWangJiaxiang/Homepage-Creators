# 浏览器自动化测试

测试工具：Playwright Test 1.64.1 + Chromium。npm 仅用于开发测试，不参与站点发布。

## 安装

需要 Node.js 22+、Python 3 和 Zola 0.23.6。

```sh
npm ci
npx playwright install --with-deps chromium
```

Linux 上 `--with-deps` 会安装浏览器所需系统库和字体，需要管理员权限。浏览器保存在 Playwright 用户缓存目录，不提交到 Git。

## 运行

```sh
npm run test:e2e
# 若 Zola 未加入 PATH，指定二进制路径：
ZOLA=/tmp/opencode/zola-0.23.6/zola npm run test:e2e
npm run test:e2e:report
```

Playwright 自动在临时目录构建生产站点，并启动绑定 `127.0.0.1:4173` 的本地服务器。构建使用本地 base URL，确保图片等资源来自本地而非线上站点，不覆盖 `public/`。运行前请确保该端口空闲。

- 桌面：1440 × 900、1920 × 1080。
- 移动端：320 × 568、390 × 844。
- 平板：768 × 1024（竖屏）、1024 × 768（横屏）。
- 手机和平板启用触摸与移动视口模拟（不是真机）；导航测试根据菜单实际可见性选择交互路径，而非假定触摸设备一定显示折叠菜单。
- 六种尺寸共 66 项测试覆盖中英文页面、图片解码、横向溢出、导航、语言切换和视差效果。
- 另有一项中英文动态 resize 测试检查 375px、768px、1200px 断点前后与横竖屏尺寸切换；仅在一个项目执行，其他五个项目明确跳过重复扫描。完整结果为 67 passed、5 skipped。
- HTML 报告：`playwright-report/index.html`。
- 页面截图作为附件保存在 `playwright-report/` 中，通过报告查看；失败截图及 trace 位于 `test-results/`。
- 默认无重试，避免自动掩盖不稳定测试。
- npm 依赖可用 `npm audit --registry=https://registry.npmjs.org` 检查；部分镜像源不提供审计接口。

目前仅覆盖 Chromium；不代表 Firefox、Safari 或实际移动设备均已验证。截图用于人工检查，尚无像素差异基线。
