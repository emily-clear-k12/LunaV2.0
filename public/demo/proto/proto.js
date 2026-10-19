/* Dashboard prototype panel (Plan A.1 + Plan D). Lets Emily try placement, colour, shape and detail
   variations without touching the built pages. Fonts never change.
   <script src="../demo/proto/proto.js" data-page="a1|d"></script>   (last script in <body>, after ambient.js)
   - Choices are data-p-* attributes on <html> (styles in proto.css) plus a little JS placement.
   - Saved per page in localStorage (luna_proto_a1 / luna_proto_d). Defaults = the page as built.
   - ?proto=off hides the panel and restores the page as built; ?proto brings it back. Phones start collapsed.
   Remove the script tag before launch. */
(function () {
  "use strict";
  var me = document.currentScript, PAGE = (me && me.dataset.page) || "a1";
  var root = document.documentElement, KEY = "luna_proto_" + PAGE, base = me.src.replace(/proto\.js.*$/, "");
  function get() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function put(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var q = new URLSearchParams(location.search), s = get();
  if (q.get("proto") === "off") { s.on = false; put(s); }
  else if (q.has("proto")) { s.on = true; put(s); }
  if (s.on === false) return;

  var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "proto.css"; document.head.appendChild(css);
  root.classList.add("pa", "pa-" + PAGE);

  var D = {
    goalPos: PAGE === "d" ? "tl" : "tr", goalStyle: "cur", goalSize: "compact",
    title: "on", titlePos: "tl", ribbon: "off",
    shape: "cur", color: "mod", size: "m", finish: "frost",
    icon: "off", ml: "off", mt: "on", nm: "off", border: "cur",
    menu: PAGE === "d" ? "sign" : "bottom",
    badgePos: "goal", badgeSize: "m", badgeLbl: "on", earned: "full",
    stColor: "gold", stShape: "tag", stMotion: "bob",
    speaker: "off", tint: "built", art: "normal", magic: "live"
  };
  var KEYS = Object.keys(D);
  KEYS.forEach(function (k) { if (s[k] === undefined) s[k] = D[k]; });

  var SHORT = ["SCR", "ECR", "Stellar Writers", "Writing Process", "Revision", "Editing"];
  var BADGE = ["scr", "ecr", "stellar", "process", "revision", "editing"];
  var BUDDY = [["Bear", "#e0703a"], ["Raccoon", "#9b7bea"], ["Owl", "#3fb6e8"], ["Fox", "#f5a524"], ["Squirrel", "#4cc28a"], ["Bunny", "#ef6fa8"]];   // Plan D arrows 1–6
  var LP = window.lsProgress, NEXT = (LP && LP.next) || 2;

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  /* the inner parts every module button gets (hidden ones are switched on by the panel) */
  function dress(btn, i, name) {
    var title = btn.querySelector(".module-title") || el("span", "module-title", SHORT[i]);
    var tx = el("span", "pa-tx");
    tx.appendChild(el("span", "pa-ml", "Module " + (i + 1)));
    tx.appendChild(title);
    var nm = el("span", "pa-nm"); nm.textContent = name; tx.appendChild(nm);
    var ic = el("img", "pa-ic"); ic.src = "../demo/badges/" + BADGE[i] + ".png"; ic.alt = "";
    btn.insertBefore(tx, btn.firstChild); btn.insertBefore(ic, tx);
    btn.classList.add("pa-mb");
  }

  /* ---------------- page adapters ---------------- */
  var A = {};
  A.a1 = {
    init: function () {
      var W = window.A1_WORLDS || [], tiles = [].slice.call(document.querySelectorAll("#tiles .tile"));
      tiles.forEach(function (t, i) { var w = W[i] || {}; dress(t, i, w.short || w.name || "");
        t.style.setProperty("--fx", w.x + "px"); t.style.setProperty("--fy", (w.y + w.h / 2 + 4) + "px"); });
      var g = document.querySelector(".goaltile");
      if (g && LP && LP.speaker) { var b = LP.speaker("Today's goal: Back up every answer with evidence from the text."); b.classList.add("pa-say"); g.insertBefore(b, g.firstChild); }
      var w2 = W[NEXT - 1], fr = document.getElementById("frame");
      if (w2 && fr) {
        var r = el("div", "pa-ring"); r.style.cssText = "left:" + w2.x + "px;top:" + w2.y + "px;width:" + (w2.w + 18) + "px;height:" + (w2.h + 18) + "px;--mc:" + w2.color;
        r.setAttribute("aria-hidden", "true"); (document.getElementById("lanterns") || fr).appendChild(r);
        var st = document.querySelector(".ls-start"); if (st) st.style.setProperty("--mc", w2.color);
      }
    },
    layout: function () { this.place(); this.leftStack(); },
    /* top-left column: title, goal (when top-left), badges (when under it), Replay intro, side-left menu — stacked, never overlapping */
    leftStack: function () {
      var bar = document.getElementById("bar"), rp = document.querySelector(".intro-replay"), g = document.querySelector(".goaltile"), lsb = document.querySelector(".lsb"), strip = document.querySelector(".strip");
      if (bar) bar.style.top = "";
      var y = 44;
      if (s.title === "on" && s.titlePos === "tl" && strip) y = strip.offsetTop + strip.offsetHeight + 8;
      var moved = s.goalPos === "tl";
      if (moved && g) y = Math.max(y, g.offsetTop + g.offsetHeight + 8);
      if (moved && lsb && s.badgePos === "goal") y = Math.max(y, lsb.offsetTop + lsb.offsetHeight + 8);
      if (rp) { if (moved) { rp.style.top = y + "px"; } else if (rp.style.top !== "86px") rp.style.top = "86px"; y = Math.max(y, rp.offsetTop + rp.offsetHeight + 8); }
      if (bar && s.menu === "left") bar.style.top = Math.max(126, y) + "px";
    },
    place: function () {
      var lsb = document.querySelector(".lsb"), g = document.querySelector(".goaltile"); if (!lsb || !g) return;
      lsb.style.left = lsb.style.right = lsb.style.top = lsb.style.bottom = lsb.style.transform = "";
      var pos = s.badgePos;
      if (pos === "goal") {
        var top = g.offsetTop + g.offsetHeight + 8;
        if (s.goalPos === "tr") { if (s.goalSize !== "compact") lsb.style.top = top + "px"; return; }   // as built
        lsb.style.top = top + "px";
        if (s.goalPos === "tl") { lsb.style.left = g.offsetLeft + "px"; lsb.style.right = "auto"; }
        else { lsb.style.left = (g.offsetLeft + g.offsetWidth / 2) + "px"; lsb.style.right = "auto"; lsb.style.transform = "translateX(-50%)"; }
      } else if (pos === "tr") {
        lsb.style.top = (s.goalPos === "tr" ? g.offsetTop + g.offsetHeight + 8 : 44) + "px";
      } else {   // bottom-left corner, above the bottom bar; the "selected module" note moves up above it
        var bar = document.getElementById("bar"), sm = document.querySelector(".selected-module");
        var bottom = s.menu === "bottom" && bar ? bar.offsetHeight + 20 : 12;
        lsb.style.top = "auto"; lsb.style.right = "auto"; lsb.style.left = "12px"; lsb.style.bottom = bottom + "px";
        if (sm) sm.style.bottom = (bottom + lsb.offsetHeight + 8) + "px";
        return;
      }
      var sm2 = document.querySelector(".selected-module"); if (sm2) sm2.style.bottom = "";
    }
  };
  A.d = {
    init: function () {
      var hots = [].slice.call(document.querySelectorAll(".hot[data-arrow]")), stage = document.querySelector(".stage");
      var bar = el("nav", "pa-menu"); bar.setAttribute("aria-label", "Modules");
      var fl = el("div", "pa-float"); this.bar = bar; this.fl = fl; this.btns = [];
      var self = this;
      hots.forEach(function (h, i) {
        var b = el("button", "pa-btn"); b.type = "button"; b.style.setProperty("--c", BUDDY[i][1]);
        b.setAttribute("aria-label", h.getAttribute("aria-label") || ("Module " + (i + 1)));
        dress(b, i, BUDDY[i][0]);
        var bx = ["left", "top", "width", "height"].map(function (k) { return parseFloat(h.style[k]); });
        b.style.setProperty("--fx", (bx[0] + bx[2] / 2) + "%"); b.style.setProperty("--fy", (bx[1] + bx[3]) + "%");
        b.addEventListener("click", function () { h.click(); });
        h.addEventListener("click", function () { self.btns.forEach(function (o, j) { o.classList.toggle("on", j === i); }); });
        if (i + 1 === NEXT) b.classList.add("on");
        self.btns.push(b); bar.appendChild(b);
        if (i + 1 === NEXT) {
          var r = el("div", "pa-ring sq"); r.setAttribute("aria-hidden", "true");
          r.style.cssText = "left:" + (bx[0] + bx[2] / 2) + "%;top:" + (bx[1] + bx[3] / 2) + "%;width:calc(" + bx[2] + "% + 16px);height:calc(" + bx[3] + "% + 12px);--mc:" + BUDDY[i][1];
          stage.appendChild(r);
          var st = document.querySelector(".ls-start"); if (st) st.style.setProperty("--mc", BUDDY[i][1]);
        }
      });
      document.body.appendChild(bar); if (stage) stage.appendChild(fl);
      var art = el("div", "pa-art"); art.setAttribute("aria-hidden", "true"); if (stage) stage.insertBefore(art, stage.firstChild);
      var lbl = document.querySelector(".card .lbl");
      if (lbl && LP && LP.speaker) { var sp = LP.speaker("Today's goal: Back up my opinion with strong, specific reasons."); sp.classList.add("pa-say"); lbl.appendChild(sp); }
    },
    layout: function () {
      var self = this; (s.menu === "float" ? this.fl : this.bar).append.apply(s.menu === "float" ? this.fl : this.bar, this.btns);
      var card = document.querySelector(".card"), top = document.querySelector(".top"), go = document.querySelector(".go"), lsb = document.querySelector(".lsb");
      if (!card || !lsb) return;
      root.style.setProperty("--pa-goal-h", card.offsetHeight + "px");
      root.style.setProperty("--pa-title-h", (document.querySelector(".title") || {}).offsetHeight + "px");
      var vsH = parseFloat(getComputedStyle(root).getPropertyValue("--vs-h")) || 36, vw = document.documentElement.clientWidth, vh = window.innerHeight;
      var rp = document.querySelector(".intro-replay"); go.style.top = ""; this.bar.style.top = "";
      lsb.style.cssText = "";
      if (s.badgePos === "goal" && s.goalPos === "tl") { if (lsb.parentNode !== top) top.appendChild(lsb); lsb.classList.remove("pa-fixed"); }
      else { if (lsb.parentNode !== document.body) document.body.appendChild(lsb); lsb.classList.add("pa-fixed"); }
      var cr = card.getBoundingClientRect();
      // right-hand column: goal (top-right) → badges → "Writing module" card → side-right menu
      var ry = vsH + 12;
      if (s.goalPos === "tr") ry = cr.bottom + 8;
      if (s.badgePos === "goal" && s.goalPos === "tr") { lsb.style.top = ry + "px"; lsb.style.right = (vw - cr.right) + "px"; ry += lsb.offsetHeight + 8; }
      if (ry > vsH + 12) go.style.top = ry + "px";
      ry = go.getBoundingClientRect().bottom + 8;
      if (s.badgePos === "tr") { lsb.style.top = ry + "px"; lsb.style.right = "14px"; ry += lsb.offsetHeight + 8; }
      if (s.badgePos === "goal" && s.goalPos === "tc") { lsb.style.top = (cr.bottom + 8) + "px"; lsb.style.left = (cr.left + cr.width / 2) + "px"; lsb.style.transform = "translateX(-50%)"; }
      if (s.menu === "right") this.bar.style.top = Math.max(vsH + 150, ry) + "px";
      if (s.menu === "left") this.bar.style.top = Math.max(vsH + 240, top.getBoundingClientRect().bottom + 8) + "px";
      // bottom-left: bottom menu → badges (corner) → Replay intro
      var by = s.menu === "bottom" ? self.bar.getBoundingClientRect().height + 22 : 14;
      if (s.badgePos === "corner") { lsb.style.left = "14px"; lsb.style.bottom = (by + (s.menu === "bottom" ? 0 : 40)) + "px"; by = vh - lsb.getBoundingClientRect().top + 8; }
      if (rp) { if (s.menu === "bottom" || s.badgePos === "corner") { rp.classList.add("pa-rp"); rp.style.setProperty("--pa-rp-b", by + "px"); } else rp.classList.remove("pa-rp"); }
    }
  };
  var AD = A[PAGE];

  /* ---------------- apply ---------------- */
  function apply() {
    KEYS.forEach(function (k) { root.setAttribute("data-p-" + k.toLowerCase(), s[k]); });
    var lvl = s.magic === "live" ? 0 : +s.magic;
    window.__magicLevel = lvl;
    if (window.AmbientFX && AmbientFX.setLevel) AmbientFX.setLevel(lvl);
    if (AD && AD.ready) { AD.layout(); requestAnimationFrame(function () { AD.layout(); }); }
    var p = document.getElementById("paPanel");
    if (p) p.querySelectorAll("[data-k]").forEach(function (b) { b.classList.toggle("on", String(s[b.getAttribute("data-k")]) === b.getAttribute("data-v")); });
    put(s);
  }
  apply();

  function seg(k, opts) { return '<div class="pa-seg">' + opts.map(function (o) { return '<button type="button" data-k="' + k + '" data-v="' + o[0] + '">' + o[1] + "</button>"; }).join("") + "</div>"; }
  function row(label, k, opts) { return '<div class="pa-row"><small>' + label + "</small>" + seg(k, opts) + "</div>"; }
  function head(t) { return '<h4 class="pa-h">' + t + "</h4>"; }
  var isD = PAGE === "d";

  function boot() {
    if (AD) { AD.init(); AD.ready = true; }
    var p = el("div", "pa-panel" + (s.min === undefined && window.innerWidth < 700 ? " min" : s.min ? " min" : ""));
    if (s.min === undefined && window.innerWidth < 700) s.min = true;
    p.id = "paPanel"; p.setAttribute("role", "region"); p.setAttribute("aria-label", "Dashboard prototype");
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    p.innerHTML =
      '<div class="pa-top"><b>Dashboard prototype</b><button type="button" data-min aria-label="Collapse or expand">&#8211;</button></div>' +
      '<div class="pa-body">' +
        head("Goal &amp; title") +
        row("Goal placement", "goalPos", [["tl", "Top-left"], ["tc", "Top-center"], ["tr", "Top-right"]]) +
        row("Goal style", "goalStyle", [["cur", "Current"], ["wood", "Wood sign"], ["glass", "Frosted"], ["parch", "Parchment"], ["navy", "Navy"]]) +
        row("Goal size", "goalSize", [["compact", "Compact"], ["large", "Large"]]) +
        row("Speaker button", "speaker", [["off", "Off (as built)"], ["gold", "Gold"], ["wood", "Wood"], ["icon", "Icon only"]]) +
        row("Title", "title", [["on", "Show"], ["off", "Hide"]]) +
        row("Title placement", "titlePos", [["tl", "Top-left"], ["center", "Centered"]]) +
        row("Ribbon banner", "ribbon", [["off", "Off"], ["on", "On"]]) +
        head("Module buttons") + (isD ? '<p class="pa-hint">Plan D: the painted arrows stay as they are; these style the added menu (bottom, side or tags on the arrows). Picking one while on "Signpost only" switches to tags on the arrows.</p>' : "") +
        row("Shape", "shape", [["cur", "Current"], ["tile", "Tiles"], ["pill", "Pills"], ["plank", "Planks"], ["circle", "Circles"]]) +
        row("Color", "color", [["mod", "Per module"], ["navy", "Navy + edge"], ["gold", "All gold"]]) +
        row("Size", "size", [["s", "S"], ["m", "M"], ["l", "L"]]) +
        row("Finish", "finish", [["frost", "Frosted"], ["solid", "Solid"]]) +
        row("Icon", "icon", [["off", "Hide"], ["on", "Show"]]) +
        row("'Module N' label", "ml", [["off", "Hide"], ["on", "Show"]]) +
        row("Module title", "mt", [["on", "Show"], ["off", "Hide"]]) +
        row(isD ? "Buddy name" : "World name", "nm", [["off", "Hide"], ["on", "Show"]]) +
        row("Border", "border", [["cur", "Current"], ["none", "None"], ["gold", "Gold rim"], ["glow", "Glow"]]) +
        head("Menu &amp; badges") +
        row("Menu placement", "menu", (isD ? [["sign", "Signpost only"]] : [["bottom", "Bottom bar"]]).concat(isD ? [["bottom", "Bottom bar"]] : []).concat([["left", "Side left"], ["right", "Side right"], ["float", isD ? "On the arrows" : "On the lanterns"]])) +
        row("Badge placement", "badgePos", [["goal", "Under goal"], ["corner", "Bottom corner"], ["tr", "Top-right"]]) +
        row("Badge size", "badgeSize", [["s", "S"], ["m", "M"], ["l", "L"]]) +
        row("Badge labels", "badgeLbl", [["on", "On"], ["off", "Off"]]) +
        row("Earned look", "earned", [["full", "Full color"], ["ring", "Gold ring"], ["sparkle", "Sparkle"]]) +
        head("Start here") +
        row("Color", "stColor", [["gold", "Gold"], ["white", "White"], ["mod", "Module color"]]) +
        row("Shape", "stShape", [["tag", "Tag"], ["arrow", "Arrow"], ["ring", "Glowing ring"]]) +
        row("Motion", "stMotion", [["bob", "Bob"], ["pulse", "Pulse"], ["still", "Still"]]) +
        head("Look &amp; magic") +
        row("UI tint", "tint", [["built", "As built"], ["warm", "Warm gold"], ["cool", "Cool blue"], ["forest", "Forest"]]) +
        row("Art brightness", "art", [["dim", "Dim"], ["normal", "Normal"], ["bright", "Bright"]]) +
        row("Magic meter", "magic", [["live", "As built"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]]) +
        '<p class="pa-hint">1 = a few fireflies and stars · 3 = glows, sparkles, a shooting star · 5 = dragons and aurora.' + (reduce ? " Reduce motion is on, so effects stay off." : "") + "</p>" +
        '<button type="button" class="pa-reset" data-reset>Reset to default</button>' +
        '<p class="pa-note">This page only, saved in this browser. Add ?proto=off to the address to hide this panel and see the page as built; ?proto brings it back.</p>' +
      "</div>";
    if (s.min) p.classList.add("min");
    document.body.appendChild(p);
    p.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-min")) { s.min = !s.min; p.classList.toggle("min", s.min); put(s); return; }
      if (b.hasAttribute("data-reset")) { KEYS.forEach(function (k) { s[k] = D[k]; }); apply(); return; }
      var k = b.getAttribute("data-k"); if (!k) return;
      s[k] = b.getAttribute("data-v");
      if (PAGE === "d" && s.menu === "sign" && ["shape", "color", "size", "finish", "icon", "ml", "mt", "nm", "border"].indexOf(k) >= 0) s.menu = "float";   // D: show the buttons so the change is visible
      if (k === "mt" || k === "ml" || k === "nm") { if (s.mt === "off" && s.ml === "off" && s.nm === "off") s.ml = "on"; }   // never an empty button
      apply();
    });
    window.addEventListener("resize", function () { AD && AD.layout(); });
    var host = document.getElementById("frame") || document.querySelector(".stage");
    if (host && window.MutationObserver) new MutationObserver(function (m) { if (m.some(function (r) { return [].some.call(r.addedNodes, function (n) { return n.classList && n.classList.contains("intro-replay"); }); })) AD.layout(); }).observe(host, { childList: true });
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.LunaProto = { state: function () { return JSON.parse(JSON.stringify(s)); }, set: function (k, v) { s[k] = v; apply(); }, defaults: D, reset: function () { KEYS.forEach(function (k) { s[k] = D[k]; }); apply(); } };
})();
