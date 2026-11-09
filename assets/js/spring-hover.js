/**
 * Spring Hover · 阻尼谐振子驱动的悬停/按压动画
 * ---------------------------------------------------------------
 * 为什么不用 CSS transition：
 *   transition 是"固定时长 + 固定曲线"，速度信息在起止处被丢弃。
 *   真弹簧要有：初速可注入（松手速度）、过冲可回弹、时长由物理量决定。
 *
 * 物理模型（单自由度阻尼振子）：
 *   m·x'' + c·x' + k·x = k·target
 *   ω₀ = √(k/m), ζ = c / (2√(k·m))
 *   阻尼比 ζ = 0.8（欠阻尼，过冲 ≈ exp(-πζ/√(1-ζ²)) ≈ 1.5%）
 *
 * 积分：**解析解**（闭式），任意 dt 精确、与刷新率无关，无数值阻尼。
 * 调度：全局单 rAF 循环；全部静止后自动停机，不空转。
 *
 * API：
 *   new Spring({omega, zeta, value, target})
 *   spring.step(dt)        推进时间
 *   spring.setTarget(t, v) 换目标，可带初速
 *   spring.settled()       是否已停
 */
(function () {
  'use strict';

  function Spring(opts) {
    opts = opts || {};
    var omega = opts.omega || 14;              // 自然角频率，越大越快
    var zeta = typeof opts.zeta === 'number' ? opts.zeta : 0.8;
    var mass = opts.mass || 1;

    this.k = mass * omega * omega;
    this.c = 2 * zeta * mass * omega;          // 2ζmω₀
    this.m = mass;
    this.omega = omega;
    this.zeta = zeta;

    this.value = typeof opts.value === 'number' ? opts.value : 0;
    this.target = typeof opts.target === 'number' ? opts.target : this.value;
    this.velocity = 0;

    // 静止判据：0.01px / 0.5px·s⁻¹ 以内人眼不可辨，能提前约一半时间停机
    this.epsPos = opts.epsPos || 0.01;
    this.epsVel = opts.epsVel || 0.5;
  }

  Spring.prototype.setTarget = function (target, velocity) {
    this.target = target;
    if (typeof velocity === 'number' && isFinite(velocity)) this.velocity = velocity;
  };

  /**
   * 解析解步进（不是数值积分）。
   *
   * 为什么：半隐式欧拉在 ω₀h≈0.06 时会引入约 30% 的数值阻尼，
   * 实测过冲从理论 1.51% 掉到 1.09%——"弹性"被算法吃掉了。
   * 阻尼振子有闭式解，直接算任意 dt 的精确状态，误差为 0，
   * 也天然与刷新率无关（不需要固定步长子步）。
   */
  Spring.prototype.step = function (dt) {
    if (!(dt > 0)) return;

    var w0 = this.omega;
    var z = this.zeta;
    var x0 = this.value - this.target;
    var v0 = this.velocity;

    // 临界阻尼附近做保护，避免 ωd→0 时除零
    var zd = 1 - z * z;
    if (zd < 1e-6) zd = 1e-6;

    var wd = w0 * Math.sqrt(zd);
    var e = Math.exp(-z * w0 * dt);
    var cos = Math.cos(wd * dt);
    var sin = Math.sin(wd * dt);

    var x = e * (x0 * cos + ((v0 + z * w0 * x0) / wd) * sin);
    var v = e * (v0 * cos - ((w0 * w0 * x0 + z * w0 * v0) / wd) * sin);

    this.value = this.target + x;
    this.velocity = v;
  };

  Spring.prototype.settled = function () {
    return Math.abs(this.value - this.target) < this.epsPos &&
           Math.abs(this.velocity) < this.epsVel;
  };

  Spring.prototype.snap = function () {
    this.value = this.target;
    this.velocity = 0;
  };

  /* ─────────────────────────────────────────────────────────────
     元素控制器：把两个弹簧（位移 y、缩放 s）映射成 transform/filter
     阴影强度由位移进度推导，不额外开弹簧，减少每帧计算与重绘
     ───────────────────────────────────────────────────────────── */

  var REST = { y: 0, s: 1 };
  var HOVER = { y: -6, s: 1.015 };
  var PRESS = { y: -1.8, s: 0.997 };

  // 阴影随进度插值：静置 2/4/.045 → 悬停 14/28/.13
  function shadowFilter(p) {
    var y = 2 + 12 * p;
    var blur = 4 + 24 * p;
    var alpha = 0.045 + 0.085 * p;
    return 'drop-shadow(0 ' + y.toFixed(2) + 'px ' + blur.toFixed(2) +
           'px rgba(1,2,5,' + alpha.toFixed(3) + '))';
  }

  function Controller(el, opts) {
    this.el = el;
    this.reduce = opts.reduce;
    this.response = opts.response || 0.34;          // 0.42 → 0.34：收敛更快
    this.zeta = typeof opts.zeta === 'number' ? opts.zeta : 0.9;  // 0.8 → 0.9：基本不晃
    this.lift = typeof opts.lift === 'number' ? opts.lift : HOVER.y;
    this.scaleAmt = typeof opts.scale === 'number' ? opts.scale : HOVER.s;
    // 初速再大，首峰位移也不许越过「目标 ± maxOvershoot」——橡皮筋感的来源就是没设这个边界
    this.maxOvershoot = typeof opts.overshoot === 'number' ? opts.overshoot : 1.2;
    // 含正在播放的视频时关掉逐帧 filter：每帧重算阴影会迫使视频走软件合成
    this.shadow = opts.shadow !== false;

    var omega = (2 * Math.PI) / this.response;

    this.sy = new Spring({ omega: omega, zeta: this.zeta, value: 0, target: 0 });
    this.ss = new Spring({ omega: omega, zeta: this.zeta, value: 1, target: 1 });
    this.state = 'rest';
    this.active = false;
    this.pointerVY = 0;      // 指针竖直速度 px/s（平滑后）
    this.lastPointer = null;

    this.bound = {
      enter: this.enter.bind(this),
      leave: this.leave.bind(this),
      down: this.down.bind(this),
      up: this.up.bind(this),
      move: this.move.bind(this),
      focus: this.focus.bind(this),
      blur: this.blur.bind(this)
    };
    this.bind();
    this.render();     // 先落一次静置态，保证所有卡片的初始阴影一致
  }

  Controller.prototype.bind = function () {
    var el = this.el, b = this.bound;
    el.addEventListener('pointerenter', b.enter);
    el.addEventListener('pointerleave', b.leave);
    el.addEventListener('pointerdown', b.down);
    el.addEventListener('pointerup', b.up);
    el.addEventListener('pointercancel', b.up);
    el.addEventListener('pointermove', b.move);
    el.addEventListener('focus', b.focus);
    el.addEventListener('blur', b.blur);
    el.classList.add('spring-ready');
  };

  /**
   * 给定初速时，**越过目标**的最大距离（px）。注意不是 |x| 的最大值：
   * 起点离目标 6px，|x| 天然就是 6，用它做判据等于永远不超标。
   * 这里只量"冲过目标之后再走多远"。
   */
  Controller.prototype.overshootOf = function (v0, target) {
    var sp = this.sy;
    var x0 = sp.value - target;
    var w = sp.omega, z = sp.zeta;
    var wd = w * Math.sqrt(Math.max(1e-6, 1 - z * z));
    var B = (v0 + z * w * x0) / wd;
    // 方向：从目标的哪一侧出发；若已在目标上，则看初速方向
    var dir = Math.abs(x0) > 1e-6 ? Math.sign(x0) : (Math.sign(v0) || 1);

    var over = 0, absMax = Math.abs(x0);
    function sample(t) {
      var e = Math.exp(-z * w * t);
      var x = e * (x0 * Math.cos(wd * t) + B * Math.sin(wd * t));
      if (Math.abs(x) > absMax) absMax = Math.abs(x);
      var o = dir > 0 ? Math.max(0, -x) : Math.max(0, x);
      if (o > over) over = o;
    }
    for (var i = 1; i <= 250; i++) sample(i * 0.001);   // 前 0.25s 密采样，抓住峰尖
    for (var j = 26; j <= 120; j++) sample(j * 0.01);   // 之后疏采样，覆盖长尾
    // 已经在目标上时，"冲过目标"没有方向可言，直接限制绝对位移
    return Math.abs(x0) < 0.5 ? absMax : over;
  };

  /**
   * 初速预算：**只在超标时收敛**，不动正常输入。
   *
   * 先算这个 v0 会冲过目标多远；超过 maxOvershoot 就二分把速度按比例收回。
   * 结果是：指针甩得再快，卡片也只会"吸附"到目标附近轻轻回弹，
   * 而不是像橡皮筋弹出去老远；v0=0 这类正常输入完全不受影响。
   */
  Controller.prototype.clampSeed = function (v0, target) {
    var v = Math.max(-400, Math.min(400, v0));
    var bound = this.maxOvershoot;
    if (this.overshootOf(v, target) <= bound) return v;

    var lo = 0, hi = 1;
    for (var i = 0; i < 14; i++) {
      var mid = (lo + hi) / 2;
      if (this.overshootOf(v * mid, target) <= bound) lo = mid;
      else hi = mid;
    }
    return v * lo;
  };

  Controller.prototype.go = function (y, s, seed) {
    var v = (typeof seed === 'number' && isFinite(seed)) ? seed : this.sy.velocity;
    this.sy.setTarget(y, this.clampSeed(v, y));
    this.ss.setTarget(s);
    this.wake();
  };

  Controller.prototype.setTargets = function (y, s) {
    this.go(y, s);
  };

  // 各状态的落点：悬停/按压都由实例参数推导，便于按元素微调
  Controller.prototype.hoverY = function () { return this.lift; };
  Controller.prototype.hoverS = function () { return this.scaleAmt; };
  Controller.prototype.pressY = function () { return this.lift * 0.22; };
  Controller.prototype.pressS = function () { return 1 - (this.scaleAmt - 1) * 0.25; };

  Controller.prototype.enter = function (e) {
    if (this.reduce || (e && e.pointerType === 'touch')) return;
    this.state = 'hover';
    this.setTargets(this.hoverY(), this.hoverS());
  };

  Controller.prototype.leave = function () {
    if (this.reduce) return;
    this.state = 'rest';
    // 松手速度：保留当前弹簧速度（连续），叠加指针离场方向的贡献，再交给 clampSeed 限幅
    var seed = this.sy.velocity + Math.max(-200, Math.min(200, this.pointerVY * 0.04));
    this.go(REST.y, REST.s, seed);
  };

  Controller.prototype.down = function () {
    if (this.reduce) return;
    this.state = 'press';
    this.go(this.pressY(), this.pressS());
  };

  Controller.prototype.up = function () {
    if (this.reduce) return;
    this.state = 'hover';
    // 抬指瞬间的速度只作"轻推"：幅度由 clampSeed 的位移预算兜住
    var seed = this.sy.velocity + Math.max(-240, Math.min(240, this.pointerVY * 0.05));
    this.go(this.hoverY(), this.hoverS(), seed);
  };

  Controller.prototype.move = function (e) {
    var now = e.timeStamp || performance.now();
    if (this.lastPointer) {
      var dt = (now - this.lastPointer.t) / 1000;
      if (dt > 0.001 && dt < 0.2) {
        var vy = (e.clientY - this.lastPointer.y) / dt;
        // 一阶低通，去掉抖动
        this.pointerVY = this.pointerVY * 0.72 + vy * 0.28;
      }
    }
    this.lastPointer = { y: e.clientY, t: now };
  };

  Controller.prototype.focus = function () {
    if (this.reduce) return;
    // 触摸点击会触发 focus，但不会触发 :focus-visible；只对键盘聚焦抬升
    if (this.el.matches && !this.el.matches(':focus-visible')) return;
    this.state = 'hover';
    this.setTargets(this.hoverY(), this.hoverS());
  };

  Controller.prototype.blur = function () {
    if (this.reduce) return;
    if (this.state === 'press') return;
    this.state = 'rest';
    this.setTargets(REST.y, REST.s);
  };

  Controller.prototype.wake = function () {
    if (this.active) return;
    this.active = true;
    this.el.setAttribute('data-spring-on', '');
    this.el.style.willChange = 'transform, filter';
    schedule(this);
  };

  Controller.prototype.sleep = function () {
    this.active = false;
    this.el.removeAttribute('data-spring-on');
    this.el.style.willChange = '';
    this.render();     // 收尾一次，保证落点精确
  };

  Controller.prototype.step = function (dt) {
    this.sy.step(dt);
    this.ss.step(dt);
    this.render();
    if (this.sy.settled() && this.ss.settled()) {
      this.sy.snap();
      this.ss.snap();
      this.sleep();
      return false;
    }
    return true;
  };

  Controller.prototype.render = function () {
    var y = this.sy.value, s = this.ss.value;
    // 进度：位移占悬停位移的比例（两者都是负值，比值即为 0→1）
    var p = y / (this.lift || HOVER.y);
    p = Math.max(0, Math.min(1.25, p));
    this.el.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';
    if (this.shadow) this.el.style.filter = shadowFilter(p);
  };

  /* ── 全局调度：所有控制器共用一个 rAF，空闲即停 ── */
  var running = new Set();
  var rafId = 0;
  var last = 0;

  function schedule(c) {
    running.add(c);
    if (!rafId) {
      last = 0;
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    var dt = last ? (now - last) / 1000 : 1 / 60;
    last = now;

    var stillRunning = [];
    running.forEach(function (c) {
      if (c.step(dt)) stillRunning.push(c);
    });

    running = new Set(stillRunning);
    if (running.size) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
      last = 0;
    }
  }

  /* ── 启动 ── */
  var controllers = [];
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function boot() {
    var reduce = !!(mq && mq.matches);
    // 先打标记：CSS 里据此关掉过渡回退，避免与 JS 逐帧写入打架
    document.documentElement.classList.add('spring-js');
    var nodes = document.querySelectorAll('[data-spring]');
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.__rvSpring) return;
      var num = function (name, fallback) {
        var v = parseFloat(el.getAttribute(name));
        return isFinite(v) ? v : fallback;
      };
      var c = new Controller(el, {
        reduce: reduce,
        response: num('data-spring-response', 0.34),   // 秒：越小越"硬"
        zeta: num('data-spring-zeta', 0.9),            // 阻尼比：0.9 基本不晃，0.6 才有明显回弹
        lift: num('data-spring-lift', HOVER.y),        // px：上浮距离
        scale: num('data-spring-scale', HOVER.s),      // 缩放终点
        overshoot: num('data-spring-overshoot', 1.2),  // px：冲过目标的最大距离
        shadow: el.getAttribute('data-spring-shadow') !== 'off'
      });
      el.__rvSpring = c;
      controllers.push(c);
    });

    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) {
        controllers.forEach(function (c) {
          c.reduce = e.matches;
          if (e.matches) {
            c.sy.snap(); c.ss.snap(); c.render(); c.sleep();
          }
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 暴露给测试
  window.RVSpring = {
    Spring: Spring,
    Controller: Controller,
    shadowFilter: shadowFilter,
    constants: { REST: REST, HOVER: HOVER, PRESS: PRESS }
  };
})();
