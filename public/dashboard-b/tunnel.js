/* Plan B "Through the tunnel" loader: the view from a train window rushing through a glowing crystal tunnel,
   then a warm light at the tunnel's end opens into the chosen world's painting. Runs between the depart film and the
   world page (which is prefetched meanwhile), on the fixed 1366x768 stage. One small canvas, no blur filters,
   smooth alpha only (no strobing). Usage: CrystalTunnel.run({ art: "assets/worlds/x.jpg", onDone: fn }). */
(function () {
  "use strict";
  var W = 1366, H = 768, CX = 683, CY = 372;
  var RES = 0.5;             // canvas resolution vs. the stage
  var DUR = 2200;            // total tunnel time (ms)
  var LIGHT_AT = 1300;       // the light at the end starts growing
  var ART_AT = 1750;         // the world painting appears inside the light

  function rand(a, b) { return a + Math.random() * (b - a); }
  function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }

  var JEWELS = [[255, 120, 200], [120, 235, 170], [255, 196, 90], [185, 140, 255]];
  function crystal(far) {
    var jewel = Math.random() < 0.18;
    return {
      a: rand(0, Math.PI * 2), z: far ? rand(0.92, 1.05) : rand(0.15, 1), r: rand(0.82, 1.02),
      len: rand(0.9, 1.6), w: rand(0.35, 0.55), tilt: rand(-0.35, 0.35),
      col: jewel ? JEWELS[(Math.random() * JEWELS.length) | 0] : [rand(90, 140) | 0, rand(185, 225) | 0, 255]
    };
  }

  function run(opt) {
    var frame = document.getElementById("frame") || document.body;
    var wrap = document.createElement("div");
    wrap.className = "tunnel";
    wrap.innerHTML =
      '<canvas width="' + W * RES + '" height="' + H * RES + '"></canvas>' +
      '<div class="tunnel-art"></div>' +
      '<div class="tunnel-window" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
    frame.appendChild(wrap);
    var canvas = wrap.querySelector("canvas"), ctx = canvas.getContext("2d", { alpha: false });
    ctx.scale(RES, RES);   // drawn at reduced resolution and scaled up by CSS: soft, glowy, and cheap on a Chromebook
    var artEl = wrap.querySelector(".tunnel-art"), win = wrap.querySelector(".tunnel-window");
    artEl.style.backgroundImage = 'url("' + opt.art + '")';

    var crystals = [], i;
    for (i = 0; i < 85; i++) crystals.push(crystal(false));
    var rings = [];
    for (i = 0; i < 16; i++) rings.push({ z: (i + 1) / 16, seed: Math.random() * 100 });
    var runes = [];
    for (i = 0; i < 7; i++) runes.push({ a: rand(0, Math.PI * 2), z: rand(0.2, 1), g: (Math.random() * 3) | 0 });

    var t0 = performance.now(), last = t0, done = false;
    requestAnimationFrame(function () { wrap.classList.add("on"); });
    // once the window view covers the stage, stop compositing the station underneath (cheaper on a Chromebook)
    setTimeout(function () { frame.classList.add("tunnel-on"); }, 420);

    function proj(a, z, r) { var d = (175 * r) / z; return [CX + Math.cos(a) * d, CY + Math.sin(a) * d * 0.82]; }

    function draw(now) {
      var t = now - t0, dt = Math.min(50, now - last) / 1000; last = now;
      var speed = 0.55 + 0.35 * ease(t / 900);                 // gentle acceleration, constant after ~1s
      // rattle: small, smooth, low-amplitude sway of the whole carriage window
      var rx = Math.sin(t / 61) * 1.4 + Math.sin(t / 23) * 0.5, ry = Math.sin(t / 47) * 1.1;
      canvas.style.transform = "translate(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px)";      // compositor-only
      win.style.transform = "translate(" + (-rx * 0.35).toFixed(2) + "px," + (-ry * 0.35).toFixed(2) + "px)";

      // walls: rich violet-blue rock, glowing toward the center
      var g = ctx.createRadialGradient(CX, CY, 10, CX, CY, 820);
      g.addColorStop(0, "#e4f6ff"); g.addColorStop(0.05, "#8fd0ff"); g.addColorStop(0.16, "#4a6cc4");
      g.addColorStop(0.36, "#3a3a86"); g.addColorStop(0.7, "#3a2d6e"); g.addColorStop(1, "#2c2558");
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // rock ribs rushing outward
      for (i = 0; i < rings.length; i++) {
        var rg = rings[i];
        rg.z -= dt * speed * 0.55; if (rg.z <= 0.06) { rg.z += 1; rg.seed = Math.random() * 100; }
      }
      rings.sort(function (a, b) { return a.z - b.z; });     // near first ... far last
      for (i = 0; i < rings.length; i++) {
        var rg = rings[i];
        var alpha = Math.min(1, (1 - rg.z) * 1.8) * 0.6;
        ctx.beginPath();
        for (var k = 0; k <= 24; k++) {
          var a = (k / 24) * Math.PI * 2, wob = 1 + 0.07 * Math.sin(a * 5 + rg.seed) + 0.04 * Math.sin(a * 9 + rg.seed * 2);
          var p = proj(a, rg.z, 1.25 * wob);
          if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
        }
        // faint lit facet just inside each rib, so the walls read as carved rock
        ctx.strokeStyle = (i % 2 ? "rgba(120,110,210," : "rgba(80,70,170,") + (alpha * 0.22).toFixed(3) + ")";
        ctx.lineWidth = Math.min(260, 34 / rg.z);
        ctx.stroke();
        ctx.strokeStyle = "rgba(20, 16, 48," + alpha.toFixed(3) + ")";
        ctx.lineWidth = Math.min(150, 15 / rg.z);
        ctx.stroke();
        ctx.strokeStyle = "rgba(140, 170, 255," + (alpha * 0.55).toFixed(3) + ")";
        ctx.lineWidth = Math.min(14, 2 / rg.z);
        ctx.stroke();
      }

      // rune glows on the walls (soft, drifting outward slowly)
      ctx.globalCompositeOperation = "lighter";
      for (i = 0; i < runes.length; i++) {
        var ru = runes[i];
        ru.z -= dt * speed * 0.5; if (ru.z <= 0.12) { ru.z += 0.9; ru.a = rand(0, Math.PI * 2); }
        var rp = proj(ru.a, ru.z, 1.1), rs = Math.min(90, 14 / ru.z), ra = Math.min(1, (1 - ru.z) * 1.4) * 0.5;
        var rgd = ctx.createRadialGradient(rp[0], rp[1], 0, rp[0], rp[1], rs * 1.6);
        rgd.addColorStop(0, "rgba(120,200,255," + (ra * 0.55).toFixed(3) + ")"); rgd.addColorStop(1, "rgba(120,200,255,0)");
        ctx.fillStyle = rgd; ctx.beginPath(); ctx.arc(rp[0], rp[1], rs * 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(190,235,255," + ra.toFixed(3) + ")"; ctx.lineWidth = Math.max(1, rs / 14);
        ctx.beginPath();
        if (ru.g === 0) { ctx.arc(rp[0], rp[1], rs * 0.5, 0, Math.PI * 1.6); }
        else if (ru.g === 1) { ctx.moveTo(rp[0], rp[1] - rs * .6); ctx.lineTo(rp[0] + rs * .45, rp[1]); ctx.lineTo(rp[0], rp[1] + rs * .6); ctx.lineTo(rp[0] - rs * .45, rp[1]); ctx.closePath(); }
        else { ctx.moveTo(rp[0] - rs * .5, rp[1] + rs * .4); ctx.lineTo(rp[0], rp[1] - rs * .5); ctx.lineTo(rp[0] + rs * .5, rp[1] + rs * .4); }
        ctx.stroke();
      }

      // crystals streaking past from the center (speed line + faceted gem)
      for (i = 0; i < crystals.length; i++) {
        var c = crystals[i];
        var zPrev = c.z;
        c.z -= dt * speed * 0.6;
        if (c.z <= 0.05) { crystals[i] = crystal(true); continue; }
        var p1 = proj(c.a, c.z, c.r), p0 = proj(c.a, Math.min(1, zPrev + 0.05), c.r);
        var size = Math.min(95, 18 / c.z), ca = Math.min(1, (1 - c.z) * 2.4);
        var col = c.col[0] + "," + c.col[1] + "," + c.col[2];
        ctx.strokeStyle = "rgba(" + col + "," + (ca * 0.4).toFixed(3) + ")";
        ctx.lineWidth = Math.max(1, size * 0.18);
        ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
        // gem: pointing toward the tunnel center, glow + body + highlight
        var ang = Math.atan2(CY - p1[1], CX - p1[0]) + c.tilt;
        ctx.save(); ctx.translate(p1[0], p1[1]); ctx.rotate(ang);
        var L = size * c.len, Wd = size * c.w;
        ctx.fillStyle = "rgba(" + col + "," + (ca * 0.16).toFixed(3) + ")";
        ctx.beginPath(); ctx.ellipse(L * 0.3, 0, L * 0.9, Wd * 1.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(" + col + "," + (ca * 0.95).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(L * 0.25, -Wd); ctx.lineTo(-L * 0.25, -Wd * 0.7); ctx.lineTo(-L * 0.25, Wd * 0.7); ctx.lineTo(L * 0.25, Wd); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255," + (ca * 0.55).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(L * 0.25, -Wd); ctx.lineTo(L * 0.1, -Wd * 0.15); ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.globalCompositeOperation = "lighter";
      }

      // the light at the end of the tunnel grows smoothly and fills the window
      var lu = ease((t - LIGHT_AT) / (DUR - LIGHT_AT));
      ctx.globalCompositeOperation = "source-over";
      if (lu > 0) {
        var R = 40 + lu * 1100;
        var lg = ctx.createRadialGradient(CX, CY, 0, CX, CY, R);
        lg.addColorStop(0, "rgba(255,250,232,1)"); lg.addColorStop(0.55, "rgba(255,244,214," + (0.85 * lu + 0.1).toFixed(3) + ")");
        lg.addColorStop(1, "rgba(255,240,205,0)");
        ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
      }
      if (t >= ART_AT && !wrap.classList.contains("arrive")) wrap.classList.add("arrive");   // painting + window open up
      if (t < DUR) { requestAnimationFrame(draw); return; }
      if (!done) { done = true; if (opt.onDone) opt.onDone(); }
    }
    requestAnimationFrame(draw);
  }
  window.CrystalTunnel = { run: run, duration: DUR };
})();
