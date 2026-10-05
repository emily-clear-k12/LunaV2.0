/* Version switcher: injects a slim top bar with Plan B / Plan A / Lesson pills.
   Usage: <script src=".../demo/switcher.js" data-page="dashboard|dashboard-a|lesson"></script>
   Links resolve from this script's folder (/demo/), so they work from /dashboard/,
   /dashboard-a/, /demo/ and /demo/lesson/. */
(function () {
  var me = document.currentScript;
  var page = (me && me.dataset.page) || "dashboard";
  var base = new URL("./", (me && me.src) || location.href); // .../demo/
  var links = [
    { id: "dashboard", label: "Dashboard · Plan B", href: new URL("../dashboard/", base).href },
    { id: "dashboard-a", label: "Dashboard · Plan A", href: new URL("../dashboard-a/", base).href },
    { id: "lesson", label: "Lesson", href: new URL("./lesson/", base).href },
  ];
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
