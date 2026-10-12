/* Plan E "Lost Library" dashboard: six arched windows (from worlds.js). Tap a window -> ~2s gold firefly swarm
   swirls out of it across the screen -> fades into that world's page. DRAFT ART. */
(function () {
  "use strict";
  var L = window.LOST_LIBRARY, $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var box = $("windows"), toWorld = $("toWorld"), cv = $("swarm"), ctx = cv.getContext("2d"), busy = false;
  var params = new URLSearchParams(location.search), justKey = params.get("key");
  var done = L.done();
  var KEY = '<svg viewBox="0 0 44 44"><circle cx="13" cy="22" r="8" fill="none" stroke="#f2c54b" stroke-width="4.5"/><circle cx="13" cy="22" r="8" fill="none" stroke="#fff1b8" stroke-width="1.2"/>' +
            '<path d="M21 22h19M33 22v7M39 22v5" fill="none" stroke="#f2c54b" stroke-width="4.5" stroke-linecap="round"/></svg>';

  var refs = {};
  L.worlds.forEach(function (w, i) {
    var b = document.createElement("button"); b.type = "button"; b.className = "win";
    b.style.cssText = "left:" + w.win.x + "px;top:" + w.win.y + "px;width:" + w.win.w + "px;height:" + w.win.h + "px;--r:" + (w.win.w / 2) + "px";
    b.setAttribute("aria-label", "Module " + w.module + ": " + w.name);
    b.innerHTML = '<span class="dust"></span><span class="glow"></span>';
    var s = document.createElement("span"); s.className = "slot" + (i === 0 ? " first" : "");
    s.style.left = w.slot.x + "px"; s.style.top = w.slot.y + "px"; s.innerHTML = '<span class="shade"></span>' + KEY;
    var p = document.createElement("div"); p.className = "plaque";
    p.style.left = (w.win.x + w.win.w / 2) + "px"; p.style.top = (w.slot.y + 24) + "px";
    if (w.module === 5) p.style.setProperty("--pw", "112px");
    p.innerHTML = "<b></b><small></small>"; p.querySelector("b").textContent = w.name; p.querySelector("small").textContent = "Module " + w.module;
    box.appendChild(b); box.appendChild(s); box.appendChild(p);
    b.addEventListener("mouseenter", function () { p.classList.add("hov"); });
    b.addEventListener("mouseleave", function () { p.classList.remove("hov"); });
    b.addEventListener("click", function () { go(w); });
    refs[w.slug] = [b, s, p];
    var isDone = done.indexOf(w.slug) >= 0;
    if (isDone && w.slug !== justKey) mark(w.slug, true);
    if (isDone) b.setAttribute("aria-label", "Module " + w.module + ": " + w.name + " (restored, key found)");
  });
  function mark(slug) { refs[slug].forEach(function (e) { e.classList.add("done"); }); }
  if (justKey && refs[justKey] && done.indexOf(justKey) >= 0) {   // just collected: the window restores in front of the student
    setTimeout(function () { mark(justKey); say("The " + refs[justKey][2].querySelector("b").textContent + " window is restored!"); }, reduce ? 0 : 450);
    try { history.replaceState(null, "", location.pathname + "?return=1"); } catch (e) {}
  }
  var tt;
  function say(m) { var t = $("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("on"); }, 2200); }

  $("reset").addEventListener("click", function () {
    L.reset(); Object.keys(refs).forEach(function (k) { refs[k].forEach(function (e) { e.classList.remove("done"); }); });
    say("Progress reset: every window is dusty again");
  });

  // ---- firefly swarm (code only): ~2s of gold particles swirling out of the window, then the world fades in
  function go(w) {
    if (busy) return; busy = true;
    var img = new Image(); img.src = w.art;
    toWorld.style.backgroundImage = 'url("' + w.art + '")';
    try { sessionStorage.setItem("lib-arrive", "1"); } catch (e) {}
    function nav() { location.href = w.slug + "/"; }
    if (reduce) { toWorld.classList.add("on"); setTimeout(nav, 650); return; }
    var cx = w.win.x + w.win.w / 2, cy = w.win.y + w.win.h * 0.45, N = 170, P = [], t0 = performance.now(), DUR = 2000, faded = false;
    for (var i = 0; i < N; i++) {
      P.push({ d: Math.random() * 600,                       // launch delay (ms)
        a: Math.random() * Math.PI * 2, sp: 0.25 + Math.random() * 0.55, spin: (Math.random() < 0.5 ? -1 : 1) * (1.6 + Math.random() * 2.2),
        r: 1.4 + Math.random() * 2.6, ph: Math.random() * 6.28, fx: (Math.random() - 0.5) * 30, fy: (Math.random() - 0.5) * 50 });
    }
    function frame(now) {
      var t = now - t0; ctx.clearRect(0, 0, 1366, 768);
      ctx.globalCompositeOperation = "lighter";
      var veil = Math.min(1, t / 900) * 0.35;                 // dusk the library a touch so the fireflies read
      ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = "rgba(10,8,20," + veil + ")"; ctx.fillRect(0, 0, 1366, 768);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < N; i++) {
        var p = P[i], u = (t - p.d) / 1000; if (u < 0) continue;
        var rad = 18 + p.sp * 520 * u * u * 0.9 + 40 * u, ang = p.a + p.spin * u;      // spiral outward, accelerating
        var x = cx + Math.cos(ang) * rad * 1.35 + p.fx * u, y = cy + Math.sin(ang) * rad * 0.8 + p.fy * u - 30 * u;
        var tw = 0.55 + 0.45 * Math.sin(p.ph + t / 90), a = Math.min(1, u * 4) * tw;
        var g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 5);
        g.addColorStop(0, "rgba(255,244,190," + a + ")"); g.addColorStop(0.3, "rgba(255,200,80," + a * 0.7 + ")"); g.addColorStop(1, "rgba(255,170,40,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.r * 5, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      if (!faded && t > DUR - 450) { faded = true; toWorld.classList.add("on"); setTimeout(nav, 650); }
      if (t < DUR + 700) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  window.LostLibrary = { go: function (i) { go(L.worlds[i]); }, introVideo: L.introVideo /* HOOK */ };
  window.addEventListener("pageshow", function (e) { if (e.persisted) location.reload(); });
})();
