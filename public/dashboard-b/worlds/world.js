/* Plan B "Crystal Railways": shared builder for the world arrival screens.
   Each world page sets window.WORLD before loading this file:
     { name, sub, variants: [{ key, art, spots: [[x, y, w, h, "below"?], ...] }], fireflies: [zones], runes: [[x, y, w, rotDeg, glyph], ...] }
   Coordinates are painting pixels of the 1280x720 art. One spot per blue lesson crystal, in lesson order. */
(function () {
  "use strict";
  var W = window.WORLD;
  if (!W) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  // arriving straight from the station's depart film: the painting was already faded in there, so show it at once
  try { if (sessionStorage.getItem("planb-arrive")) { sessionStorage.removeItem("planb-arrive"); document.documentElement.classList.add("from-depart"); } } catch (e) {}

  var FRAME = (window.StageFit && window.StageFit.frame()) || document.body;
  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  /* ---------- scene ---------- */
  var scene = el("div", "scene", FRAME);
  var stage = el("div", "stage", scene); stage.id = "stage";
  var art = el("img", "art", stage); art.alt = W.name + " — " + (W.sub || "");
  var spotsLayer = el("div", "spots", stage); spotsLayer.style.cssText = "inset:0";
  var canvas = null;

  /* ---------- HUD: back + title ---------- */
  var hud = el("header", "hud", FRAME);
  var back = el("a", "back frost", hud); back.href = "../";
  back.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15 10H5M9 5.5 4.5 10 9 14.5" fill="none" stroke="#4a2e1a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Station';
  back.setAttribute("aria-label", "Back to the Crystal Railways station");
  var title = el("div", "titlecard frost", hud);
  title.innerHTML = "<h1>Astra’s Writing Adventure</h1><p></p>";
  var sub = title.querySelector("p");

  var toast = el("div", "toast frost", FRAME); toast.setAttribute("role", "status");
  var toastT = 0;
  function say(msg) { toast.textContent = msg; toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("on"); }, 1800); }

  /* ---------- hotspots ---------- */
  function showVariant(v) {
    art.src = v.art;
    spotsLayer.innerHTML = "";
    v.spots.forEach(function (s, i) {
      var b = el("button", "hs" + (s[4] === "below" ? " below" : ""), spotsLayer);
      b.type = "button";
      b.style.setProperty("--x", s[0]); b.style.setProperty("--y", s[1]);
      b.style.setProperty("--w", s[2]); b.style.setProperty("--h", s[3]);
      b.setAttribute("aria-label", "Lesson " + (i + 1));
      var t = el("span", "tag frost", b); t.textContent = "Lesson " + (i + 1);
      b.addEventListener("click", function () { say(W.name + " · Lesson " + (i + 1) + " is coming soon"); });
    });
    sub.textContent = W.name + " · " + v.spots.length + " lessons";
    document.title = W.name + " · Crystal Railways · Astra’s Writing Adventure";
  }

  var variants = W.variants;
  var want = new URLSearchParams(location.search).get("lessons");
  var cur = variants.filter(function (v) { return v.key === want; })[0] || variants[0];
  showVariant(cur);

  if (variants.length > 1) {
    var tg = el("div", "toggle frost", FRAME);
    tg.setAttribute("role", "group"); tg.setAttribute("aria-label", "Number of lessons");
    el("span", "", tg).textContent = "LESSONS";
    variants.forEach(function (v) {
      var b = el("button", "", tg); b.type = "button"; b.textContent = v.key;
      b.setAttribute("aria-pressed", v === cur ? "true" : "false");
      b.addEventListener("click", function () {
        cur = v; showVariant(v);
        Array.prototype.forEach.call(tg.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        var u = new URL(location.href); u.searchParams.set("lessons", v.key); history.replaceState(null, "", u);
      });
    });
  }

  /* ---------- gold runes (slow, random shimmer; never in step) ---------- */
  var GLYPHS = {
    moon: "M24 6 A14 14 0 1 0 24 34 A11 11 0 1 1 24 6 Z",
    tree: "M20 36 L20 6 M20 18 L11 9 M20 18 L29 9 M20 26 L13 20 M20 26 L27 20",
    leaf: "M20 4 C30 12 30 26 20 36 C10 26 10 12 20 4 Z M20 8 L20 33 M20 15 L26 11 M20 21 L27 17 M20 15 L14 11 M20 21 L13 17",
    wave: "M4 26 C8 18 14 18 16 24 C18 30 24 30 26 22 C27.5 16 33 13 36 18",
    gem: "M20 4 L32 16 L20 36 L8 16 Z M8 16 L32 16 M20 4 L20 36",
    eye: "M4 20 C12 10 28 10 36 20 C28 30 12 30 4 20 Z M20 15 A5 5 0 1 1 20 25 A5 5 0 1 1 20 15"
  };
  (W.runes || []).forEach(function (r) {
    var d = el("div", "rune", stage);
    d.style.setProperty("--x", r[0]); d.style.setProperty("--y", r[1]); d.style.setProperty("--w", r[2]); d.style.setProperty("--r", (r[3] || 0) + "deg");
    ["carve", "gold", "glow"].forEach(function (c) {
      var s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", "0 0 40 40"); s.setAttribute("class", c);
      var p = document.createElementNS(NS, "path"); p.setAttribute("d", GLYPHS[r[4]] || GLYPHS.gem); s.appendChild(p); d.appendChild(s);
    });
    var g = d.querySelector(".glow");
    if (reduce) { g.style.opacity = ".3"; return; }
    (function loop() {
      setTimeout(function () {
        g.style.transitionDuration = (2.6 + Math.random() * 1.6).toFixed(2) + "s";
        g.style.opacity = (.34 + Math.random() * .16).toFixed(2);
        setTimeout(function () { g.style.opacity = (.08 + Math.random() * .06).toFixed(2); loop(); }, 2800 + Math.random() * 2000);
      }, 3000 + Math.random() * 7000);
    })();
  });

  /* ---------- drifting fireflies (soft, unsynchronised fades; slow wander) ---------- */
  if (W.fireflies && W.fireflies.length) {
    canvas = el("canvas", "fx", stage);
    stage.insertBefore(canvas, spotsLayer);
    var ctx = canvas.getContext("2d"), scale = 1, dpr = 1;
    var resize = function () {
      var r = { width: stage.offsetWidth, height: stage.offsetHeight }; scale = r.width / 1280; dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    };
    resize(); window.addEventListener("resize", resize);
    var spr = document.createElement("canvas"); spr.width = spr.height = 64;
    (function () {
      var g = spr.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      [[0, "rgba(255,250,215,1)"], [.12, "rgba(255,226,130,.95)"], [.3, "rgba(255,196,80,.38)"], [.6, "rgba(255,170,50,.10)"], [1, "rgba(255,160,40,0)"]]
        .forEach(function (s) { gr.addColorStop(s[0], s[1]); });
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    })();
    var rand = function (a, b) { return a + Math.random() * (b - a); };
    var flies = [];
    W.fireflies.forEach(function (z) {
      for (var i = 0; i < z[4]; i++) flies.push({
        z: z, x: rand(z[0], z[2]), y: rand(z[1], z[3]), vx: rand(-8, 8), vy: rand(-6, 6), size: rand(9, 14),
        ph: Math.random() < .5 ? "on" : "off", start: 0, until: rand(400, 5000), dur: 1, peak: rand(.5, .9)
      });
    });
    var ease = function (u) { u = Math.max(0, Math.min(1, u)); return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; };
    var draw = function (now, dt) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      flies.forEach(function (f) {
        var z = f.z;
        // gentle drift: a small random steer, soft speed cap, turn back inside the zone
        f.vx += rand(-14, 14) * dt; f.vy += rand(-12, 12) * dt;
        var sp = Math.hypot(f.vx, f.vy); if (sp > 14) { f.vx *= 14 / sp; f.vy *= 14 / sp; }
        if (f.x < z[0]) f.vx += 10 * dt; if (f.x > z[2]) f.vx -= 10 * dt;
        if (f.y < z[1]) f.vy += 10 * dt; if (f.y > z[3]) f.vy -= 10 * dt;
        f.x += f.vx * dt; f.y += f.vy * dt;
        if (now >= f.until) {
          if (f.ph === "off") { f.ph = "in"; f.start = now; f.dur = rand(1600, 2600); f.until = now + f.dur; f.peak = rand(.5, .9); }
          else if (f.ph === "in") { f.ph = "on"; f.until = now + rand(2500, 6000); }
          else if (f.ph === "on") { f.ph = "out"; f.start = now; f.dur = rand(1600, 2800); f.until = now + f.dur; }
          else { f.ph = "off"; f.until = now + rand(1500, 6000); }
        }
        var a = f.ph === "in" ? ease((now - f.start) / f.dur) * f.peak : f.ph === "on" ? f.peak : f.ph === "out" ? (1 - ease((now - f.start) / f.dur)) * f.peak : 0;
        if (a <= .01) return;
        ctx.globalAlpha = a;
        var s = f.size;
        ctx.drawImage(spr, (f.x - s) * scale * dpr, (f.y - s) * scale * dpr, 2 * s * scale * dpr, 2 * s * scale * dpr);
      });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };
    if (reduce) {
      flies.forEach(function (f, i) { if (i % 2 === 0) { f.ph = "on"; } });
      var still = function () { resize(); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.globalCompositeOperation = "lighter";
        flies.forEach(function (f) { if (f.ph !== "on") return; ctx.globalAlpha = .7; var s = f.size; ctx.drawImage(spr, (f.x - s) * scale * dpr, (f.y - s) * scale * dpr, 2 * s * scale * dpr, 2 * s * scale * dpr); });
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; };
      still(); window.addEventListener("resize", still);
    } else {
      var last = performance.now();
      (function frame(now) { var dt = Math.min(.05, (now - last) / 1000); last = now; draw(now, dt); requestAnimationFrame(frame); })(last);
    }
  }

  window.addEventListener("pageshow", function (e) { if (e.persisted) location.reload(); });
})();
