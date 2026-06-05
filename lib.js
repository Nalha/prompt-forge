// lib.js — pure functions with no DOM dependency.
// Loaded as a <script> in the browser (before app.js) and require()'d in tests.

// ── Tag categorization ─────────────────────────────────────────────────────
// Returns 'hair' | 'face' | 'feat' | 'other' | null (skip)
function catTag(t) {
  if (/^\d+(girl|boy|other|girls|boys|others)$/.test(t) || t === 'solo') return null;

  // Hair — checked before tail/ear so ponytail / twintails land here
  if (/\bhair\b/.test(t))                                                              return 'hair';
  if (/\b(twintails?|ponytail|side ponytail|low ponytail|high ponytail|braids?|sidelocks|ahoge|hime cut|antenna hair|ringlets?|bobcut)\b/.test(t)) return 'hair';
  if (/\b(single hair bun|double bun)\b/.test(t))                                     return 'hair';

  // Face
  if (/\beyes?\b/.test(t))                                                             return 'face';
  if (/\bpupils?\b/.test(t))                                                           return 'face';
  if (/\b(eyewear|glasses|goggles|monocle|eyepatch|heterochromia)\b/.test(t))         return 'face';

  // Body / species features
  if (/\bears?\b/.test(t))                                                             return 'feat';
  if (/\btails?\b/.test(t))                                                            return 'feat';
  if (/\bhorns?\b/.test(t))                                                            return 'feat';
  if (/\bwings?\b/.test(t))                                                            return 'feat';
  if (/\bfangs?\b/.test(t))                                                            return 'feat';
  if (/\b(halo|tentacles?|fins?|antlers?|scales|claws?|feathers?|gills?)\b/.test(t)) return 'feat';

  return 'other';
}

// ── Unescape danbooru \( \) → ( ) ─────────────────────────────────────────
function unesc(t) {
  return t.replace(/\\([()])/g, '$1');
}

// ── Parse one line of the character data file ──────────────────────────────
function parseLine(line) {
  const parts = line.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const name   = unesc(parts[0]);
  const series = unesc(parts[1]);
  const tags   = parts.slice(2).map(unesc);
  const hair = [], face = [], feat = [], other = [];
  tags.forEach(t => {
    const c = catTag(t);
    if      (c === 'hair')  hair.push(t);
    else if (c === 'face')  face.push(t);
    else if (c === 'feat')  feat.push(t);
    else if (c === 'other') other.push(t);
  });
  return { name, series, hair, face, feat, other };
}

// ── Build prompt from a plain values object (no DOM reads) ─────────────────
// v mirrors the form fields: char1, char2, char1Pos, char2Pos, foundation,
// count, subject, hair, face, skin, feat, outfit, c2*, pose, camera,
// setting, lighting, style, colour.
function buildPromptFromValues(v) {
  const g = k => (v[k] || '').trim().replace(/,\s*$/, '');
  const c1 = v.char1 || '';
  const c2 = v.char2 || '';

  if (c1 && c2) {
    const shared = [g('pose'), g('camera'), g('setting'), g('lighting'), g('style'), g('colour')].filter(Boolean).join(', ');

    if (c1 === c2) {
      // Same gender: count inline with foundation; blocks have position only.
      const header  = [g('foundation'), g('count')].filter(Boolean).join(', ');
      const c1Block = [g('char1Pos'), g('subject'), g('hair'), g('face'), g('skin'), g('feat'), g('outfit')].filter(Boolean).join(', ');
      const c2Block = [g('char2Pos'), g('c2subject'), g('c2hair'), g('c2face'), g('c2skin'), g('c2feat'), g('c2outfit')].filter(Boolean).join(', ');
      return [header, c1Block, c2Block, shared].filter(Boolean).join(',\n');
    } else {
      // Mixed gender: each block owns its 1x prefix; no separate count line.
      const c1Block = [`1${c1}`, g('char1Pos'), g('subject'), g('hair'), g('face'), g('skin'), g('feat'), g('outfit')].filter(Boolean).join(', ');
      const c2Block = [`1${c2}`, g('char2Pos'), g('c2subject'), g('c2hair'), g('c2face'), g('c2skin'), g('c2feat'), g('c2outfit')].filter(Boolean).join(', ');
      return [g('foundation'), c1Block, c2Block, shared].filter(Boolean).join(',\n');
    }
  }

  // Single character
  return [
    g('foundation'), g('count'), g('subject'), g('hair'), g('face'),
    g('skin'), g('feat'), g('outfit'), g('char1Pos'),
    g('pose'), g('camera'), g('setting'), g('lighting'), g('style'), g('colour'),
  ].filter(Boolean).join(', ');
}

// CommonJS export for tests; in the browser these are plain globals.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { catTag, unesc, parseLine, buildPromptFromValues };
}
