'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { catTag, unesc, parseLine, buildPromptFromValues } = require('../lib.js');

// ─────────────────────────────────────────────────────────────────────────────
// catTag
// ─────────────────────────────────────────────────────────────────────────────
describe('catTag', () => {

  describe('returns null for count/meta tags', () => {
    for (const t of ['1girl', '2girls', '1boy', '2boys', '1other', 'solo']) {
      test(t, () => assert.equal(catTag(t), null));
    }
  });

  describe('hair', () => {
    for (const t of [
      'long hair', 'short hair', 'very long hair', 'black hair', 'brown hair',
      'hair bow', 'hair between eyes', 'hair ornament', 'frog hair ornament',
      'hair ribbon', 'hair tubes', 'hair bobbles', 'hair rings', 'hair flower',
      'butterfly hair ornament', 'braided hair', 'twin braids',
      'twintails', 'low twintails', 'ponytail', 'side ponytail', 'high ponytail',
      'double bun', 'single hair bun', 'ahoge', 'hime cut', 'sidelocks',
    ]) {
      test(t, () => assert.equal(catTag(t), 'hair'));
    }
  });

  describe('face', () => {
    for (const t of [
      'red eyes', 'blue eyes', 'glowing eyes', 'multicolored eyes',
      'slit pupils', 'star-shaped pupils',
      'glasses', 'round eyewear', 'eyepatch', 'monocle', 'heterochromia',
    ]) {
      test(t, () => assert.equal(catTag(t), 'face'));
    }
  });

  describe('feat', () => {
    for (const t of [
      'cat ears', 'wolf ears', 'rabbit ears', 'fox ears', 'extra ears',
      'animal ear fluff', 'animal ear piercing',
      'cat tail', 'wolf tail', 'fox tail', 'ghost tail', 'two tails', 'multiple tails', 'tapir tail',
      'dragon horns', 'single horn', 'red horns', 'horn ribbon',
      'wings', 'angel wings', 'demon wings',
      'fangs', 'fang',
      'halo', 'scales', 'antlers', 'fins',
    ]) {
      test(t, () => assert.equal(catTag(t), 'feat'));
    }
  });

  describe('does NOT mis-categorise', () => {
    // ponytail has "tail" but must be hair
    test('ponytail → hair not feat', () => assert.equal(catTag('ponytail'), 'hair'));
    test('low ponytail → hair not feat', () => assert.equal(catTag('low ponytail'), 'hair'));
    // earmuffs has "ear" but is an accessory
    test('earmuffs → other not feat', () => assert.equal(catTag('earmuffs'), 'other'));
    // series / character names
    test('touhou → other', () => assert.equal(catTag('touhou'), 'other'));
    test('hakurei reimu → other', () => assert.equal(catTag('hakurei reimu'), 'other'));
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// unesc
// ─────────────────────────────────────────────────────────────────────────────
describe('unesc', () => {
  test('unescapes \\( and \\)', () => {
    assert.equal(unesc('fate \\(series\\)'), 'fate (series)');
  });
  test('unescapes character variant suffix', () => {
    assert.equal(unesc('konpaku youmu \\(ghost\\)'), 'konpaku youmu (ghost)');
  });
  test('leaves plain strings untouched', () => {
    assert.equal(unesc('touhou'), 'touhou');
  });
  test('leaves normal parens untouched', () => {
    assert.equal(unesc('star-shaped pupils'), 'star-shaped pupils');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// parseLine
// ─────────────────────────────────────────────────────────────────────────────
describe('parseLine', () => {

  test('parses a basic touhou character', () => {
    const r = parseLine('hakurei reimu, touhou, 1girl, brown eyes, red eyes, brown hair, long hair, black hair, hair bow, hair tubes,');
    assert.equal(r.name,   'hakurei reimu');
    assert.equal(r.series, 'touhou');
    assert.deepEqual(r.face, ['brown eyes', 'red eyes']);
    assert.deepEqual(r.hair, ['brown hair', 'long hair', 'black hair', 'hair bow', 'hair tubes']);
    assert.deepEqual(r.feat, []);
    assert.deepEqual(r.other, []);
  });

  test('parses animal features', () => {
    const r = parseLine('reisen udongein inaba, touhou, 1girl, rabbit ears, red eyes, purple hair, long hair, very long hair,');
    assert.deepEqual(r.feat, ['rabbit ears']);
    assert.deepEqual(r.face, ['red eyes']);
    assert.ok(r.hair.includes('purple hair'));
  });

  test('unescapes parens in name and series', () => {
    const r = parseLine('konpaku youmu \\(ghost\\), touhou, 1girl, blue eyes, short hair, white hair,');
    assert.equal(r.name, 'konpaku youmu (ghost)');
  });

  test('returns null for a line with fewer than 2 parts', () => {
    assert.equal(parseLine(''), null);
    assert.equal(parseLine('only one'), null);
  });

  test('skips 1girl / solo tags (not in any bucket)', () => {
    const r = parseLine('cirno, touhou, 1girl, solo, blue eyes, blue hair, short hair, hair bow,');
    assert.deepEqual(r.other, []);  // neither 1girl nor solo land in other
    assert.ok(!r.hair.includes('1girl'));
    assert.ok(!r.hair.includes('solo'));
  });

  test('routes horn_ribbon to feat via horns? match', () => {
    const r = parseLine('ibuki suika, touhou, 1girl, horns, horn ribbon, orange hair, long hair,');
    assert.ok(r.feat.includes('horns'));
    assert.ok(r.feat.includes('horn ribbon'));
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// buildPromptFromValues
// ─────────────────────────────────────────────────────────────────────────────
describe('buildPromptFromValues', () => {

  // Helpers
  const base = { char1: 'girl', char2: '', char1Pos: '', char2Pos: '',
    foundation: '', count: '1girl, solo',
    subject: '', hair: '', face: '', skin: '', feat: '', outfit: '',
    c2subject: '', c2hair: '', c2face: '', c2skin: '', c2feat: '', c2outfit: '',
    pose: '', camera: '', setting: '', lighting: '', style: '', colour: '' };
  const v = overrides => ({ ...base, ...overrides });

  describe('single character', () => {

    test('empty form → empty string', () => {
      assert.equal(buildPromptFromValues({ ...base, count: '' }), '');
    });

    test('count only', () => {
      assert.equal(buildPromptFromValues(base), '1girl, solo');
    });

    test('foundation + count', () => {
      assert.equal(
        buildPromptFromValues(v({ foundation: 'masterpiece, best quality', count: '1girl, solo' })),
        'masterpiece, best quality, 1girl, solo'
      );
    });

    test('full single-char prompt assembles in correct order', () => {
      const result = buildPromptFromValues(v({
        foundation: 'masterpiece',
        count:      '1girl, solo',
        subject:    'hakurei reimu, touhou',
        hair:       'brown hair, long hair',
        face:       'red eyes',
        outfit:     'red-white outfit',
        pose:       'looking at viewer',
        setting:    'shrine',
      }));
      assert.equal(result, 'masterpiece, 1girl, solo, hakurei reimu, touhou, brown hair, long hair, red eyes, red-white outfit, looking at viewer, shrine');
    });

    test('trailing commas in field values are stripped', () => {
      const result = buildPromptFromValues(v({ count: '1girl, solo', hair: 'long hair,' }));
      assert.equal(result, '1girl, solo, long hair');
    });

  });

  describe('two characters — same gender (2girls)', () => {
    const twoGirls = v({
      char1: 'girl', char2: 'girl',
      char1Pos: 'on the left', char2Pos: 'on the right',
      foundation: 'masterpiece', count: '2girls',
    });

    test('count is on the foundation line, not a separate block', () => {
      const lines = buildPromptFromValues(twoGirls).split('\n');
      assert.ok(lines[0].includes('2girls'), 'first line should contain 2girls');
      assert.ok(lines[0].includes('masterpiece'), 'first line should contain foundation');
      assert.equal(lines.length, 3); // header + c1 + c2 (no shared, no extra)
    });

    test('character blocks start with position, not "1girl"', () => {
      const lines = buildPromptFromValues(twoGirls).split('\n');
      assert.ok(lines[1].startsWith('on the left'), `line 1: "${lines[1]}"`);
      assert.ok(lines[2].startsWith('on the right'), `line 2: "${lines[2]}"`);
    });

    test('no standalone "1girl" lines', () => {
      const result = buildPromptFromValues(twoGirls);
      const lines = result.split('\n');
      assert.ok(!lines.some(l => l.trim() === '1girl'), 'no standalone 1girl line');
    });

    test('character appearance tags appear in correct blocks', () => {
      const result = buildPromptFromValues({ ...twoGirls,
        subject: 'char1name', hair: 'red hair',
        c2subject: 'char2name', c2hair: 'blue hair',
      });
      const [, l1, l2] = result.split('\n');
      assert.ok(l1.includes('char1name') && l1.includes('red hair'));
      assert.ok(l2.includes('char2name') && l2.includes('blue hair'));
    });

    test('blocks separated by ",\\n"', () => {
      const result = buildPromptFromValues(twoGirls);
      assert.ok(result.includes(',\n'), 'separator should be ,\\n');
      assert.ok(!result.includes('\n\n'), 'no blank lines');
    });

  });

  describe('two characters — mixed gender (1girl + 1boy)', () => {
    const mixed = v({
      char1: 'girl', char2: 'boy',
      char1Pos: 'on the left', char2Pos: 'on the right',
      foundation: 'masterpiece', count: '1girl, 1boy',
    });

    test('no separate count line — count embedded in blocks', () => {
      const lines = buildPromptFromValues(mixed).split('\n');
      assert.ok(!lines.some(l => l.trim() === '1girl, 1boy'), 'no standalone count line');
    });

    test('first block starts with 1girl', () => {
      const [l1] = buildPromptFromValues(mixed).split('\n');
      // l1 is foundation only; l2 is c1Block
      const lines = buildPromptFromValues(mixed).split('\n');
      assert.ok(lines[1].startsWith('1girl'), `c1 block: "${lines[1]}"`);
    });

    test('second block starts with 1boy', () => {
      const lines = buildPromptFromValues(mixed).split('\n');
      assert.ok(lines[2].startsWith('1boy'), `c2 block: "${lines[2]}"`);
    });

    test('produces 3 lines (foundation + c1 + c2) when no shared tags', () => {
      assert.equal(buildPromptFromValues(mixed).split('\n').length, 3);
    });

    test('shared tags appear as 4th line', () => {
      const result = buildPromptFromValues({ ...mixed, pose: 'looking at viewer', setting: 'park' });
      const lines = result.split('\n');
      assert.equal(lines.length, 4);
      assert.ok(lines[3].includes('looking at viewer'));
      assert.ok(lines[3].includes('park'));
    });

  });

});
