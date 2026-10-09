/* Plan B "Crystal Railways": living station scene.
   Layers (painting px, 1280x720): plate.jpg (empty station) < runes < lantern glows < train.webp < Astra < fern < one canvas (steam, fireflies, leaves).
   Everything moves with transform/opacity; one rAF loop. prefers-reduced-motion shows the final still scene. */
(function () {
  "use strict";
  var W = 1280, H = 720;
  var SLOPE = -0.078;                 // the track rises ~0.078px per px to the right
  var STACK = { x: 349, y: 210 };     // smokestack mouth (painting px, train at rest)
  var VIDEO_STACK = { x: 437, y: 168 }; // smokestack mouth in the last frame of intro-blend.mp4
  // intro-controller.js (loaded first) films the arrival; when it is present the CSS train/Astra stay hidden
  // and this file only adds ambient effects once the intro has finished ("crystal-intro-done").
  var intro = window.CrystalIntro || null;
  var videoMode = false;
  var ARRIVE_D = 1150, ARRIVE_T = 3300, SETTLE_T = 650;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stage = document.getElementById("stage");
  var train = document.getElementById("train");
  var astra = document.getElementById("astra");
  var shadow = document.getElementById("astraShadow");
  var headlamp = document.getElementById("headlamp");
  var lamp1 = document.getElementById("lamp1"), lamp2 = document.getElementById("lamp2");
  var canvas = document.getElementById("fx");
  var ctx = canvas.getContext("2d");
  var runes = Array.prototype.slice.call(document.querySelectorAll(".rune .glow"));

  var scale = 1, dpr = 1;
  function resize() {
    var r = stage.getBoundingClientRect();
    scale = r.width / W;
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------- helpers ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeOutCubic(u) { return 1 - Math.pow(1 - u, 3); }
  function easeInOut(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function easeInQuad(u) { return u * u; }
  // smooth value noise from summed sines with random phases (no visible period)
  function wobble(seed) {
    var p = [rand(0, 6.28), rand(0, 6.28), rand(0, 6.28)], f = [rand(.6, .9), rand(1.3, 1.9), rand(2.7, 3.6)];
    return function (t) { return (Math.sin(t * f[0] + p[0]) * .5 + Math.sin(t * f[1] + p[1]) * .3 + Math.sin(t * f[2] + p[2]) * .2) * (seed || 1); };
  }

  /* ---------- sprites ---------- */
  function radialSprite(size, stops) {
    var c = document.createElement("canvas"); c.width = c.height = size;
    var g = c.getContext("2d"), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
    g.fillStyle = gr; g.fillRect(0, 0, size, size); return c;
  }
  var puffSprite = radialSprite(128, [[0, "rgba(255,252,246,.95)"], [.35, "rgba(250,246,238,.62)"], [.7, "rgba(240,236,228,.18)"], [1, "rgba(240,236,228,0)"]]);
  var flySprite = radialSprite(64, [[0, "rgba(255,250,215,1)"], [.12, "rgba(255,226,130,.95)"], [.3, "rgba(255,196,80,.38)"], [.6, "rgba(255,170,50,.10)"], [1, "rgba(255,160,40,0)"]]);

  /* ---------- train state ---------- */
  var trainDx = reduce ? 0 : ARRIVE_D;   // painting px along the track (+ = to the right)
  var state = reduce ? "idle" : "waiting"; // waiting -> arriving -> idle -> departing
  var t0 = 0, departT0 = 0, lastChuff = 0, nextChuff = 0, shudderT = -10;
  function placeTrain(dx, jx, jy) {
    if (videoMode) return;
    var x = (dx + (jx || 0)) * scale, y = (SLOPE * dx + (jy || 0)) * scale;
    train.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
  }
  placeTrain(trainDx);

  /* ---------- steam ---------- */
  var puffs = [];
  function stackPos() { return videoMode ? VIDEO_STACK : { x: STACK.x + trainDx, y: STACK.y + SLOPE * trainDx }; }
  function emitPuff(big, now, extra) {
    var s = stackPos();
    puffs.push({
      x: s.x + rand(-4, 4), y: s.y + rand(-2, 2),
      vx: (big ? rand(-34, -16) : rand(-16, -7)) + (extra && extra.vx || 0),
      vy: big ? rand(-62, -42) : rand(-30, -20),
      r0: big ? rand(13, 18) : rand(8, 12), r1: big ? rand(62, 86) : rand(36, 52),
      a: big ? rand(.55, .72) : rand(.34, .48),
      born: now, life: big ? rand(2100, 2900) : rand(3400, 4600), drag: big ? .55 : .35
    });
  }
  function emitCylinder(now) {
    // low steam from the cylinders by the front wheels: a short "whoosh" sideways
    for (var i = 0; i < 6; i++) {
      var left = i % 2 === 0;
      puffs.push({
        x: 300 + trainDx + rand(-10, 10), y: 600 + SLOPE * trainDx + rand(-6, 6),
        vx: left ? rand(-120, -60) : rand(40, 90), vy: rand(-26, -10),
        r0: rand(16, 24), r1: rand(70, 110), a: rand(.45, .62), born: now + i * 40, life: rand(1200, 1700), drag: 1.4
      });
    }
  }
  function drawPuffs(now, dt) {
    for (var i = puffs.length - 1; i >= 0; i--) {
      var p = puffs[i], age = now - p.born;
      if (age < 0) continue;
      var u = age / p.life;
      if (u >= 1) { puffs.splice(i, 1); continue; }
      var k = Math.exp(-p.drag * dt);
      p.vx *= k; p.vy = p.vy * k - 4 * dt; // slow down, keep a little lift
      p.vx -= 3 * dt;                      // breeze drifts it to the left
      p.x += p.vx * dt; p.y += p.vy * dt;
      var r = p.r0 + (p.r1 - p.r0) * easeOutCubic(u);
      var a = p.a * (u < .12 ? u / .12 : Math.pow(1 - (u - .12) / .88, 1.6));
      ctx.globalAlpha = a;
      ctx.drawImage(puffSprite, (p.x - r) * scale * dpr, (p.y - r) * scale * dpr, 2 * r * scale * dpr, 2 * r * scale * dpr);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- fireflies (over forest and shadows, never under the ticket or title) ---------- */
  var zones = [
    { x0: 12, x1: 215, y0: 120, y1: 540, n: 6 },   // left forest by the lamps and fence
    { x0: 760, x1: 835, y0: 40, y1: 265, n: 3 },   // trunk shadows right of the treehouse
    { x0: 610, x1: 760, y0: 20, y1: 175, n: 3 },   // canopy under the treehouse
    { x0: 250, x1: 500, y0: 70, y1: 185, n: 3 },   // dark roof / trunk band
    { x0: 15, x1: 470, y0: 575, y1: 680, n: 3 },   // foreground shadows by the fern and platform
    { x0: 720, x1: 835, y0: 600, y1: 680, n: 2 }   // shadows bottom right of the platform
  ];
  var flies = [];
  zones.forEach(function (z) {
    for (var i = 0; i < z.n; i++) {
      flies.push({
        z: z, cx: rand(z.x0, z.x1), cy: rand(z.y0, z.y1), wx: wobble(1), wy: wobble(1),
        ax: rand(18, 40), ay: rand(14, 30), sp: rand(.18, .32), size: rand(9, 15),
        a: 0, phase: "off", until: rand(0, 4000), dur: 1, start: 0, peak: rand(.55, 1)
      });
    }
  });
  function drawFlies(now, dt) {
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < flies.length; i++) {
      var f = flies[i], z = f.z, t = now / 1000 * f.sp;
      // slow wander of the centre inside the zone
      f.cx = clamp(f.cx + f.wx(t * 0.7 + i) * 6 * dt, z.x0, z.x1);
      f.cy = clamp(f.cy + f.wy(t * 0.7 + i * 3) * 5 * dt, z.y0, z.y1);
      var x = f.cx + f.wx(t) * f.ax, y = f.cy + f.wy(t + 10) * f.ay;
      // random, unsynchronised fade in / hold / fade out / rest
      if (now >= f.until) {
        if (f.phase === "off") { f.phase = "in"; f.start = now; f.dur = rand(900, 1800); f.until = now + f.dur; f.peak = rand(.55, 1); }
        else if (f.phase === "in") { f.phase = "on"; f.until = now + rand(1200, 4200); }
        else if (f.phase === "on") { f.phase = "out"; f.start = now; f.dur = rand(1000, 2000); f.until = now + f.dur; }
        else { f.phase = "off"; f.until = now + rand(800, 5200); }
      }
      var a = f.phase === "in" ? easeInOut((now - f.start) / f.dur) * f.peak :
              f.phase === "on" ? f.peak : f.phase === "out" ? (1 - easeInOut((now - f.start) / f.dur)) * f.peak : 0;
      if (a <= .01) continue;
      var s = f.size;
      ctx.globalAlpha = a;
      ctx.drawImage(flySprite, (x - s) * scale * dpr, (y - s) * scale * dpr, 2 * s * scale * dpr, 2 * s * scale * dpr);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------- drifting leaves ---------- */
  var leaves = [], nextLeaves = 2500;
  var leafColors = ["#c9892f", "#d9a441", "#a8742a", "#8c9a3a", "#b5652a"];
  function spawnLeaves(now) {
    var n = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) {
      leaves.push({
        x: rand(20, 800), y: rand(-30, -10) - i * rand(30, 70), vy: rand(16, 26), sway: rand(22, 48), sf: rand(.5, .9),
        ph: rand(0, 6.28), drift: rand(4, 14), rot: rand(0, 6.28), spin: rand(-.9, .9), size: rand(7, 11),
        c: leafColors[Math.floor(Math.random() * leafColors.length)], born: now
      });
    }
    nextLeaves = now + rand(5000, 10000);
  }
  function drawLeaves(now, dt) {
    for (var i = leaves.length - 1; i >= 0; i--) {
      var l = leaves[i], t = (now - l.born) / 1000;
      l.y += l.vy * dt;
      var x = l.x + l.drift * t + Math.sin(t * l.sf * 2 + l.ph) * l.sway;
      var flip = Math.cos(t * l.sf * 2 + l.ph);           // flutter: the leaf turns as it swings
      l.rot += l.spin * dt;
      if (l.y > H + 20 || x > 860) { leaves.splice(i, 1); continue; }
      var a = clamp((H + 10 - l.y) / 80, 0, 1) * clamp((860 - x) / 40, 0, 1);
      ctx.save();
      ctx.globalAlpha = .92 * a;
      ctx.translate(x * scale * dpr, l.y * scale * dpr);
      ctx.rotate(l.rot + flip * .6);
      ctx.scale(scale * dpr, scale * dpr * (.35 + .65 * Math.abs(flip)));
      var s = l.size;
      ctx.beginPath();
      ctx.moveTo(-s, 0); ctx.quadraticCurveTo(-s * .2, -s * .62, s, 0); ctx.quadraticCurveTo(-s * .2, s * .62, -s, 0);
      ctx.fillStyle = l.c; ctx.fill();
      ctx.strokeStyle = "rgba(70,40,10,.45)"; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.moveTo(-s * 1.15, 0); ctx.lineTo(s * .85, 0); ctx.stroke();
      ctx.restore();
    }
  }

  /* ---------- lanterns, headlamp, runes ---------- */
  var fl1 = wobble(1), fl2 = wobble(1), fl1b = wobble(1), fl2b = wobble(1), hl = wobble(1);
  function lights(now) {
    var t = now / 1000;
    // soft candle flicker: slow drift plus a small quick shimmer (never a regular beat)
    lamp1.style.opacity = (.78 + fl1(t * .9) * .1 + fl1b(t * 5.3) * .05).toFixed(3);
    lamp2.style.opacity = (.74 + fl2(t * 1.1) * .11 + fl2b(t * 6.1) * .06).toFixed(3);
    if (!videoMode) headlamp.style.opacity = (.66 + hl(t * .22) * .1).toFixed(3);     // very slow glow breathing
  }
  function runeShimmer() {
    runes.forEach(function (g) {
      (function loop() {
        var wait = rand(2500, 9000);
        setTimeout(function () {
          g.style.transitionDuration = rand(1.8, 3.2).toFixed(2) + "s";
          g.style.opacity = rand(.55, .8).toFixed(2);
          setTimeout(function () { g.style.opacity = rand(.24, .36).toFixed(2); loop(); }, rand(1800, 3200));
        }, wait);
      })();
    });
  }

  /* ---------- Astra ---------- */
  var astraTimer = 0;
  function astraHop() {
    astra.classList.remove("hop", "sway"); shadow.classList.remove("hop");
    void astra.offsetWidth;
    astra.classList.add("hop"); shadow.classList.add("hop");
    scheduleSway();
  }
  function scheduleSway() {
    clearTimeout(astraTimer);
    astraTimer = setTimeout(function () {
      if (state !== "idle") return;
      astra.classList.remove("hop", "sway"); void astra.offsetWidth; astra.classList.add("sway");
      scheduleSway();
    }, rand(10000, 13000));
  }

  /* ---------- main loop ---------- */
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var jx = 0, jy = 0;

    if (state === "arriving") {
      var e = now - t0;
      if (e < ARRIVE_T) {
        var u = e / ARRIVE_T;
        trainDx = ARRIVE_D * (1 - easeOutCubic(u)) - 6 * Math.pow(u, 3);   // glides in and slides 6px past the mark
        var speed = ARRIVE_D * 3 * Math.pow(1 - u, 2) / (ARRIVE_T / 1000);
        if (now - lastChuff > (speed > 120 ? 85 : 140)) { emitPuff(true, now); lastChuff = now; }
      } else if (e < ARRIVE_T + SETTLE_T) {
        var v = (e - ARRIVE_T) / SETTLE_T;
        trainDx = -6 * (1 - easeInOut(v));                                  // settles back onto the mark
        jy = Math.sin(v * Math.PI) * .8;                                   // a little sit-down on the springs
        if (now - lastChuff > 260) { emitPuff(false, now); lastChuff = now; }
      } else {
        trainDx = 0; state = "idle"; nextChuff = now + 700; astraHop();
      }
      placeTrain(trainDx, jx, jy);
    } else if (state === "idle") {
      if (now >= nextChuff) {
        emitPuff(false, now);
        if (Math.random() < .35) setTimeout(function () { emitPuff(false, performance.now()); }, 260);
        nextChuff = now + rand(1500, 2800); shudderT = now;
      }
      // tiny idle shudder (~1px) that rides each chuff, plus a faint constant tremor
      var se = (now - shudderT) / 1000;
      jy = Math.sin(now / 1000 * 2 * Math.PI * 8.5) * (.18 + .6 * Math.exp(-se * 5));
      jx = Math.sin(now / 1000 * 2 * Math.PI * 6.1 + 1) * .12;
      placeTrain(0, jx, jy);
    } else if (state === "departing") {
      var d = now - departT0;
      var dd = d;
      trainDx = -1450 * easeInQuad(Math.min(1, dd / 2900));               // pulls away slowly, then picks up speed
      if (now - lastChuff > (dd < 900 ? 150 : 95)) { emitPuff(true, now, { vx: 30 }); lastChuff = now; }
      placeTrain(trainDx, 0, dd < 200 ? Math.sin(dd / 200 * Math.PI) * .8 : 0);
    }

    lights(now);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFlies(now, dt);
    if (now >= nextLeaves) spawnLeaves(now);
    drawLeaves(now, dt);
    drawPuffs(now, dt);
    requestAnimationFrame(frame);
  }

  /* ---------- reduced motion: one still frame ---------- */
  function drawStill() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var now = 0;
    // a calm steam plume and a few lit fireflies
    [[0, 0, 12, .5], [-14, -38, 22, .4], [-34, -78, 32, .28], [-60, -116, 40, .16]].forEach(function (q) {
      var r = q[2]; ctx.globalAlpha = q[3];
      ctx.drawImage(puffSprite, (STACK.x + q[0] - r) * scale * dpr, (STACK.y + q[1] - r) * scale * dpr, 2 * r * scale * dpr, 2 * r * scale * dpr);
    });
    ctx.globalCompositeOperation = "lighter";
    flies.forEach(function (f, i) {
      if (i % 2) return;
      ctx.globalAlpha = .8; var s = f.size;
      ctx.drawImage(flySprite, (f.cx - s) * scale * dpr, (f.cy - s) * scale * dpr, 2 * s * scale * dpr, 2 * s * scale * dpr);
    });
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    runes.forEach(function (g) { g.style.opacity = ".45"; });
  }

  /* ---------- start ---------- */
  function decoded(img) {
    if (!img) return Promise.resolve();
    if (img.decode) return img.decode().catch(function () {});
    return new Promise(function (res) { if (img.complete) res(); else { img.onload = img.onerror = res; } });
  }
  function startVideoIdle() {
    // filmed train is parked: steam from its stack, fireflies, leaves and lantern flicker only
    if (videoMode) return;
    videoMode = true;
    lamp1.style.setProperty("--x", "60"); lamp1.style.setProperty("--y", "305");   // lanterns in the filmed frame
    lamp2.style.setProperty("--x", "190"); lamp2.style.setProperty("--y", "307");
    resize();
    trainDx = 0; state = "idle"; nextChuff = performance.now() + 500;
    if (reduce) { drawStill(); return; }
    requestAnimationFrame(function (n) { last = n; requestAnimationFrame(frame); });
  }
  var plateStarted = false;
  var introFailed = intro && intro.video && intro.video.error;
  if (intro && !introFailed) {
    window.addEventListener("crystal-intro-done", startVideoIdle);
    intro.video.addEventListener("error", startPlate);   // video can't play: fall back to the code-layered arrival
    if (scene().classList.contains("intro-done")) startVideoIdle();
  } else {
    startPlate();
  }
  function scene() { return document.querySelector(".scene"); }
  function startPlate() {
  if (plateStarted || videoMode) return; plateStarted = true;
  if (reduce) {
    placeTrain(0);
    var redraw = function () { resize(); drawStill(); };
    Promise.all([decoded(train.querySelector("img"))]).then(redraw);
    window.addEventListener("resize", redraw);
  } else {
    var started = false;
    var go = function () {
      if (started) return; started = true;
      resize();
      state = "arriving"; t0 = performance.now(); lastChuff = 0;
    };
    Promise.all([decoded(document.querySelector(".plate")), decoded(train.querySelector("img")), decoded(astra.querySelector("img"))]).then(function () { setTimeout(go, 250); });
    setTimeout(go, 3500); // never wait forever on a slow image
    window.addEventListener("resize", function () { placeTrain(trainDx); });
    runeShimmer();
    requestAnimationFrame(function (n) { last = n; requestAnimationFrame(frame); });
  }
  }

  /* ---------- ticket: pick a stop (highlight), then "Board the train" punches it, the ticket flies off,
     the depart video plays unobstructed, and the chosen world opens when it ends ---------- */
  var ticket = document.querySelector(".ticket");
  var main = document.querySelector(".paper.main");
  var goBtn = document.getElementById("goSandstone");   // the NEXT stop: selected by default
  var board = document.getElementById("board");
  var boardDest = document.getElementById("boardDest");
  var fade = document.getElementById("departFade");
  var leaving = false, selected = null;
  if (!intro) document.body.classList.remove("ui-away");   // no intro controller: show the ticket right away

  Array.prototype.forEach.call(document.querySelectorAll(".world.soon"), function (b) {
    var tm = 0;
    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      b.classList.add("tip"); clearTimeout(tm);
      tm = setTimeout(function () { b.classList.remove("tip"); }, 1600);
    });
  });

  function select(b, animate) {
    if (leaving) return;
    Array.prototype.forEach.call(document.querySelectorAll(".world.go"), function (x) {
      x.classList.toggle("sel", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false");
    });
    selected = b;
    var name = b.querySelector(".wname").textContent;
    if (boardDest) boardDest.textContent = "to " + name;
    board.disabled = false;
    board.setAttribute("aria-label", "Board the train to " + name);
    if (animate && !reduce) { b.classList.remove("pick"); void b.offsetWidth; b.classList.add("pick"); }
  }
  Array.prototype.forEach.call(document.querySelectorAll(".world.go"), function (b) {
    b.addEventListener("click", function (ev) { ev.preventDefault(); select(b, true); });
  });
  if (goBtn) select(goBtn, false); else board.disabled = true;

  function punchHole(btn) {
    // punch a real hole (mask cut) beside the chosen stop's medal, where finished stops carry their punch
    var medal = btn.querySelector(".medal").getBoundingClientRect();
    var mr = main.getBoundingClientRect();
    var cx = medal.right - 1 - mr.left, cy = medal.top + 47 - mr.top;
    var ring = document.createElement("span");
    ring.className = "punchring"; ring.style.left = cx + "px"; ring.style.top = cy + "px";
    main.appendChild(ring);
    var R = 8.5;
    function setHole(r) { main.style.setProperty("--cut-c", "radial-gradient(circle at " + cx + "px " + cy + "px, transparent " + r + "px, #000 " + (r + .6) + "px)"); }
    if (reduce) { setHole(R); return; }
    ring.classList.add("go");
    ticket.classList.add("press");
    var s0 = performance.now();
    (function grow(n) {
      var u = Math.min(1, (n - s0) / 160);
      setHole(R * easeOutCubic(u));
      if (u < 1) requestAnimationFrame(grow);
    })(s0);
    setTimeout(function () {
      var chad = document.createElement("span");
      chad.className = "chad";
      chad.style.left = (mr.left + cx) + "px"; chad.style.top = (mr.top + cy) + "px";
      document.body.appendChild(chad);
      setTimeout(function () { chad.remove(); }, 1300);
    }, 120);
  }

  // the old code-layered departure (only used if the depart video is unavailable)
  function departCSS(dest) {
    if (videoMode) { videoMode = false; scene().classList.remove("intro-done", "depart-playing", "depart-done"); }
    if (state !== "idle") { state = "idle"; trainDx = 0; placeTrain(0); }
    clearTimeout(astraTimer);
    setTimeout(function () {
      var n = performance.now();
      emitCylinder(n);
      for (var i = 0; i < 7; i++) (function (k) { setTimeout(function () { emitPuff(true, performance.now()); }, k * 70); })(i);
      astra.classList.remove("hop", "sway"); shadow.classList.remove("hop");
      void astra.offsetWidth;
      astra.classList.add("boarding"); shadow.classList.add("boarding");
    }, 380);
    setTimeout(function () { state = "departing"; departT0 = performance.now(); lastChuff = 0; }, 1250);
    setTimeout(function () { fade.classList.add("on"); }, 3150);
    setTimeout(function () { location.href = dest; }, 3950);
  }

  function departVideo(dest) {
    var done = false;
    function go() { if (done) return; done = true; fade.classList.add("on"); setTimeout(function () { location.href = dest; }, 350); }
    window.addEventListener("crystal-depart-done", go, { once: true });
    window.CrystalDepart.play();
    var v = window.CrystalDepart.video();
    if (v) {
      // soft fade over the very last frames, then open the world on "ended"
      v.addEventListener("timeupdate", function tu() {
        if (v.duration && v.currentTime > v.duration - .45) { fade.classList.add("on"); v.removeEventListener("timeupdate", tu); }
      });
      v.addEventListener("error", go, { once: true });
    }
    setTimeout(go, 22000); // never strand the student if the video stalls
  }

  function boardTrain(ev) {
    if (ev) ev.preventDefault();
    if (leaving || !selected) return;
    leaving = true;
    var dest = selected.getAttribute("data-dest") || "sandstone-canyon/";
    board.blur();
    if (window.CrystalDepart && window.CrystalDepart.preload) window.CrystalDepart.preload();
    punchHole(selected);                                       // conductor's punch on the chosen stop
    if (reduce) { setTimeout(function () { location.href = dest; }, 450); return; }
    setTimeout(function () { document.body.classList.add("ui-flyoff"); }, 420);   // ticket lifts and swoops off
    var useVideo = window.CrystalDepart && !(intro && (intro.failed || (intro.video && intro.video.error)));
    setTimeout(function () { if (useVideo) departVideo(dest); else departCSS(dest); }, 1300);
  }
  board.addEventListener("click", boardTrain);

  // coming back with the browser's back button: reset the scene
  window.addEventListener("pageshow", function (e) { if (e.persisted) location.reload(); });
})();
