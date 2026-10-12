/* Plan C world page, built like the Plan B world screens (same DOM + world.css look).
   Config comes from worlds.js, keyed by <body data-world="slug">. The clip plays ONCE at 0.75x and holds its hold frame. */
(function () {
  "use strict";
  var slug = document.body.getAttribute("data-world"), W = (window.POPUP_WORLD_PAGES || {})[slug];
  if (!W) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FRAME = (window.StageFit && window.StageFit.frame()) || document.body;
  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  var scene = el("div", "scene", FRAME);
  var stage = el("div", "stage", scene);
  var art = el("img", "art", stage); art.alt = W.name; art.src = (reduce || !W.video) ? W.holdImg : W.poster;
  var spots = el("div", "spots", stage); spots.style.cssText = "inset:0";

  if (W.video && !reduce) {
    var v = document.createElement("video");
    v.className = "art artvid"; v.muted = true; v.defaultMuted = true; v.loop = false; v.autoplay = true; v.playsInline = true;
    v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.setAttribute("aria-hidden", "true");
    v.preload = "auto"; v.poster = W.poster; v.src = W.video;
    var rate = W.rate || 0.75;
    v.defaultPlaybackRate = rate; v.playbackRate = rate;
    v.addEventListener("loadedmetadata", function () { v.playbackRate = rate; });
    function hold() { art.src = W.holdImg; }
    v.addEventListener("ended", hold);
    if (W.hold != null) v.addEventListener("timeupdate", function () { if (v.currentTime >= W.hold) { v.pause(); hold(); } });
    v.addEventListener("error", function () { v.remove(); hold(); });
    stage.insertBefore(v, spots);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }

  var hud = el("header", "hud", FRAME);
  var back = el("a", "back frost", hud); back.href = "../?return=1";
  back.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15 10H5M9 5.5 4.5 10 9 14.5" fill="none" stroke="#4a2e1a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Book';
  back.setAttribute("aria-label", "Back to the book");
  var title = el("div", "titlecard frost", hud);
  title.innerHTML = "<h1>Astra’s Writing Adventure</h1><p></p>";
  title.querySelector("p").textContent = "Pop Up Mounts · Module " + W.module + " · " + W.name;
  document.title = W.name + " · Pop Up Mounts · Astra’s Writing Adventure";

  var pill = el("div", "modpill", FRAME); pill.style.setProperty("--c", W.color || "#7a5638");
  pill.setAttribute("aria-label", "You are in Module " + W.module + ": " + W.name);
  pill.innerHTML = '<span class="ic" aria-hidden="true"></span><span class="wt"><span></span><small></small></span>';
  pill.querySelector(".ic").textContent = W.icon || "📖";
  pill.querySelector(".wt span").textContent = W.name;
  pill.querySelector("small").textContent = "Module " + W.module;

  var toast = el("div", "toast frost", FRAME); toast.setAttribute("role", "status");
  var tt = 0;
  function say(m) { toast.textContent = m; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 1800); }

  // worlds.js hotspots are in 1366x768 stage px; world.css places .hs in 1280x720 painting px
  var K = 1280 / 1366;
  W.hotspots.forEach(function (h, i) {
    var b = el("button", "hs" + (h.below ? " below" : ""), spots); b.type = "button";
    b.style.setProperty("--x", h.x * K); b.style.setProperty("--y", h.y * K);
    b.style.setProperty("--w", h.w * K); b.style.setProperty("--h", h.h * K);
    b.setAttribute("aria-label", "Lesson " + (i + 1));
    el("span", "tag frost", b).textContent = "Lesson " + (i + 1);
    b.addEventListener("click", function () { say("Lesson " + (i + 1) + " is coming soon"); });
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) location.reload(); });
})();
