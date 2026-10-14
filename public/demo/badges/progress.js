/* Shared demo progress + read-aloud for the main dashboards (A.1, D, D.1).
   Load BEFORE badges.js. Demo state: M1 done, M2 next, M3–M6 not started (never hard-locked). */
(function () {
  var P = window.lsProgress = {
    done: [1], next: 2,
    lines: ["Answer in a few sentences", "Write a longer answer", "Build strong sentences", "Plan, draft, and write", "Make your writing better", "Fix and polish"],
    status: function (m) { return P.done.indexOf(m) >= 0 ? "done" : m === P.next ? "next" : "todo"; },
    voice: null,
    pickVoice: function () {
      if (!("speechSynthesis" in window)) return;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^en(-|_|$)/i.test(x.lang); });
      var pref = [/Samantha/i, /Google US English/i, /Aria|Jenny|Ana|Zira/i, /Karen|Moira|Tessa|Serena/i, /en-US/i];
      for (var i = 0; i < pref.length && !P.voice; i++) P.voice = v.filter(function (x) { return pref[i].test(x.name) || pref[i].test(x.lang); })[0] || null;
      if (!P.voice) P.voice = v[0] || null;
    },
    /* Only ever called from tap handlers. */
    speak: function (text) {
      if (!("speechSynthesis" in window)) return;
      try { speechSynthesis.cancel(); if (!P.voice) P.pickVoice();
        var u = new SpeechSynthesisUtterance(text); u.rate = 0.9; u.pitch = 1.05; u.lang = (P.voice && P.voice.lang) || "en-US"; if (P.voice) u.voice = P.voice;
        speechSynthesis.speak(u); } catch (e) {}
    },
    sayModule: function (m, name) { P.speak("Module " + m + ", " + name + ". " + P.lines[m - 1] + "."); },
    /* Round speaker button that reads `text` aloud. */
    speaker: function (text, cls) {
      var b = document.createElement("button"); b.type = "button"; b.className = "ls-say" + (cls ? " " + cls : "");
      b.setAttribute("aria-label", "Read the goal aloud"); b.title = "Read aloud";
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.2 9a4 4 0 0 1 0 6M17.8 6.6a7.4 7.4 0 0 1 0 10.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      b.addEventListener("click", function (e) { e.stopPropagation(); P.speak(text); });
      return b;
    },
    check: function (cls) { var s = document.createElement("span"); s.className = "ls-check" + (cls ? " " + cls : ""); s.setAttribute("aria-hidden", "true");
      s.innerHTML = '<svg viewBox="0 0 16 16"><path d="M3.5 8.4 6.6 11.4 12.5 4.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; return s; },
    startTag: function (cls) { var s = document.createElement("span"); s.className = "ls-start" + (cls ? " " + cls : ""); s.setAttribute("aria-hidden", "true");
      s.innerHTML = 'Start here<i></i>'; return s; }
  };
  if ("speechSynthesis" in window) { P.pickVoice(); speechSynthesis.onvoiceschanged = function () { P.voice = null; P.pickVoice(); }; }
  var css =
    ".ls-say{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;flex:none;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);" +
    "background:#f5b400;color:#14538c;cursor:pointer;padding:0;box-shadow:0 2px 6px rgba(0,0,0,.35)}.ls-say svg{width:16px;height:16px}.ls-say:hover{filter:brightness(1.08)}" +
    ".ls-say:focus-visible{outline:2px solid #fff;outline-offset:2px}" +
    ".ls-check{position:absolute;width:20px;height:20px;border-radius:50%;background:#2e9e6b;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:4;box-sizing:border-box}" +
    ".ls-check svg{width:13px;height:13px}" +
    ".ls-start{position:absolute;transform:translate(-50%,-100%);padding:3px 10px 4px;border-radius:999px;background:#f5b400;color:#14538c;white-space:nowrap;pointer-events:none;z-index:6;" +
    "font:800 13px/1.1 var(--ls-sans,'Manrope',sans-serif);box-shadow:0 3px 8px rgba(0,0,0,.4);animation:lsbob 1.8s ease-in-out infinite}" +
    ".ls-start i{position:absolute;left:50%;bottom:-7px;margin-left:-7px;border:7px solid transparent;border-bottom:0;border-top-color:#f5b400}" +
    "@keyframes lsbob{0%,100%{translate:0 0}50%{translate:0 -5px}}" +
    "@media (prefers-reduced-motion:reduce){.ls-start{animation:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();
