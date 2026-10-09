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
  scene.classList.add("intro-playing", "intro-waiting");
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
    try {
      if (intro.duration && isFinite(intro.duration))
        intro.currentTime = Math.max(0, intro.duration - 0.05);
    } catch (e) {}
    showUI();   // ticket + title slide in only now
    window.dispatchEvent(new CustomEvent("crystal-intro-done"));
  }

  function failIntro() {
    if (finished) return; finished = true;
    scene.classList.remove("intro-playing", "intro-waiting");
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
    scene.classList.add("depart-playing");
    scene.classList.remove("intro-done", "intro-playing");
    playWithSound(d);
  }

  window.CrystalIntro = { video: intro, finish: finishIntro, start: startIntro, failed: false };
  window.CrystalDepart = { play: playDepart, preload: getDepart, video: function () { return depart; } };
  // fetch the depart video early (after the intro has begun) so boarding never waits on the network
  intro.addEventListener("playing", function () { setTimeout(getDepart, 1500); }, { once: true });
})();
