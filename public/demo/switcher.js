/* Version switcher: injects a slim top bar with "Student dashboard" / "Lesson" pills.
   Usage: <script src=".../demo/switcher.js" data-page="dashboard|lesson"></script> placed at the start of <body>.
   Links resolve from this script's folder (/demo/), so they work from /dashboard/, /demo/ and /demo/lesson/.
   "Student dashboard" always opens the Astra dashboard at /dashboard/; "Lesson" opens /demo/lesson/. */
(function () {
  var me = document.currentScript;
  var page = (me && me.dataset.page) || "dashboard";
  var base = new URL("./", (me && me.src) || location.href); // .../demo/
  var links = [
    { id: "dashboard", label: "Student dashboard", href: new URL("../dashboard/", base).href },
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
