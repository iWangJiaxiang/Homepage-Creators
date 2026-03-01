// 获取具有特定 class 的兄弟节点，返回第一个
function getSiblingNodesWithClass(element, className) {
  const parent = element.parentNode;

  // Iterate through the child nodes of the parent
  for (let i = 0; i < parent.children.length; i++) {
    const sibling = parent.children[i];
    // Check if the sibling has the specified class and is not the original element
    if (sibling !== element && sibling.classList.contains(className)) {
      return sibling;
    }
  }

  return null;
}

// 渐进加载图片
window.progressiveLoad = function (element) {
  if (!element) return;
  // 隐藏缩略图
  var sibing = getSiblingNodesWithClass(element, 'progressive-thumbnail')
  if (sibing)
    sibing.classList.add('loaded');
  // 加载主图
  element.classList.add('loaded');
  // 去除模糊效果
  element.parentNode.classList.add('loaded');
}

var homepage = {
  //显示菜单
  showMenu: function () {
    document.getElementById("body").classList.add("show-menu");
  },

  hideMenu: function () {
    document.getElementById("body").classList.remove("show-menu");
  },

  //跳转到id
  scrollTo(id) {
    let target = document.getElementById(id);
    if (!target) return;
    let targetPosition = target.offsetTop - 60;
    let startPosition = window.scrollY;
    let distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;
      let run = ease(timeElapsed, startPosition, distance, 600);
      window.scrollTo(0, run);
      if (timeElapsed < 600) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
}

//滚动页面动画
function scrollToTopWithAnimation() {
  const duration = 600; // in milliseconds
  const startPosition = window.pageYOffset;
  const distance = -window.pageYOffset;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) {
      startTime = currentTime;
    }
    const timeElapsed = currentTime - startTime;
    const scrollY = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, scrollY);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

function initNav() {
  const n = document.querySelector('.nav');
  n.classList.toggle("top", document.documentElement.scrollTop === 0);
}

window.addEventListener('scroll', function () {
  initNav()
})

document.addEventListener('DOMContentLoaded', function () {
  // 添加视差效果
  //var image = document.getElementsByClassName('progressive-content'); bug see: https://github.com/geosigno/simpleParallax.js/issues/64
  var image = document.querySelectorAll('.banner-pic-img  .progressive-content');
  new simpleParallax(image, {
    orientation: 'up',
    scale: 1.2,
    delay: 2,
    transition: 'cubic-bezier(0,0,0,1)',
    maxTransition: 50,
    overflow: true
  });

  // 添加菜单点击事件
  var menuButton = document.getElementById("nav-menu");
  menuButton.addEventListener('click', function () {
    if (document.getElementById("body").classList.contains('show-menu')) {
      homepage.hideMenu();
    } else {
      homepage.showMenu();
    }
  }, false)

  //关闭菜单
  $('.menu-list').click(function () {
    homepage.hideMenu();
  });

  //阻止菜单滚动
  document.querySelector('.menu-list').addEventListener('wheel', (e) => {
    e.preventDefault()
  })

  // 语言切换下拉菜单
  var langBtn = document.getElementById('lang-switch-btn');
  var langDropdown = document.getElementById('lang-dropdown');
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      langDropdown.classList.remove('open');
    });
  }

  initNav()
});
