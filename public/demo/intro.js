/* Dashboard intro film + living loop (Plan A.1 Lantern Tree, Plan D Forest Guides).
   <script src="../demo/intro.js" data-preset="a1"></script>   — place BEFORE ../demo/ambient.js

   What it does
   - Intro: a short film that ends exactly on the dashboard art. It needs one tap to start (so Astra's voice plays with sound),
     then the panels/buttons slide in. Plays once per day per plan; "Replay intro" brings it back any time. Skip at any point.
   - Caption: Astra's line appears in a see-through speech bubble while he speaks, fades after a few seconds, and has an × to close.
   - Loop: after the intro, a gentle looping clip (Astra reading in A.1, the whole porch in D) plays under the effects layer.
     In D the original signpost is laid back on top of the video, so the arrows stay pixel-exact and clickable.
   - Reduce motion: no intro autoplay and no loop video; the still art and every control work as before.
   - ?intro=1 forces the intro (handy for review); ?intro=0 skips it. */
(function () {
  "use strict";
  var me = document.currentScript, preset = (me && me.dataset.preset) || "a1";
  var Q = new URLSearchParams(location.search);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PRESETS = {
    a1: {
      host: function () { return document.getElementById("frame"); },           // 1366x768 stage
      after: function () { return document.querySelector("#frame .bg"); },
      W: 1366, H: 768,
      intro: "intro", poster: "intro-poster.jpg",
      loop: "astra-loop", loopRect: [442, 436, 512, 288], loopFeather: true,
      ui: ".strip, .goaltile, #lanterns, .bar, .selected-module, .lsb, .ls-start, .ls-check",
      caption: { text: "Oh, hi! Every lantern leads to a new world. Which one will we explore today?", at: 13.1, hold: 6.5, x: 760, y: 360 },
      startLabel: "Let’s begin!",
      introStars: 8,
      replayCss: "left:12px;top:86px"
    },
    d: {
      host: function () { return document.querySelector(".stage"); },             // 1280x720 cover box
      after: null,
      W: 1280, H: 720,
      intro: "assets/intro", poster: "assets/intro-poster.jpg",
      loop: "assets/loop", loopRect: null,
      overlay: { src: "assets/signpost.png", rect: [674, 52, 190, 545] },
      ui: ".top, .go, .hop, .hot, .ls-start, .ls-check, .fx, .lsb",
      caption: { text: "Are you ready to go on an adventure?", at: 15.9, hold: 4.5, x: 215, y: 165, tail: "right" },
      startLabel: "Let’s begin!",
      replayCss: "left:14px;bottom:14px"
    }
  };
  var P = PRESETS[preset]; if (!P) return;
  var host = P.host(); if (!host) return;
  var KEY = "luna-intro-" + preset, today = new Date().toISOString().slice(0, 10);
  function seenToday() { try { return localStorage.getItem(KEY) === today; } catch (e) { return false; } }
  function markSeen() { try { localStorage.setItem(KEY, today); } catch (e) {} }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".fx-loop{position:absolute;pointer-events:none;opacity:0;transition:opacity .8s ease;object-fit:cover;display:block}",
    ".fx-loop.on{opacity:1}",
    ".fx-loop.feather{-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 72%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 72%,transparent 100%)}",
    ".fx-overlay{position:absolute;pointer-events:none}",
    ".intro-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:40;background:#000;transition:opacity .7s ease}",
    ".intro-film.gone{opacity:0}",
    P.ui.split(",").map(function (q) { return "html.intro-on " + q.trim(); }).join(",") + "{opacity:0 !important;pointer-events:none !important}",
    P.ui + "{transition:opacity .7s ease, background-color .2s ease, box-shadow .25s ease}",
    ".intro-gate{position:absolute;inset:0;z-index:45;display:grid;place-items:center;background:rgba(10,6,24,.28)}",
    ".intro-btn{font:800 26px/1 'Baloo 2','Manrope',system-ui,sans-serif;color:#fffaf0;cursor:pointer;padding:16px 30px;border-radius:18px;",
    "  background:linear-gradient(180deg,#edc25c 0%,#d39a33 55%,#b47a22 100%);border:2px solid #fff3d2;",
    "  box-shadow:0 0 0 2px #8a5a1c,0 5px 0 #6e4614,0 10px 22px rgba(20,10,0,.5),inset 0 2px 0 rgba(255,255,255,.45);text-shadow:0 1px 0 rgba(90,52,14,.6)}",
    ".intro-btn:hover{filter:brightness(1.06)} .intro-btn:active{translate:0 3px}",
    ".intro-skip,.intro-replay{position:absolute;z-index:46;font:700 14px/1 'Manrope','Baloo 2',system-ui,sans-serif;color:#fff;cursor:pointer;",
    "  padding:8px 14px;border-radius:999px;background:rgba(16,12,38,.55);border:1px solid rgba(255,255,255,.35);",
    "  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}",
    ".intro-skip{right:16px;bottom:16px} .intro-replay{z-index:30} .intro-skip:hover,.intro-replay:hover{background:rgba(16,12,38,.75)}",
    ".astra-say{position:absolute;z-index:47;max-width:380px;padding:12px 40px 12px 16px;border-radius:18px;",
    "  font:700 19px/1.3 'Baloo 2','Manrope',system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7);",
    "  background:rgba(18,12,36,.30);border:1.5px solid rgba(255,255,255,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);",
    "  box-shadow:0 8px 24px rgba(0,0,0,.25);opacity:0;transform:translateY(6px) scale(.98);transition:opacity .4s ease,transform .4s ease}",
    ".astra-say.on{opacity:1;transform:none}",
    ".astra-say::after{content:'';position:absolute;left:28px;bottom:-11px;width:18px;height:18px;transform:rotate(45deg);",
    "  background:inherit;border-right:1.5px solid rgba(255,255,255,.55);border-bottom:1.5px solid rgba(255,255,255,.55);",
    "  -webkit-backdrop-filter:inherit;backdrop-filter:inherit}",
    ".astra-say.tail-right::after{left:auto;right:28px}",
    ".astra-say b{display:block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#ffd77a;margin-bottom:2px}",
    ".astra-say .x{position:absolute;top:6px;right:8px;width:26px;height:26px;border-radius:50%;border:0;cursor:pointer;",
    "  font:700 18px/26px system-ui,sans-serif;color:#fff;background:rgba(0,0,0,.25)} .astra-say .x:hover{background:rgba(0,0,0,.45)}"
  ].join("\n");
  document.head.appendChild(css);

  // each clip ships as .webm (VP9, smaller) and .mp4 (H.264, Safari/older devices); pick what this browser plays
  var probe = document.createElement("video");
  function src(base) { return probe.canPlayType('video/webm; codecs="vp9"') ? base + ".webm" : base + ".mp4"; }
  function pct(v, of) { return (v / of * 100).toFixed(4) + "%"; }
  function place(el, x, y, w, h) {
    if (P.W === 1366) { el.style.left = x + "px"; el.style.top = y + "px"; if (w) el.style.width = w + "px"; if (h) el.style.height = h + "px"; }
    else { el.style.left = pct(x, P.W); el.style.top = pct(y, P.H); if (w) el.style.width = pct(w, P.W); if (h) el.style.height = pct(h, P.H); }
  }

  /* ---------- the living loop ---------- */
  var loop = null;
  function buildLoop() {
    if (reduce || loop) return;
    loop = document.createElement("video");
    loop.className = "fx-loop" + (P.loopFeather ? " feather" : "");
    loop.muted = true; loop.loop = true; loop.playsInline = true; loop.setAttribute("playsinline", ""); loop.setAttribute("aria-hidden", "true");
    loop.preload = "auto"; loop.src = src(P.loop);
    if (P.loopRect) place(loop, P.loopRect[0], P.loopRect[1], P.loopRect[2], P.loopRect[3]);
    else { loop.style.inset = "0"; loop.style.width = "100%"; loop.style.height = "100%"; }
    var ref = P.after && P.after();
    if (ref) ref.after(loop); else host.prepend(loop);
    if (P.overlay) {   // original signpost back on top of the video
      var o = document.createElement("img"); o.className = "fx-overlay"; o.alt = ""; o.src = P.overlay.src; o.setAttribute("aria-hidden", "true");
      place(o, P.overlay.rect[0], P.overlay.rect[1], P.overlay.rect[2], P.overlay.rect[3]);
      loop.after(o);
    }
    loop.addEventListener("playing", function () { loop.classList.add("on"); });
    loop.addEventListener("error", function () { loop.remove(); });   // no clip yet → still art, nothing breaks
    document.addEventListener("visibilitychange", function () { if (document.hidden) loop.pause(); else startLoop(); });
  }
  function startLoop() { if (loop) { var p = loop.play(); if (p && p.catch) p.catch(function () {}); } }

  /* ---------- UI hide/show ---------- */
  function hideUI() { document.documentElement.classList.add("intro-on"); }
  function showUI() { document.documentElement.classList.remove("intro-on"); }

  /* ---------- caption ---------- */
  var say = null, sayTimer = 0;
  function showCaption() {
    if (!P.caption) return;
    closeCaption(true);
    say = document.createElement("div"); say.className = "astra-say" + (P.caption.tail === "right" ? " tail-right" : ""); say.setAttribute("role", "status");
    say.innerHTML = "<b>Astra</b>" + P.caption.text + '<button class="x" type="button" aria-label="Close">×</button>';
    place(say, P.caption.x, P.caption.y);
    host.appendChild(say);
    say.querySelector(".x").onclick = function () { closeCaption(); };
    requestAnimationFrame(function () { say && say.classList.add("on"); });
    sayTimer = setTimeout(closeCaption, P.caption.hold * 1000);
  }
  function closeCaption(now) {
    clearTimeout(sayTimer); if (!say) return;
    var s = say; say = null;
    if (now) { s.remove(); return; }
    s.classList.remove("on"); setTimeout(function () { s.remove(); }, 450);
  }

  /* ---------- intro ---------- */
  var film = null, gate = null, skip = null, replay = null, stopStars = null;
  function finish() {
    if (film) { var f = film; film = null; f.classList.add("gone"); setTimeout(function () { f.remove(); }, 750); }
    if (gate) { gate.remove(); gate = null; }
    if (skip) { skip.remove(); skip = null; }
    if (stopStars) { stopStars(); stopStars = null; }
    markSeen(); showUI(); buildLoop(); startLoop(); addReplay();
    setTimeout(function () { closeCaption(); }, 2500);
  }
  function playIntro(withGate) {
    hideUI(); if (replay) { replay.remove(); replay = null; }
    if (loop) loop.pause();
    film = document.createElement("video");
    film.className = "intro-film"; film.playsInline = true; film.setAttribute("playsinline", ""); film.preload = "auto";
    film.poster = P.poster; film.style.background = "#000 url(\"" + P.poster + "\") center / cover no-repeat"; film.src = src(P.intro);
    host.appendChild(film);
    var shown = false;
    film.addEventListener("timeupdate", function () { if (!shown && film && film.currentTime >= P.caption.at) { shown = true; showCaption(); } });
    film.addEventListener("ended", finish);
    film.addEventListener("error", finish);   // missing file → go straight to the dashboard
    skip = document.createElement("button"); skip.type = "button"; skip.className = "intro-skip"; skip.innerHTML = "Skip intro ›";
    skip.onclick = function () { if (film) film.pause(); closeCaption(true); finish(); };
    host.appendChild(skip);
    function go() {
      if (gate) { gate.remove(); gate = null; }
      if (P.introStars && window.AmbientFX && AmbientFX.introStars) stopStars = AmbientFX.introStars(host, P.W, P.H, P.introStars);
      var p = film.play(); if (p && p.catch) p.catch(function () { film.muted = true; film.play(); }); }
    if (withGate) {
      gate = document.createElement("div"); gate.className = "intro-gate";
      gate.innerHTML = '<button type="button" class="intro-btn">▶ ' + P.startLabel + "</button>";
      gate.querySelector("button").onclick = go;
      host.appendChild(gate);
      setTimeout(function () { gate && gate.querySelector("button").focus({ preventScroll: true }); }, 50);
    } else go();
  }
  function addReplay() {
    if (replay) return;
    replay = document.createElement("button"); replay.type = "button"; replay.className = "intro-replay";
    replay.innerHTML = "↺ Replay intro"; replay.style.cssText = P.replayCss;
    replay.onclick = function () { playIntro(false); };
    host.appendChild(replay);
  }

  var force = Q.get("intro");
  if (reduce || force === "0" || (force !== "1" && seenToday())) { buildLoop(); startLoop(); addReplay(); }
  else playIntro(true);
})();
