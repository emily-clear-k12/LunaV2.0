/* Plan C world page: plays its clip ONCE at 0.75x, holds on the hold frame. Config: worlds.js, keyed by <body data-world>. */
(function () {
  "use strict";
  var slug = document.body.getAttribute("data-world"), W = (window.POPUP_WORLD_PAGES || {})[slug];
  if (!W) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var stage = $("wstage"), toast = $("toast");
  document.title = W.name + " · Pop Up Mounts · Astra’s Writing Adventure";
  $("wsub").textContent = "Pop Up Mounts · Module " + W.module + " · " + W.name;
  function holdStill() { stage.style.backgroundImage = 'url("' + W.holdImg + '")'; }
  if (reduce || !W.video) holdStill();
  else {
    stage.style.backgroundImage = 'url("' + W.poster + '")';
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.autoplay = true; v.loop = false;
    v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.setAttribute("aria-hidden", "true");
    v.preload = "auto"; v.poster = W.poster; v.src = W.video;
    v.defaultPlaybackRate = W.rate || 0.75; v.playbackRate = W.rate || 0.75;
    v.addEventListener("loadedmetadata", function () { v.playbackRate = W.rate || 0.75; });
    v.addEventListener("ended", holdStill);
    if (W.hold != null) v.addEventListener("timeupdate", function () { if (v.currentTime >= W.hold) { v.pause(); holdStill(); } });
    v.addEventListener("error", function () { v.remove(); holdStill(); });
    stage.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  W.hotspots.forEach(function (h, i) {
    var b = document.createElement("button"); b.type = "button"; b.className = "ls";
    b.style.left = h.x + "px"; b.style.top = h.y + "px"; b.style.width = h.w + "px"; b.style.height = h.h + "px";
    b.setAttribute("aria-label", "Lesson " + (i + 1)); b.innerHTML = "<b>Lesson " + (i + 1) + "</b>";
    b.addEventListener("click", function () {
      toast.textContent = "Lesson " + (i + 1) + " is coming soon";
      toast.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(function () { toast.classList.remove("on"); }, 2200);
    });
    $("spots").appendChild(b);
  });
  requestAnimationFrame(function () { $("wfade").classList.add("off"); });
})();
