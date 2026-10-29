/**
 * 首页钩子 JS
 * - 迷你播放器：单曲切换 + 进度条（点击才播）
 * - 三层体验：状态机 + 层叠加；音频可 stub（无 src 或失败时仍走 UI）
 * 依赖 DOM：见 fragments/home-index-insert.md / preview/index.html
 */
(function () {
  'use strict';

  /* ── 三层体验 ── */
  var LAYER_STATUS = {
    none: '当前：仅画面。音频关闭——先建立视觉基线。',
    0: '当前：仅画面。音频关闭——先建立视觉基线。',
    1: '当前：+环境层。Ambience Bus 建立空间与材质，尚未进入玩法反馈。',
    2: '当前：+交互层。SFX 与 UI 反馈进入，注意 Ducking 与优先级。',
    3: '当前：+音乐层。Music Bus 叠合交互层，强度曲线跟随战斗意图。',
  };

  function initStage(root) {
    const dots = Array.from(root.querySelectorAll('.stage-dot'));
    const status = root.querySelector('.stage-status');
    const reset = root.querySelector('.stage-reset');
    const layers = {};
    root.querySelectorAll('audio[data-layer]').forEach(function (a) {
      layers[a.getAttribute('data-layer')] = a;
    });

    // state: how many sequential layers on (1..3), or free set — use sequential enable up to n
    var enabled = { ambience: false, sfx: false, music: false };
    var order = ['ambience', 'sfx', 'music'];

    function activeCount() {
      return order.filter(function (k) {
        return enabled[k];
      }).length;
    }

    function render() {
      dots.forEach(function (btn) {
        var key = btn.getAttribute('data-layer');
        var on = !!enabled[key];
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var n = activeCount();
      var msg = LAYER_STATUS[n] || LAYER_STATUS[3];
      if (status) status.textContent = msg;

      order.forEach(function (key) {
        var a = layers[key];
        if (!a) return;
        if (enabled[key]) {
          var p = a.play();
          if (p && p.catch) {
            p.catch(function () {
              /* stub / blocked: keep UI state */
            });
          }
        } else {
          a.pause();
          try {
            a.currentTime = 0;
          } catch (e) {}
        }
      });
    }

    function enableUpTo(n) {
      order.forEach(function (key, i) {
        enabled[key] = i < n;
      });
      render();
    }

    dots.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-layer');
        var idx = order.indexOf(key);
        // Click stage n: enable 1..n, disable above
        if (enabled[key] && activeCount() === idx + 1) {
          // re-click active top layer → turn all off for replay feel
          enableUpTo(0);
        } else {
          enableUpTo(idx + 1);
        }
      });
    });

    if (reset) {
      reset.addEventListener('click', function () {
        enableUpTo(0);
      });
    }

    enableUpTo(0);
  }

  function boot() {
    document.querySelectorAll('[data-hook="stage"]').forEach(initStage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
