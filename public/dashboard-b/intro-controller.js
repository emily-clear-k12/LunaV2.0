/* Plan B intro + depart. Video under ticket UI.
   <script src="intro-controller.js"></script> BEFORE anim.js */
(function () {
  "use strict";
  var scene = document.querySelector(".scene");
  var stage = document.getElementById("stage");
  if (!scene || !stage) return;

  function makeVideo(id, src) {
    var vid = document.createElement("video");
    vid.id = id;
    vid.className = "intro-bg";
    vid.src = src;
    vid.playsInline = true;
    vid.preload = "auto";
    vid.setAttribute("playsinline", "");
    vid.muted = false;
    vid.volume = 1;
    return vid;
  }

  /* ---- INTRO (auto on load) ---- */
  var intro = makeVideo("introBg", "assets/intro-blend.mp4");
  stage.insertBefore(intro, stage.firstChild);
  scene.classList.add("intro-playing");

  function finishIntro() {
    scene.classList.remove("intro-playing");
    scene.classList.add("intro-done");
    try { intro.pause(); } catch (e) {}
    try {
      if (intro.duration && isFinite(intro.duration))
        intro.currentTime = Math.max(0, intro.duration - 0.05);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("crystal-intro-done"));
  }

  intro.addEventListener("ended", finishIntro);
  intro.addEventListener("error", function () {
    scene.classList.remove("intro-playing");
    console.warn("intro video failed; falling back to plate animation");
  });

  function tryPlay(vid) {
    var p = vid.play();
    if (p && typeof p.then === "function") {
      p.catch(function () {
        function unlock() {
          vid.muted = false;
          vid.play().catch(function () {});
          document.removeEventListener("pointerdown", unlock, true);
        }
        document.addEventListener("pointerdown", unlock, true);
        vid.muted = true;
        vid.play().catch(function () {});
      });
    }
  }

  if (intro.readyState >= 2) tryPlay(intro);
  else intro.addEventListener("canplay", function () { tryPlay(intro); }, { once: true });

  /* ---- DEPART (call when student chooses world) ---- */
  var depart = null;
  function playDepart() {
    if (!depart) {
      depart = makeVideo("departBg", "assets/depart-blend.mp4");
      stage.insertBefore(depart, stage.firstChild);
      depart.addEventListener("ended", function () {
        scene.classList.remove("depart-playing");
        scene.classList.add("depart-done");
        window.dispatchEvent(new CustomEvent("crystal-depart-done"));
      });
    }
    // hide intro hold, show depart
    try { intro.style.display = "none"; } catch (e) {}
    depart.style.display = "block";
    depart.currentTime = 0;
    scene.classList.add("depart-playing");
    scene.classList.remove("intro-done");
    tryPlay(depart);
  }

  window.CrystalIntro = { video: intro, finish: finishIntro };
  window.CrystalDepart = { play: playDepart, video: function () { return depart; } };
})();
