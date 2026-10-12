/* Plan C "Pop Up Mounts" controller: start plate -> intro (with Astra's audio) -> teacup world (held frame) + six bookmarks. */
(function () {
  "use strict";
  // Left-to-right painted ribbons in the video: teapot, purple diamond, wing, pocket watch, kite, gumdrop.
  var WORLDS = [
    { id: "porcelain",   name: "Porcelain Tea Gardens",         mount: "Teacup buggy",     c: "#3f7cc0", ic: "🫖", x: 320 },
    { id: "desert",      name: "Desert Mirage Bazaar",    mount: "Flying carpet",    c: "#7a45b5", ic: "🏜️", x: 397 },
    { id: "thunderpeak", name: "Thunderpeak Aerie",       mount: "Thunder elk",      c: "#4f7f3c", ic: "⚡", x: 477 },
    { id: "clockwork",   name: "Clockwork Gearworks City", mount: "Pocket-watch pod", c: "#8a5426", ic: "⚙️", x: 576 },
    { id: "highlands",   name: "Windswept Ribbon Highlands", mount: "Kite glider",   c: "#c0414f", ic: "🪁", x: 658 },
    { id: "candyleaf",   name: "Candyleaf Grove",         mount: "Gumdrop cart",     c: "#d8742a", ic: "🍬", x: 742 }
  ];
  var RATE = 0.75;   // Emily found loops too fast on Plan B
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var scene = $("scene"), intro = $("intro"), gate = $("gate"), startBtn = $("start"), skip = $("skip");
  var layers = [$("layerA"), $("layerB")], front = 0, cur = -1, finished = false, started = false;
  var ribs = $("ribs"), ride = $("ride"), wl = $("wl"), wlIc = $("wlIc"), wlName = $("wlName"), toast = $("toast");
  // Each clip plays ONCE (at 0.75x) and holds its last frame, cut at Astra's happiest open-eyed moment.
  // poster = that hold frame (also the reduced-motion / error fallback); first = frame 0 shown while the clip loads.
  // The teacup world has no clip of its own: it simply holds the intro's end frame.
  WORLDS.forEach(function (w) {
    w.poster = "assets/" + w.id + ".jpg";
    if (w.id !== "porcelain") { w.vid = "assets/" + w.id + ".mp4"; w.first = "assets/" + w.id + "-start.jpg"; }
  });

  // ---- bookmarks: menu tabs + invisible hotspots over the painted ribbons
  var spots = [];
  WORLDS.forEach(function (w, i) {
    var r = document.createElement("button");
    r.type = "button"; r.className = "rib ui"; r.style.setProperty("--c", w.c); r.title = w.name; r.style.left = (w.x - 33) + "px";
    r.setAttribute("aria-label", "Bookmark: " + w.name);
    r.addEventListener("click", function () { select(i); });
    r.addEventListener("pointerenter", function () { warm(i); }); r.addEventListener("focus", function () { warm(i); });
    ribs.appendChild(r); spots.push(r);
  });

  var warmed = {};
  function warm(i) {   // preload a world's clip (and poster) before it is picked
    if (reduce || warmed[i] || !WORLDS[i].vid) return; warmed[i] = true;
    var v = document.createElement("video"); v.muted = true; v.preload = "auto"; v.src = WORLDS[i].vid;
    try { v.load(); } catch (e) {}
  }

  function select(i, instant) {
    if (i === cur && !WORLDS[i].vid) return;   // re-selecting a clip world replays it once
    cur = i; var w = WORLDS[i];
    spots.forEach(function (s, k) { s.classList.toggle("active", k === i); s.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    wl.style.setProperty("--c", w.c); wlIc.textContent = w.ic; wlName.textContent = w.name; ride.setAttribute("aria-label", "Ride to " + w.name);
    var back = layers[front], next = layers[1 - front]; front = 1 - front;
    next.style.backgroundImage = 'url("' + ((w.vid && !reduce) ? w.first : w.poster) + '")';
    var old = next.querySelector("video"); if (old) old.remove();
    function show() {
      next.style.zIndex = 3; back.style.zIndex = 2;
      if (instant) next.style.transition = "none";
      next.classList.add("on"); void next.offsetWidth; next.style.transition = "";
      setTimeout(function () {
        if (layers[front] !== next) return;
        back.classList.remove("on"); var bv = back.querySelector("video"); if (bv) bv.pause();
      }, 560);
    }
    if (reduce || !w.vid) { show(); return; }
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = false; v.playsInline = true; v.autoplay = true;
    v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.preload = "auto"; v.poster = w.first; v.src = w.vid;
    v.defaultPlaybackRate = RATE; v.playbackRate = RATE;
    var shown = false; function once() { if (!shown) { shown = true; show(); } }
    v.addEventListener("loadedmetadata", function () { v.playbackRate = RATE; });
    v.addEventListener("playing", once);
    v.addEventListener("ended", function () { next.style.backgroundImage = 'url("' + w.poster + '")'; });   // holds on the last frame
    v.addEventListener("error", function () { next.style.backgroundImage = 'url("' + w.poster + '")'; v.remove(); once(); });   // poster stays as the layer background
    setTimeout(once, 900);                                              // slow network: fade in on the poster
    next.appendChild(v);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    warm((i + 1) % WORLDS.length);
  }

  ride.addEventListener("click", function () {
    toast.textContent = WORLDS[cur].name + " is coming soon!";
    toast.classList.add("on"); clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove("on"); }, 2200);
  });

  // ---- intro
  function finish(instant) {
    if (finished) return; finished = true;
    try { sessionStorage.setItem("popupIntroSeen", "1"); } catch (e) {}
    skip.classList.remove("on"); skip.hidden = true;
    gate.hidden = true;
    select(0, instant);
    scene.classList.add("ready");
    WORLDS.forEach(function (w) { var im = new Image(); im.src = w.poster; });
  }
  function startIntro() {
    if (started) return; started = true;
    gate.classList.add("opening");
    setTimeout(function () { gate.classList.add("gone"); }, 250);
    setTimeout(function () { gate.hidden = true; }, 800);
    intro.muted = false;
    var p = intro.play();
    if (p && p.catch) p.catch(function () { intro.muted = true; intro.play().catch(function () { finish(); }); });
    setTimeout(function () { if (!finished) { skip.hidden = false; void skip.offsetWidth; skip.classList.add("on"); } }, 1000);
  }
  function skipIntro(instant) {
    if (finished) return; started = true;
    try { intro.muted = true; intro.pause(); } catch (e) {}
    try { if (intro.duration) intro.currentTime = intro.duration - 0.05; } catch (e) {}
    finish(instant);
  }
  intro.addEventListener("ended", function () { finish(); });
  intro.addEventListener("error", function () { if (started) finish(); });
  startBtn.addEventListener("click", startIntro);
  skip.addEventListener("click", function () { skip.blur(); skipIntro(); });
  window.PopUp = { select: select, skip: skipIntro, worlds: WORLDS };

  var seen = false;
  try { seen = sessionStorage.getItem("popupIntroSeen") === "1"; } catch (e) {}
  if (/[?&]return=1/.test(location.search)) seen = true;
  if (seen || reduce) { intro.preload = "none"; skipIntro(true); }
  else WORLDS.forEach(function (w, i) { if (i < 2) warm(i); });
})();
