// app.js — Prompt Forge logic
// Depends on TAGS (tags.js) being loaded first.

// ── Selectors ──────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const val = id => { const el = $(id); return el ? el.value.trim().replace(/,\s*$/, '') : ''; };

// ── Constants ──────────────────────────────────────────────────────────────
const QUALITY  = 'masterpiece, best quality, very aesthetic, detailed face';
const FACE     = 'glowing eyes, sharp nose, defined lips';
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
  if ($('qFace').checked)    parts.push(FACE);
  if ($('qRes').checked)     parts.push(RES);
  if ($('qNewest').checked)  parts.push(NEWEST);
  $('foundation').value = parts.join(', ');
}

function rebuildCount() {
  const noHumans = $('countNoHumans')?.checked;
  let countStr = '';

  if (noHumans) {
    countStr = 'no humans';
  } else {
    const n = id => parseInt($(`count${id}`)?.dataset.val ?? '0');
    const girls  = n('Girls');
    const boys   = n('Boys');
    const others = n('Others');

    const tag = (count, singular, plural) => {
      if (!count) return '';
      if (count === 1) return singular;
      if (count <= 5)  return `${count}${plural}`;
      return `6+${plural}`;
    };

    const total = girls + boys + others;

    const parts = [
      tag(girls,  '1girl',  'girls'),
      tag(boys,   '1boy',   'boys'),
      tag(others, '1other', 'others'),
    ].filter(Boolean);

    // solo: auto into positive when exactly 1 character, auto into negative when 2+, nowhere when 0
    if (total === 1) parts.push('solo');
    if ($('countSoloFocus')?.checked)  parts.push('solo focus');
    if ($('countMaleFocus')?.checked)  parts.push('male focus');
    if ($('countOtherFocus')?.checked) parts.push('other focus');

    countStr = parts.join(', ');

    // Sync solo in negative field
    const negField = $('negative');
    if (negField) {
      let neg = negField.value.split(',').map(s => s.trim()).filter(Boolean);
      if (total > 1 && !neg.includes('solo')) neg.push('solo');
      else if (total !== 1) neg = neg.filter(t => t !== 'solo'); // remove from neg when 0 or 1
      negField.value = neg.join(', ');
    }
  }

  $('count').value = countStr;
}

// ── Build prompt: join all section text fields in order ───────────────────
function buildPrompt() {
  return [
    val('foundation'),
    val('count'),
    val('subject'),
    val('hair'),
    val('eyes'),
    val('feat'),
    val('outfit'),
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
  const highlighted = p
    .replace(QUALITY, `<span class="q">${QUALITY}</span>`)
    .replace(FACE,    `<span class="q">${FACE}</span>`);
  $('outPrompt').innerHTML = highlighted || '<span style="color:#5e554e">…start filling the form…</span>';
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
    { id: 'chipsSubject',  tags: TAGS.subjects,       target: 'subject' },
    { id: 'chipsHair',     tags: TAGS.hairFeatures,   target: 'hair'    },
    { id: 'chipsEyes',     tags: TAGS.eyeFeatures,    target: 'eyes'    },
    { id: 'chipsFeatures', tags: TAGS.bodyFeatures,   target: 'feat'    },
    { id: 'chipsOutfit',   tags: TAGS.outfits,        target: 'outfit'  },
    { id: 'chipsSetting',  tags: TAGS.settings,       target: 'setting' },
    { id: 'chipsStyle',    tags: TAGS.styles,         target: 'style'   },
    { id: 'chipsColour',   tags: TAGS.colourPalettes, target: 'colour'  },
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

// ── Count buttons ──────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.count-btn');
  if (!btn) return;
  const group = btn.closest('.count-btns');
  if (!group) return;
  group.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  group.dataset.val = btn.dataset.n;
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
  ['subject', 'hair', 'eyes', 'feat', 'outfit', 'pose',
   'camera', 'setting', 'lighting', 'style', 'colour']
    .forEach(id => { const el = $(id); if (el) el.value = ''; });

  // Reset colour-push selects and camera selects
  ['hairColour', 'eyeColour', 'framing', 'angle'].forEach(id => {
    const el = $(id);
    if (el) { el.selectedIndex = 0; el.dataset.prev = ''; }
  });

  // Reset count buttons to girls=1, boys=0, others=0
  [['countGirls', '1'], ['countBoys', '0'], ['countOthers', '0']].forEach(([id, def]) => {
    const group = $(id);
    if (!group) return;
    group.dataset.val = def;
    group.querySelectorAll('.count-btn').forEach(b => b.classList.toggle('active', b.dataset.n === def));
  });

  // Reset count modifiers
  ['countSoloFocus', 'countMaleFocus', 'countOtherFocus', 'countNoHumans']
    .forEach(id => { const el = $(id); if (el) el.checked = false; });

  // Reset foundation checkboxes
  $('qQuality').checked = true;
  $('qFace').checked    = true;
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
