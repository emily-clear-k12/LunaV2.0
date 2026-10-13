/* Version switcher: injects a slim top bar with the five dashboard plans (A–E, in order) plus the Lesson.
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
  var html = '<span class="vs-lbl">View</span><span class="vs-pills">';
  links.forEach(function (l) {
    html += '<a href="' + l.href + '"' + (l.id === page ? ' aria-current="page"' : "") + ">" + l.label + "</a>";
  });
  nav.innerHTML = html + "</span>";
  function mount() { document.body.insertBefore(nav, document.body.firstChild); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
