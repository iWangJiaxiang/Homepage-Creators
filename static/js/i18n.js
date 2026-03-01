/**
 * i18n.js - 多语言检测与切换提示
 * 
 * 从 window.__i18n_detect 读取全局字典（由 config.toml 配置、模板渲染为内联 JS）
 * 检测用户浏览器语言，在语言不匹配时显示切换提示 banner
 */
(function () {
  'use strict';

  var detectDict = window.__i18n_detect;
  var supportedLangs = window.__supported_languages;

  // 无配置或无支持语言列表则不执行
  if (!detectDict || !supportedLangs || supportedLangs.length < 2) return;

  // 已关闭过则不再显示（同 session）
  if (sessionStorage.getItem('lang-detect-dismissed')) return;

  var currentLang = document.documentElement.lang || 'en';

  // 获取用户浏览器语言（取主语言代码，如 zh-CN → zh, en-US → en）
  var userLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();

  // 如果用户语言就是当前页面语言，不需要提示
  if (userLang === currentLang || userLang === currentLang.split('-')[0]) return;

  // 查找用户语言是否在支持的语言列表中
  var targetLang = null;
  for (var i = 0; i < supportedLangs.length; i++) {
    if (supportedLangs[i] === userLang || supportedLangs[i].split('-')[0] === userLang) {
      targetLang = supportedLangs[i];
      break;
    }
  }

  // 用户语言不在支持列表中，则设为英语
  if (!targetLang) targetLang = 'en';

  // 获取目标语言的提示信息
  var detectInfo = detectDict[targetLang];
  if (!detectInfo || !detectInfo.message || !detectInfo.url) return;

  // 显示 banner
  var banner = document.getElementById('lang-detect-banner');
  var textEl = document.getElementById('lang-detect-text');
  var actionEl = document.getElementById('lang-detect-action');
  var dismissEl = document.getElementById('lang-detect-dismiss');

  if (!banner || !textEl || !actionEl || !dismissEl) return;

  textEl.textContent = detectInfo.message;
  actionEl.textContent = detectInfo.action || 'Switch';
  actionEl.href = detectInfo.url;

  banner.style.display = '';
  document.body.classList.add('lang-banner-active');

  // 关闭按钮
  dismissEl.addEventListener('click', function () {
    banner.style.display = 'none';
    document.body.classList.remove('lang-banner-active');
    sessionStorage.setItem('lang-detect-dismissed', '1');
  });
})();
