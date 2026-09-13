/**
 * 首页钩子 JS（Sprint B）
 * - 迷你播放器：单曲切换 + 进度条（点击才播）
 * - 三层体验：状态机 + 层叠加；音频可 stub（无 src 或失败时仍走 UI）
 * 依赖 DOM：见 fragments/home-index-insert.md / preview/index.html
 */
(function () {
  'use strict';

  /* ── 迷你播放器 ── */
  function initMiniPlayer(root) {
    const audio = root.querySelector('.mp-audio');
    const playBtn = root.querySelector('.mp-play');
    const bar = root.querySelector('.mp-bar');
    const fill = root.querySelector('.mp-bar > i');
    const title = root.querySelector('.mp-title');
    const items = Array.from(root.querySelectorAll('.mp-list button'));
    if (!audio || !playBtn) return;

    let tracks = [];
    try {
      tracks = JSON.parse(root.getAttribute('data-tracks') || '[]');
    } catch (e) {
      tracks = [];
    }
    let index = 0;

    function setTrack(i) {
      if (!tracks.length) return;
      index = ((i % tracks.length) + tracks.length) % tracks.length;
      const t = tracks[index];
      audio.src = t.src;
      if (title) title.textContent = t.title || '—';
      items.forEach((btn, n) => {
        btn.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
      playBtn.dataset.playing = 'false';
      playBtn.setAttribute('aria-label', '播放');
      playBtn.textContent = '▶';
      audio.pause();
      if (fill) fill.style.width = '0%';
    }

    function toggle() {
      if (!audio.src) {
        if (title) title.textContent = '暂无音源';
        return;
      }
      if (audio.paused) {
        const p = audio.play();
        if (p && p.catch) {
          p.catch(function () {
            if (title) title.textContent = '播放失败，点击重试';
          });
        }
      } else {
        audio.pause();
      }
    }

    playBtn.addEventListener('click', toggle);
    items.forEach((btn, i) => {
      btn.addEventListener('click', function () {
        setTrack(i);
        toggle();
      });
    });
    audio.addEventListener('play', function () {
      playBtn.dataset.playing = 'true';
      playBtn.textContent = '❚❚';
      playBtn.setAttribute('aria-label', '暂停');
    });
    audio.addEventListener('pause', function () {
      playBtn.dataset.playing = 'false';
      playBtn.textContent = '▶';
      playBtn.setAttribute('aria-label', '播放');
    });
    audio.addEventListener('ended', function () {
      setTrack(index + 1);
      toggle();
    });
    audio.addEventListener('timeupdate', function () {
      if (!fill || !audio.duration) return;
      fill.style.width = ((audio.currentTime / audio.duration) * 100).toFixed(2) + '%';
    });
    if (bar) {
      bar.addEventListener('click', function (e) {
        if (!audio.duration) return;
        const r = bar.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        audio.currentTime = ratio * audio.duration;
      });
    }

    if (tracks.length) setTrack(0);
  }

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
    const video = root.querySelector('.stage-video video');
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
        if (video) {
          try {
            video.currentTime = 0;
          } catch (e) {}
        }
      });
    }

    enableUpTo(0);
  }

  /* ── Showreel：缺片时仅按钮提示 ── */
  function initReel(root) {
    const video = root.querySelector('video');
    const play = root.querySelector('[data-reel-play]');
    const status = root.querySelector('[data-reel-status]');
    if (!play) return;
    play.addEventListener('click', function () {
      if (!video || !video.getAttribute('src')) {
        if (status) status.textContent = 'Showreel 母版尚未挂入本站。把 mp4/webm 路径填入 data-src 后即可播放。';
        return;
      }
      video.play().catch(function () {
        if (status) status.textContent = '无法自动播放。请再次点击或检查编码（建议 H.264 + AAC）。';
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-hook="mini-player"]').forEach(initMiniPlayer);
    document.querySelectorAll('[data-hook="stage"]').forEach(initStage);
    document.querySelectorAll('[data-hook="reel"]').forEach(initReel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
