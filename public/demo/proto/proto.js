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
  else if (q.has("proto") || q.has("p")) { s.on = true; put(s); }
  if (s.on === false) return;

  var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "proto.css?v=14"; document.head.appendChild(css);
  root.classList.add("pa", "pa-" + PAGE);

  var D = {
    goalPos: PAGE === "d" ? "tl" : "tr", goalStyle: "cur", goalSize: "compact",
    title: "on", titlePos: "tl", ribbon: "off",
    shape: "cur", color: "mod", size: "m", finish: "frost",
    icon: "off", ml: "off", mt: "on", nm: "off", border: "cur",
    menu: PAGE === "d" ? "sign" : "bottom",
    badgePos: "goal", badgeSize: "m", badgeLbl: "on", earned: "full",
    stColor: "gold", stShape: "tag", stMotion: "bob",
    speaker: "off", lanShape: "cur", scene: "a1", tap: "menu", pstyle: "rune", tod: "cur", pose: "cur", spot: "cur", signIc: "cur", badgeIc: "off", tint: "built", art: "normal", magic: "live", goStyle: "cur", goLbl: "cur", goPos: "cur", goMo: "none",
    badgeIn: "off", reveal: "always", preview: "off", trail: "off", prog: "none", tapfx: "none", zoom: "off", bubble: "off", sound: "off", vol: "3", weather: "none", season: "summer"
  };
  if (PAGE === "d") { D.signIc = "none"; for (var di = 1; di <= 7; di++) { D["c" + di] = ["owl", "raccoon", "squirrel", "astra", "fox", "bear", "bunny"][di - 1]; D["q" + di] = ["stand", "stand", "stand", "point", "point", "wave", "wave"][di - 1]; D["f" + di] = di === 5 ? "on" : "off"; } }
  var KEYS = Object.keys(D);
  if (q.get("p")) { try { var qp = JSON.parse(atob(q.get("p"))); s.on = true; KEYS.forEach(function (k) { s[k] = qp[k] !== undefined ? String(qp[k]) : D[k]; }); } catch (e) {} }
  KEYS.forEach(function (k) { if (s[k] === undefined) s[k] = D[k]; });
  if (!s.keep || typeof s.keep !== "object") s.keep = {};

  var SHORT = ["SCR", "ECR", "Stellar Writers", "Writing Process", "Revision", "Editing"];
  var BADGE = ["scr", "ecr", "stellar", "process", "revision", "editing"];
  var BUDDY = [["Bear", "#e0703a"], ["Raccoon", "#9b7bea"], ["Owl", "#3fb6e8"], ["Fox", "#f5a524"], ["Squirrel", "#4cc28a"], ["Bunny", "#ef6fa8"]];   // Plan D arrows 1–6
  var LP = window.lsProgress, NEXT = (LP && LP.next) || 2;

  function fl() { return s.menu === "float" || s.menu === "arc"; }
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
      if (Lm) [].forEach.call(Lm.querySelectorAll(".lantern"), function (b, i) { b.addEventListener("click", function () { if (self.onLan) self.onLan(i); if (s.tap === "portal") self.portal(i); }); });
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
    layout: function () { astra(); tod(); this.scene(); this.place(); this.leftStack(); this.lan(); if (s.tap !== "portal") this.closePortal(); },
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
      var fr = document.getElementById("frame"), W = window.A1_WORLDS || [], built = W[i]; if (!fr || !built) return;
      var picked = this.worldByKey && this.worldByKey((s.lanWorld || {})[i]);
      var w = picked || built;
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
      var pa = s.scene === "pa", R = pa ? 100 : 115, cx = pa ? 1210 : 1200, cy = pa ? 250 : 520, ps = s.pstyle === "pa";
      if (ps) { var PH = pa ? 192 : 290; p.style.setProperty("--pw", PH * .6 + "px"); p.style.setProperty("--ph", PH + "px"); R = PH * .3; if (pa) cy = 248; }
      p.classList.toggle("pa-ps", ps);
      var vid = p.querySelector(".pa-pvid");
      if (ps) { if (!vid) { vid = el("video", "pa-pvid"); vid.muted = true; vid.loop = true; vid.playsInline = true; vid.setAttribute("playsinline", ""); vid.setAttribute("aria-hidden", "true"); p.querySelector(".pa-pring").insertBefore(vid, p.querySelector(".pa-pwin")); }
        vid.poster = "portals/p" + built.m + ".jpg"; if (vid.dataset.m !== String(built.m)) { vid.src = "portals/p" + built.m + ".mp4"; vid.dataset.m = built.m; }
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) { var pv = vid.play(); if (pv && pv.catch) pv.catch(function () {}); } }
      else if (vid) vid.pause();
      p.style.setProperty("--r", R + "px"); p.style.left = cx + "px"; p.style.top = cy + "px";
      p.classList.toggle("info-left", true);
      p.style.setProperty("--mc", w.color || built.color);
      p.querySelector(".pa-pwin img").src = w.art || built.art;
      p.querySelector(".pa-pt").textContent = w.name || ("Module " + built.m + " · " + (built.short || built.name));
      p.querySelector(".pa-pgo").onclick = function () { location.href = w.href || ("world.html?w=" + built.id); };
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
        b.dataset.fx = (bx[0] + bx[2] / 2) + "%"; b.dataset.fy = (bx[1] + bx[3]) + "%"; b.style.setProperty("--fx", b.dataset.fx); b.style.setProperty("--fy", b.dataset.fy);
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
      var anchor = stage.querySelector(".pd-glow") || stage.querySelector(".fx-overlay") || stage.querySelector(".fx-loop") || stage.querySelector(".pa-art");
      if (anchor && anchor.nextSibling !== this.signc) { anchor.after(this.signc); this.signc.after(this.sics); }
      else if (!anchor && !this.signc.parentNode) { stage.insertBefore(this.sics, stage.firstChild); stage.insertBefore(this.signc, this.sics); }
      if (this.sigKey === set) return; this.sigKey = set;
      this.sics.innerHTML = "";
      SIGN_IC.forEach(function (p, i) {
        if (set === "cur" || set === "none") return;
        var d = el("div", "pa-si pa-si-" + set, signIcon(set, i));
        d.style.left = (p[0] / 12.8) + "%"; d.style.top = (p[1] / 7.2) + "%";
        this.sics.appendChild(d);
      }, this);
    },
    layout: function () {
      tod(); this.signs();
      var self = this; (fl() ? this.fl : this.bar).append.apply(fl() ? this.fl : this.bar, this.btns);
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
    stars: { ar: 1.01, cy: .55 }, crystals: { ar: .24, cy: .57 }, globes: { ar: .59, cy: .61 }, houses: { ar: .70, cy: .60 }, scrolls: { ar: .14, cy: .55 }, inkwells: { ar: .11, cy: .64 },
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
    if (["tools3d", "gems3d", "forest3d"].indexOf(set) >= 0) return '<img src="../dashboard-d/assets/signicons/' + set.replace("3d", "") + "-" + (i + 1) + '.webp?v=1" alt="">';
    if (set === "badge") return '<img src="../demo/badges/' + BADGE[i] + '.png" alt="">';
    if (set === "symbol") return "<svg " + SVGNS + ' viewBox="0 0 48 48">' + SYM[i] + "</svg>";
    if (set === "buddy") return "<svg " + SVGNS + ' viewBox="0 0 48 48" style="color:#2b190d"><g fill="#2b190d" stroke="#fff3d6" stroke-opacity=".75" stroke-width="1.6" paint-order="stroke">' + BUD[i] + "</g></svg>";
    return "";
  }
  /* centres of the six painted icons on the signpost, in signpost.png pixels (image sits at 674,52 on the 1280x720 art) */
  var SIGN_IC = [[792, 117], [802, 190], [802, 257], [786, 325], [779, 395], [781, 462]];   // centre of the blank wood on each arrow (art px)

  /* ---------------- Astra pose + spot (both pages): clean-plate patch hides the painted Astra, a cut-out pose stands on a soft shadow ---------------- */
  var POSE = { writing: { ar: .7372, h: 605 }, waving: { ar: .3648, h: 932 }, reading: { ar: .3282, h: 911 }, pointing: { ar: .3684, h: 912 }, books: { ar: .4806, h: 876 }, plana: { ar: .5098, h: 935, anim: 1 } };
  var ASTRA = {
    a1: { u: 1, W: 1366, H: 768, k: .37, plate: [542, 422, 307, 302, "astra-plate.webp"], fallback: "writing",
          spots: { cur: [690, 705, 1, 0], left: [150, 705, 1, 0], near: [1085, 705, 1, 1] } },
    d:  { u: 0, W: 1280, H: 720, k: .461, plate: [482, 192, 237, 465, "assets/astra-plate.webp"], fallback: "pointing",
          spots: { cur: [1188, 708, 1.05, 0], left: [1188, 708, 1.05, 0], near: [1188, 708, 1.05, 0] } }
  };
  function astra() {
    if (PAGE === "d") return;
    var C = ASTRA[PAGE], host = PAGE === "a1" ? document.getElementById("frame") : document.querySelector(".stage"); if (!host) return;
    var on = s.pose !== "cur" || (PAGE !== "d" && s.spot !== "cur");
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
    var pose = s.pose === "cur" ? C.fallback : s.pose, P = POSE[pose], sp = PAGE === "d" ? C.spots.cur : C.spots[s.spot], px2 = astra.px;
    var h = P.h * C.k * sp[2], w = h * P.ar, x = sp[0] - w / 2, y = sp[1] - h;
    var im2 = b.querySelector(".pa-astra"), safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent), vd = b.querySelector(".pa-astra-v");
    if (P.anim && !safari) {   // Plan A's animated Astra: VP9-alpha WebM (Chrome, Edge, Firefox); Safari gets the animated WebP
      if (!vd) { vd = el("video", "pa-astra pa-astra-v"); vd.muted = true; vd.loop = true; vd.playsInline = true; vd.setAttribute("playsinline", ""); vd.autoplay = true; b.appendChild(vd); }
      if (!vd.getAttribute("src")) vd.src = "../demo/astra/plana.webm";
      var pv = vd.play(); if (pv && pv.catch) pv.catch(function () {}); im2.style.display = "none"; im2 = vd; vd.style.display = "";
    } else { if (vd) { vd.pause(); vd.style.display = "none"; } im2.style.display = ""; im2.src = "../demo/astra/" + (P.anim ? "plana.webp" : pose + ".webp"); }
    im2.style.cssText = (im2.style.display === "none" ? "display:none;" : "") + "left:" + px2(x, C.W) + ";top:" + px2(y, C.H) + ";width:" + px2(w, C.W) + ";height:" + px2(h, C.H) + (sp[3] && pose === "pointing" ? ";transform:scaleX(-1)" : "");
    var sh = b.querySelector(".pa-ashadow"), sw = w * (pose === "writing" || pose === "books" ? .95 : .8), shh = 22 * sp[2];
    sh.style.cssText = "left:" + px2(sp[0] - sw / 2, C.W) + ";top:" + px2(sp[1] - shh * .6, C.H) + ";width:" + px2(sw, C.W) + ";height:" + px2(shh, C.H);
    b.classList.toggle("plate", s.spot !== "cur" || s.pose !== "cur");
  }

  /* ---------------- Time of day: Emily's stills (aligned to the built art), per-time clean plates ---------------- */
  function tod() {
    if (PAGE === "d") { dScene(); return; }
    var t = s.tod, a1 = PAGE === "a1", host = a1 ? document.getElementById("frame") : document.querySelector(".stage"); if (!host) return;
    var on = t !== "cur";
    if (a1) {
      var key = on ? t : "base";
      var bg = document.getElementById("sceneBg"); if (bg) bg.src = "plates/" + key + ".jpg";
      var lc = document.getElementById("lanCuts"); if (lc) lc.src = "plates/lanterns-" + key + ".webp";
      var ac = document.getElementById("astraCut"); if (ac) ac.src = "plates/astra-" + key + ".webp";
      var sc = document.getElementById("signCut"); if (sc) sc.src = "plates/sign-" + key + ".webp";
      root.classList.remove("pa-tod-on");
      return;
    }
    if (!tod.img) { tod.img = el("img", "pa-tod"); tod.img.alt = ""; tod.img.setAttribute("aria-hidden", "true"); }
    var anchor = a1 ? host.querySelector(".bg") : (host.querySelector(".fx-loop") || host.querySelector(".pa-art"));
    if (anchor && anchor.nextSibling !== tod.img) anchor.after(tod.img); else if (!anchor && !tod.img.parentNode) host.insertBefore(tod.img, host.firstChild);
    root.classList.toggle("pa-tod-on", on);
    if (on) tod.img.src = a1 ? "tod-" + t + ".jpg" : "assets/tod-" + t + ".jpg";
    var suf = on ? "-" + t : "";
    if (astra.box) { var pl = astra.box.querySelector(".pa-aplate"); if (pl) pl.src = ASTRA[PAGE].plate[4].replace(".webp", suf + ".webp"); }
    if (a1) root.style.setProperty("--pa-clean", 'url("../../dashboard-a1/tree-clean' + suf + '.jpg")');
    else if (AD.signc) AD.signc.src = "../dashboard-d/assets/signpost-clean" + suf + ".png";
  }

var CMETA={"astra-cheer":[312,640,0.545,0.995],"astra-point":[294,640,0.48,0.994],"astra-read":[268,640,0.519,0.952],"astra-wave":[378,640,0.548,0.995],"astra-write":[264,640,0.521,0.969],"bear-cheer":[490,640,0.462,0.995],"bear-point":[363,640,0.567,0.995],"bear-read":[320,640,0.505,0.991],"bear-stand":[309,640,0.474,0.991],"bear-wave":[351,640,0.554,0.995],"bunny-cheer":[340,640,0.451,0.995],"bunny-point":[300,640,0.518,0.995],"bunny-read":[252,640,0.544,0.994],"bunny-stand":[237,640,0.435,0.994],"bunny-wave":[292,640,0.507,0.994],"fox-cheer":[410,640,0.549,0.995],"fox-point":[322,640,0.477,0.995],"fox-read":[301,640,0.503,0.958],"fox-stand":[254,640,0.587,0.97],"fox-wave":[331,640,0.464,0.994],"owl-cheer":[523,640,0.464,0.98],"owl-point":[422,640,0.551,0.995],"owl-read":[365,640,0.462,0.958],"owl-stand":[331,640,0.524,0.975],"owl-wave":[397,640,0.598,0.972],"raccoon-cheer":[462,640,0.485,0.981],"raccoon-point":[325,640,0.583,0.967],"raccoon-read":[342,640,0.534,0.973],"raccoon-stand":[312,640,0.59,0.967],"raccoon-wave":[342,640,0.598,0.978],"squirrel-cheer":[486,640,0.569,0.995],"squirrel-point":[491,640,0.571,0.994],"squirrel-read":[461,640,0.606,0.992],"squirrel-stand":[417,640,0.675,0.995],"squirrel-wave":[494,640,0.568,0.992]};
  /* ================= Plan D scene: character-free porch backgrounds + rearrangeable character cutouts ================= */
  var CH = ["owl", "raccoon", "squirrel", "astra", "fox", "bear", "bunny"];
  var CHN = { owl: "Owl", raccoon: "Raccoon", squirrel: "Squirrel", astra: "Astra", fox: "Fox", bear: "Bear", bunny: "Bunny" };
  var CPOSE = { astra: ["point", "wave", "read", "write", "cheer"] }; function poses(c) { return CPOSE[c] || ["stand", "wave", "read", "point", "cheer"]; }
  var PN = { point: "Point", wave: "Wave", read: "Read", write: "Write", cheer: "Cheer", stand: "Stand" };
  var CHH = { owl: 300, raccoon: 280, squirrel: 205, astra: 400, fox: 330, bear: 300, bunny: 300 };   // natural height in art px at the front of the deck
  /* foot x, foot y (art px of 1280x720), depth scale; matched to the original Plan D figures */
  var SPOT = [[165, 662, 1], [302, 666, 1], [452, 656, .97], [590, 648, .97], [880, 628, .9], [1036, 614, .68], [1126, 597, .6]];
  var SPOTN = ["Far left (deck)", "Left", "Left-centre", "Middle (by signpost)", "Right of signpost", "Bridge start", "On the bridge"];
  var DDEF = { c: ["owl", "raccoon", "squirrel", "astra", "fox", "bear", "bunny"], q: ["stand", "stand", "stand", "point", "point", "wave", "wave"], f: ["off", "off", "off", "off", "on", "off", "off"] };
  /* night glows: windows and lanterns in the porch art */
  var GLOW = [[34, 200, 26], [81, 197, 26], [227, 305, 34], [398, 237, 22], [1211, 297, 26], [1234, 516, 26], [62, 150, 18]];
  function dbg() { var se = s.season, t = s.tod;
    var exact = se === "summer" ? ({ cur: "day", day: "day", sunrise: "sunrise", dusk: "sunset" })[t] : (t === "cur" || t === "day") ? ({ spring: "spring", autumn: "fall", winter: "winter" })[se] : null;
    var img = exact || (se === "summer" ? "day" : ({ spring: "spring", autumn: "fall", winter: "winter" })[se]);
    return { img: img, grade: exact ? "none" : (t === "dusk" ? "sunset" : t) };
  }
  function dScene() {
    var st = document.querySelector(".stage"); if (!st) return;
    if (!dScene.bg) {
      var bg = dScene.bg = el("img", "pd-bg"); bg.alt = ""; bg.setAttribute("aria-hidden", "true");
      var gr = dScene.gr = el("div", "pd-grade"); gr.setAttribute("aria-hidden", "true");
      var gl = dScene.gl = el("div", "pd-glow"); gl.setAttribute("aria-hidden", "true");
      gl.innerHTML = GLOW.map(function (g) { return '<i style="left:' + g[0] / 12.8 + "%;top:" + g[1] / 7.2 + "%;width:" + g[2] * 2 / 12.8 + '%"></i>'; }).join("");
      var cs = dScene.cs = el("div", "pd-chars"); cs.setAttribute("aria-hidden", "true");
      st.insertBefore(cs, st.firstChild); st.insertBefore(gl, cs); st.insertBefore(gr, gl); st.insertBefore(bg, gr);
      dScene.els = SPOT.map(function () { var d = el("div", "pd-ch"); d.innerHTML = '<span class="pd-sh"></span><img alt="">'; cs.appendChild(d); return d; });
    }
    var b = dbg(); var src = "assets/bg/" + b.img + ".jpg"; if (dScene.bg.getAttribute("src") !== src) dScene.bg.src = src;
    root.setAttribute("data-pd-grade", b.grade);
    SPOT.forEach(function (p, i) {
      var d = dScene.els[i], c = s["c" + (i + 1)], q = s["q" + (i + 1)];
      if (c === "none" || !c) { d.style.display = "none"; return; }
      if (poses(c).indexOf(q) < 0) q = poses(c)[0];
      var m = CMETA[c + "-" + q] || [300, 640, .5, 1], h = CHH[c] * p[2] / m[3], w = h * m[0] / m[1], flip = s["f" + (i + 1)] === "on", cx = flip ? 1 - m[2] : m[2];
      d.style.display = ""; d.dataset.c = c; d.className = "pd-ch pd-" + c + (flip ? " pd-flip" : "");
      d.style.left = (p[0] - w * cx) / 12.8 + "%"; d.style.top = (p[1] - h * .997) / 7.2 + "%"; d.style.width = w / 12.8 + "%"; d.style.height = h / 7.2 + "%";
      d.style.zIndex = Math.round(p[1]); d.style.setProperty("--cx", cx * 100 + "%");
      var im = d.querySelector("img"), u = "assets/chars/" + c + "-" + q + ".webp?v=2"; if (im.getAttribute("src") !== u) im.src = u;
    });
  }
  /* keep every character in one spot: putting X into a spot that someone else holds swaps them */
  function dSet(i, c) {
    var old = s["c" + i]; if (c !== "none") for (var j = 1; j <= 7; j++) if (j !== i && s["c" + j] === c) { s["c" + j] = old; fixPose(j); }
    s["c" + i] = c; fixPose(i);
  }
  function fixPose(j) { var c = s["c" + j]; if (c && c !== "none" && poses(c).indexOf(s["q" + j]) < 0) s["q" + j] = c === "astra" ? (s["q" + j] === "stand" ? "point" : poses(c)[0]) : (s["q" + j] === "write" ? "read" : "stand"); }
  function dShuffle(poseToo) {
    var a = CH.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = a[i]; a[i] = a[j]; a[j] = t; }
    a.forEach(function (c, i) { s["c" + (i + 1)] = c; if (poseToo) { var P = poses(c); s["q" + (i + 1)] = P[Math.random() * P.length | 0]; s["f" + (i + 1)] = Math.random() < .3 ? "on" : "off"; } else fixPose(i + 1); });
  }
  var AD = A[PAGE];
  /* ================= Extra play options (both pages): arc menu, menu reveal, preview card, path trail, progress,
     tap effects + zoom, Astra speech bubble, ambient sound, weather, season ================= */
  var KID = ["Answer a question in a few strong sentences.", "Build a longer answer with reasons and proof.", "Write sentences that really shine.",
    "Plan, draft and polish your ideas.", "Make your writing clearer and stronger.", "Fix spelling, capitals and commas."];
  var TIP = ["Tip: say the question back in your answer!", "Tip: give a reason, then prove it with the text.", "Tip: one big idea in every sentence.",
    "Tip: make a quick plan before you write.", "Tip: read it out loud, then make it better.", "Tip: check each capital and comma."];
  var X = {};
  function isA1() { return PAGE === "a1"; }
  function hostEl() { return isA1() ? document.getElementById("frame") : document.querySelector(".stage"); }
  /* module centre in host coordinates: A.1 stage px; D art px (1280x720) */
  function modPt(i) {
    if (isA1()) { var g = AD.geo(i); return { x: g.x, y: g.y, w: g.w, h: g.h }; }
    var h = document.querySelectorAll(".hot[data-arrow]")[i]; if (!h) return { x: 0, y: 0, w: 0, h: 0 };
    var b = ["left", "top", "width", "height"].map(function (k) { return parseFloat(h.style[k]); });
    return { x: (b[0] + b[2] / 2) * 12.8, y: (b[1] + b[3] / 2) * 7.2, w: b[2] * 12.8, h: b[3] * 7.2 };
  }
  function hostToScreen(x, y) {   // host coords -> viewport px
    var hst = hostEl(), r = hst.getBoundingClientRect(), W = isA1() ? 1366 : 1280, H = isA1() ? 768 : 720;
    return { x: r.left + x / W * r.width, y: r.top + y / H * r.height, k: r.width / W };
  }
  function status(m) { return LP && LP.status ? LP.status(m) : ""; }
  function doneCount() { var n = 0; for (var m = 1; m <= 6; m++) if (status(m) === "done") n++; return n; }

  /* ---- arc menu ---- */
  X.arc = function () {
    if (s.menu !== "arc") { if (X.wasArc) { X.wasArc = false; if (isA1()) { var bt = document.querySelectorAll("#tiles .tile"); [].forEach.call(bt, function (b, i) { var g = AD.geo(i); b.style.setProperty("--fx", g.x + "px"); b.style.setProperty("--fy", (g.y + g.h / 2 + 4) + "px"); }); } else (AD.btns || []).forEach(function (b) { b.style.setProperty("--fx", b.dataset.fx); b.style.setProperty("--fy", b.dataset.fy); }); } return; }
    X.wasArc = true;
    var btns = isA1() ? [].slice.call(document.querySelectorAll("#tiles .tile")) : AD.btns || [];
    var cx, cy, rx, ry, a0 = 200, a1 = 340;
    if (isA1()) { if (s.scene === "pa") { cx = 683; cy = 735; rx = 470; ry = 150; } else { cx = 690; cy = 690; rx = 330; ry = 250; } }
    else { cx = 640; cy = 760; rx = 470; ry = 180; }
    btns.forEach(function (b, i) {
      var a = (a0 + (a1 - a0) * i / (btns.length - 1)) * Math.PI / 180, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      if (isA1()) { b.style.setProperty("--fx", x + "px"); b.style.setProperty("--fy", y + "px"); }
      else { b.style.setProperty("--fx", (x / 12.8) + "%"); b.style.setProperty("--fy", (y / 7.2) + "%"); }
    });
  };
  /* ---- menu reveal ---- */
  X.reveal = function () {
    if (!X.handle) {
      var hb = X.handle = el("button", "pa-handle"); hb.type = "button"; hb.innerHTML = "<span>&#9650;</span> Modules";
      hb.setAttribute("aria-expanded", "false");
      hb.onclick = function () { var o = !root.classList.contains("pa-menu-open"); root.classList.toggle("pa-menu-open", o); hb.setAttribute("aria-expanded", o); setTimeout(X.reveal, 380); };
      document.body.appendChild(hb);
    }
    var m = s.menu === "bottom" ? document.querySelector(isA1() ? ".bar" : ".pa-menu") : null, hb2 = 10;
    if (m && root.classList.contains("pa-menu-open")) { var r = m.getBoundingClientRect(); hb2 = innerHeight - r.top + 6; }
    root.style.setProperty("--pa-hb", hb2 + "px");
  };
  /* ---- preview card ---- */
  X.preview = function (i, elx, sticky) {
    if (s.preview !== "on") return;
    var c = X.card; if (!c) { c = X.card = el("div", "pa-card"); c.setAttribute("role", "status"); document.body.appendChild(c); }
    var W = window.A1_WORLDS || [], name = isA1() ? (W[i] && (W[i].short || W[i].name)) : BUDDY[i][0] + "'s world";
    var img = isA1() ? (W[i] && W[i].art) : "../dashboard-a1/portals/p" + (i + 1) + ".jpg";
    c.innerHTML = '<img alt="" src="' + img + '"><div><b>Module ' + (i + 1) + " · " + SHORT[i] + "</b><span>" + name + "</span><p>" + KID[i] + "</p></div>";
    var r = elx.getBoundingClientRect(), cw = 250, ch = 92;
    var x = Math.min(Math.max(8, r.left + r.width / 2 - cw / 2), innerWidth - cw - 8), y = r.top - ch - 10; if (y < 44) y = r.bottom + 10;
    c.style.left = x + "px"; c.style.top = Math.min(y, innerHeight - ch - 8) + "px"; c.classList.add("show");
    clearTimeout(X.cardT); if (sticky) X.cardT = setTimeout(function () { c.classList.remove("show"); }, 3500);
  };
  X.unpreview = function () { if (X.card) X.card.classList.remove("show"); };
  /* ---- path trail ---- */
  X.trail = function () {
    var hst = hostEl(); if (!hst) return;
    var key = s.trail + "|" + s.scene + "|" + s.lanShape;
    if (!X.tr) { X.tr = document.createElementNS("http://www.w3.org/2000/svg", "svg"); X.tr.setAttribute("class", "pa-trail"); X.tr.setAttribute("aria-hidden", "true"); }
    var anchor = isA1() ? document.getElementById("lanterns") : (hst.querySelector(".pa-sics") || hst.querySelector(".hot"));
    if (anchor && anchor.previousSibling !== X.tr) anchor.before(X.tr);
    if (s.trail === "off" || X.trKey === key) return; X.trKey = key;
    var W = isA1() ? 1366 : 1280, H = isA1() ? 768 : 720; X.tr.setAttribute("viewBox", "0 0 " + W + " " + H); X.tr.setAttribute("preserveAspectRatio", "none");
    var pts = [0, 1, 2, 3, 4, 5].map(modPt), out = "";
    for (var i = 0; i < 5; i++) {
      var a = pts[i], b = pts[i + 1], mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + (isA1() ? 60 : 0) , ox = isA1() ? 0 : 70;
      var d = "M" + a.x + " " + a.y + " Q" + (mx + ox) + " " + my + " " + b.x + " " + b.y;
      var lit = status(i + 1) === "done";
      out += '<path d="' + d + '" class="' + (lit ? "lit" : "dim") + '"/>';
    }
    pts.forEach(function (p, i) { out += '<circle cx="' + p.x + '" cy="' + p.y + '" r="5" class="' + (status(i + 1) === "done" ? "lit" : status(i + 1) === "next" ? "nx" : "dim") + '"/>'; });
    X.tr.innerHTML = out;
  };
  /* ---- progress near the goal ---- */
  X.progress = function () {
    var g = document.querySelector(isA1() ? ".goaltile" : ".card"); if (!g) return;
    var p = g.querySelector(".pa-prog"); if (s.prog === "none") { if (p) p.remove(); return; }
    if (!p) { p = el("div", "pa-prog"); g.appendChild(p); }
    var n = doneCount(), html = "";
    if (s.prog === "bar") html = '<i style="--p:' + (n / 6 * 100) + '%"></i><span>' + n + " of 6 done</span>";
    else if (s.prog === "stars") { for (var k = 0; k < 6; k++) html += '<em class="' + (k < n ? "on" : "") + '">&#9733;</em>'; }
    else html = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 1 18 8 10 23 2 8z" fill="#7fe3ff" stroke="#2a7fb8" stroke-width="1.4"/><path d="M2 8h16M10 1 7 8l3 15 3-15z" fill="none" stroke="#2a7fb8" stroke-width="1"/></svg><span>' + (n * 3) + " crystals</span>";
    p.className = "pa-prog pa-prog-" + s.prog; p.innerHTML = html;
    p.setAttribute("aria-label", n + " of 6 modules done");
  };
  /* ---- tap effect + zoom + speech bubble ---- */
  X.pick = function (i, elx) {
    root.classList.add("pa-menu-open"); if (X.handle) X.handle.setAttribute("aria-expanded", "true");
    var p = modPt(i), col = isA1() ? ((window.A1_WORLDS || [])[i] || {}).color : BUDDY[i][1];
    if (s.tapfx === "sparkle" && window.AmbientFX && AmbientFX.burst) AmbientFX.burst(p.x, p.y, col || "#ffd27a", 26);
    if (s.tapfx === "swing") {
      var t = isA1() ? (document.querySelectorAll("#lanterns .pa-lanw")[5 - i] || null) : document.querySelectorAll(".pa-si")[i];
      var tgt = t && (t.querySelector ? (t.querySelector(".pa-lan") || t) : t);
      if (tgt && tgt.getClientRects().length) { tgt.classList.remove("pa-swing"); void tgt.offsetWidth; tgt.classList.add("pa-swing"); }
      else X.glow(p, col);
    }
    if (s.tapfx === "glow") X.glow(p, col);
    if (s.zoom === "on") X.zoomTo(p);
    if (s.bubble === "on") X.say(TIP[i]);
    X.preview(i, elx, true);
  };
  X.glow = function (p, col) {
    var hst = hostEl(), g = el("div", "pa-burst"); g.style.setProperty("--c", col || "#ffd27a");
    if (isA1()) { g.style.left = p.x + "px"; g.style.top = p.y + "px"; } else { g.style.left = p.x / 12.8 + "%"; g.style.top = p.y / 7.2 + "%"; }
    hst.appendChild(g); setTimeout(function () { g.remove(); }, 900);
  };
  X.zoomTo = function (p) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var hst = hostEl(), W = isA1() ? 1366 : 1280, H = isA1() ? 768 : 720;
    var list = isA1() ? [].filter.call(hst.children, function (c) { return !c.matches(".strip,.goaltile,.bar,.lsb,.selected-module,.intro-replay,.pa-portal,.intro-film,.astra-say"); }) : [hst];
    list.forEach(function (c) { c.style.transformOrigin = (isA1() ? p.x + "px " + p.y + "px" : (p.x / W * 100) + "% " + (p.y / H * 100) + "%"); c.classList.add("pa-zoom"); });
    clearTimeout(X.zT); X.zT = setTimeout(function () { list.forEach(function (c) { c.classList.add("pa-zback"); c.classList.remove("pa-zoom"); setTimeout(function () { c.classList.remove("pa-zback"); c.style.transformOrigin = ""; }, 950); }); }, 1400);
  };
  X.say = function (txt) {
    var b = X.bub; if (!b) { b = X.bub = el("div", "pa-bubble"); b.setAttribute("role", "status"); document.body.appendChild(b); }
    var a = isA1() ? document.querySelector(".pa-astra-on .pa-astra-wrap .pa-astra:not([style*='display:none'])") : document.querySelector(".pd-ch.pd-astra img"), x, y;
    if (a && a.getClientRects().length) { var r = a.getBoundingClientRect(); x = r.left + r.width * .5; y = r.top + r.height * .08; }
    else { var c = isA1() ? (s.scene === "pa" ? [190, 150] : [655, 462]) : [570, 215], q = hostToScreen(c[0], c[1]); x = q.x; y = q.y; }
    b.textContent = txt; b.classList.remove("show"); void b.offsetWidth;
    var bw = 230; b.style.left = Math.min(Math.max(8, x - 30), innerWidth - bw - 8) + "px"; b.style.top = Math.max(44, y - 70) + "px"; b.classList.add("show");
    clearTimeout(X.bT); X.bT = setTimeout(function () { b.classList.remove("show"); }, 6000);
  };
  X.bind = function () {
    var els = isA1() ? [[].slice.call(document.querySelectorAll("#lanterns .lantern")), [].slice.call(document.querySelectorAll("#tiles .tile"))]
                     : [[].slice.call(document.querySelectorAll(".hot[data-arrow]")), AD.btns || []];
    els.forEach(function (list, li) { list.forEach(function (e, i) {
      if (li === 0 || isA1()) e.addEventListener("click", function () { X.pick(i, e); });
      e.addEventListener("mouseenter", function () { X.preview(i, e, false); });
      e.addEventListener("mouseleave", X.unpreview);
      e.addEventListener("focus", function () { X.preview(i, e, false); }); e.addEventListener("blur", X.unpreview);
    }); });
  };
  /* ---- ambient sound (WebAudio synthesis; starts only after a tap) ---- */
  var SND = { ctx: null, gain: null, timer: null };
  function sndKind() { var t = s.tod === "cur" ? (isA1() ? "night" : "day") : s.tod; return t === "dusk" || t === "night" ? "night" : "day"; }
  function sndStart() {
    if (SND.ctx) { SND.ctx.resume && SND.ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    var c = SND.ctx = new AC(), g = SND.gain = c.createGain(); g.gain.value = 0; g.connect(c.destination);
    // soft wind bed: filtered noise
    var len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    var n = c.createBufferSource(); n.buffer = buf; n.loop = true; var f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 500;
    var ng = c.createGain(); ng.gain.value = 0.18; n.connect(f); f.connect(ng); ng.connect(g); n.start();
    function tone(freq, t0, dur, vol, type, glide) {
      var o = c.createOscillator(), e = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
      if (glide) o.frequency.exponentialRampToValueAtTime(glide, t0 + dur);
      e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(vol, t0 + Math.min(.02, dur / 4)); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(e); e.connect(g); o.start(t0); o.stop(t0 + dur + .05);
    }
    function tick() {
      if (!SND.ctx || s.sound !== "on") return;
      var t = c.currentTime + 0.05, k = sndKind();
      if (k === "day") {   // birds: a few quick chirps with falling or rising pitch
        if (Math.random() < .55) { var b = 2200 + Math.random() * 1800, nn = 2 + (Math.random() * 4 | 0);
          for (var j = 0; j < nn; j++) tone(b, t + j * .11, .08, .05, "sine", b * (Math.random() < .5 ? 1.35 : .7)); }
      } else {             // crickets: fast pulsed high tone
        if (Math.random() < .7) { var cf = 4300 + Math.random() * 500; for (var q = 0; q < 6; q++) tone(cf, t + q * .045, .03, .018, "triangle"); }
      }
      if (Math.random() < .12) { var root0 = [523.25, 659.25, 783.99, 987.77][Math.random() * 4 | 0]; tone(root0, t, 2.4, .035, "sine"); tone(root0 * 2, t + .02, 1.6, .012, "sine"); }   // soft chime
      SND.timer = setTimeout(tick, 380 + Math.random() * 700);
    }
    SND.tick = tick; tick();
  }
  X.sound = function () {
    var v = (+s.vol || 3) / 5 * 0.9;
    if (s.sound !== "on") { if (SND.gain) SND.gain.gain.setTargetAtTime(0, SND.ctx.currentTime, .3); clearTimeout(SND.timer); return; }
    if (!SND.ctx) { if (X.userTapped) sndStart(); else return; }
    SND.ctx.resume && SND.ctx.resume(); SND.gain.gain.setTargetAtTime(v, SND.ctx.currentTime, .4);
    clearTimeout(SND.timer); SND.tick && SND.tick();
  };
  ["pointerdown", "keydown"].forEach(function (ev) { document.addEventListener(ev, function () { if (X.userTapped) return; X.userTapped = true; if (s.sound === "on") { sndStart(); X.sound(); } }, { capture: true }); });
  /* ---- weather + season particles (one canvas inside the stage, above the art, below the UI) ---- */
  var WX = { c: null, g: null, parts: [], kind: "", raf: 0 };
  X.weather = function () {
    var hst = hostEl(); if (!hst) return;
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var kinds = []; if (s.weather !== "none") kinds.push(s.weather);
    var kind = reduce ? "" : kinds.join(",");
    if (!WX.c) { WX.c = el("canvas", "pa-weather"); WX.c.setAttribute("aria-hidden", "true"); WX.g = WX.c.getContext("2d"); }
    var anchor = isA1() ? (hst.querySelector(".ambient-fx") || document.getElementById("lanterns")) : (hst.querySelector(".ambient-fx") || hst.querySelector(".pa-sics"));
    if (anchor && anchor.nextSibling !== WX.c) anchor.after(WX.c); else if (!anchor && !WX.c.parentNode) hst.appendChild(WX.c);
    if (kind === WX.kind) return; WX.kind = kind;
    var W = isA1() ? 1366 : 1280, H = isA1() ? 768 : 720; WX.c.width = W; WX.c.height = H; WX.parts = [];
    function R(a, b) { return a + Math.random() * (b - a); }
    kinds.forEach(function (k) {
      var n = { rain: 64, leaves: 12, snow: 48, blossom: 14, frost: 16, fewleaves: 5 }[k] || 0;
      for (var i = 0; i < n; i++) WX.parts.push({ k: k, x: R(0, W), y: R(-H, H), v: k === "rain" ? R(620, 900) : k === "snow" || k === "frost" ? R(18, 46) : R(30, 70),
        s: k === "rain" ? R(10, 18) : k === "snow" ? R(1.5, 3.4) : k === "frost" ? R(1, 2.2) : R(5, 9), ph: R(0, 6.3), r: R(0, 6.3), vr: R(-2, 2),
        c: k === "blossom" ? ["#ffc6dc", "#ffd9e6", "#ffb0cc"][i % 3] : ["#e9772c", "#d4542a", "#f2a93b", "#b8461f"][i % 4] });
    });
    cancelAnimationFrame(WX.raf); var last = performance.now(), g = WX.g;
    function frame(now) {
      var dt = Math.min(.05, (now - last) / 1000); last = now; g.clearRect(0, 0, W, H);
      WX.parts.forEach(function (p) {
        if (p.k === "rain") { p.y += p.v * dt; p.x -= p.v * .18 * dt; if (p.y > H) { p.y = R(-60, 0); p.x = R(0, W + 120); }
          g.strokeStyle = "rgba(214,228,242,.38)"; g.lineWidth = 1; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + p.s * .12, p.y - p.s); g.stroke(); return; }
        p.y += p.v * dt; p.ph += dt; p.r += p.vr * dt; p.x += Math.sin(p.ph * 1.3) * (p.k === "snow" || p.k === "frost" ? 12 : 30) * dt;
        if (p.y > H + 20) { p.y = R(-40, -10); p.x = R(0, W); }
        if (p.k === "snow" || p.k === "frost") { g.fillStyle = p.k === "frost" ? "rgba(232,244,255,.55)" : "rgba(255,255,255,.7)"; g.beginPath(); g.arc(p.x, p.y, p.s * .8, 0, 6.283); g.fill(); return; }
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.globalAlpha = .72;
        g.beginPath(); g.ellipse(0, 0, p.s * .7, p.s * .32, 0, 0, 6.283); g.fill(); g.restore();
      });
      if (WX.parts.length) WX.raf = requestAnimationFrame(frame);
    }
    if (WX.parts.length) WX.raf = requestAnimationFrame(frame);
  };
  /* Season backgrounds are off. Time of day owns the tree. */
  X.season = function () { root.classList.remove("pa-season-art"); };
  X.unclash = function () {
    if (!isA1()) return; var st = document.querySelector(".strip"), g = document.querySelector(".goaltile"); if (!st || !g) return;
    st.style.translate = ""; var a = st.getBoundingClientRect(), b = g.getBoundingClientRect(), k = hostToScreen(0, 0).k || 1;
    if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) st.style.translate = "0 " + ((b.bottom - a.top + 8) / k) + "px";
  };
  /* ================= "Let's go" button: style, label, position, motion (both pages) ================= */
  var GOLBL = { cur: null, start: "Start", begin: "Begin adventure", go: "Go!" };
  function goBtn() { return isA1() ? document.querySelector("#act .go") : document.querySelector(".hop"); }
  X.go = function () {
    var b = goBtn(); if (!b) return;
    if (!b.dataset.orig) { var tn = [].filter.call(b.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })[0]; b.dataset.orig = tn ? tn.textContent : ""; }
    var tn2 = [].filter.call(b.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })[0];
    var want = GOLBL[s.goLbl] ? (isA1() ? GOLBL[s.goLbl] + " \u203a" : GOLBL[s.goLbl] + " ") : b.dataset.orig;
    if (tn2 && tn2.textContent !== want) tn2.textContent = want;
    if (!b.querySelector(".pa-gospark")) { var sp = el("span", "pa-gospark", "<i>\u2726</i><i>\u2727</i><i>\u2726</i>"); sp.setAttribute("aria-hidden", "true"); b.appendChild(sp); }
    var m = LP && LP.next ? LP.next - 1 : 1, col = isA1() ? (((window.A1_WORLDS || [])[m] || {}).color || "#f5b400") : BUDDY[m][1];
    b.style.setProperty("--go-c", col);
    b.style.left = b.style.top = "";
    if (s.goPos === "sign") {
      if (isA1()) { b.style.left = "690px"; b.style.top = "700px";
        var tq = hostToScreen(690, 700), br = b.getBoundingClientRect(), kk = tq.k || 1;
        b.style.left = (690 + (tq.x - (br.left + br.width / 2)) / kk) + "px"; b.style.top = (700 + (tq.y - (br.top + br.height / 2)) / kk) + "px"; }
      else { var q = hostToScreen(762, 600); b.style.left = q.x + "px"; b.style.top = q.y + "px"; }
    }
  };
  if (window.MutationObserver) document.addEventListener("DOMContentLoaded", function () {
    var act = document.getElementById("act"); if (act) new MutationObserver(function () { X.go(); }).observe(act, { childList: true });
  });
  X.layout = function () { X.go(); X.unclash(); X.badgeIn(); X.arc(); X.reveal(); X.trail(); X.progress(); X.weather(); X.season(); X.sound(); };

  X.badgeIn = function () {
    var imgs = [].slice.call(document.querySelectorAll(".lsb i")), btns = isA1() ? [].slice.call(document.querySelectorAll("#tiles .tile")) : AD.btns || [];
    btns.forEach(function (b, i) {
      var bi = b.querySelector(".pa-bin"), src = imgs[i] && imgs[i].querySelector("img");
      if (s.badgeIn !== "on") { if (bi) bi.remove(); return; }
      if (!src) return;
      if (!bi) { bi = el("img", "pa-bin"); bi.alt = ""; b.insertBefore(bi, b.firstChild); }
      bi.src = src.currentSrc || src.src; bi.classList.toggle("earned", imgs[i].classList.contains("earned"));
    });
  };

  /* ---------------- apply ---------------- */
  function apply() {
    KEYS.forEach(function (k) { root.setAttribute("data-p-" + k.toLowerCase(), s[k]); });
    var lvl = s.magic === "live" ? 0 : +s.magic;
    window.__magicLevel = lvl; window.__tod = s.tod;
    if (window.AmbientFX && AmbientFX.setLevel) AmbientFX.setLevel(lvl);
    root.setAttribute("data-p-menux", fl() ? "float" : s.menu);
    if (AD && AD.ready) { AD.layout(); X.layout(); requestAnimationFrame(function () { AD.layout(); X.layout(); }); }
    var p = document.getElementById("paPanel");
    if (p && PAGE === "d") for (var si = 1; si <= 7; si++) {
      var cs = p.querySelector('[data-ch="' + si + '"]'), ps = p.querySelector('[data-pose="' + si + '"]'), fb = p.querySelector('[data-flip="' + si + '"]'); if (!cs) break;
      var cc = s["c" + si]; cs.value = cc; ps.disabled = cc === "none";
      var want = cc === "none" ? [] : poses(cc); if (ps.dataset.c !== cc) { ps.innerHTML = want.map(function (q) { return '<option value="' + q + '">' + PN[q] + "</option>"; }).join(""); ps.dataset.c = cc; }
      ps.value = s["q" + si]; fb.classList.toggle("on", s["f" + si] === "on"); fb.disabled = cc === "none";
    }
    if (p) p.querySelectorAll("[data-k]").forEach(function (b) { b.classList.toggle("on", String(s[b.getAttribute("data-k")]) === b.getAttribute("data-v")); });
    if (p) p.querySelectorAll("[data-keep]").forEach(function (b) {
      var on = !!(s.keep && s.keep[b.getAttribute("data-keep")]);
      b.textContent = on ? "Kept" : "Keep"; b.classList.toggle("on", on);
      var row = b.closest(".pa-row"); if (row) row.classList.toggle("kept", on);
    });
    put(s);
  }
  apply();

  function seg(k, opts) { return '<div class="pa-seg" data-n="' + opts.length + '">' + opts.map(function (o) { return '<button type="button" data-k="' + k + '" data-v="' + o[0] + '">' + o[1] + "</button>"; }).join("") + "</div>"; }
  function row(label, k, opts) { return '<div class="pa-row" data-row="' + k + '"><small>' + label + '<button type="button" class="pa-keep" data-keep="' + k + '">Keep</button></small>' + seg(k, opts) + "</div>"; }
    var isD = PAGE === "d";

  function boot() {
    if (AD) { AD.init(); AD.ready = true; }
    var p = el("div", "pa-panel" + (s.min === undefined && window.innerWidth < 700 ? " min" : s.min ? " min" : ""));
    if (s.min === undefined && window.innerWidth < 700) s.min = true;
    p.id = "paPanel"; p.setAttribute("role", "region"); p.setAttribute("aria-label", "Dashboard prototype");
    var A1 = !isD, sec = s.open || (s.open = { scene: 1 });
    function S(id, title, body) { return '<section class="pa-sec' + (sec[id] ? " open" : "") + '" data-sec="' + id + '"><button type="button" class="pa-sh" data-sec-t="' + id + '" aria-expanded="' + !!sec[id] + '">' + title + '</button><div class="pa-sb">' + body + "</div></section>"; }
    var menuOpts = (isD ? [["sign", "Signpost only"], ["bottom", "Bottom bar"]] : [["bottom", "Bottom bar"]]).concat([["left", "Side left"], ["right", "Side right"], ["float", isD ? "On the arrows" : "On the lanterns"], ["arc", isD ? "Arc at the bottom" : "Arc (Astra / tree base)"]]);
    p.innerHTML =
      '<div class="pa-top"><b>Dashboard prototype</b><button type="button" data-min aria-label="Collapse or expand">&#8211;</button></div>' +
      '<div class="pa-body">' +
      '<div class="pa-tools"><button type="button" data-rand>&#127922; Randomize</button><button type="button" data-reset>Reset all</button><button type="button" data-copy>Copy link</button></div>' +
      '<p class="pa-hint">Tap Keep on a choice you like. Randomize leaves it alone. Save A, B, or C stores the whole look.</p>' +
      '<div class="pa-tools pa-slots">' + ["A", "B", "C"].map(function (x) { return '<span><button type="button" data-save="' + x + '">Save ' + x + '</button><button type="button" data-load="' + x + '"' + (localStorage.getItem(KEY + "_slot_" + x) ? "" : " disabled") + '>Load</button></span>'; }).join("") + "</div>" +
      S("scene", "Atmosphere",
        (A1 ? row("Scene", "scene", [["a1", "Lantern Tree"], ["pa", "Plan A Portals"]]) : "") +
        row("Time of day", "tod", isD ? [["sunrise", "Sunrise"], ["cur", "Day"], ["dusk", "Sunset"], ["night", "Night"]] : [["cur", "Now"], ["sunrise", "Sunrise"], ["day", "Day"], ["dusk", "Dusk"], ["night", "Night"]]) +
        (isD ? row("Season", "season", [["summer", "Summer"], ["spring", "Spring"], ["autumn", "Fall"], ["winter", "Winter"]]) : "") +
        row("Weather", "weather", [["none", "Clear"], ["rain", "Rain"], ["leaves", "Leaves"], ["snow", "Snow"]]) +
        row("Magic", "magic", [["live", "As built"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]]) +
        '<p class="pa-hint">Magic builds in the open sky only. 1 is a few lights, 5 adds a slow ribbon.</p>' +
        row("Art brightness", "art", [["dim", "Dim"], ["normal", "Normal"], ["bright", "Bright"]]) +
        row("UI tint", "tint", [["built", "As built"], ["warm", "Warm gold"], ["cool", "Cool blue"], ["forest", "Forest"]]) +
        row("Ambient sound", "sound", [["off", "Off"], ["on", "On"]]) +
        '<div class="pa-row"><small>Volume</small><input type="range" min="1" max="5" step="1" data-range="vol" value="' + s.vol + '" aria-label="Volume"></div>') +
      (isD ? S("chars", "Characters",
        '<div class="pa-tools"><button type="button" data-shuffle>&#128256; Shuffle characters</button><button type="button" data-shufpose>Shuffle + poses</button></div>' +
        SPOT.map(function (p, i) { var n = i + 1;
          return '<div class="pa-row pa-chrow"><small>' + (i + 1) + ". " + SPOTN[i] + '</small><div class="pa-chsel"><select data-ch="' + n + '" aria-label="Character in spot ' + n + '">' +
            CH.map(function (c) { return '<option value="' + c + '">' + CHN[c] + "</option>"; }).join("") + '<option value="none">Empty</option></select>' +
            '<select data-pose="' + n + '" aria-label="Pose in spot ' + n + '"></select>' +
            '<button type="button" class="pa-flip" data-flip="' + n + '" aria-label="Mirror spot ' + n + '" title="Mirror">&#8644;</button></div></div>'; }).join("") +
        row("Speech bubble (Astra)", "bubble", [["off", "Off"], ["on", "Tip on tap"]])) :
      S("astra", "Astra",
        row("Pose", "pose", [["cur", "Current"], ["writing", "Writing"], ["waving", "Waving"], ["reading", "Reading"], ["pointing", "Pointing"], ["books", "On books"], ["plana", "Plan A (animated)"]]) +
        row("Spot", "spot", [["cur", "Current spot"], ["left", "Left"], ["near", "Right, under the goal"]]) +
        row("Speech bubble", "bubble", [["off", "Off"], ["on", "Tip on tap"]]))) +
      S("lan", isD ? "Signpost" : "Markers",
        (isD ? row("Sign icons", "signIc", [["none", "None (numbers only)"], ["buddy", "Buddies"], ["symbol", "Symbols"], ["badge", "Badges"], ["tools3d", "3D Writing tools"], ["gems3d", "3D Gems"], ["forest3d", "3D Forest"]])
             : row("Style", "lanShape", [["cur", "As painted"], ["round", "Round"], ["tall", "Tall"], ["star", "Star"], ["flower", "Flower"], ["moroccan", "Moroccan"], ["stars", "Paper stars"], ["crystals", "Crystals"], ["globes", "Globes"], ["houses", "Houses"], ["scrolls", "Scrolls"], ["inkwells", "Inkwells"]])) +
        row("Badges as icons", "badgeIc", [["off", "Off"], ["on", "On"]]) +
        row("Tap effect", "tapfx", [["none", "None"], ["swing", "Swing"], ["glow", "Glow burst"], ["sparkle", "Sparkle"]]) +
        row("Camera zoom on tap", "zoom", [["off", "Off"], ["on", "On"]]) +
        (A1 ? row("Lantern tap", "tap", [["menu", "Bottom menu (current)"], ["portal", "Open portal"]]) + row("Portal style", "pstyle", [["rune", "Gold rune ring"], ["pa", "Plan A portal"]]) + '<div class="pa-worlds" id="paWorlds"><p class="pa-hint">Click a lantern, then pick which world it opens.</p></div>' : "")) +
      S("menu", "Menu",
        row("Placement", "menu", menuOpts) +
        row("Reveal", "reveal", [["always", "Always"], ["handle", "Slide-up handle"], ["tap", "After a tap"]]) +
        (isD ? '<p class="pa-hint">Painted arrows stay as they are; these style the added menu.</p>' : "") +
        row("Shape", "shape", [["cur", "Current"], ["tile", "Tiles"], ["pill", "Pills"], ["plank", "Planks"], ["circle", "Circles"]]) +
        row("Color", "color", [["mod", "Per module"], ["navy", "Navy + edge"], ["gold", "All gold"]]) +
        row("Size", "size", [["s", "S"], ["m", "M"], ["l", "L"]]) +
        row("Finish", "finish", [["frost", "Frosted"], ["solid", "Solid"]]) +
        row("Icon", "icon", [["off", "Hide"], ["on", "Show"]]) +
        row("'Module N' label", "ml", [["off", "Hide"], ["on", "Show"]]) +
        row("Module title", "mt", [["on", "Show"], ["off", "Hide"]]) +
        row(isD ? "Buddy name" : "World name", "nm", [["off", "Hide"], ["on", "Show"]]) +
        row("Border", "border", [["cur", "Current"], ["none", "None"], ["gold", "Gold rim"], ["glow", "Glow"]]) +
        row("Badges in buttons", "badgeIn", [["off", "Off"], ["on", "On (hides badge row)"]])) +
      S("gobtn", isD ? "Let's go button" : "Go button",
        row("Style", "goStyle", [["cur", "Current"], ["wood", "Carved wood"], ["gem", "Gold gem"], ["leather", "Leather tab"], ["lantern", "Lantern"], ["ticket", "Paper ticket"], ["vine", "Leafy vine"], ["compass", "Compass"], ["candy", "Candy 3D"]]) +
        row("Label", "goLbl", [["cur", isD ? "Let's go!" : "Go"], ["start", "Start"], ["begin", "Begin adventure"], ["go", "Go!"]]) +
        row("Position", "goPos", [["cur", "Current"], ["br", "Bottom right"], ["bc", "Bottom center"], ["sign", isD ? "By the signpost" : "By the tree base"]]) +
        row("Motion", "goMo", [["none", "None"], ["bounce", "Gentle bounce"], ["sparkle", "Sparkle"]])) +
      S("goal", "Goal &amp; title",
        row("Goal placement", "goalPos", [["tl", "Top-left"], ["tc", "Top-center"], ["tr", "Top-right"]]) +
        row("Goal style", "goalStyle", [["cur", "Current"], ["wood", "Wood sign"], ["glass", "Frosted"], ["parch", "Parchment"], ["navy", "Navy"]]) +
        row("Goal size", "goalSize", [["compact", "Compact"], ["large", "Large"]]) +
        row("Title", "title", [["on", "Show"], ["off", "Hide"]]) +
        row("Title placement", "titlePos", [["tl", "Top-left"], ["center", "Centered"]]) +
        row("Ribbon banner", "ribbon", [["off", "Off"], ["on", "On"]])) +
      S("prog", "Progress &amp; guidance",
        row("Start here color", "stColor", [["gold", "Gold"], ["white", "White"], ["mod", "Module color"]]) +
        row("Start here shape", "stShape", [["tag", "Tag"], ["arrow", "Arrow"], ["ring", "Glowing ring"]]) +
        row("Start here motion", "stMotion", [["bob", "Bob"], ["pulse", "Pulse"], ["still", "Still"]]) +
        row("Progress by goal", "prog", [["none", "None"], ["bar", "Fill bar"], ["stars", "Six stars"], ["crystals", "Crystals"]]) +
        row("Path trail", "trail", [["off", "Off"], ["on", "On"]]) +
        row("Preview card", "preview", [["off", "Off"], ["on", "On hover / tap"]]) +
        row("Badge placement", "badgePos", [["goal", "Under goal"], ["corner", "Bottom corner"], ["tr", "Top-right"]]) +
        row("Badge size", "badgeSize", [["s", "S"], ["m", "M"], ["l", "L"]]) +
        row("Badge labels", "badgeLbl", [["on", "On"], ["off", "Off"]]) +
        row("Earned look", "earned", [["full", "Full color"], ["ring", "Gold ring"], ["sparkle", "Sparkle"]]) +
        row("Speaker button", "speaker", [["off", "Off (as built)"], ["gold", "Gold"], ["wood", "Wood"], ["icon", "Icon only"]])) +
      '<p class="pa-note">Saved in this browser for this page. Copy link shares the exact combo. ?proto=off hides the panel; ?proto brings it back.</p>' +
      "</div>";
    if (s.min) p.classList.add("min");
    document.body.appendChild(p);
    var CATS = window.ASTRA_WORLD_CATALOG || [];
    function worldByKey(key) {
      for (var g = 0; g < CATS.length; g++) for (var j = 0; j < CATS[g].items.length; j++) if (CATS[g].items[j].key === key) return CATS[g].items[j];
      return null;
    }
    if (A.a1) A.a1.worldByKey = worldByKey;
    function fixGo(i) {
      var btn = document.querySelector("#act .go"), built = (window.A1_WORLDS || [])[i];
      var w = worldByKey((s.lanWorld || {})[i]) || (built && { href: "world.html?w=" + built.id });
      if (btn && w) btn.onclick = function () { location.href = w.href; };
    }
    function showWorldList(i) {
      var box = document.getElementById("paWorlds"); if (!box) return;
      var built = (window.A1_WORLDS || [])[i], cur = (s.lanWorld || {})[i] || (built && ("0:" + built.id));
      var html = '<p class="pa-hint">Lantern ' + (i + 1) + " opens</p>";
      CATS.forEach(function (g) {
        html += '<div class="pa-wgroup"><b>' + g.set + "</b>";
        g.items.forEach(function (w) {
          html += '<button type="button" data-world="' + w.key + '"' + (w.key === cur ? ' class="on"' : "") + '><img alt="" src="' + w.art + '"><span>' + w.name + "</span></button>";
        });
        html += "</div>";
      });
      box.innerHTML = html;
      var onb = box.querySelector("button.on"); if (onb) onb.scrollIntoView({ block: "nearest" });
    }
    if (A.a1) A.a1.onLan = function (i) {
      s.focusLan = i; sec.lan = 1;
      var secEl = p.querySelector('[data-sec="lan"]');
      if (secEl) { secEl.classList.add("open"); var t = secEl.querySelector(".pa-sh"); if (t) t.setAttribute("aria-expanded", "true"); }
      showWorldList(i); fixGo(i); put(s);
    };
    function fix(k) {
      if (PAGE === "d" && s.menu === "sign" && ["shape", "color", "size", "finish", "icon", "ml", "mt", "nm", "border", "badgeIn", "reveal"].indexOf(k) >= 0) s.menu = "float";
      if (s.mt === "off" && s.ml === "off" && s.nm === "off") s.ml = "on";
    }
    function flash(b, txt) { var o = b.textContent; b.textContent = txt; setTimeout(function () { b.textContent = o; }, 1300); }
    p.addEventListener("change", function (e) {
      var sc = e.target.getAttribute("data-ch"), sp = e.target.getAttribute("data-pose");
      if (sc) { dSet(+sc, e.target.value); apply(); } else if (sp) { s["q" + sp] = e.target.value; apply(); }
    });
    p.addEventListener("input", function (e) { var r = e.target.closest("[data-range]"); if (r) { s[r.getAttribute("data-range")] = r.value; apply(); } });
    p.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-min")) { s.min = !s.min; p.classList.toggle("min", s.min); put(s); return; }
      var st = b.getAttribute("data-sec-t");
      if (st) { sec[st] = sec[st] ? 0 : 1; b.parentNode.classList.toggle("open", !!sec[st]); b.setAttribute("aria-expanded", !!sec[st]); put(s); return; }
      if (b.hasAttribute("data-reset")) { KEYS.forEach(function (k) { s[k] = D[k]; }); s.keep = {}; apply(); syncRange(); return; }
      if (b.hasAttribute("data-rand")) {
        var groups = {}; p.querySelectorAll(".pa-seg [data-k]").forEach(function (x) { (groups[x.getAttribute("data-k")] = groups[x.getAttribute("data-k")] || []).push(x.getAttribute("data-v")); });
        Object.keys(groups).forEach(function (k) { if (k === "sound" || (s.keep && s.keep[k])) return; var v = groups[k]; s[k] = v[Math.random() * v.length | 0]; });
        if (isD) dShuffle(true);
        fix("shape"); apply(); return;
      }
      if (b.hasAttribute("data-copy")) {
        var o = {}; KEYS.forEach(function (k) { if (s[k] !== D[k]) o[k] = s[k]; });
        var u = new URL(location.href); u.searchParams.delete("proto"); u.searchParams.set("p", btoa(JSON.stringify(o)));
        (navigator.clipboard ? navigator.clipboard.writeText(u.href) : Promise.reject()).then(function () { flash(b, "Copied!"); }, function () { window.prompt("Copy this link", u.href); });
        return;
      }
      if (b.hasAttribute("data-shuffle") || b.hasAttribute("data-shufpose")) { dShuffle(b.hasAttribute("data-shufpose")); apply(); return; }
      var fp = b.getAttribute("data-flip"); if (fp) { s["f" + fp] = s["f" + fp] === "on" ? "off" : "on"; apply(); return; }
      var sv = b.getAttribute("data-save"), ld = b.getAttribute("data-load");
      if (sv) { var o2 = {}; KEYS.forEach(function (k) { o2[k] = s[k]; }); try { localStorage.setItem(KEY + "_slot_" + sv, JSON.stringify(o2)); } catch (er) {} p.querySelector('[data-load="' + sv + '"]').disabled = false; flash(b, "Saved"); return; }
      if (ld) { try { var o3 = JSON.parse(localStorage.getItem(KEY + "_slot_" + ld)) || {}; KEYS.forEach(function (k) { if (o3[k] !== undefined) s[k] = o3[k]; }); } catch (er) {} apply(); syncRange(); return; }
      var wk = b.getAttribute("data-world");
      if (wk && s.focusLan != null) {
        if (!s.lanWorld) s.lanWorld = {};
        s.lanWorld[s.focusLan] = wk; showWorldList(s.focusLan); fixGo(s.focusLan);
        if (s.tap === "portal" && A.a1) A.a1.portal(s.focusLan);
        put(s); return;
      }
      var kk = b.getAttribute("data-keep");
      if (kk) { if (!s.keep) s.keep = {}; if (s.keep[kk]) delete s.keep[kk]; else s.keep[kk] = 1; apply(); return; }
      var k = b.getAttribute("data-k"); if (!k) return;
      s[k] = b.getAttribute("data-v"); fix(k); apply();
    });
    function syncRange() { var r = p.querySelector("[data-range=vol]"); if (r) r.value = s.vol; }
    X.bind();
    window.addEventListener("resize", function () { AD && AD.layout(); });
    var host = document.getElementById("frame") || document.querySelector(".stage");
    if (host && window.MutationObserver) new MutationObserver(function (m) { if (m.some(function (r) { return [].some.call(r.addedNodes, function (n) { return n.classList && n.classList.contains("intro-replay"); }); })) AD.layout(); }).observe(host, { childList: true });
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.LunaProto = { state: function () { return JSON.parse(JSON.stringify(s)); }, set: function (k, v) { s[k] = v; apply(); }, defaults: D, reset: function () { KEYS.forEach(function (k) { s[k] = D[k]; }); apply(); } };
})();
