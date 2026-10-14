/* Plan E world page (same chrome as the Plan B / C world screens). DRAFT ART: still background from ../assets/worlds/.
   Lesson rune spots in the art have inconsistent counts, so no lesson hotspots yet; a placeholder "Collect the key"
   marks the world done (localStorage) and returns to the library, where its window shows restored. */
(function () {
  "use strict";
  var L = window.LOST_LIBRARY, slug = document.body.getAttribute("data-world"), W = null;
  L.worlds.forEach(function (w) { if (w.slug === slug) W = w; });
  if (!W) return;
  try { if (sessionStorage.getItem("lib-arrive")) { sessionStorage.removeItem("lib-arrive"); document.documentElement.classList.add("from-depart"); } } catch (e) {}
  var FRAME = (window.StageFit && window.StageFit.frame()) || document.body;
  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  var scene = el("div", "scene", FRAME), stage = el("div", "stage", scene);
  var art = el("img", "art", stage); art.alt = W.name; art.src = "../" + W.art;

  var hud = el("header", "hud", FRAME);
  var back = el("a", "back frost", hud); back.href = "../?return=1";
  back.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15 10H5M9 5.5 4.5 10 9 14.5" fill="none" stroke="#4a2e1a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Library';
  back.setAttribute("aria-label", "Back to the library");
  var title = el("div", "titlecard frost", hud);
  title.innerHTML = "<h1>Astra’s Writing Adventure</h1><p></p>";
  title.querySelector("p").textContent = "Lost Library · Module " + W.module + " · " + W.name;
  document.title = W.name + " · Lost Library · Astra’s Writing Adventure";

  var pill = el("div", "modpill", FRAME); pill.style.setProperty("--c", W.color);
  pill.setAttribute("aria-label", "You are in Module " + W.module + ": " + W.name);
  pill.innerHTML = '<span class="ic" aria-hidden="true"></span><span class="wt"><span></span><small></small></span>';
  pill.querySelector(".ic").textContent = W.icon;
  pill.querySelector(".wt span").textContent = W.name;
  pill.querySelector("small").textContent = "Module " + W.module;

  var toast = el("div", "toast frost", FRAME); toast.setAttribute("role", "status");
  var KEY = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="10" cy="16" r="6.5" fill="none" stroke="#c99a2e" stroke-width="3.4"/><path d="M16.5 16H29M24 16v5M28 16v4" fill="none" stroke="#c99a2e" stroke-width="3.4" stroke-linecap="round"/></svg>';
  var btn = el("button", "collect frost", FRAME); btn.type = "button";
  var done = L.done().indexOf(slug) >= 0;
  btn.innerHTML = KEY + "<span>" + (done ? "Key collected" : "Collect the key") + '<br><span class="note">placeholder · lessons coming soon</span></span>';
  btn.addEventListener("click", function () {
    L.setDone(slug); btn.disabled = true;
    toast.textContent = "You found the golden key!"; toast.classList.add("on");
    setTimeout(function () { location.href = "../?return=1&key=" + encodeURIComponent(slug); }, 1100);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) location.reload(); });
})();
