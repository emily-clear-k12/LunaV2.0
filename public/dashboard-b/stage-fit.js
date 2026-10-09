/* Plan B fixed design stage (see stage-fit.css). Exposes window.StageFit.{scale, frame(), toLocal(x, y)}. */
(function () {
  "use strict";
  var W = 1366, H = 768;
  function frame() {
    var f = document.getElementById("frame");
    if (!f) { f = document.createElement("div"); f.id = "frame"; f.className = "stage-frame"; document.body.appendChild(f); }
    return f;
  }
  function barH() {
    var root = document.documentElement;
    if (!root.classList.contains("vs-on")) return 0;
    var v = parseFloat(getComputedStyle(root).getPropertyValue("--vs-h"));
    return isNaN(v) ? 36 : v;
  }
  var api = { scale: 1, frame: frame, fit: fit, x: 0, y: 0 };
  function fit() {
    if (!document.body) return;
    var f = frame(), b = barH();
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var vh = Math.max(1, window.innerHeight - b);
    var s = Math.min(vw / W, vh / H);
    var x = Math.round((vw - W * s) / 2), y = Math.round(b + (vh - H * s) / 2);
    f.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
    api.scale = s; api.x = x; api.y = y;
  }
  // screen (client) px -> stage px
  api.toLocal = function (cx, cy) { return { x: (cx - api.x) / api.scale, y: (cy - api.y) / api.scale }; };
  window.StageFit = api;
  fit();
  window.addEventListener("resize", fit);
  document.addEventListener("DOMContentLoaded", fit);
  window.addEventListener("load", fit);
})();
