/* Module badges row (SCR … EDITING). <script src="../demo/badges/badges.js" data-mount="#frame" data-mode="abs|flow" data-current="N"></script>
   window.lsBadges.select(i) highlights badge i (0-based; M1=SCR … M6=EDITING). Non-interactive. */
(function () {
  var me = document.currentScript, base = me.src.replace(/badges\.js.*$/, "");
  var B = [["scr", "SCR"], ["ecr", "ECR"], ["stellar", "STELLAR"], ["process", "PROCESS"], ["revision", "REVISION"], ["editing", "EDITING"]];
  var css = ".lsb{display:flex;gap:2px;padding:4px 6px 3px;border-radius:12px;background:rgba(11,29,51,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);" +
    "border:1px solid rgba(255,255,255,.18);pointer-events:none;box-sizing:border-box;width:max-content}" +
    ".lsb.abs{position:absolute;right:12px;top:86px;z-index:5}.lsb.flow{justify-self:start}" +
    ".lsb i{display:flex;flex-direction:column;align-items:center;width:46px;padding:2px 0 3px;border-radius:9px;border:1.5px solid transparent;font-style:normal;transition:background .25s,border-color .25s}" +
    ".lsb img{width:32px;height:32px;object-fit:contain;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45))}" +
    ".lsb b{margin-top:2px;font:800 8.5px/1 var(--ls-sans,'Manrope',sans-serif);letter-spacing:.06em;color:#a9d8f5;padding-bottom:2px;border-bottom:2px solid transparent}" +
    ".lsb i.on{background:rgba(255,255,255,.1);border-color:#e2b04a}.lsb i.on b{color:#f5c542;border-bottom-color:#f5c542}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  function mount() {
    var host = document.querySelector(me.dataset.mount || "#frame"); if (!host) return;
    var row = document.createElement("div"); row.className = "lsb " + (me.dataset.mode || "abs");
    row.setAttribute("role", "img"); row.setAttribute("aria-label", "Module badges: " + B.map(function (b) { return b[1]; }).join(", "));
    row.innerHTML = B.map(function (b) { return '<i><img src="' + base + b[0] + '.png" alt=""/><b>' + b[1] + "</b></i>"; }).join("");
    host.appendChild(row);
    var items = row.children;
    window.lsBadges = { select: function (i) { [].forEach.call(items, function (e, j) { e.classList.toggle("on", j === i); }); } };
    if (me.dataset.current) window.lsBadges.select(+me.dataset.current - 1);
    if (window.__lsBadgePending != null) window.lsBadges.select(window.__lsBadgePending);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
