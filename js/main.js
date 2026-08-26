/* ==========================================================================
   Greenmind — 全站互動
   需求書 §6：手機版導覽選單開關、滾動進場淡入（IntersectionObserver）
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* JS 可用時才啟用進場動畫的初始隱藏狀態 */
  root.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     1. 手機版導覽選單
     ------------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var desktopQuery = window.matchMedia('(min-width: 861px)');

  function setNavOpen(open) {
    if (!header || !toggle) return;

    if (open) {
      header.setAttribute('data-nav-open', '');
      document.body.style.overflow = 'hidden';
    } else {
      header.removeAttribute('data-nav-open');
      document.body.style.overflow = '';
    }

    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  }

  function isNavOpen() {
    return !!(header && header.hasAttribute('data-nav-open'));
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!isNavOpen());
    });

    /* 點選單內連結後關閉（同頁錨點也適用） */
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNavOpen(false);
    });

    /* Esc 關閉並把焦點還給漢堡按鈕 */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isNavOpen()) {
        setNavOpen(false);
        toggle.focus();
      }
    });

    /* 轉為桌面寬度時清掉手機選單狀態，避免捲動被鎖住 */
    var onDesktop = function (event) {
      if (event.matches) setNavOpen(false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', onDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onDesktop);
    }
  }

  /* ------------------------------------------------------------------------
     2. 滾動進場淡入
     ------------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('.reveal');

  function showAll() {
    for (var i = 0; i < revealTargets.length; i++) {
      revealTargets[i].classList.add('is-visible');
    }
  }

  /* 使用者要求減少動態，或瀏覽器不支援時，直接呈現最終狀態 */
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     2b. SMIL 動畫（巡行路徑）也要遵守動態偏好
     CSS 的 prefers-reduced-motion 管不到 SVG 的 animateMotion，
     因此改用 pauseAnimations() 讓自走車停在起點；圖形本身仍完整可讀。
     ------------------------------------------------------------------------ */
  function setSvgAnimations(paused) {
    var svgs = document.querySelectorAll('svg');
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i];
      if (typeof svg.pauseAnimations !== 'function') continue;
      if (paused) {
        svg.pauseAnimations();
      } else {
        svg.unpauseAnimations();
      }
    }
  }

  if (reduceMotion.matches) setSvgAnimations(true);

  /* 動態偏好中途變更時也要跟上 */
  var onMotionChange = function (event) {
    setSvgAnimations(event.matches);
    if (event.matches) showAll();
  };
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', onMotionChange);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(onMotionChange);
  }

  /* ------------------------------------------------------------------------
     3. Demo 影片佔位播放器
     影片來源尚未決定（需求書 §5.2 待工程師確認）。
     實際影片就緒後，把 iframe 或 video 標籤插進 .video-frame 內即可，
     CSS 已備妥鋪滿樣式，此處的提示按鈕連同 .video-frame__center 一起移除。
     ------------------------------------------------------------------------ */
  var playButton = document.querySelector('.video-frame__play');
  if (playButton) {
    playButton.addEventListener('click', function () {
      var note = document.getElementById('video-status');
      if (note) note.textContent = '示範影片尚未上傳，內容準備中。';
    });
  }
})();
