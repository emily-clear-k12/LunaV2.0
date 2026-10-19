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
    speaker: "off", lanShape: "cur", scene: "a1", tap: "menu", pose: "cur", spot: "cur", signIc: "cur", badgeIc: "off", tint: "built", art: "normal", magic: "live"
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
      var self = this, Wm = window.A1_WORLDS || [], Lm = document.getElementById("lanterns");
      if (Lm && LP) { var ck = [].slice.call(Lm.querySelectorAll(".ls-check")), stt = [].slice.call(Lm.querySelectorAll(".ls-start")); this.marks = [];
        Wm.forEach(function (w, i) { var st = LP.status(w.m); if (st === "done" && ck.length) self.marks.push({ i: i, t: "check", el: ck.shift() }); if (st === "next" && stt.length) self.marks.push({ i: i, t: "start", el: stt.shift() }); }); }
      if (Lm) [].forEach.call(Lm.querySelectorAll(".lantern"), function (b, i) { b.addEventListener("click", function () { if (s.tap === "portal") self.portal(i); }); });
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
    layout: function () { astra(); this.scene(); this.place(); this.leftStack(); this.lan(); if (s.tap !== "portal") this.closePortal(); },
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
    /* ---- Scene (A.1 Lantern Tree / Plan A Portals) + Lantern tap (bottom menu / open portal) ---- */
    PAX: [25.9, 38.8, 51.6, 64.6, 78.2, 92.5],
    geo: function (i) { var W = window.A1_WORLDS || []; return s.scene === "pa" ? { x: this.PAX[i] * 13.66, y: 60.5 * 7.68, w: 11 * 13.66, h: 31 * 7.68 } : W[i]; },
    scene: function () {
      var fr = document.getElementById("frame"), L = document.getElementById("lanterns"), W = window.A1_WORLDS || [], self = this; if (!fr || !L) return;
      if (this.sceneKey === s.scene) return; this.sceneKey = s.scene;
      if (s.scene === "pa" && !this.paArt) {
        var A = "../dashboard-a/", box = el("div", "pa-pa"); box.setAttribute("aria-hidden", "true");
        box.innerHTML = '<img src="' + A + 'portal-hub-poster-v3.jpg" alt="">' +
          (matchMedia("(prefers-reduced-motion: reduce)").matches ? "" : '<video muted autoplay loop playsinline preload="auto" poster="' + A + 'portal-hub-poster-v3.jpg"><source src="' + A + 'portal-hub-loop-v3.mp4" type="video/mp4"><source src="' + A + 'portal-hub-loop-v3.webm" type="video/webm"></video>') +
          '<img class="pv" src="' + A + 'portal-clockwork-city.jpg" alt="" style="left:78.8%"><img class="pv" src="' + A + 'portal-crystal-caverns.jpg" alt="" style="left:26.5%">';
        var bg = fr.querySelector(".bg"); (bg ? bg.after(box) : fr.insertBefore(box, fr.firstChild));
        var v = box.querySelector("video"); if (v) { v.muted = true; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        this.paArt = box;
      }
      if (this.paArt) { var vv = this.paArt.querySelector("video"); if (vv) { if (s.scene === "pa") { var q = vv.play(); if (q && q.catch) q.catch(function () {}); } else vv.pause(); } }
      [].forEach.call(L.querySelectorAll(".lantern"), function (b, i) { var g = self.geo(i);
        b.style.left = g.x + "px"; b.style.top = g.y + "px"; b.style.width = g.w + "px"; b.style.height = g.h + "px"; });
      (this.marks || []).forEach(function (mk) { var g = self.geo(mk.i);
        if (mk.t === "check") { mk.el.style.left = (g.x + g.w / 2 - 14) + "px"; mk.el.style.top = (g.y - g.h / 2 + 2) + "px"; }
        else { mk.el.style.left = g.x + "px"; mk.el.style.top = (g.y - g.h / 2 - 6) + "px"; } });
      var r = L.querySelector(".pa-ring"); if (r) { var g2 = this.geo(NEXT - 1); r.style.left = g2.x + "px"; r.style.top = g2.y + "px"; r.style.width = (g2.w + 18) + "px"; r.style.height = (g2.h + 18) + "px"; }
      [].forEach.call(document.querySelectorAll("#tiles .tile"), function (t, i) { var g = self.geo(i); t.style.setProperty("--fx", g.x + "px"); t.style.setProperty("--fy", (g.y + g.h / 2 + 4) + "px"); });
      this.closePortal();
    },
    portal: function (i) {
      var fr = document.getElementById("frame"), W = window.A1_WORLDS || [], w = W[i]; if (!fr || !w) return;
      var p = this.pt;
      if (!p) {
        p = this.pt = el("div", "pa-portal"); p.setAttribute("role", "dialog"); p.setAttribute("aria-label", "World portal");
        var runes = "ᚨᛋᛏᚱᚨ ✦ ᚹᚱᛁᛏᛖ ✦ ᛞᚱᛖᚨᛗ ✦ ᛒᚱᚨᚡᛖ ✦ ᛋᛏᚨᚱ ✦ ᛚᛁᚷᚺᛏ ✦ ";
        p.innerHTML = '<div class="pa-pring"><div class="pa-pwin"><img alt=""></div>' +
          '<svg class="pa-prunes" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="paRunePath" d="M100 100m-86 0a86 86 0 1 1 172 0a86 86 0 1 1-172 0"/></defs>' +
          '<circle cx="100" cy="100" r="95" fill="none" stroke="#f3c75a" stroke-width="3"/><circle cx="100" cy="100" r="78" fill="none" stroke="#f3c75a" stroke-width="2"/>' +
          '<text font-size="11" fill="#ffe6a0" letter-spacing="2"><textPath href="#paRunePath">' + runes + runes + "</textPath></text></svg>" +
          '<button type="button" class="pa-px" aria-label="Close portal">&times;</button></div>' +
          '<div class="pa-pinfo"><b class="pa-pt"></b><button type="button" class="pa-pgo">Go ›</button></div>';
        p.querySelector(".pa-px").onclick = this.closePortal.bind(this);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") this.closePortal(); }.bind(this));
        fr.appendChild(p);
      }
      var pa = s.scene === "pa", R = pa ? 100 : 115, cx = pa ? 1210 : 1200, cy = pa ? 250 : 520;
      p.style.setProperty("--r", R + "px"); p.style.left = cx + "px"; p.style.top = cy + "px";
      p.classList.toggle("info-left", true);
      p.style.setProperty("--mc", w.color);
      p.querySelector(".pa-pwin img").src = w.art;
      p.querySelector(".pa-pt").textContent = "Module " + w.m + " · " + (w.short || w.name);
      p.querySelector(".pa-pgo").onclick = function () { location.href = "world.html?w=" + w.id; };
      p.classList.remove("open"); void p.offsetWidth; p.classList.add("open");
      setTimeout(function () { var x = p.querySelector(".pa-pgo"); if (x) x.focus({ preventScroll: true }); }, 50);
    },
    closePortal: function () { if (this.pt) this.pt.classList.remove("open"); },
    /* Lantern shape + badges on lanterns: a clean-plate patch hides the painted lantern, an SVG lantern is drawn on top */
    lan: function () {
      var W = window.A1_WORLDS || [], L = document.getElementById("lanterns"); if (!L) return;
      var key = s.lanShape + "|" + s.badgeIc;
      if (this.lanKey === key) return; this.lanKey = key;
      [].slice.call(L.querySelectorAll(".pa-lanw")).forEach(function (n) { n.remove(); });
      if (s.lanShape === "cur" && s.badgeIc !== "on") return;
      W.forEach(function (w, i) {
        var wrap = el("div", "pa-lanw"); wrap.setAttribute("aria-hidden", "true"); wrap.style.setProperty("--c", w.color);
        if (s.lanShape !== "cur") {
          var px = Math.round(w.x - w.w * .52) - 12, py = Math.round(w.y - w.h * .6) - 12, pw = Math.round(w.w * 1.04) + 24, ph = Math.round(w.h * 1.16) + 24;
          var pt = el("div", "pa-patch"); pt.style.cssText = "left:" + px + "px;top:" + py + "px;width:" + pw + "px;height:" + ph + "px;background-position:" + (-px) + "px " + (-py) + "px";
          wrap.appendChild(pt);
          var m = s.lanShape === "mixed" ? LART.mixed[i] : LART[s.lanShape];
          var sh = Math.min(w.w * 1.05 / m.ar, w.h * 1.6), sw = sh * m.ar, top = w.y - w.h * .64;
          var sv = el("img", "pa-lan"); sv.alt = ""; sv.src = "lanterns/" + s.lanShape + "-" + (i + 1) + ".webp";
          sv.style.cssText = "left:" + (w.x - sw / 2) + "px;top:" + top + "px;width:" + sw + "px;height:" + sh + "px";
          wrap.appendChild(sv); wrap.dataset.cy = top + sh * m.cy;
        }
        if (s.badgeIc === "on") {
          var cy = s.lanShape === "cur" ? w.y + 4 : +wrap.dataset.cy;
          var bs = Math.round(w.w * .5), b = el("div", "pa-lb" + (s.lanShape === "cur" ? " cur" : ""));
          b.style.cssText = "left:" + (w.x - bs / 2) + "px;top:" + (cy - bs / 2) + "px;width:" + bs + "px;height:" + bs + "px";
          b.innerHTML = '<img src="../demo/badges/' + BADGE[i] + '.png" alt="">'; wrap.appendChild(b);
        }
        L.insertBefore(wrap, L.firstChild);
      });
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
    /* Sign icons on the painted arrows: a cleaned signpost (icons removed) goes over the art, new icons on top */
    signs: function () {
      var stage = document.querySelector(".stage"); if (!stage) return;
      var set = s.badgeIc === "on" ? "badge" : s.signIc;
      if (!this.signc) {
        var c = el("img", "pa-signc"); c.alt = ""; c.setAttribute("aria-hidden", "true"); c.src = "../dashboard-d/assets/signpost-clean.png";
        c.style.cssText = "left:" + (674 / 12.8) + "%;top:" + (52 / 7.2) + "%;width:" + (190 / 12.8) + "%;height:" + (545 / 7.2) + "%";
        var ic = el("div", "pa-sics"); ic.setAttribute("aria-hidden", "true");
        this.signc = c; this.sics = ic;
      }
      var anchor = stage.querySelector(".fx-overlay") || stage.querySelector(".fx-loop") || stage.querySelector(".pa-art");
      if (anchor && anchor.nextSibling !== this.signc) { anchor.after(this.signc); this.signc.after(this.sics); }
      else if (!anchor && !this.signc.parentNode) { stage.insertBefore(this.sics, stage.firstChild); stage.insertBefore(this.signc, this.sics); }
      if (this.sigKey === set) return; this.sigKey = set;
      this.sics.innerHTML = "";
      SIGN_IC.forEach(function (p, i) {
        if (set === "cur" || set === "none") return;
        var d = el("div", "pa-si pa-si-" + set, signIcon(set, i));
        d.style.left = ((674 + p[0]) / 12.8) + "%"; d.style.top = ((52 + p[1]) / 7.2) + "%";
        this.sics.appendChild(d);
      }, this);
    },
    layout: function () {
      astra(); this.signs();
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
  /* ---------------- lantern shapes (A.1), sign icons (D), badges as icons (both) ---------------- */
  var SVGNS = 'xmlns="http://www.w3.org/2000/svg"';
  /* Emily's lantern art (dashboard-a1/lanterns/*.webp, cut out from her two sheets). ar = width/height, cy = body centre (fraction of height).
     Single shapes come pre-recoloured to each module's colour; "mixed" = her first sheet as drawn; "moroccan" = her brass set, already in module colours. */
  var LART = { round: { ar: .4412, cy: .377 }, hex: { ar: .3892, cy: .4576 }, tall: { ar: .2944, cy: .4134 }, star: { ar: .6288, cy: .6023 }, flower: { ar: .6562, cy: .4414 }, moroccan: { ar: .356, cy: .5 },
    mixed: [{ ar: .4412, cy: .377 }, { ar: .3892, cy: .4576 }, { ar: .2944, cy: .4134 }, { ar: .6288, cy: .6023 }, { ar: .6562, cy: .4414 }, { ar: .4175, cy: .3859 }] };
  /* simple module symbols (Plan D signs): quill, scroll, star, lightbulb, magnifier, pencil */
  var SYM = [
    '<path d="M38 6C22 10 12 24 10 40l4 2C18 28 28 16 40 10z" fill="#fff3d6"/><path d="M10 40 30 18" stroke="#3a2412" stroke-width="2"/><path d="M8 44l4-6" stroke="#3a2412" stroke-width="3" stroke-linecap="round"/>',
    '<rect x="11" y="10" width="26" height="28" rx="2" fill="#fff3d6"/><rect x="7" y="7" width="34" height="7" rx="3.5" fill="#f0d7a8"/><rect x="7" y="34" width="34" height="7" rx="3.5" fill="#f0d7a8"/><path d="M16 20h16M16 25h16M16 30h10" stroke="#3a2412" stroke-width="2"/>',
    '<path d="M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35 11.5 42l3-14L4 18.5 18 17z" fill="#ffd34d"/>',
    '<path d="M24 5a13 13 0 0 0-8 23c2 2 3 4 3 7h10c0-3 1-5 3-7a13 13 0 0 0-8-23z" fill="#fff1a8"/><rect x="18" y="36" width="12" height="4" rx="1" fill="#c9c2b0"/><rect x="19" y="41" width="10" height="3" rx="1.5" fill="#a8a090"/><path d="M20 20l4 6 4-6" stroke="#c98a1a" stroke-width="1.8" fill="none"/>',
    '<circle cx="20" cy="20" r="12" fill="#bfe6ff" fill-opacity=".85" stroke="#fff3d6" stroke-width="5"/><path d="M29 29l12 12" stroke="#fff3d6" stroke-width="7" stroke-linecap="round"/><path d="M29 29l12 12" stroke="#8a5a2e" stroke-width="3.5" stroke-linecap="round"/>',
    '<g transform="rotate(45 24 24)"><rect x="19" y="2" width="10" height="32" fill="#ffc93c"/><rect x="19" y="2" width="10" height="6" fill="#f08aa0"/><rect x="19" y="8" width="10" height="3" fill="#c9c2b0"/><path d="M19 34h10l-5 11z" fill="#f2d9b0"/><path d="M22.5 41.5h3L24 45z" fill="#3a2412"/></g>'
  ];
  /* buddy silhouettes (dark, soft cream edge): bear, raccoon, owl, fox, squirrel, bunny */
  var BUD = [
    '<circle cx="12" cy="13" r="6"/><circle cx="36" cy="13" r="6"/><ellipse cx="24" cy="27" rx="16" ry="15"/>',
    '<path d="M8 6l8 10M40 6l-8 10" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M4 24c4-10 12-12 20-12s16 2 20 12c-4 8-12 16-20 18-8-2-16-10-20-18z"/><path d="M9 24q7-5 13 0q2 2 4 0q6-5 13 0q-6 6-13 2q-2-1-4 0q-7 4-13-2z" fill="#fff3d6" stroke="none" opacity=".9"/><circle cx="16" cy="25" r="2" fill="#2b190d" stroke="none"/><circle cx="32" cy="25" r="2" fill="#2b190d" stroke="none"/>',
    '<path d="M10 6l6 8h16l6-8v24c0 9-6 15-14 15s-14-6-14-15z"/><circle cx="18" cy="22" r="5" fill="#fff3d6" stroke="none"/><circle cx="30" cy="22" r="5" fill="#fff3d6" stroke="none"/><circle cx="18" cy="22" r="2" fill="#2b190d" stroke="none"/><circle cx="30" cy="22" r="2" fill="#2b190d" stroke="none"/><path d="M22 28l2 4 2-4z" fill="#e0a040" stroke="none"/>',
    '<path d="M6 4l12 12h12L42 4l-2 18c-2 10-8 18-16 22-8-4-14-12-16-22z"/>',
    '<path d="M30 42c10-2 15-12 12-22-2-8-10-14-16-10 6 0 9 6 7 12-1 5-4 7-6 9z"/><ellipse cx="18" cy="32" rx="9" ry="11"/><circle cx="16" cy="17" r="7"/><path d="M12 11l1-6 4 5z"/>',
    '<ellipse cx="17" cy="12" rx="4.5" ry="11"/><ellipse cx="31" cy="12" rx="4.5" ry="11"/><ellipse cx="24" cy="31" rx="13" ry="12"/>'
  ];
  function signIcon(set, i) {
    if (set === "badge") return '<img src="../demo/badges/' + BADGE[i] + '.png" alt="">';
    if (set === "symbol") return "<svg " + SVGNS + ' viewBox="0 0 48 48">' + SYM[i] + "</svg>";
    if (set === "buddy") return "<svg " + SVGNS + ' viewBox="0 0 48 48" style="color:#2b190d"><g fill="#2b190d" stroke="#fff3d6" stroke-opacity=".75" stroke-width="1.6" paint-order="stroke">' + BUD[i] + "</g></svg>";
    return "";
  }
  /* centres of the six painted icons on the signpost, in signpost.png pixels (image sits at 674,52 on the 1280x720 art) */
  var SIGN_IC = [[107, 68], [105, 136], [105, 199], [97, 271], [101, 337], [100, 407]];

  /* ---------------- Astra pose + spot (both pages): clean-plate patch hides the painted Astra, a cut-out pose stands on a soft shadow ---------------- */
  var POSE = { writing: { ar: .7372, h: 605 }, waving: { ar: .3648, h: 932 }, reading: { ar: .3282, h: 911 }, pointing: { ar: .3684, h: 912 }, books: { ar: .4806, h: 876 } };
  var ASTRA = {
    a1: { u: 1, W: 1366, H: 768, k: .37, plate: [542, 422, 307, 302, "astra-plate.webp"], fallback: "writing",
          spots: { cur: [690, 705, 1, 0], left: [150, 705, 1, 0], near: [1085, 705, 1, 1] } },
    d:  { u: 0, W: 1280, H: 720, k: .461, plate: [482, 192, 237, 465, "assets/astra-plate.webp"], fallback: "pointing",
          spots: { cur: [583, 632, 1, 0], left: [55, 712, .8, 0], near: [1212, 652, .7, 1] } }
  };
  function astra() {
    var C = ASTRA[PAGE], host = PAGE === "a1" ? document.getElementById("frame") : document.querySelector(".stage"); if (!host) return;
    var on = s.pose !== "cur" || s.spot !== "cur";
    if (!astra.box) {
      var box = astra.box = el("div", "pa-astra-wrap"); box.setAttribute("aria-hidden", "true");
      var pl = el("img", "pa-aplate"); pl.alt = ""; pl.src = C.plate[4]; box.appendChild(pl);
      box.appendChild(el("div", "pa-ashadow")); var im = el("img", "pa-astra"); im.alt = ""; box.appendChild(im);
      function px(v, tot) { return C.u ? v + "px" : (v / tot * 100) + "%"; }
      astra.px = px;
      pl.style.cssText = "left:" + px(C.plate[0], C.W) + ";top:" + px(C.plate[1], C.H) + ";width:" + px(C.plate[2], C.W) + ";height:" + px(C.plate[3], C.H);
    }
    var b = astra.box, anchor = host.querySelector(".fx-loop") || host.querySelector(".pa-art") || host.querySelector(".bg");
    if (anchor) { if (anchor.nextSibling !== b) anchor.after(b); } else if (!b.parentNode) host.insertBefore(b, host.firstChild);
    root.classList.toggle("pa-astra-on", on);
    var key = s.pose + "|" + s.spot; if (!on || astra.key === key) return; astra.key = key;
    var pose = s.pose === "cur" ? C.fallback : s.pose, P = POSE[pose], sp = C.spots[s.spot], px2 = astra.px;
    var h = P.h * C.k * sp[2], w = h * P.ar, x = sp[0] - w / 2, y = sp[1] - h;
    var im2 = b.querySelector(".pa-astra"); im2.src = "../demo/astra/" + pose + ".webp";
    im2.style.cssText = "left:" + px2(x, C.W) + ";top:" + px2(y, C.H) + ";width:" + px2(w, C.W) + ";height:" + px2(h, C.H) + (sp[3] && pose === "pointing" ? ";transform:scaleX(-1)" : "");
    var sh = b.querySelector(".pa-ashadow"), sw = w * (pose === "writing" || pose === "books" ? .95 : .8), shh = 22 * sp[2];
    sh.style.cssText = "left:" + px2(sp[0] - sw / 2, C.W) + ";top:" + px2(sp[1] - shh * .6, C.H) + ";width:" + px2(sw, C.W) + ";height:" + px2(shh, C.H);
    b.classList.toggle("plate", s.spot !== "cur" || s.pose !== "cur");
  }

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
        head(isD ? "Signpost" : "Lanterns") +
        (isD ? row("Sign icons", "signIc", [["cur", "Current"], ["none", "None"], ["buddy", "Buddies"], ["symbol", "Symbols"], ["badge", "Badges"]])
             : row("Lantern shape", "lanShape", [["cur", "Current"], ["round", "Round"], ["hex", "Hexagon"], ["tall", "Tall"], ["star", "Star"], ["flower", "Flower"], ["mixed", "Mixed"], ["moroccan", "Moroccan"]])) +
        (isD ? "" : row("Scene", "scene", [["a1", "A.1 Lantern Tree (current)"], ["pa", "Plan A Portals"]]) + row("Lantern tap", "tap", [["menu", "Bottom menu (current)"], ["portal", "Open portal"]])) +
        row("Badges as icons" + (isD ? " (arrows + buttons)" : " (lanterns + buttons)"), "badgeIc", [["off", "Off"], ["on", "On"]]) +
        head("Astra") +
        row("Astra pose", "pose", [["cur", "Current"], ["writing", "Writing"], ["waving", "Waving"], ["reading", "Reading"], ["pointing", "Pointing"], ["books", "On books"]]) +
        row("Astra spot", "spot", [["cur", "Current spot"], ["left", "Left"], ["near", isD ? "Right, by Let's go" : "Right, under the goal"]]) +
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
