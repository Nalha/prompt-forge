// app.js — Prompt Forge logic
// Depends on TAGS (tags.js) being loaded first.

// ── Selectors ──────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const val = id => { const el = $(id); return el ? el.value.trim().replace(/,\s*$/, '') : ''; };

// ── Constants ──────────────────────────────────────────────────────────────
const QUALITY  = 'masterpiece, best quality, very aesthetic, detailed face';
const RES      = 'absurdres, highres';
const NEWEST   = 'newest';
const NEG_BASE = 'worst quality, low quality, lowres, jpeg artifacts, bad anatomy, extra digits, extra limbs, watermark, signature, text, oldest, early, displeasing, chromatic aberration, unfinished';

// ── Toggle a tag (or comma-joined multi-tag) in/out of a text field ─────────
function toggle(fieldId, tag) {
  const input = $(fieldId);
  if (!input || !tag) return;
  const parts = tag.split(',').map(s => s.trim()).filter(Boolean);
  let cur = input.value.split(',').map(s => s.trim()).filter(Boolean);
  const allPresent = parts.every(t => cur.includes(t));
  if (allPresent) {
    cur = cur.filter(t => !parts.includes(t));
  } else {
    parts.forEach(t => { if (!cur.includes(t)) cur.push(t); });
  }
  input.value = cur.join(', ');
}

// ── Rebuild section fields from structured controls ────────────────────────

function rebuildFoundation() {
  const parts = [];
  if ($('qQuality').checked) parts.push(QUALITY);
  if ($('qRes').checked)     parts.push(RES);
  if ($('qNewest').checked)  parts.push(NEWEST);
  $('foundation').value = parts.join(', ');
}

function rebuildCount() {
  const c1 = $('char1')?.value || '';
  const c2 = $('char2')?.value || '';

  let countStr = '';

  if (c1 && !c2) {
    countStr = `1${c1}, solo`;
  } else if (!c1 && c2) {
    countStr = `1${c2}, solo`;
  } else if (c1 && c2) {
    if (!$('char1Pos').value) {
      $('char1Pos').value = 'on the left';
      $('char2Pos').value = 'on the right';
    }
    if (c1 === c2) {
      countStr = c1 === 'other' ? '2others' : `2${c1}s`;
    } else {
      countStr = `1${c1}, 1${c2}`;
    }
  }

  $('count').value = countStr;

  // Sync solo in negative field
  const negField = $('negative');
  if (negField) {
    let neg = negField.value.split(',').map(s => s.trim()).filter(Boolean);
    const twoChars = !!(c1 && c2);
    if (twoChars && !neg.includes('solo')) neg.push('solo');
    else if (!twoChars) neg = neg.filter(t => t !== 'solo');
    negField.value = neg.join(', ');
  }

  updateChar2Visibility();
}

function updateChar2Visibility() {
  const c2set = !!($('char2')?.value);
  const block = $('char2AppearanceBlock');
  const label = $('char1AppearanceLabel');
  const addBtn = $('addCharBtn');
  if (block)  block.style.display  = c2set ? '' : 'none';
  if (label)  label.style.display  = c2set ? '' : 'none';
  if (addBtn) addBtn.style.display = c2set ? 'none' : '';
}

// ── Build prompt: collect DOM values → delegate to pure buildPromptFromValues ──
function buildPrompt() {
  return buildPromptFromValues({
    char1: $('char1')?.value || '', char2: $('char2')?.value || '',
    char1Pos: val('char1Pos'),  char2Pos: val('char2Pos'),
    foundation: val('foundation'), count: val('count'),
    subject: val('subject'), hair: val('hair'), face: val('face'),
    skin: val('skin'), feat: val('feat'), outfit: val('outfit'),
    c2subject: val('c2subject'), c2hair: val('c2hair'), c2face: val('c2face'),
    c2skin: val('c2skin'), c2feat: val('c2feat'), c2outfit: val('c2outfit'),
    pose: val('pose'), camera: val('camera'), setting: val('setting'),
    lighting: val('lighting'), style: val('style'), colour: val('colour'),
  });
}

// ── Build negative: just the negative text field ──────────────────────────
function buildNeg() {
  return val('negative');
}

// ── Sync chip active states from their target text fields ─────────────────
function syncChipActive() {
  document.querySelectorAll('.chips[data-target]').forEach(group => {
    const inputEl = $(group.dataset.target);
    if (!inputEl) return;
    const cur = inputEl.value.split(',').map(s => s.trim()).filter(Boolean);
    group.querySelectorAll('.chip').forEach(chip => {
      chip.classList.toggle('active', cur.includes(chip.textContent));
    });
  });
}

// ── Sync checkbox states from their target text fields ────────────────────
// Groups with data-field keep their checkboxes in sync with the field content.
function syncCheckboxes() {
  document.querySelectorAll('[data-field]').forEach(group => {
    const fieldTags = $(group.dataset.field)?.value
      ?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
    group.querySelectorAll('input[type=checkbox]').forEach(cb => {
      const parts = cb.value.split(',').map(s => s.trim()).filter(Boolean);
      cb.checked = parts.every(t => fieldTags.includes(t));
    });
  });
}

// ── Render preview ─────────────────────────────────────────────────────────
function render() {
  const p = buildPrompt();
  $('outPrompt').innerHTML = p || '<span style="color:#5e554e">…start filling the form…</span>';
  $('outNeg').textContent = buildNeg();
  const n = p ? p.split(',').map(s => s.trim()).filter(Boolean).length : 0;
  $('tagCount').textContent = n ? `${n} tags` : '';
  syncChipActive();
  syncCheckboxes();
}

// ── Filter chip panel ──────────────────────────────────────────────────────
function filterChips(searchInput) {
  const chipsEl = $(searchInput.dataset.chips);
  if (!chipsEl) return;
  const noMatch = document.querySelector(`.no-match[data-for="${searchInput.dataset.chips}"]`);
  const q = searchInput.value.toLowerCase().trim();
  let shown = 0;
  chipsEl.querySelectorAll('.chip').forEach(c => {
    const vis = !q || c.textContent.toLowerCase().includes(q);
    c.classList.toggle('hidden', !vis);
    if (vis) shown++;
  });
  if (noMatch) noMatch.style.display = (!q || shown) ? 'none' : '';
}

// ── Init: populate colour selects ─────────────────────────────────────────
function initColourSelects() {
  document.querySelectorAll('.colour-select').forEach(sel => {
    const placeholder = sel.dataset.placeholder || '— add colour —';
    const list = sel.dataset.list === 'skin' ? TAGS.skinTones : TAGS.colours;
    sel.innerHTML = [
      `<option value="">${placeholder}</option>`,
      ...list.map(c => `<option value="${c}">${c}</option>`)
    ].join('');
  });
}

// ── Init: populate chip containers ────────────────────────────────────────
function initChips() {
  const defs = [
    { id: 'chipsSubject',    tags: TAGS.subjects,       target: 'subject'   },
    { id: 'chipsHair',       tags: TAGS.hairFeatures,   target: 'hair'      },
    { id: 'chipsFace',       tags: TAGS.faceFeatures,   target: 'face'      },
    { id: 'chipsFeatures',   tags: TAGS.bodyFeatures,   target: 'feat'      },
    { id: 'chipsOutfit',     tags: TAGS.outfits,        target: 'outfit'    },
    { id: 'chipsC2Subject',  tags: TAGS.subjects,       target: 'c2subject' },
    { id: 'chipsC2Hair',     tags: TAGS.hairFeatures,   target: 'c2hair'    },
    { id: 'chipsC2Face',     tags: TAGS.faceFeatures,   target: 'c2face'    },
    { id: 'chipsC2Features', tags: TAGS.bodyFeatures,   target: 'c2feat'    },
    { id: 'chipsC2Outfit',   tags: TAGS.outfits,        target: 'c2outfit'  },
    { id: 'chipsSetting',    tags: TAGS.settings,       target: 'setting'   },
    { id: 'chipsColour',     tags: TAGS.colourPalettes, target: 'colour'    },
  ];
  defs.forEach(({ id, tags, target }) => {
    const el = $(id);
    if (!el) return;
    el.dataset.target = target;
    el.innerHTML = tags.map(t => `<span class="chip">${t}</span>`).join('');
  });
}

// ── Init: pre-populate section text fields ─────────────────────────────────
function initFields() {
  rebuildFoundation();
  rebuildCount();
  $('negative').value = NEG_BASE;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

// ── Character selects ──────────────────────────────────────────────────────
document.addEventListener('change', e => {
  if (!e.target.matches('#char1, #char2')) return;
  rebuildCount();
  render();
});

// ── Add / Remove character ─────────────────────────────────────────────────
$('addCharBtn').addEventListener('click', () => {
  const c2el = $('char2');
  if (c2el) c2el.value = 'girl';
  rebuildCount();
  render();
});

document.addEventListener('click', e => {
  if (e.target.id !== 'removeCharBtn') return;
  const c2el = $('char2');
  if (c2el) c2el.value = '';
  ['c2subject', 'c2hair', 'c2face', 'c2skin', 'c2feat', 'c2outfit']
    .forEach(id => { const el = $(id); if (el) el.value = ''; });
  ['c2hairColour', 'c2faceColour', 'c2skinColour', 'char2Pos']
    .forEach(id => { const el = $(id); if (el) el.selectedIndex = 0; });
  rebuildCount();
  render();
});

// ── Chip panel toggle ──────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.chip-toggle');
  if (!btn) return;
  e.stopPropagation();
  const panel = $(btn.dataset.panel);
  if (!panel) return;
  const open = panel.classList.toggle('open');
  btn.classList.toggle('open', open);
  if (open) panel.querySelector('.chip-search')?.focus();
});

// ── Chip click: toggle tag into target text field ─────────────────────────
document.addEventListener('click', e => {
  if (!e.target.classList.contains('chip')) return;
  const group = e.target.closest('.chips[data-target]');
  if (!group) return;
  toggle(group.dataset.target, e.target.textContent);
  render();
});

// ── Clear field buttons ────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.clear-field');
  if (!btn) return;
  const el = $(btn.dataset.clear);
  if (el) { el.value = ''; render(); }
});

// ── Colour-push selects: add "{colour} {suffix}" to target field ──────────
document.addEventListener('change', e => {
  if (!e.target.classList.contains('colour-push')) return;
  const colour = e.target.value;
  if (!colour) return;
  toggle(e.target.dataset.target, colour + (e.target.dataset.suffix || ''));
  e.target.selectedIndex = 0;
  render();
});

// ── Camera selects: smart-replace previous value in camera field ──────────
document.addEventListener('change', e => {
  if (!e.target.matches('#framing, #angle')) return;
  const prev = e.target.dataset.prev || '';
  const curr = e.target.value;
  const fieldEl = $('camera');
  if (fieldEl) {
    let cur = fieldEl.value.split(',').map(s => s.trim()).filter(Boolean);
    if (prev) cur = cur.filter(t => t !== prev);
    if (curr) cur.push(curr);
    fieldEl.value = cur.join(', ');
  }
  e.target.dataset.prev = curr;
  render();
});

// ── Checkboxes ────────────────────────────────────────────────────────────
// data-rebuild="foundation"|"count"  → rebuild that section field
// data-field="fieldId"               → toggle cb.value in/out of field
document.addEventListener('change', e => {
  if (e.target.type !== 'checkbox') return;

  const rebuild = e.target.closest('[data-rebuild]')?.dataset.rebuild;
  if (rebuild === 'foundation') { rebuildFoundation(); render(); return; }
  if (rebuild === 'count')      { rebuildCount();      render(); return; }

  const field = e.target.closest('[data-field]')?.dataset.field;
  if (field) { toggle(field, e.target.value); render(); return; }

  render();
});

// ── Chip search filter ─────────────────────────────────────────────────────
document.addEventListener('input', e => {
  if (e.target.classList.contains('chip-search')) filterChips(e.target);
  else render(); // text field edits
});

// ── Reset ──────────────────────────────────────────────────────────────────
$('resetAll').addEventListener('click', () => {
  // Clear all section text fields
  ['subject', 'hair', 'face', 'skin', 'feat', 'outfit',
   'c2subject', 'c2hair', 'c2face', 'c2skin', 'c2feat', 'c2outfit',
   'pose', 'camera', 'setting', 'lighting', 'style', 'colour']
    .forEach(id => { const el = $(id); if (el) el.value = ''; });

  // Reset colour-push selects, position selects, and camera selects
  ['hairColour', 'faceColour', 'skinColour', 'c2hairColour', 'c2faceColour', 'c2skinColour',
   'char1Pos', 'char2Pos', 'framing', 'angle'].forEach(id => {
    const el = $(id);
    if (el) { el.selectedIndex = 0; el.dataset.prev = ''; }
  });

  // Reset character selects
  const c1el = $('char1'); if (c1el) c1el.value = 'girl';
  const c2el = $('char2'); if (c2el) c2el.value = '';

  // Reset foundation checkboxes
  $('qQuality').checked = true;
  $('qRes').checked     = false;
  $('qNewest').checked  = false;

  // Rebuild structured fields and restore negative baseline
  rebuildFoundation();
  rebuildCount();
  $('negative').value = NEG_BASE;

  // Clear chip search and collapse panels
  document.querySelectorAll('.chip-search').forEach(inp => { inp.value = ''; filterChips(inp); });
  document.querySelectorAll('.chip-panel.open').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.chip-toggle.open').forEach(b => b.classList.remove('open'));

  render();
});

// ── Copy ───────────────────────────────────────────────────────────────────
function copy(text, btn, label) {
  const done = () => {
    btn.classList.add('copied'); btn.textContent = 'Copied';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = label; }, 1300);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallback(text, done));
  else fallback(text, done);
}
function fallback(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch(e) {}
  document.body.removeChild(ta);
}
$('copyPrompt').addEventListener('click', e => copy(buildPrompt(), e.target, 'Copy Prompt'));
$('copyNeg').addEventListener('click',    e => copy(buildNeg(),    e.target, 'Copy Negative'));

// Boot — runs after all setup below is complete (see end of file)

// ═══════════════════════════════════════════════════════════════════════════
// CHARACTER BROWSER
// ═══════════════════════════════════════════════════════════════════════════

// ── Tab switching ──────────────────────────────────────────────────────────
(function () {
  const bar = document.querySelector('.bar');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      $('tabForge').style.display = tab === 'forge' ? '' : 'none';
      $('tabChars').style.display = tab === 'chars'  ? '' : 'none';
      if (bar) bar.style.display  = tab === 'forge' ? '' : 'none';
      history.replaceState(null, '', '#' + tab);
      if (tab === 'chars' && charData === null) loadChars();
    });
  });
})();

// ── State ──────────────────────────────────────────────────────────────────
let charData  = null;   // null = not yet fetched
let charQuery = '';
let charShown = 60;
const CHAR_PAGE = 60;

// catTag / unesc / parseLine live in lib.js (loaded before this file).

// ── Parse the pre-loaded character data ───────────────────────────────────
function loadChars() {
  charData = (typeof CHAR_RAW === 'string' ? CHAR_RAW : '')
    .split('\n').map(parseLine).filter(Boolean);
  renderChars();
}

// ── Filter ─────────────────────────────────────────────────────────────────
function getFiltered() {
  if (!charData) return [];
  const q = charQuery.trim().toLowerCase();
  if (!q) return charData;
  return charData.filter(c =>
    c.name.toLowerCase().includes(q)   ||
    c.series.toLowerCase().includes(q) ||
    [...c.hair, ...c.face, ...c.feat, ...c.other].some(t => t.toLowerCase().includes(q))
  );
}

// ── Render grid ────────────────────────────────────────────────────────────
function renderChars() {
  if (!charData) return;
  const filtered = getFiltered();
  const slice    = filtered.slice(0, charShown);

  $('charCount').textContent = filtered.length === charData.length
    ? `${charData.length.toLocaleString()} characters`
    : `${filtered.length.toLocaleString()} / ${charData.length.toLocaleString()}`;

  $('charGrid').innerHTML = slice.length
    ? slice.map(cardHTML).join('')
    : '<div class="char-loading">No matches.</div>';

  const more    = $('charLoadMore');
  const remain  = filtered.length - charShown;
  more.style.display = remain > 0 ? '' : 'none';
  if (remain > 0) more.textContent = `Load ${Math.min(CHAR_PAGE, remain)} more (${remain} remaining)`;
}

// ── Escape value for HTML attribute ───────────────────────────────────────
function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Build one card's HTML ──────────────────────────────────────────────────
function cardHTML(c) {
  const pills = [
    ...c.face.slice(0, 3).map(t => `<span class="ctag face">${t}</span>`),
    ...c.feat.slice(0, 3).map(t => `<span class="ctag feat">${t}</span>`),
    ...c.hair.slice(0, 4).map(t => `<span class="ctag hair">${t}</span>`),
  ].slice(0, 8).join('');

  const allTags   = escAttr([c.name, c.series, ...c.face, ...c.feat, ...c.hair, ...c.other].join(', '));
  const nameField = escAttr([c.name, c.series].join(', '));
  const hairField = escAttr(c.hair.join(', '));
  const faceField = escAttr(c.face.join(', '));
  const featField = escAttr(c.feat.join(', '));

  return `<div class="char-card">
  <div>
    <div class="char-card-name">${c.name}</div>
    <div class="char-card-series">${c.series}</div>
  </div>
  <div class="char-card-tags">${pills}</div>
  <div class="char-card-actions">
    <button class="char-action-btn copy" data-copy="${allTags}">Copy tags</button>
    <button class="char-action-btn load"
      data-name="${nameField}"
      data-hair="${hairField}"
      data-face="${faceField}"
      data-feat="${featField}">Load into Forge →</button>
  </div>
</div>`;
}

// ── Search input ───────────────────────────────────────────────────────────
$('charSearch').addEventListener('input', e => {
  charQuery = e.target.value;
  charShown = CHAR_PAGE;
  renderChars();
});

// ── Load more ──────────────────────────────────────────────────────────────
$('charLoadMore').addEventListener('click', () => {
  charShown += CHAR_PAGE;
  renderChars();
});

// ── Card buttons ───────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const copyBtn = e.target.closest('.char-action-btn.copy');
  if (copyBtn) { copy(copyBtn.dataset.copy, copyBtn, 'Copy tags'); return; }

  const loadBtn = e.target.closest('.char-action-btn.load');
  if (loadBtn) {
    if ($('subject')) $('subject').value = loadBtn.dataset.name || '';
    if ($('hair'))    $('hair').value    = loadBtn.dataset.hair || '';
    if ($('face'))    $('face').value    = loadBtn.dataset.face || '';
    if ($('feat'))    $('feat').value    = loadBtn.dataset.feat || '';
    document.querySelector('.tab-btn[data-tab="forge"]')?.click();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ── Boot (must be last — tab listeners must be registered before hash check) ──
initColourSelects();
initChips();
initFields();
render();
if (window.location.hash === '#chars') {
  document.querySelector('.tab-btn[data-tab="chars"]')?.click();
}
