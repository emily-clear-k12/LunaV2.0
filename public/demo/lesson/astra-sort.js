/* Astra sort engine (from demo/tile-preview): pool of chips + bins as dark tiles; tap or drag.
   mount(root, step, {esc, onCheck(wrong)}) - root holds .pool and .bins; #chk is the Check button. */
window.AstraSort = (function () {
  let cur = null, drag = null;
  function mount(root, D, hooks) {
    const esc = hooks.esc, pool = root.querySelector('.pool'), bins = root.querySelector('.bins');
    const chk = document.getElementById('chk');
    const order = D.items.map((_, i) => i).sort(() => Math.random() - 0.5);
    pool.innerHTML = order.map(i => `<button type="button" class="tile chip" data-i="${i}">${esc(D.items[i][0])}</button>`).join('');
    bins.innerHTML = D.bins.map((b, i) => {
      const m = b.match(/^(MAIN IDEA:|CLAIM:)\s*(.*)$/);
      return `<div class="tile bin" data-b="${i}" tabindex="0" role="button" aria-label="${esc(b)}"><div class="bhead">${m ? `<small>${esc(m[1])}</small><b>${esc(m[2])}</b>` : `<b>${esc(b)}</b>`}</div><div class="drop"></div></div>`;
    }).join('');
    const binEls = [...bins.querySelectorAll('.bin')];
    const S = { root, pool, binEls, sel: null, locked: false, poolLocked: false };
    S.lockPool = () => { if (S.poolLocked || !pool.offsetHeight) return; pool.style.minHeight = pool.offsetHeight + 'px'; S.poolLocked = true; };
    const ready = on => binEls.forEach(b => b.classList.toggle('ready', on));
    const clearTry = () => { const f = document.querySelector('#foot .feedback.try'); if (f) f.remove(); };
    S.select = c => {
      root.querySelectorAll('.chip.sel').forEach(x => x.classList.remove('sel'));
      S.sel = c; if (c) c.classList.add('sel', 'solid'); ready(!!c);
      pool.querySelectorAll('.chip').forEach(x => { if (x !== c) x.classList.remove('solid'); });
    };
    S.place = (c, target) => {
      c.classList.remove('sel', 'right', 'wrong');
      if (target === pool) { pool.appendChild(c); c.classList.remove('solid'); }
      else { target.querySelector('.drop').appendChild(c); target.classList.add('solid'); c.classList.add('solid'); }
      S.sel = null; ready(false);
      const empty = !pool.querySelector('.chip'); pool.classList.toggle('empty', empty); if (empty) pool.style.minHeight = '';
      if (chk) chk.disabled = !empty;
      clearTry();
    };
    S.chipTap = c => {
      if (S.locked) return; const inBin = c.closest('.bin');
      if (S.sel && S.sel !== c && inBin) { S.place(S.sel, inBin); return; }
      if (S.sel === c) { c.classList.remove('sel'); if (!inBin) c.classList.remove('solid'); S.sel = null; ready(false); return; }
      S.select(c);
    };
    binEls.forEach(b => {
      b.addEventListener('click', e => { if (e.target.closest('.chip')) return; if (S.sel) S.place(S.sel, b); });
      b.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && S.sel && !e.target.closest('.chip')) { e.preventDefault(); S.place(S.sel, b); } });
    });
    pool.addEventListener('click', e => { if (!e.target.closest('.chip') && S.sel && S.sel.closest('.bin')) S.place(S.sel, pool); });
    if (chk) chk.onclick = () => {
      let wrong = 0;
      bins.querySelectorAll('.chip').forEach(c => {
        const ok = D.items[+c.dataset.i][1] === +c.closest('.bin').dataset.b;
        c.classList.toggle('right', ok); c.classList.toggle('wrong', !ok); if (!ok) wrong++;
      });
      if (!wrong) {
        S.locked = true; bins.querySelectorAll('.chip').forEach(c => { c.setAttribute('aria-disabled', 'true'); c.tabIndex = -1; });
        chk.remove(); pool.classList.add('done');
      } else {
        chk.disabled = true;
        setTimeout(() => {
          bins.querySelectorAll('.chip.wrong').forEach(c => { pool.appendChild(c); c.classList.remove('solid'); });
          pool.classList.remove('empty'); binEls.forEach(b => { if (!b.querySelector('.chip')) b.classList.remove('solid'); });
          S.poolLocked = false; pool.style.minHeight = ''; requestAnimationFrame(S.lockPool);
        }, 900);
      }
      hooks.onCheck(wrong);
    };
    cur = S; requestAnimationFrame(S.lockPool);
    return S;
  }

  /* pointer drag (mouse, pen, touch on wide screens); a short press without movement is a tap */
  const host = () => document.getElementById('app') || document.body;
  const live = c => cur && cur.root.isConnected && cur.root.contains(c);
  document.addEventListener('pointerdown', e => {
    const c = e.target.closest && e.target.closest('.asort .chip'); if (!c || e.button > 0 || !live(c) || cur.locked) return;
    drag = { S: cur, c, x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, ghost: null, ox: 0, oy: 0 };
  });
  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 7) return;
      if (e.pointerType === 'touch' && innerWidth <= 760) { drag = null; return; }
      drag.moved = true; const r = drag.c.getBoundingClientRect(); drag.ox = drag.x - r.left; drag.oy = drag.y - r.top;
      const g = drag.c.cloneNode(true); g.classList.add('ghost', 'solid'); g.classList.remove('sel', 'right', 'wrong');
      g.style.width = r.width + 'px'; host().appendChild(g); drag.ghost = g;
      drag.c.classList.add('lifting'); drag.S.select(drag.c);
    }
    e.preventDefault(); drag.ghost.style.left = (e.clientX - drag.ox) + 'px'; drag.ghost.style.top = (e.clientY - drag.oy) + 'px';
    const under = document.elementFromPoint(e.clientX, e.clientY), b = under && under.closest('.bin');
    drag.S.binEls.forEach(x => x.classList.toggle('over', x === b));
  });
  function endDrag(e, cancel) {
    if (!drag || e.pointerId !== drag.id) return; const d = drag, S = d.S; drag = null;
    if (!d.moved) { if (!cancel) S.chipTap(d.c); return; }
    d.ghost.remove(); d.c.classList.remove('lifting'); S.binEls.forEach(x => x.classList.remove('over'));
    const under = cancel ? null : document.elementFromPoint(e.clientX, e.clientY);
    const b = under && under.closest('.bin'), p = under && under.closest('.pool');
    if (b && S.binEls.includes(b)) S.place(d.c, b);
    else if (p === S.pool && d.c.closest('.bin')) S.place(d.c, S.pool);
    else S.select(null);
  }
  document.addEventListener('pointerup', e => endDrag(e, false));
  document.addEventListener('pointercancel', e => endDrag(e, true));
  /* chips are buttons: block their native click (taps go through pointerup) but keep keyboard */
  document.addEventListener('click', e => { const c = e.target.closest && e.target.closest('.asort .chip'); if (c && e.detail > 0) e.stopPropagation(); }, true);
  document.addEventListener('keydown', e => {
    const c = e.target.closest && e.target.closest('.asort .chip');
    if (c && live(c) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); cur.chipTap(c); }
  });
  return { mount };
})();
