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

// ── Toggle a single tag in/out of a text field ────────────────────────────
function toggle(fieldId, tag) {
  const input = $(fieldId);
  if (!input || !tag) return;
  let cur = input.value.split(',').map(s => s.trim()).filter(Boolean);
  cur = cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag];
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
    if (c1 == c2) {
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

// ── Build prompt: join all section text fields in order ───────────────────
function buildPrompt() {
  const c1 = $('char1')?.value || '';
  const c2 = $('char2')?.value || '';

  if (c1 && c2) {
    // Two-character mode: each character's tags clustered behind their gender anchor.
    // Blocks joined with \n — acts as a weak segmentation cue in the attention pass.
    const c1Block = [`${c1} ${val('char1Pos')}`, val('subject'), val('hair'), val('face'), val('skin'), val('feat'), val('outfit')].filter(Boolean).join(', ');
    const c2Block = [`${c2} ${val('char2Pos')}`, val('c2subject'), val('c2hair'), val('c2face'), val('c2skin'), val('c2feat'), val('c2outfit')].filter(Boolean).join(', ');
    const shared  = [val('pose'), val('camera'), val('setting'), val('lighting'), val('style'), val('colour')].filter(Boolean).join(', ');
    return [val('foundation'), val('count'), c1Block, c2Block, shared].filter(Boolean).join('\n');
  }

  // Single character
  return [
    val('foundation'),
    val('count'),
    val('subject'),
    val('hair'),
    val('face'),
    val('skin'),
    val('feat'),
    val('outfit'),
    val('char1Pos'),
    val('pose'),
    val('camera'),
    val('setting'),
    val('lighting'),
    val('style'),
    val('colour'),
  ].filter(Boolean).join(', ');
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
      cb.checked = fieldTags.includes(cb.value);
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
    sel.innerHTML = [
      `<option value="">${placeholder}</option>`,
      ...TAGS.colours.map(c => `<option value="${c}">${c}</option>`)
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
    { id: 'chipsC2Features', tags: TAGS.bodyFeatures,   target: 'c2feat'    },
    { id: 'chipsC2Outfit',   tags: TAGS.outfits,        target: 'c2outfit'  },
    { id: 'chipsSetting',    tags: TAGS.settings,       target: 'setting'   },
    { id: 'chipsStyle',      tags: TAGS.styles,         target: 'style'     },
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

// ── Boot ───────────────────────────────────────────────────────────────────
initColourSelects();
initChips();
initFields();
render();
