/* Plan B intro + depart. Video under the ticket UI.
   <script src="intro-controller.js"></script> BEFORE anim.js

   Sound: the intro waits for a tap on the "All aboard!" start button, then plays intro-blend.mp4 from 0 WITH sound,
   so Astra's line (embedded in the mp4 at ~5.9s) is always in sync and never starts muted / unmutes mid-way.
   No separate <audio> is used (astra-speech.mp3 is only a spare), so speech can never double up.
   UI: body.ui-away keeps the ticket and title off-screen while a video plays; it is removed when the intro ends. */
(function () {
  "use strict";
  var scene = document.querySelector(".scene");
  var stage = document.getElementById("stage");
  if (!scene || !stage) return;
  var body = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- framing: contain-fit the 1280x720 film, blurred fill around it, ease left of the ticket once settled ---- */
  var FW = 1280, FH = 720;
  // locomotive (cowcatcher) .. Astra/cab, in film px; must end up left of the ticket
  var KEEP = { left: 230, right: 790 };
  var settled = false;
  function layout() {
    if (!scene.classList.contains("vmode")) return;
    var sw = scene.clientWidth, sh = scene.clientHeight;
    var c = Math.min(sw / FW, sh / FH);
    var w = FW * c, h = FH * c;
    var x = (sw - w) / 2, y = (sh - h) / 2;
    scene.style.setProperty("--vx", x + "px");
    scene.style.setProperty("--vy", y + "px");
    scene.style.setProperty("--vw", w + "px");
    // short windows: shrink the ticket to fit the height (anchored at its right edge) instead of clipping it
    var t = document.querySelector(".ticket"), ticketLeft = null;
    if (t && t.offsetHeight) {
      var ts = Math.min(1, (sh - 16) / t.offsetHeight);
      t.style.transformOrigin = "100% 50%";
      t.style.scale = ts < 1 ? String(ts) : "";
      ticketLeft = t.offsetLeft + t.offsetWidth * (1 - ts);
    }
    var dx = 0, dy = 0, k = 1;
    if (settled) {
      var limit = sw * 0.60;
      if (ticketLeft !== null) limit = Math.min(limit, ticketLeft - 24);
      var keepW = (KEEP.right - KEEP.left) * c;
      k = Math.min(1, (limit - 12) / keepW);                     // shrink only on narrow windows
      var nx = Math.min(limit - KEEP.right * c * k, 0);          // right of the cab/Astra at the limit, left edge never exposed if avoidable
      nx = Math.max(nx, 12 - KEEP.left * c * k);                 // keep the cowcatcher on screen
      var ny = sh - h * k;                                       // bottom-anchored: feet stay put
      if (k === 1) ny = y;
      dx = nx - x; dy = ny - y;
    }
    scene.style.setProperty("--dx", dx + "px");
    scene.style.setProperty("--dy", dy + "px");
    scene.style.setProperty("--k", k);
  }
  window.addEventListener("resize", function () {
    scene.classList.add("vnoease"); layout();
    requestAnimationFrame(function () { scene.classList.remove("vnoease"); });
  });

  var fill = document.getElementById("vfill");
  var fctx = fill && fill.getContext("2d");
  var fillSrc = null, fillLoop = 0;
  function drawFill() {
    if (!fctx || !fillSrc || fillSrc.readyState < 2) return;
    try { fctx.drawImage(fillSrc, 0, 0, fill.width, fill.height); } catch (e) {}
  }
  function fillFrom(v) {
    fillSrc = v; cancelAnimationFrame(fillLoop);
    (function tick() { drawFill(); if (!v.paused && !v.ended) fillLoop = requestAnimationFrame(tick); })();
  }

  function makeVideo(id, src, poster) {
    var vid = document.createElement("video");
    vid.id = id;
    vid.className = "intro-bg";
    vid.src = src;
    if (poster) vid.poster = poster;
    vid.playsInline = true;
    vid.preload = "auto";
    vid.setAttribute("playsinline", "");
    vid.muted = false;
    vid.volume = 1;
    return vid;
  }

  // play with sound; only if the browser refuses even after a tap, fall back to muted (and stay muted: no mid-way unmute)
  function playWithSound(vid) {
    vid.muted = false; vid.volume = 1;
    var p = vid.play();
    if (p && typeof p.then === "function") {
      p.catch(function () { vid.muted = true; vid.play().catch(function () {}); });
    }
  }

  /* ---- INTRO (starts on tap) ---- */
  var intro = makeVideo("introBg", "assets/intro-blend.mp4", "assets/intro-poster.jpg");
  stage.insertBefore(intro, stage.firstChild);
  scene.classList.add("intro-playing", "intro-waiting", "vmode");
  layout();
  intro.addEventListener("loadeddata", function () { if (!fillSrc) fillFrom(intro); });
  intro.addEventListener("play", function () { fillFrom(intro); });
  body.classList.add("ui-away");

  var gate = document.getElementById("introGate");
  var gateBtn = document.getElementById("introStart");
  var started = false, finished = false;

  function showUI() { body.classList.remove("ui-away"); }

  function finishIntro() {
    if (finished) return; finished = true;
    scene.classList.remove("intro-playing", "intro-waiting");
    scene.classList.add("intro-done");
    try { intro.pause(); } catch (e) {}
    drawFill();
    settled = true; layout();   // ease the film left of the ticket (1s)
    showUI();   // ticket + title slide in only now
    window.dispatchEvent(new CustomEvent("crystal-intro-done"));
  }

  function failIntro() {
    if (finished) return; finished = true;
    scene.classList.remove("intro-playing", "intro-waiting", "vmode");
    if (gate) gate.hidden = true;
    showUI();
    window.CrystalIntro.failed = true;
    console.warn("intro video failed; falling back to plate animation");
  }

  function startIntro() {
    if (started || finished) return; started = true;
    scene.classList.remove("intro-waiting");
    if (gate) gate.classList.add("gone");
    setTimeout(function () { if (gate) gate.hidden = true; }, 500);
    try { intro.currentTime = 0; } catch (e) {}
    window.CrystalIntro.tapAt = performance.now();
    playWithSound(intro);   // inside the tap handler, so sound is allowed
  }

  // The last ~0.15s (frames 237-240) has Astra lowering her hand mid-squint; hold frame 233 instead
  // (pointing with the pencil, eyes open, smiling). Her line ends at ~9.65s, so nothing is cut.
  var HOLD_T = 9.71;   // inside frame 233 (9.708-9.750s)
  function watchHold() {
    if (finished) return;
    if (intro.currentTime >= HOLD_T - 0.02) { intro.pause(); finishIntro(); return; }
    if (intro.requestVideoFrameCallback) intro.requestVideoFrameCallback(watchHold);
    else requestAnimationFrame(watchHold);
  }
  intro.addEventListener("playing", watchHold, { once: true });
  intro.addEventListener("ended", finishIntro);
  intro.addEventListener("error", failIntro);
  if (gateBtn) { gateBtn.addEventListener("click", startIntro); try { gateBtn.focus({ preventScroll: true }); } catch (e) {} }
  else startIntro();

  /* ---- DEPART (call when the student boards) ---- */
  var depart = null;
  function getDepart() {
    if (!depart) {
      depart = makeVideo("departBg", "assets/depart-blend.mp4");
      depart.style.display = "none";
      stage.insertBefore(depart, stage.firstChild);
      depart.addEventListener("ended", function () {
        scene.classList.remove("depart-playing");
        scene.classList.add("depart-done");
        window.dispatchEvent(new CustomEvent("crystal-depart-done"));
      });
    }
    return depart;
  }
  function playDepart() {
    var d = getDepart();
    // stop and silence the intro so its audio can never overlap "Let's go!"
    try { intro.pause(); intro.muted = true; } catch (e) {}
    try { intro.style.display = "none"; } catch (e) {}
    d.style.display = "block";
    try { d.currentTime = 0; } catch (e) {}
    scene.classList.add("vmode");
    settled = false; layout();    // back to the whole, centered frame (the ticket has flown off)
    fillFrom(d);
    d.addEventListener("play", function () { fillFrom(d); });
    scene.classList.add("depart-playing");
    scene.classList.remove("intro-done", "intro-playing");
    playWithSound(d);
  }

  // boarding: ease back to the whole centered frame while the ticket flies off, before the depart film starts
  window.CrystalStage = { center: function () { settled = false; layout(); } };
  window.CrystalIntro = { video: intro, finish: finishIntro, start: startIntro, failed: false };
  window.CrystalDepart = { play: playDepart, preload: getDepart, video: function () { return depart; } };
  // fetch the depart video early (after the intro has begun) so boarding never waits on the network
  intro.addEventListener("playing", function () { setTimeout(getDepart, 1500); }, { once: true });
})();
