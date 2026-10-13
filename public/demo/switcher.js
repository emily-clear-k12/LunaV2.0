/* Version switcher: injects a slim top bar with Plan A, A.1–A.3, an "Other ideas" dropdown (Plans B–E) and the Lesson.
   Usage: <script src=".../demo/switcher.js" data-page="dashboard-a|dashboard-b|dashboard-c|dashboard-d|dashboard-e|lesson"></script>
   Links resolve from this script's folder (/demo/), so they work from /dashboard-a/ … /dashboard-e/,
   /demo/ and /demo/lesson/. */
(function () {
  var me = document.currentScript;
  var page = (me && me.dataset.page) || "dashboard-a";
  var base = new URL("./", (me && me.src) || location.href); // .../demo/
  var links = [
    { id: "dashboard-a", label: "Plan A · Portals", href: new URL("../dashboard-a/", base).href },
    { id: "dashboard-a1", label: "Plan A.1 · Lantern Tree", href: new URL("../dashboard-a1/", base).href },
    { id: "dashboard-a2", label: "Plan A.2 · Trunk Doors", href: new URL("../dashboard-a2/", base).href },
    { id: "dashboard-a3", label: "Plan A.3 · Treehouses", href: new URL("../dashboard-a3/", base).href },
    { id: "dashboard-b", label: "Plan B · Crystal Railways", href: new URL("../dashboard-b/", base).href },
    { id: "dashboard-c", label: "Plan C · Pop Up Mounts", href: new URL("../dashboard-c/", base).href },
    { id: "dashboard-d", label: "Plan D · Forest Guides", href: new URL("../dashboard-d/", base).href },
    { id: "dashboard-e", label: "Plan E · Lost Library", href: new URL("../dashboard-e/", base).href },
    { id: "lesson", label: "Lesson", href: new URL("./lesson/", base).href },
  ];
  // Lonestar Writing Studio branding (fonts + chrome), appended last so it wins over page styles.
  var brand = document.createElement("link");
  brand.rel = "stylesheet"; brand.href = new URL("./lonestar-brand.css", base).href;
  (document.head || document.documentElement).appendChild(brand);
  document.documentElement.classList.add("vs-on");
  var nav = document.createElement("nav");
  nav.className = "vswitch";
  nav.setAttribute("aria-label", "Switch view");
  // Tabled plans (B–E) live in one "Other ideas" dropdown; Plan A family + Lesson stay as pills.
  var other = links.filter(function (l) { return /^dashboard-[b-e]$/.test(l.id); });
  var main = links.filter(function (l) { return other.indexOf(l) < 0; });
  var esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var pill = function (l) { return '<a href="' + l.href + '"' + (l.id === page ? ' aria-current="page"' : "") + ">" + esc(l.label) + "</a>"; };
  var onOther = other.some(function (l) { return l.id === page; });
  var html = '<span class="vs-lbl">View</span><span class="vs-pills">';
  main.forEach(function (l) {
    if (l.id === "lesson") {
      html += '<span class="vs-more"><button type="button" class="vs-more-btn" aria-haspopup="true" aria-expanded="false"' + (onOther ? ' aria-current="page"' : "") + '>Other ideas <span aria-hidden="true">▾</span></button>' +
        '<span class="vs-menu" role="menu" hidden>' + other.map(function (o) {
          return '<a role="menuitem" href="' + o.href + '"' + (o.id === page ? ' aria-current="page"' : "") + ">" + esc(o.label) + "</a>"; }).join("") + "</span></span>";
    }
    html += pill(l);
  });
  nav.innerHTML = html + "</span>";
  var btn = nav.querySelector(".vs-more-btn"), menu = nav.querySelector(".vs-menu"), wrap = nav.querySelector(".vs-more");
  function setOpen(open) { menu.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); }
  btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(menu.hidden); });
  menu.addEventListener("click", function () { setOpen(false); });
  document.addEventListener("pointerdown", function (e) { if (!menu.hidden && !wrap.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  // Style for the dropdown (kept here so every page that loads switcher.js gets it).
  var st = document.createElement("style");
  st.textContent =
    ".vswitch .vs-more{position:relative;display:flex;pointer-events:auto}" +
    ".vswitch .vs-more-btn{display:block;padding:5px 11px;border-radius:999px;border:0;background:none;color:#fff;font:inherit;font-weight:700;cursor:pointer;white-space:nowrap;touch-action:manipulation}" +
    ".vswitch .vs-more-btn:hover,.vswitch .vs-more-btn[aria-expanded=true]{background:rgba(255,255,255,.14)}" +
    ".vswitch .vs-more-btn[aria-current=page]{background:#fff;color:#02384d;box-shadow:inset 0 -2px 0 #06aade}" +
    ".vswitch .vs-more-btn:focus-visible{outline:2px solid #06aade;outline-offset:2px}" +
    ".vswitch .vs-menu{position:absolute;top:calc(100% + 6px);right:0;z-index:10001;min-width:220px;display:flex;flex-direction:column;gap:2px;padding:6px;border-radius:14px;" +
    "background:rgba(16,12,38,.94);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid rgba(255,210,122,.32);box-shadow:0 12px 28px -8px rgba(0,0,0,.7);pointer-events:auto}" +
    ".vswitch .vs-menu[hidden]{display:none}" +
    ".vswitch .vs-menu a{border-radius:10px;padding:8px 12px}";
  (document.head || document.documentElement).appendChild(st);
  function mount() { document.body.insertBefore(nav, document.body.firstChild); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
