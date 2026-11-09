/**
 * Squircle · 连续曲率圆角（G2 / superellipse）
 * ---------------------------------------------------------------
 * 形状用「超椭圆 |x|^n + |y|^n = r^n」的四角截取，写进 clip-path: path()。
 *
 * 为什么不用 SVG <clipPath clipPathUnits="objectBoundingBox">：
 *   归一化坐标会把圆角按宽高比拉伸——同一个类用在 16:9 视频和 4:3 图上，
 *   圆角一个扁一个胖。这里按元素实际像素尺寸生成路径，半径恒定。
 *
 * 用法：class="apple-squircle"，可选
 *   --squircle-radius: 18px;   圆角半径（默认 18）
 *   --squircle-curvature: 4.5; 曲率指数（苹果观感约 4–5，越大越接近方形）
 */
(function () {
  'use strict';

  var DEFAULTS = { radius: 18, curvature: 4.5, steps: 16 };
  var supported = (function () {
    try {
      return !!(window.CSS && window.CSS.supports && window.CSS.supports('clip-path', 'path("M0 0 L1 1")'));
    } catch (e) { return false; }
  })();

  function num(value, fallback) {
    var n = parseFloat(value);
    return isFinite(n) && n > 0 ? n : fallback;
  }

  /** 生成超椭圆圆角矩形的 d 字符串（单位 px，坐标基于元素边框盒左上角） */
  function buildPath(w, h, r, n) {
    r = Math.min(r, w / 2, h / 2);
    if (r <= 0.5) return 'M0 0 H' + w + ' V' + h + ' H0 Z';

    var p = 2 / n;
    var steps = DEFAULTS.steps;
    var out = [];

    function push(x, y) {
      var px = Math.round(x * 100) / 100;
      var py = Math.round(y * 100) / 100;
      var last = out[out.length - 1];
      if (last && last[0] === px && last[1] === py) return;   // 去掉弧与直线接缝处的重复点
      out.push([px, py]);
    }
    // 角弧：f 给出 (c, s) → 坐标，c = cosᵖθ，s = sinᵖθ，θ 从 0 到 π/2
    function arc(fx, fy) {
      for (var i = 0; i <= steps; i++) {
        var t = (i / steps) * (Math.PI / 2);
        var c = Math.pow(Math.cos(t), p);
        var s = Math.pow(Math.sin(t), p);
        push(fx(c, s), fy(c, s));
      }
    }

    push(r, 0);                                  // 左上角终点，作为起点
    push(w - r, 0);                              // 上边
    arc(function (c, s) { return w - r + r * s; }, function (c, s) { return r - r * c; });   // 右上
    push(w, h - r);                              // 右边
    arc(function (c, s) { return w - r + r * c; }, function (c, s) { return h - r + r * s; }); // 右下
    push(r, h);                                  // 下边
    arc(function (c, s) { return r - r * s; }, function (c, s) { return h - r + r * c; });   // 左下
    push(0, r);                                  // 左边
    arc(function (c, s) { return r - r * c; }, function (c, s) { return r - r * s; });       // 左上

    return 'M' + out.map(function (pt) { return pt[0] + ' ' + pt[1]; }).join(' L') + ' Z';
  }

  var SVGNS = 'http://www.w3.org/2000/svg';

  /**
   * 描边：用与 clip 完全相同的超椭圆路径画一条线。
   *
   * 为什么不用 box-shadow: inset / border：
   *   两者都是「矩形环」，被 clip-path 裁过之后圆角处会断掉。
   *   这里把路径向内缩 0.5px、线宽 1px，正好整条线都落在裁剪区内，
   *   于是描边严格沿着曲线走，不会缺角。
   */
  function applyStroke(el, w, h, r, n) {
    var color = el.getAttribute('data-sq-stroke');
    if (!color) return;

    var svg = null;
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].classList && el.children[i].classList.contains('sq-stroke')) {
        svg = el.children[i]; break;
      }
    }
    if (!svg) {
      svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('class', 'sq-stroke');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      el.appendChild(svg);
    }

    var width = parseFloat(el.getAttribute('data-sq-stroke-width')) || 1;
    var inset = width / 2;
    var d = buildPath(w - width, h - width, Math.max(0.5, r - inset), n);

    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.innerHTML = '<path d="' + d + '" fill="none" stroke="' + color +
      '" stroke-width="' + width + '" transform="translate(' + inset + ',' + inset + ')" ' +
      'shape-rendering="geometricPrecision" vector-effect="non-scaling-stroke"/>';
  }

  function apply(el) {
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    if (!w || !h) return;                        // 隐藏元素尺寸为 0，等 resize 再算

    var cs = window.getComputedStyle(el);
    var r = num(cs.getPropertyValue('--squircle-radius'), DEFAULTS.radius);
    var n = num(cs.getPropertyValue('--squircle-curvature'), DEFAULTS.curvature);
    var d = buildPath(w, h, r, n);

    el.style.clipPath = 'path("' + d + '")';
    el.style.webkitClipPath = 'path("' + d + '")';
    el.setAttribute('data-sq', 'on');
    applyStroke(el, w, h, r, n);
  }

  function each(fn) {
    Array.prototype.forEach.call(document.querySelectorAll('.apple-squircle'), fn);
  }

  function boot() {
    if (!supported) return;                      // 不支持 path() 时保留 border-radius 兜底
    each(apply);
    if (typeof ResizeObserver === 'function') {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) { apply(entry.target); });
      });
      each(function (el) { ro.observe(el); });
    } else {
      window.addEventListener('resize', function () { each(apply); }, { passive: true });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { each(apply); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 暴露给测试与调试（不影响页面行为）
  window.Squircle = { buildPath: buildPath, apply: apply, supported: supported };
})();
