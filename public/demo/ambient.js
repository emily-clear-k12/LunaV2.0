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
        ph: rnd(0, TAU), pr: rnd(0.5, 1.1), c: pick(colors), s: rnd(size * 0.5, size * 0.85), turn: rnd(-0.6, 0.6) });
    }
    return function (g, t, dt) {
      g.globalCompositeOperation = "lighter";
      list.forEach(function (f) {
        var b = f.b;
        f.turn += rnd(-0.28, 0.28) * dt; f.turn = clamp(f.turn, -0.55, 0.55);
        f.a += f.turn * dt * 0.85;
        var depth = clamp((f.y - b[1]) / Math.max(1, b[3]), 0, 1);
        var spd = f.sp * (0.42 + depth * 0.75);
        f.x += Math.cos(f.a) * spd * dt; f.y += Math.sin(f.a) * spd * dt * 0.65;
        if (f.x < b[0] || f.x > b[0] + b[2] || f.y < b[1] || f.y > b[1] + b[3]) {
          var cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2;
          f.a += (Math.atan2(cy - f.y, cx - f.x) - f.a) * 0.08;
        }
        var p = 0.5 + 0.5 * Math.sin(t * f.pr * 1.6 + f.ph); p = p * p;
        var depth2 = clamp((f.y - b[1]) / Math.max(1, b[3]), 0, 1);
        var s = f.s * (0.42 + depth2 * 0.85) * (0.62 + p * 0.7);
        g.globalAlpha = 0.22 + p * 0.5;
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

  // Shooting stars: glide slowly across the sky with a long glowing tail, every couple of seconds.
  function shootingStars(zones, every, opts) {
    opts = opts || {};
    var live = [], next = rnd(0.6, 1.5), maxLive = opts.max || 3;
    return function (g, t, dt) {
      next -= dt;
      if (next <= 0 && live.length < maxLive) {
        var z = pick(zones), ang = z.ang + rnd(-0.1, 0.1), sp = rnd(opts.speed ? opts.speed[0] : 230, opts.speed ? opts.speed[1] : 340);
        live.push({ x: rnd(z.x, z.x + z.w), y: rnd(z.y, z.y + z.h), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          life: 0, max: rnd(2.0, 3.0), len: rnd(170, 290), w: rnd(2.2, 3.2) });
        next = rnd(every[0], every[1]);
      }
      g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      live = live.filter(function (s) {
        s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
        var k = s.life / s.max; if (k >= 1) return false;
        var a = Math.min(1, k * 5) * Math.min(1, (1 - k) * 2.2);            // quick fade-in, long glide, soft fade-out
        var n = Math.hypot(s.vx, s.vy), ux = s.vx / n, uy = s.vy / n;
        var L = s.len * Math.min(1, k * 3), tx = s.x - ux * L, ty = s.y - uy * L;
        var gr = g.createLinearGradient(tx, ty, s.x, s.y);
        gr.addColorStop(0, "rgba(200,170,255,0)"); gr.addColorStop(0.7, "rgba(255,225,250," + (0.45 * a) + ")"); gr.addColorStop(1, "rgba(255,255,255," + a + ")");
        g.strokeStyle = gr; g.lineWidth = s.w; g.beginPath(); g.moveTo(tx, ty); g.lineTo(s.x, s.y); g.stroke();
        g.lineWidth = s.w * 3.2; g.globalAlpha = 0.25; g.stroke(); g.globalAlpha = 1;   // soft outer glow on the tail
        g.globalAlpha = a; g.drawImage(glow("#fff6ff"), s.x - 13, s.y - 13, 26, 26); g.drawImage(glow("#ffffff"), s.x - 5, s.y - 5, 10, 10); g.globalAlpha = 1;
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

  // Runes carved in the art: a mask of their own pixels, breathing softly with a glow that drifts up the trunk.
  function runes(mask, color, lo, hi) {
    if (!mask) return function () {};
    var tmp = document.createElement("canvas"); tmp.width = mask.w; tmp.height = mask.h;
    var tg = tmp.getContext("2d");
    return function (g, t) {
      var k = 0.5 + 0.5 * Math.sin(t * TAU / 6);
      // steady soft breath over every rune
      g.globalCompositeOperation = "lighter";
      g.globalAlpha = lo + (hi - lo) * k;
      g.drawImage(mask.glow, mask.x, mask.y);
      // a brighter band that travels slowly upward
      tg.globalCompositeOperation = "source-over"; tg.clearRect(0, 0, mask.w, mask.h);
      tg.drawImage(mask.glow, 0, 0);
      tg.globalCompositeOperation = "destination-in";
      var cy = mask.h * (1.25 - ((t / 9) % 1) * 1.5), band = mask.h * 0.22;
      var gr = tg.createLinearGradient(0, cy - band, 0, cy + band);
      gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      tg.fillStyle = gr; tg.fillRect(0, 0, mask.w, mask.h);
      g.globalAlpha = hi * 1.2;
      g.drawImage(tmp, mask.x, mask.y);
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    };
  }

  // Tiny dragon silhouettes gliding far away across the sky, every so often.
  function dragons(zones, color, every) {
    var live = [], next = rnd(2, 5);
    function drawDragon(g, d, t) {
      var s = d.s, flap = Math.sin(t * d.fr + d.ph);
      g.save(); g.translate(d.x, d.y); g.scale(d.dir, 1); g.rotate(Math.sin(t * 0.7 + d.ph) * 0.05);
      g.fillStyle = color; g.strokeStyle = color; g.lineCap = "round"; g.lineJoin = "round";
      // body + neck + head
      g.beginPath(); g.ellipse(0, 0, s * 0.55, s * 0.16, 0, 0, TAU); g.fill();
      g.lineWidth = s * 0.12; g.beginPath(); g.moveTo(s * 0.45, -s * 0.02); g.quadraticCurveTo(s * 0.75, -s * 0.18, s * 0.92, -s * 0.12); g.stroke();
      g.beginPath(); g.ellipse(s * 0.98, -s * 0.1, s * 0.12, s * 0.07, 0.2, 0, TAU); g.fill();
      // long curling tail
      g.lineWidth = s * 0.08; g.beginPath(); g.moveTo(-s * 0.5, 0);
      g.quadraticCurveTo(-s * 0.95, s * (0.12 + flap * 0.05), -s * 1.3, -s * 0.05 + flap * s * 0.06); g.stroke();
      // two bat wings, flapping
      var wy = -s * (0.15 + 0.75 * flap);
      g.beginPath(); g.moveTo(-s * 0.15, -s * 0.05); g.lineTo(s * 0.05, wy); g.lineTo(s * 0.32, wy * 0.6); g.lineTo(s * 0.25, -s * 0.05); g.closePath(); g.fill();
      g.globalAlpha *= 0.75;
      g.beginPath(); g.moveTo(-s * 0.05, -s * 0.02); g.lineTo(s * 0.18, wy * 0.8 - s * 0.05); g.lineTo(s * 0.4, wy * 0.45); g.lineTo(s * 0.3, -s * 0.02); g.closePath(); g.fill();
      g.restore();
    }
    return function (g, t, dt) {
      next -= dt;
      if (next <= 0 && live.length < 2) {
        var z = pick(zones), dir = Math.random() < 0.5 ? 1 : -1, sp = rnd(16, 26);
        var n = Math.random() < 0.25 ? 2 : 1;
        for (var i = 0; i < n; i++) live.push({ z: z, dir: dir, x: dir > 0 ? z.x - 30 - i * 22 : z.x + z.w + 30 + i * 22,
          y0: rnd(z.y, z.y + z.h) + i * 6, y: 0, vx: sp * dir * 0.85, s: rnd(z.s[0], z.s[1]) * (i ? 0.72 : 0.82), fr: rnd(3.2, 4.4), ph: rnd(0, TAU), bob: rnd(3, 7) });
        next = rnd(every[0], every[1]);
      }
      live = live.filter(function (d) {
        d.x += d.vx * dt; d.y = d.y0 + Math.sin(t * 0.6 + d.ph) * d.bob;
        var z = d.z, u = (d.x - z.x) / z.w; if (u < -0.15 || u > 1.15) return false;
        var edge = Math.min(1, Math.min(u + 0.15, 1.15 - u) / 0.2);     // fade in/out at the zone edges
        g.globalAlpha = z.a * Math.max(0, edge);
        drawDragon(g, d, t);
        return true;
      });
      g.globalAlpha = 1;
    };
  }

  // Aurora: slow ribbons that breathe in and out. Drawn only where the sky mask allows.
  function aurora(bands, spans) {
    var R = bands.map(function (b) { return { y: b.y, h: b.h, amp: b.amp, k: b.k, sp: b.sp, a: b.a, cols: b.cols, ph: rnd(0, TAU) }; });
    return function (g, t) {
      g.save();
      g.globalCompositeOperation = "source-over";
      R.forEach(function (r) {
        var breathe = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.11 + r.ph));
        spans.forEach(function (sp) {
          var x0 = sp[0], x1 = sp[1], step = 20, pts = [], x, i;
          for (x = x0; x <= x1; x += step) {
            var y = r.y
              + Math.sin(x * r.k + t * r.sp + r.ph) * r.amp
              + Math.sin(x * r.k * 0.41 - t * r.sp * 0.33) * r.amp * 0.4;
            pts.push([x, y]);
          }
          if (pts.length < 2) return;
          var half = r.h * (0.72 + 0.12 * Math.sin(t * 0.17 + r.ph));
          var gr = g.createLinearGradient(0, r.y - half * 1.2, 0, r.y + half * 1.5);
          gr.addColorStop(0, "rgba(255,255,255,0)");
          r.cols.forEach(function (c, ci) {
            gr.addColorStop(0.28 + 0.4 * ci / Math.max(1, r.cols.length - 1), hexA(c, r.a * breathe * (ci === 0 ? 1 : 0.72)));
          });
          gr.addColorStop(1, "rgba(255,255,255,0)");
          g.globalAlpha = 1; g.fillStyle = gr; g.beginPath();
          g.moveTo(pts[0][0], pts[0][1] - half * 0.35);
          for (i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1] - half * 0.35);
          for (i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0], pts[i][1] + half);
          g.closePath(); g.fill();
        });
      });
      g.restore();
    };
  }

  // Sparkles that rise from a point (lantern hover). Call AmbientFX.burst(x, y, color) in art pixels.
  var bursts = [];
  function sparkleBursts() {
    return function (g, t, dt) {
      if (!bursts.length) return;
      g.globalCompositeOperation = "lighter";
      bursts = bursts.filter(function (p) {
        p.life += dt; if (p.life > p.max) return false;
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 6 * dt;
        var k = 1 - p.life / p.max;
        g.globalAlpha = k;
        g.drawImage(glow(p.c), p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
        return true;
      });
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    };
  }
  window.AmbientFX = {
  // Shooting stars drawn over the intro film's sky for its first few seconds (A.1). Returns a stop() function.
  introStars: function (host, W, H, seconds) {
    if (mq && mq.matches) return function () {};
    var c = document.createElement("canvas"); c.className = "intro-stars"; c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:41;transition:opacity 1s ease";
    host.appendChild(c);
    var g = c.getContext("2d"), layer = shootingStars([
      { x: W * 0.55, y: 0, w: W * 0.45, h: H * 0.12, ang: 2.6 },
      { x: 0, y: 0, w: W * 0.4, h: H * 0.12, ang: 0.55 },
      { x: W * 0.3, y: 0, w: W * 0.4, h: H * 0.08, ang: 2.35 }
    ], [0.7, 1.5], { max: 3, speed: [300, 420] });
    var t0 = performance.now(), last = t0, raf, stopped = false;
    function size() { var r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); c.width = Math.max(1, r.width * d); c.height = Math.max(1, r.height * d); }
    size();
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.setTransform(c.width / W, 0, 0, c.height / H, 0, 0);
      if (!stopped && (now - t0) / 1000 < seconds) layer(g, (now - t0) / 1000, dt); else layer(g, (now - t0) / 1000, dt * 1);
      if ((now - t0) / 1000 > seconds + 3) { stop(); return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    function stop() { stopped = true; cancelAnimationFrame(raf); c.style.opacity = "0"; setTimeout(function () { c.remove(); }, 1000); }
    return stop;
  },
  burst: function (x, y, color, n) {
    for (var i = 0; i < (n || 14); i++) bursts.push({ x: x + rnd(-18, 18), y: y + rnd(-20, 30), vx: rnd(-14, 14), vy: rnd(-55, -20),
      life: 0, max: rnd(0.9, 1.6), s: rnd(3, 6), c: Math.random() < 0.5 ? color : "#fff6d0" });
  } };

  /* Sky mask so stars, dragons and the aurora stay in open sky, behind leaves and the trunk.
     Built once from the daytime plate — the silhouette matches every time of day. */
  var sceneArt = { skyMask: null };
  function skyMasked(effect, op) {
    var buf = document.createElement("canvas"), bg = null;
    return function (g, t, dt) {
      var mask = sceneArt.skyMask;
      if (!mask) { effect(g, t, dt); return; }
      if (!bg) { buf.width = P.W; buf.height = P.H; bg = buf.getContext("2d"); }
      bg.setTransform(1, 0, 0, 1, 0, 0);
      bg.globalCompositeOperation = "source-over";
      bg.globalAlpha = 1;
      bg.clearRect(0, 0, P.W, P.H);
      effect(bg, t, dt);
      bg.globalCompositeOperation = "destination-in";
      bg.drawImage(mask, 0, 0, P.W, P.H);
      bg.globalCompositeOperation = "source-over";
      g.save();
      g.globalCompositeOperation = op || "lighter";
      g.globalAlpha = 1;
      g.drawImage(buf, 0, 0, P.W, P.H);
      g.restore();
    };
  }
  function buildSkyMask(img) {
    var W = P.W, H = P.H, c = document.createElement("canvas"); c.width = W; c.height = H;
    var g = c.getContext("2d"); g.drawImage(img, 0, 0, W, H);
    var src = g.getImageData(0, 0, W, H).data;
    var hard = document.createElement("canvas"); hard.width = W; hard.height = H;
    var id = hard.getContext("2d").createImageData(W, H), o = id.data, a1 = preset === "a1";
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var i = (y * W + x) * 4, r = src[i], gg = src[i + 1], b = src[i + 2];
        var mx = r > gg ? (r > b ? r : b) : (gg > b ? gg : b);
        var mn = r < gg ? (r < b ? r : b) : (gg < b ? gg : b);
        var sat = mx ? (mx - mn) / mx : 0;
        var foliage = gg > r + 6 && gg > b - 5 && gg > 28 && gg > b * 0.85;
        var wood = r > gg + 4 && gg > b * 0.75 && r < 120 && sat < 0.65 && mx < 110;
        var sky;
        if (a1) {
          var blue = b > r + 8 && b > 50, warm = r > 80 && r >= gg && b > 40 && gg < r + 10 && sat > 0.12 && y < H * 0.62;
          var pale = mx > 150 && sat < 0.28 && y < H * 0.55;
          sky = y < H * 0.78 && y <= H * 0.72 && !foliage && !wood && mx >= 28 && (blue || warm || pale);
        } else {
          var blue2 = b > r + 15 && b > 90, cloud = mx > 200 && sat < 0.18 && y < H * 0.45;
          sky = y < H * 0.58 && y <= H * 0.62 && !foliage && (blue2 || cloud);
        }
        o[i] = o[i + 1] = o[i + 2] = 255; o[i + 3] = sky ? 255 : 0;
      }
    }
    hard.getContext("2d").putImageData(id, 0, 0);
    var soft = document.createElement("canvas"); soft.width = W; soft.height = H;
    var sg = soft.getContext("2d");
    sg.filter = "blur(6px)"; sg.drawImage(hard, 0, 0); sg.filter = "none";
    var sd = sg.getImageData(0, 0, W, H), p = sd.data;
    for (var k = 0; k < p.length; k += 4) {
      var al = p[k + 3];
      al = al < 120 ? 0 : Math.min(255, (al - 120) * 2);
      p[k] = p[k + 1] = p[k + 2] = 255; p[k + 3] = al;
    }
    sg.putImageData(sd, 0, 0);
    return soft;
  }

  /* ---------- presets ---------- */

  var PRESETS = {
    /* Plan A.1 Lantern Tree — night: fireflies, shooting stars, twinkling sky, lantern + window + mushroom glow */
    a1: {
      W: 1366, H: 768,
      mount: function (c) { var f = document.getElementById("frame"); if (!f) return false; var ref = f.querySelector(".fx-loop") || f.querySelector(".bg"); ref ? ref.after(c) : f.prepend(c); return true; },
      art: function () { return document.querySelector("#frame .bg"); },
      skySample: { y0: 20, y1: 560, n: 70 },
      flowerSample: { box: [0, 600, 1366, 168], n: 60, test: function (r, g, b) { return b > 150 && b > r + 10 && b > g + 30 && r + g + b > 330; } },
      magic: {
        star: "#fbe9ff", flower: "#d9c6ff", sparkle: "#fff2ff", mote: "#ffe9b8", dragonColor: "#1a0f2e",
        ffColors: ["#fff3a0", "#e9ff8a", "#ffe07a", "#fff8c8"], ffSize: 7.5,
        ff: [[20, 560, 420, 190], [900, 560, 440, 190], [60, 70, 470, 300], [860, 60, 470, 300], [470, 420, 420, 140]],
        lamps: function () { return (window.A1_WORLDS || []).map(function (w) { return { x: w.x, y: w.y + 6, r: w.w * 0.95, sy: 1.25, c: w.color, lo: 0.08, hi: 0.26, flicker: true, f: rnd(0.3, 0.55) }; }); },
        mushrooms: [{ x: 60, y: 640, r: 46, c: "#c77dff", lo: 0.12, hi: 0.42, f: 0.25 }, { x: 122, y: 690, r: 32, c: "#c77dff", lo: 0.10, hi: 0.36, f: 0.3 },
          { x: 180, y: 620, r: 26, c: "#b388ff", lo: 0.08, hi: 0.32, f: 0.28 }, { x: 212, y: 700, r: 24, c: "#b388ff", lo: 0.08, hi: 0.30, f: 0.33 },
          { x: 1288, y: 645, r: 40, c: "#c77dff", lo: 0.12, hi: 0.40, f: 0.27 }, { x: 1228, y: 700, r: 28, c: "#b388ff", lo: 0.09, hi: 0.32, f: 0.31 },
          { x: 1150, y: 692, r: 24, c: "#b388ff", lo: 0.08, hi: 0.30, f: 0.29 }],
        mid: [40, 120, 1290, 460],
        shoot: [{ x: 900, y: 20, w: 460, h: 120, ang: 2.62 }, { x: 0, y: 30, w: 380, h: 120, ang: 0.52 }, { x: 760, y: 220, w: 560, h: 100, ang: 2.75 }],
        petalFrom: [{ x: 60, y: -20, w: 420, h: 60, dir: 0.3 }, { x: 900, y: -20, w: 420, h: 60, dir: -0.3 }],
        petals: ["#ffc6e6", "#e7c6ff", "#ffd8ef", "#cfe3ff"], avoid: null,
        motes: [0, 380, 1366, 380],
        aurora: [{ y: 250, h: 78, amp: 20, k: 0.0032, sp: 0.07, a: 0.28, cols: ["#7dffe0", "#8fd6ff", "#c9b6ff"] },
          { y: 330, h: 56, amp: 14, k: 0.0042, sp: -0.05, a: 0.18, cols: ["#d7c4ff", "#ffc4ea", "#9af6e4"] }],
        auroraSpans: [[0, 470], [900, 1366]],
        dragons: [{ x: 0, y: 300, w: 430, h: 70, s: [7, 10], a: 0.55 }, { x: 960, y: 320, w: 406, h: 70, s: [6, 9], a: 0.5 }]
      },
      runeBoxes: [[470, 40, 900, 640]],
      runeTest: function (r, g, b) { return r + g + b > 400 && r >= b - 8 && b > 90; },   // pale-gold rune strokes (and lit windows)
      layers: function (art) {
        var sky = art.sky;
        var W = window.A1_WORLDS || [];
        var lanterns = W.map(function (w) { return { x: w.x, y: w.y + 6, r: w.w * 0.95, sy: 1.25, c: w.color, lo: 0.10, hi: 0.32, flicker: true, f: rnd(0.3, 0.55) }; });
        return [
          twinkles(sky, "#fbe9ff"),
          skyMasked(dragons([
            { x: 40, y: 280, w: 380, h: 80, s: [6, 9], a: 0.55 },
            { x: 980, y: 300, w: 360, h: 80, s: [6, 8], a: 0.5 }
          ], "#24133f", [8, 14])),
          runes(art.runes, null, 0.10, 0.38),
          skyMasked(shootingStars([
            { x: 900, y: 20, w: 460, h: 120, ang: 2.62 },
            { x: 0, y: 30, w: 380, h: 120, ang: 0.52 },
            { x: 760, y: 160, w: 500, h: 90, ang: 2.75 },
            { x: 20, y: 150, w: 340, h: 90, ang: 0.40 }
          ], [2.2, 4.4], { max: 2, speed: [180, 260] })),
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
            [470, 420, 420, 140],    // around the trunk
            [60, 70, 470, 300],      // left branches, among the lanterns
            [860, 60, 470, 300],     // right branches, among the lanterns
            [430, 20, 520, 170],     // high in the crown
            [380, 260, 160, 170],    // where the left boughs meet the trunk
            [850, 260, 160, 170]     // where the right boughs meet the trunk
          ], 8, ["#fff3a0", "#e9ff8a", "#ffe07a", "#fff8c8"], 8.5),
          sparkleBursts()
        ];
      }
    },

    /* Plan D Forest Guides — sunny day: pollen in the light, drifting leaves, butterflies, lit windows, a few fireflies in the shade.
       Nothing is drawn over the signpost (x 680–860) so the arrows stay crisp. */
    d: {
      W: 1280, H: 720,
      mount: function (c) { var s = document.querySelector(".stage"); if (!s) return false; var v = s.querySelector(".fx-loop"); v ? v.after(c) : s.prepend(c); return true; },
      art: function () { var i = new Image(); i.src = "assets/scene.jpg"; return i; },
      runeBoxes: [[200, 60, 320, 190], [1215, 180, 1262, 242]],
      runeTest: function (r, g, b) { return r > 165 && g > 115 && b < 140 && r - b > 60; },   // warm gold carvings
      skySample: { y0: 0, y1: 230, n: 60, test: function (r, g, b, x) { return (x < 660 || x > 880) && b > 200 && b > r + 40 && g > 150; } },
      flowerSample: { box: [0, 560, 1280, 160], n: 40, test: function (r, g, b, x) { return (x < 650 || x > 890) && r > 200 && (g < 150 || b > 180) && r - Math.min(g, b) > 70; } },
      magic: {
        star: "#ffffff", flower: "#fff3c0", sparkle: "#fffbe0", mote: "#fff4c8", dragonColor: "#2c3e5c",
        ffColors: ["#fff6a8", "#eaff9a"], ffSize: 6,
        ff: [[0, 600, 140, 120], [1140, 600, 140, 120], [960, 560, 160, 90], [0, 330, 160, 230], [1110, 330, 170, 230]],
        lamps: function () { return [{ x: 84, y: 196, r: 30, c: "#ffb347", lo: 0.08, hi: 0.26, flicker: true }, { x: 400, y: 236, r: 22, c: "#ffb347", lo: 0.06, hi: 0.22, flicker: true },
          { x: 1210, y: 298, r: 26, c: "#ffb347", lo: 0.06, hi: 0.22, flicker: true }]; },
        /* Plan D's art has no mushrooms: level 3's soft pulse glows sit on the treehouse windows, porch lamp and door instead */
        mushrooms: [{ x: 33, y: 197, r: 26, c: "#ffcf70", lo: 0.12, hi: 0.40, f: 0.25 }, { x: 228, y: 306, r: 24, c: "#ffd27a", lo: 0.12, hi: 0.40, f: 0.3 },
          { x: 1233, y: 440, r: 30, c: "#ffc266", lo: 0.10, hi: 0.36, f: 0.28 }, { x: 160, y: 410, r: 40, c: "#ffd890", lo: 0.06, hi: 0.24, f: 0.22 }],
        mid: [20, 150, 640, 420],
        shoot: [{ x: 900, y: 10, w: 360, h: 80, ang: 2.75 }, { x: 420, y: 20, w: 220, h: 80, ang: 0.45 }],
        petalFrom: [{ x: 300, y: -20, w: 340, h: 60, dir: 0.4 }, { x: 980, y: -20, w: 260, h: 30, dir: -0.3 }, { x: 920, y: 130, w: 200, h: 60, dir: 0.2 }],
        petals: ["#ffc6e6", "#ffe08a", "#ffd8ef", "#f7b2d3"], avoid: [680, 40, 180, 470],
        motes: [0, 300, 1280, 420],
        aurora: [{ y: 36, h: 52, amp: 12, k: 0.004, sp: 0.07, a: 0.22, cols: ["#bfffea", "#c7e6ff", "#edd4ff"] },
          { y: 88, h: 40, amp: 10, k: 0.005, sp: -0.05, a: 0.16, cols: ["#edd4ff", "#ffd6ee", "#c8fff0"] }],
        auroraSpans: [[420, 670], [880, 1280]],
        dragons: [{ x: 880, y: 40, w: 380, h: 80, s: [6, 9], a: 0.4 }, { x: 440, y: 50, w: 230, h: 70, s: [5, 7], a: 0.34 }]
      },
      layers: function (art) {
        return [
          skyMasked(dragons([
            { x: 900, y: 24, w: 360, h: 90, s: [6, 9], a: 0.36 },
            { x: 470, y: 36, w: 210, h: 70, s: [5, 7], a: 0.3 }
          ], "#2c3e5c", [9, 15])),
          runes(art.runes, null, 0.12, 0.42),
          sunbeam(1000, -20, 640, 700, 260, "#fff2c4", 0.03, 0.11, 9),
          sunbeam(870, -20, 470, 700, 150, "#fff6d8", 0.02, 0.08, 12),
          lights([   // tree-house windows and the porch lamp
            { x: 84, y: 196, r: 30, c: "#ffb347", lo: 0.10, hi: 0.32, flicker: true },
            { x: 33, y: 197, r: 18, c: "#ffb347", lo: 0.06, hi: 0.22, flicker: true },
            { x: 400, y: 236, r: 22, c: "#ffb347", lo: 0.08, hi: 0.28, flicker: true },
            { x: 228, y: 306, r: 16, c: "#ffc266", lo: 0.10, hi: 0.36, flicker: true },
            { x: 1210, y: 298, r: 26, c: "#ffb347", lo: 0.08, hi: 0.28, flicker: true },
            { x: 1233, y: 440, r: 22, c: "#ffb347", lo: 0.08, hi: 0.26, flicker: true }
          ]),
          motes([0, 80, 1280, 560], 60, "#fff4c8"),
          leaves([
            { x: 300, y: -20, w: 340, h: 60, dir: 0.4 },      // top-left canopy
            { x: 980, y: -20, w: 260, h: 30, dir: -0.3 },     // top-right canopy
            { x: 920, y: 130, w: 200, h: 60, dir: 0.2 }       // right tree's leafy branch
          ], [0.6, 1.4], ["#f4cc4e", "#ec9a38", "#c8dc5a", "#e07636", "#ffe08a"], [680, 40, 180, 470]),
          butterflies([
            { x: 120, y: 600, rx: 60, ry: 26, speed: 0.35, s: 15, c: "#ffcf4a", c2: "#ff9f2e" },
            { x: 1190, y: 560, rx: 50, ry: 30, speed: 0.42, s: 13, c: "#9ad7ff", c2: "#5fb2ee" },
            { x: 560, y: 300, rx: 70, ry: 40, speed: 0.3, s: 12, c: "#ff9fd0", c2: "#e86aa8" },
            { x: 1000, y: 240, rx: 80, ry: 35, speed: 0.38, s: 12, c: "#fff1a0", c2: "#f2c94c" }
          ]),
          fireflies([
            [0, 600, 120, 120],       // shady plants, bottom-left
            [1150, 600, 130, 120],    // bush, bottom-right
            [960, 560, 160, 90]       // under the rope bridge
          ], 6, ["#fff6a8", "#eaff9a"], 6)
        ];
      }
    }
  };

  /* ---------- Magic meter (prototype panel): levels 1–5, each adds to the one before ---------- */
  function scatter(box, n) { var o = []; for (var i = 0; i < n; i++) o.push([rnd(box[0], box[0] + box[2]), rnd(box[1], box[1] + box[3])]); return o; }
  /* Time of day (prototype panel) only restyles the effects; the level still sets the amount. */
  function dim(fn, k) {
    var d = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "globalAlpha");
    return function (g, t, dt) {
      Object.defineProperty(g, "globalAlpha", { configurable: true, get: function () { return d.get.call(g) / k; }, set: function (v) { d.set.call(g, v * k); } });
      try { fn(g, t, dt); } finally { delete g.globalAlpha; }
    };
  }
  function magicLayers(art, L) {
    var M = P.magic, out = [], sky = art.sky || [], fl = art.flowers || [];
    var tod = window.__tod || "cur", day = tod === "day" || tod === "sunrise" || (tod === "cur" && preset === "d");
    var nightSky = !day || tod === "sunrise";
    var ff = [0, 5, 8, 12, 16, 20][L];
    var starC = day ? "#fffbe6" : M.star, starK = day ? 0.55 : 1;
    out.push(dim(twinkles(sky.slice(0, [0, 22, 30, 40, 48, 64][L]), starC), starK));             // 1: stars (day: faint sparkles)
    if (M.lamps) out.push(lights(M.lamps()));
    if (L >= 2 && fl.length) out.push(twinkles(fl.slice(0, [0, 0, 22, 30, 38, 48][L]), M.flower)); // 2: flower shimmer
    if (L >= 3) { out.push(dim(lights(M.mushrooms.map(function (m) { return Object.assign({}, m); })), day ? 0.6 : 1));   // 3: glows
      out.push(twinkles(scatter(M.mid, [0, 0, 0, 26, 36, 54][L]), M.sparkle));
      if (art.runes) out.push(runes(art.runes, null, 0.08, 0.30)); }
    if (L >= 3 && nightSky) out.push(skyMasked(shootingStars(M.shoot, [[0], [0], [0], [8, 14], [4.5, 8], [3.2, 5.5]][L], { max: [0, 0, 0, 1, 1, 2][L], speed: [170, 250] })));
    if (L >= 4) { out.push(leaves(M.petalFrom, L >= 5 ? [0.9, 1.8] : [1.6, 3.2], M.petals, M.avoid));
      out.push(motes(M.motes, L >= 5 ? 36 : 20, M.mote)); }
    if (L >= 5) {
      var bands = day ? M.aurora.map(function (b) { return Object.assign({}, b, { a: Math.min(0.34, b.a * 1.35), cols: ["#ffd0d0", "#ffe7b0", "#d7f5c4", "#cfe8ff", "#ead4ff"] }); }) : M.aurora;
      out.unshift(skyMasked(dragons(M.dragons, M.dragonColor, [6, 11])));
      out.unshift(skyMasked(aurora(bands, M.auroraSpans), day ? "source-over" : "screen"));
    }
    out.push(day ? dim(fireflies(M.ff, ff, ["#ffe9a8", "#fff3c4", "#ffd98a"], M.ffSize * 1.15), 0.6)   // day: soft golden motes
                 : fireflies(M.ff, ff, M.ffColors, M.ffSize));
    out.push(sparkleBursts());
    return out;
  }

  var P = PRESETS[preset]; if (!P) return;

  /* Read the art once: pick open-sky points for twinkles and build a soft glow mask of the rune strokes. */
  function prepArt(done) {
    var img = P.art && P.art(), out = { sky: [], runes: null };
    if (!img) { done(out); return; }
    function go() {
      try {
        var c = document.createElement("canvas"); c.width = P.W; c.height = P.H;
        var g = c.getContext("2d"); g.drawImage(img, 0, 0, P.W, P.H);
        var d = g.getImageData(0, 0, P.W, P.H).data;
        var cfg = P.skySample, tries = 0;
        while (cfg && out.sky.length < cfg.n && tries++ < 6000) {
          var x = (Math.random() * P.W) | 0, y = (cfg.y0 + Math.random() * (cfg.y1 - cfg.y0)) | 0, i = (y * P.W + x) * 4;
          var r = d[i], gg = d[i + 1], b = d[i + 2];
          if (cfg.test ? cfg.test(r, gg, b, x) : (b > 95 && b > gg + 35 && r + gg + b > 230)) out.sky.push([x, y]);   // open sky only
        }
        var fs = P.flowerSample; out.flowers = []; tries = 0;
        while (fs && out.flowers.length < fs.n && tries++ < 20000) {
          var fx = (fs.box[0] + Math.random() * fs.box[2]) | 0, fy = (fs.box[1] + Math.random() * fs.box[3]) | 0;
          if (fx >= P.W || fy >= P.H) continue; var fi = (fy * P.W + fx) * 4;
          if (fs.test(d[fi], d[fi + 1], d[fi + 2], fx)) out.flowers.push([fx, fy]);
        }
        if (P.runeBoxes) {
          var bx = P.runeBoxes, x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0;
          bx.forEach(function (q) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[2]); y1 = Math.max(y1, q[3]); });
          var pad = 12; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
          var w = x1 - x0, h = y1 - y0, m = document.createElement("canvas"); m.width = w; m.height = h;
          var mg = m.getContext("2d"), md = mg.createImageData(w, h);
          bx.forEach(function (q) {
            for (var yy = q[1]; yy < q[3]; yy++) for (var xx = q[0]; xx < q[2]; xx++) {
              var k = (yy * P.W + xx) * 4;
              if (P.runeTest(d[k], d[k + 1], d[k + 2])) { var o = ((yy - y0) * w + (xx - x0)) * 4; md.data[o] = 255; md.data[o + 1] = 214; md.data[o + 2] = 120; md.data[o + 3] = 255; }
            }
          });
          mg.putImageData(md, 0, 0);
          var gl = document.createElement("canvas"); gl.width = w; gl.height = h;
          var gg2 = gl.getContext("2d");
          gg2.filter = "blur(4px)"; gg2.drawImage(m, 0, 0); gg2.drawImage(m, 0, 0);   // soft halo
          gg2.filter = "blur(1px)"; gg2.drawImage(m, 0, 0);                         // crisp core
          out.runes = { glow: gl, x: x0, y: y0, w: w, h: h };
        }
      } catch (e) { /* tainted canvas etc. — skip twinkles/runes */ }
      done(out);
    }
    if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
  }

  function start(art) {
    var c = document.createElement("canvas");
    c.className = "ambient-fx"; c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0;";
    if (preset === "a1") c.style.cssText = "position:absolute;left:0;top:0;width:" + P.W + "px;height:" + P.H + "px;pointer-events:none;";
    if (!P.mount(c)) return;
    var g = c.getContext("2d"), layers, last = performance.now(), t0 = last;
    function setLevel(L) { L = +L || 0; layers = L >= 1 && L <= 5 && P.magic ? magicLayers(art, L) : P.layers(art); c.setAttribute("data-magic", L || "live"); }
    window.AmbientFX.setLevel = setLevel; window.AmbientFX.level = function () { return c.getAttribute("data-magic"); };
    setLevel(window.__magicLevel);

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

  function boot() {
    prepArt(function (art) {
      sceneArt = art;
      var maskSrc = preset === "a1" ? "tod-day.jpg" : "assets/scene.jpg";
      var im = new Image();
      im.onload = function () { art.skyMask = buildSkyMask(im); start(art); };
      im.onerror = function () { start(art); };
      im.src = maskSrc;
    });
    // A.1: a puff of sparkles rises from a lantern when it's hovered or focused
    if (preset === "a1" && window.A1_WORLDS) {
      [].forEach.call(document.querySelectorAll("#lanterns .lantern"), function (b, i) {
        var w = A1_WORLDS[i]; if (!w) return;
        function puff() { window.AmbientFX.burst(w.x, w.y, w.color, 16); }
        b.addEventListener("mouseenter", puff); b.addEventListener("focus", puff);
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
