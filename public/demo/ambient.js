/* Ambient life layer: soft, looping, code-drawn effects painted over a dashboard's still art.
   Usage (at the end of <body>):
     <script src="../demo/ambient.js" data-preset="a1"></script>   Plan A.1 Lantern Tree (night)
     <script src="../demo/ambient.js" data-preset="d"></script>    Plan D Forest Guides (day)
   - One <canvas> sits directly above the background art and below every button/panel (pointer-events: none),
     so hotspots, lanterns and signpost arrows are untouched.
   - Coordinates are in the art's own pixels (A.1: 1366x768 stage, D: 1280x720 cover box).
   - Off for anyone with "reduce motion" turned on, and with ?fx=0 in the URL (handy for before/after).
   - Pauses automatically when the tab is hidden (requestAnimationFrame). */
(function () {
  "use strict";
  var me = document.currentScript, preset = (me && me.dataset.preset) || "a1";
  if (/[?&]fx=0\b/.test(location.search)) return;
  var mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  if (mq && mq.matches) return;

  var TAU = Math.PI * 2;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* pre-rendered soft glow sprites, one per colour */
  var sprites = {};
  function glow(color) {
    if (sprites[color]) return sprites[color];
    var s = 64, c = document.createElement("canvas"); c.width = c.height = s;
    var g = c.getContext("2d"), r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    r.addColorStop(0, color); r.addColorStop(0.18, color); r.addColorStop(0.45, hexA(color, 0.35)); r.addColorStop(1, hexA(color, 0));
    g.fillStyle = r; g.fillRect(0, 0, s, s);
    return (sprites[color] = c);
  }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ---------- reusable effect builders ---------- */

  // Fireflies: wander inside boxes, slow pulse, warm additive glow.
  function fireflies(boxes, n, colors, size) {
    var list = [];
    for (var i = 0; i < n; i++) {
      var b = boxes[i % boxes.length];
      list.push({ b: b, x: rnd(b[0], b[0] + b[2]), y: rnd(b[1], b[1] + b[3]), a: rnd(0, TAU), sp: rnd(6, 16),
        ph: rnd(0, TAU), pr: rnd(0.5, 1.1), c: pick(colors), s: rnd(size * 0.7, size * 1.3), turn: rnd(-0.6, 0.6) });
    }
    return function (g, t, dt) {
      g.globalCompositeOperation = "lighter";
      list.forEach(function (f) {
        f.turn += rnd(-1.2, 1.2) * dt; f.turn = clamp(f.turn, -1, 1);
        f.a += f.turn * dt;
        f.x += Math.cos(f.a) * f.sp * dt; f.y += Math.sin(f.a) * f.sp * dt * 0.7;
        var b = f.b;   // steer back inside its box
        if (f.x < b[0] || f.x > b[0] + b[2] || f.y < b[1] || f.y > b[1] + b[3]) {
          var cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2;
          f.a += (Math.atan2(cy - f.y, cx - f.x) - f.a) * 0.08;
        }
        var p = 0.5 + 0.5 * Math.sin(t * f.pr * 2.2 + f.ph); p = p * p;           // long dim, short bright
        var s = f.s * (0.55 + p * 0.9);
        g.globalAlpha = 0.18 + p * 0.82;
        g.drawImage(glow(f.c), f.x - s, f.y - s, s * 2, s * 2);
      });
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    };
  }

  // Steady lights that breathe/flicker (lanterns, windows, mushrooms).
  function lights(spots) {
    spots.forEach(function (s) { s.ph = rnd(0, TAU); s.f = s.f || rnd(0.35, 0.7); });
    return function (g, t) {
      g.globalCompositeOperation = "lighter";
      spots.forEach(function (s) {
        var k = 0.5 + 0.5 * Math.sin(t * s.f * TAU / 3 + s.ph);
        if (s.flicker) k = clamp(k * 0.75 + 0.25 * (0.5 + 0.5 * Math.sin(t * 9.3 + s.ph * 3) * Math.sin(t * 5.1 + s.ph)), 0, 1);
        g.globalAlpha = s.lo + (s.hi - s.lo) * k;
        var rx = s.r * (s.sx || 1), ry = s.r * (s.sy || 1);
        g.drawImage(glow(s.c), s.x - rx, s.y - ry, rx * 2, ry * 2);
      });
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    };
  }

  // Twinkling stars at given points.
  function twinkles(points, color) {
    var st = points.map(function (p) { return { x: p[0], y: p[1], ph: rnd(0, TAU), f: rnd(0.25, 0.8), s: rnd(1, 2) }; });
    return function (g, t) {
      g.globalCompositeOperation = "lighter";
      st.forEach(function (s) {
        var k = Math.pow(0.5 + 0.5 * Math.sin(t * s.f * TAU / 2 + s.ph), 6);
        if (k < 0.02) return;
        g.globalAlpha = k;
        var r = s.s * (1 + k * 1.1);
        g.drawImage(glow(color), s.x - r * 2.2, s.y - r * 2.2, r * 4.4, r * 4.4);
        g.strokeStyle = "rgba(255,255,255," + (k * 0.8) + ")"; g.lineWidth = 0.8;   // tiny cross sparkle
        g.beginPath(); g.moveTo(s.x - r * 1.9, s.y); g.lineTo(s.x + r * 1.9, s.y); g.moveTo(s.x, s.y - r * 1.9); g.lineTo(s.x, s.y + r * 1.9); g.stroke();
      });
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    };
  }

  // Shooting stars launched from sky zones every few seconds.
  function shootingStars(zones, every) {
    var live = [], next = rnd(1, 2.5);
    return function (g, t, dt) {
      next -= dt;
      if (next <= 0 && live.length < 2) {
        var z = pick(zones), ang = z.ang + rnd(-0.12, 0.12), sp = rnd(420, 620);
        live.push({ x: rnd(z.x, z.x + z.w), y: rnd(z.y, z.y + z.h), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          life: 0, max: rnd(0.7, 1.1), len: rnd(70, 130) });
        next = rnd(every[0], every[1]);
      }
      g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      live = live.filter(function (s) {
        s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
        var k = s.life / s.max; if (k >= 1) return false;
        var a = Math.sin(Math.PI * k), n = Math.hypot(s.vx, s.vy), ux = s.vx / n, uy = s.vy / n;
        var tx = s.x - ux * s.len * a, ty = s.y - uy * s.len * a;
        var gr = g.createLinearGradient(tx, ty, s.x, s.y);
        gr.addColorStop(0, "rgba(255,230,250,0)"); gr.addColorStop(1, "rgba(255,248,255," + (0.9 * a) + ")");
        g.strokeStyle = gr; g.lineWidth = 2.2; g.beginPath(); g.moveTo(tx, ty); g.lineTo(s.x, s.y); g.stroke();
        g.globalAlpha = a; g.drawImage(glow("#fff1ff"), s.x - 7, s.y - 7, 14, 14); g.globalAlpha = 1;
        return true;
      });
      g.globalCompositeOperation = "source-over";
    };
  }

  // Slow drifting specks (pollen / dust in sunlight).
  function motes(box, n, color) {
    var m = [];
    for (var i = 0; i < n; i++) m.push({ x: rnd(box[0], box[0] + box[2]), y: rnd(box[1], box[1] + box[3]), vy: rnd(-7, -2), ph: rnd(0, TAU), s: rnd(2.2, 4.4), f: rnd(0.2, 0.5) });
    return function (g, t, dt) {
      g.globalCompositeOperation = "lighter";
      m.forEach(function (p) {
        p.y += p.vy * dt; p.x += Math.sin(t * p.f + p.ph) * 6 * dt;
        if (p.y < box[1]) { p.y = box[1] + box[3]; p.x = rnd(box[0], box[0] + box[2]); }
        g.globalAlpha = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * p.f * 3 + p.ph));
        g.drawImage(glow(color), p.x - p.s * 2, p.y - p.s * 2, p.s * 4, p.s * 4);
      });
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    };
  }

  // Leaves that drift down from the canopy, swaying and spinning, then fade.
  function leaves(sources, every, colors, avoid) {
    var live = [], next = rnd(0.3, 1.2);
    function drawLeaf(g, l, a) {
      g.save(); g.translate(l.x, l.y); g.rotate(l.rot); g.scale(1, Math.abs(Math.cos(l.flip)) * 0.85 + 0.15);
      g.globalAlpha = a; g.fillStyle = l.c;
      g.beginPath(); g.moveTo(-l.s, 0); g.quadraticCurveTo(0, -l.s * 0.62, l.s, 0); g.quadraticCurveTo(0, l.s * 0.62, -l.s, 0); g.fill();
      g.strokeStyle = "rgba(90,50,10,.55)"; g.lineWidth = 1; g.beginPath(); g.moveTo(-l.s, 0); g.lineTo(l.s, 0); g.stroke();
      g.restore();
    }
    return function (g, t, dt) {
      next -= dt;
      if (next <= 0 && live.length < 10) {
        var s = pick(sources);
        live.push({ x: rnd(s.x, s.x + s.w), y: rnd(s.y, s.y + s.h), x0: 0, vy: rnd(22, 36), sway: rnd(18, 34), f: rnd(0.6, 1.1),
          ph: rnd(0, TAU), rot: rnd(0, TAU), vr: rnd(-1.4, 1.4), flip: rnd(0, TAU), vf: rnd(1.5, 3), s: rnd(10, 14),
          c: pick(colors), life: 0, max: rnd(9, 14), dir: s.dir || 0 });
        next = rnd(every[0], every[1]);
      }
      live = live.filter(function (l) {
        l.life += dt; l.y += l.vy * dt; l.x += (Math.cos(t * l.f + l.ph) * l.sway + l.dir * 10) * dt;
        l.rot += l.vr * dt; l.flip += l.vf * dt;
        var k = l.life / l.max; if (k >= 1) return false;
        var a = Math.min(1, l.life / 1.2) * Math.min(1, (1 - k) * 4);
        if (avoid && l.x > avoid[0] && l.x < avoid[0] + avoid[2] && l.y > avoid[1] && l.y < avoid[1] + avoid[3]) a *= 0.25;
        drawLeaf(g, l, a * 0.95);
        return true;
      });
      g.globalAlpha = 1;
    };
  }

  // Butterflies that flutter on lazy figure-eight paths.
  function butterflies(list) {
    list.forEach(function (b) { b.ph = rnd(0, TAU); });
    return function (g, t) {
      list.forEach(function (b) {
        var u = t * b.speed + b.ph;
        var x = b.x + Math.sin(u) * b.rx, y = b.y + Math.sin(u * 2) * b.ry + Math.sin(t * 3.1 + b.ph) * 3;
        var dx = Math.cos(u) * b.rx; var flap = Math.abs(Math.sin(t * 13 + b.ph));
        g.save(); g.translate(x, y); g.scale(dx < 0 ? -1 : 1, 1); g.rotate(-0.25);
        g.fillStyle = b.c; g.globalAlpha = 0.95;
        var w = b.s * (0.25 + 0.75 * flap);
        g.beginPath(); g.ellipse(-w * 0.55, -b.s * 0.35, w * 0.6, b.s * 0.55, -0.5, 0, TAU); g.fill();   // upper wings
        g.beginPath(); g.ellipse(w * 0.55, -b.s * 0.35, w * 0.6, b.s * 0.55, 0.5, 0, TAU); g.fill();
        g.fillStyle = b.c2;
        g.beginPath(); g.ellipse(-w * 0.4, b.s * 0.25, w * 0.4, b.s * 0.35, 0.4, 0, TAU); g.fill();     // lower wings
        g.beginPath(); g.ellipse(w * 0.4, b.s * 0.25, w * 0.4, b.s * 0.35, -0.4, 0, TAU); g.fill();
        g.fillStyle = "#3a2410"; g.beginPath(); g.ellipse(0, 0, 1.2, b.s * 0.6, 0, 0, TAU); g.fill();       // body
        g.restore();
      });
      g.globalAlpha = 1;
    };
  }

  // A soft sunbeam that slowly brightens and fades.
  function sunbeam(x0, y0, x1, y1, width, color, lo, hi, period) {
    return function (g, t) {
      var k = 0.5 + 0.5 * Math.sin(t * TAU / period);
      var ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
      g.save(); g.globalCompositeOperation = "screen"; g.translate(x0, y0); g.rotate(ang);
      var gr = g.createLinearGradient(0, -width / 2, 0, width / 2);
      gr.addColorStop(0, hexA(color, 0)); gr.addColorStop(0.5, hexA(color, lo + (hi - lo) * k)); gr.addColorStop(1, hexA(color, 0));
      g.fillStyle = gr; g.globalAlpha = 1;
      g.beginPath(); g.moveTo(0, -width * 0.25); g.lineTo(len, -width / 2); g.lineTo(len, width / 2); g.lineTo(0, width * 0.25); g.closePath();
      g.fill();
      g.restore();
    };
  }

  /* ---------- presets ---------- */

  var PRESETS = {
    /* Plan A.1 Lantern Tree — night: fireflies, shooting stars, twinkling sky, lantern + window + mushroom glow */
    a1: {
      W: 1366, H: 768,
      mount: function (c) { var f = document.getElementById("frame"), bg = f && f.querySelector(".bg"); if (!f) return false; bg ? bg.after(c) : f.prepend(c); return true; },
      skySample: { y0: 20, y1: 560, n: 70 },
      layers: function (sky) {
        var W = window.A1_WORLDS || [];
        var lanterns = W.map(function (w) { return { x: w.x, y: w.y + 6, r: w.w * 0.95, sy: 1.25, c: w.color, lo: 0.10, hi: 0.32, flicker: true, f: rnd(0.3, 0.55) }; });
        return [
          twinkles(sky, "#fbe9ff"),
          shootingStars([
            { x: 840, y: 60, w: 420, h: 220, ang: 2.55 },   // right sky, falling down-left toward the mountains
            { x: 40, y: 70, w: 360, h: 200, ang: 0.62 },    // left sky, falling down-right
            { x: 900, y: 300, w: 380, h: 120, ang: 0.42 }   // lower right, matching the painted streaks
          ], [3.5, 7]),
          lights(lanterns),
          lights([   // tree-house windows and the lamp halfway up the trunk
            { x: 600, y: 108, r: 20, c: "#ffb347", lo: 0.10, hi: 0.35, flicker: true },
            { x: 742, y: 186, r: 22, c: "#ffb347", lo: 0.12, hi: 0.40, flicker: true },
            { x: 744, y: 284, r: 30, c: "#ffa53a", lo: 0.15, hi: 0.42, flicker: true },
            { x: 770, y: 372, r: 28, c: "#ffa53a", lo: 0.12, hi: 0.40, flicker: true },
            { x: 540, y: 384, r: 18, c: "#ffb347", lo: 0.08, hi: 0.30, flicker: true }
          ]),
          lights([   // glowing mushrooms, slow breathing
            { x: 60, y: 640, r: 46, c: "#c77dff", lo: 0.10, hi: 0.36, f: 0.25 },
            { x: 122, y: 690, r: 32, c: "#c77dff", lo: 0.08, hi: 0.30, f: 0.3 },
            { x: 180, y: 620, r: 26, c: "#b388ff", lo: 0.06, hi: 0.26, f: 0.28 },
            { x: 212, y: 700, r: 24, c: "#b388ff", lo: 0.06, hi: 0.24, f: 0.33 },
            { x: 1288, y: 645, r: 40, c: "#c77dff", lo: 0.10, hi: 0.34, f: 0.27 },
            { x: 1228, y: 700, r: 28, c: "#b388ff", lo: 0.07, hi: 0.26, f: 0.31 },
            { x: 1150, y: 692, r: 24, c: "#b388ff", lo: 0.06, hi: 0.24, f: 0.29 },
            { x: 572, y: 566, r: 16, c: "#ff9fd0", lo: 0.06, hi: 0.26, f: 0.35 }
          ]),
          fireflies([
            [20, 560, 420, 190],     // left meadow
            [900, 560, 440, 190],    // right meadow
            [430, 600, 140, 140],    // near Astra (left)
            [820, 600, 160, 130],    // near the book stack
            [470, 420, 420, 140]     // around the trunk
          ], 34, ["#fff3a0", "#e9ff8a", "#ffe07a"], 7)
        ];
      }
    },

    /* Plan D Forest Guides — sunny day: pollen in the light, drifting leaves, butterflies, lit windows, a few fireflies in the shade.
       Nothing is drawn over the signpost (x 680–860) so the arrows stay crisp. */
    d: {
      W: 1280, H: 720,
      mount: function (c) { var s = document.querySelector(".stage"); if (!s) return false; s.prepend(c); return true; },
      layers: function () {
        return [
          sunbeam(1000, -20, 640, 700, 260, "#fff2c4", 0.03, 0.11, 9),
          sunbeam(870, -20, 470, 700, 150, "#fff6d8", 0.02, 0.08, 12),
          lights([   // tree-house windows and the porch lamp
            { x: 84, y: 196, r: 30, c: "#ffb347", lo: 0.10, hi: 0.32, flicker: true },
            { x: 33, y: 197, r: 18, c: "#ffb347", lo: 0.06, hi: 0.22, flicker: true },
            { x: 400, y: 236, r: 22, c: "#ffb347", lo: 0.08, hi: 0.28, flicker: true },
            { x: 228, y: 306, r: 16, c: "#ffc266", lo: 0.10, hi: 0.36, flicker: true },
            { x: 1210, y: 298, r: 26, c: "#ffb347", lo: 0.08, hi: 0.28, flicker: true },
            { x: 1233, y: 440, r: 22, c: "#ffb347", lo: 0.08, hi: 0.26, flicker: true },
            { x: 256, y: 128, r: 40, c: "#ffd27a", lo: 0.04, hi: 0.16, f: 0.2 }   // carved rune on the trunk
          ]),
          motes([0, 80, 1280, 560], 60, "#fff4c8"),
          leaves([
            { x: 300, y: -20, w: 340, h: 60, dir: 0.4 },      // top-left canopy
            { x: 980, y: -20, w: 260, h: 30, dir: -0.3 },     // top-right canopy
            { x: 920, y: 130, w: 200, h: 60, dir: 0.2 }       // right tree's leafy branch
          ], [0.9, 2], ["#f4cc4e", "#ec9a38", "#c8dc5a", "#e07636", "#ffe08a"], [680, 40, 180, 470]),
          butterflies([
            { x: 120, y: 600, rx: 60, ry: 26, speed: 0.35, s: 15, c: "#ffcf4a", c2: "#ff9f2e" },
            { x: 1190, y: 560, rx: 50, ry: 30, speed: 0.42, s: 13, c: "#9ad7ff", c2: "#5fb2ee" }
          ]),
          fireflies([
            [0, 600, 120, 120],       // shady plants, bottom-left
            [1150, 600, 130, 120],    // bush, bottom-right
            [960, 560, 160, 90]       // under the rope bridge
          ], 10, ["#fff6a8", "#eaff9a"], 6)
        ];
      }
    }
  };

  var P = PRESETS[preset]; if (!P) return;

  function sampleSky(cfg, done) {
    var img = document.querySelector("#frame .bg");
    if (!img || !cfg) { done([]); return; }
    function go() {
      var pts = [];
      try {
        var c = document.createElement("canvas"); c.width = P.W; c.height = P.H;
        var g = c.getContext("2d"); g.drawImage(img, 0, 0, P.W, P.H);
        var d = g.getImageData(0, 0, P.W, P.H).data, tries = 0;
        while (pts.length < cfg.n && tries++ < 6000) {
          var x = (Math.random() * P.W) | 0, y = (cfg.y0 + Math.random() * (cfg.y1 - cfg.y0)) | 0, i = (y * P.W + x) * 4;
          var r = d[i], gg = d[i + 1], b = d[i + 2];
          if (b > 95 && b > gg + 35 && r + gg + b > 230) pts.push([x, y]);   // open purple sky only (not leaves, not trunk)
        }
      } catch (e) { /* tainted canvas etc. — just skip twinkles */ }
      done(pts);
    }
    if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
  }

  function start(sky) {
    var c = document.createElement("canvas");
    c.className = "ambient-fx"; c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0;";
    if (preset === "a1") c.style.cssText = "position:absolute;left:0;top:0;width:" + P.W + "px;height:" + P.H + "px;pointer-events:none;";
    if (!P.mount(c)) return;
    var g = c.getContext("2d"), layers = P.layers(sky), last = performance.now(), t0 = last;

    function size() {
      var rect = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    }
    size(); window.addEventListener("resize", size);

    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var t = (now - t0) / 1000;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
      g.setTransform(c.width / P.W, 0, 0, c.height / P.H, 0, 0);
      for (var i = 0; i < layers.length; i++) layers[i](g, t, dt);
      raf = requestAnimationFrame(frame);
    }
    var raf = requestAnimationFrame(frame);
    if (mq && mq.addEventListener) mq.addEventListener("change", function (e) { if (e.matches) { cancelAnimationFrame(raf); c.remove(); } });
  }

  function boot() { sampleSky(P.skySample, start); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
