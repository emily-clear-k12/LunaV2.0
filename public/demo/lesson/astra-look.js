/* Astra look: wires the locked chrome (top bar, sage heading, pouch, reviewer popover)
   around the existing lesson logic. Does not change step wording or scoring. */
(function () {
  const $ = (id) => document.getElementById(id);
  const app = $('app');
  if (!app || !app.classList.contains('astra')) return;

  const body = $('body');
  const foot = $('foot');
  const whereEl = $('where');
  const controls = $('reviewer');
  const revBtn = $('revToggle');
  const headBox = $('headBox');
  let syncing = false;
  let lastSig = '';

  if (controls && revBtn) {
    controls.hidden = true;
    revBtn.setAttribute('aria-expanded', 'false');
    revBtn.onclick = () => {
      const open = controls.hidden;
      controls.hidden = !open;
      revBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    document.addEventListener('pointerdown', (e) => {
      if (controls.hidden) return;
      if (controls.contains(e.target) || revBtn.contains(e.target)) return;
      controls.hidden = true;
      revBtn.setAttribute('aria-expanded', 'false');
    });
  }

  function syncHead() {
    if (!headBox || !body || syncing) return;
    const old = body.querySelector('.head-L');
    let k, p, d;
    if (old) {
      k = old.querySelector('.kind');
      p = old.querySelector('.prompt');
      d = old.querySelector('.dir');
    } else {
      k = body.querySelector(':scope > .kind');
      p = body.querySelector(':scope > .prompt');
      d = body.querySelector(':scope > .dir');
      if (!k) k = body.querySelector('.pageL > .kind');
      if (!p) p = body.querySelector('.pageL > .prompt');
      if (!d) d = body.querySelector('.pageL > .dir');
    }
    if (!(k || p || d)) return; // keep whatever is already in the heading box
    const sig = (k && k.textContent) + '|' + (p && p.textContent) + '|' + (d && d.textContent);
    if (sig === lastSig && !headBox.hidden) return;
    syncing = true;
    headBox.innerHTML =
      (k ? k.outerHTML : '') + (p ? p.outerHTML : '') + (d ? d.outerHTML : '');
    headBox.hidden = false;
    lastSig = sig;
    if (!old) {
      [k, p, d].forEach((n) => n && n.remove());
    }
    syncing = false;
  }

  function parkFeedback() {
    if (!foot || !body || syncing) return;
    body.querySelectorAll('.feedback:not(.inline)').forEach((f) => {
      if (!foot.contains(f)) foot.prepend(f);
    });
  }

  const mo = new MutationObserver(() => {
    syncHead();
    parkFeedback();
  });
  if (body) mo.observe(body, { childList: true, subtree: true });
  if (foot) mo.observe(foot, { childList: true });
  syncHead();
})();

/* Writing tiles: tap anywhere on the tile to write; solid on focus and it stays solid; tick when filled. */
(function () {
  const app = document.getElementById('app');
  if (!app) return;
  app.addEventListener('pointerdown', (e) => {
    const t = e.target.closest('.wtile');
    if (!t) return;
    const ta = t.querySelector('textarea,input');
    if (ta && e.target !== ta) { e.preventDefault(); ta.focus(); }
  });
  app.addEventListener('focusin', (e) => {
    const t = e.target.closest && e.target.closest('.wtile');
    if (t) t.classList.add('solid', 'touched');
  });
  app.addEventListener('input', (e) => {
    const t = e.target.closest && e.target.closest('.wtile');
    if (t) t.classList.toggle('filled', e.target.value.trim().length > 2);
  });
})();
