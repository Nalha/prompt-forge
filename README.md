# Prompt Forge

A browser-based booru tag assembler for AI image generation. Fill in what you want, leave the rest — it builds the prompt in the correct tag order.

## Usage

Open `index.html` directly in a browser. No server, build step, or installation required.

## Features

**Forge tab** — guided form covering the standard booru tag categories: quality foundation, character appearance (hair, face, features, outfit), pose, camera, setting, lighting, style, and colour palette. Supports single and dual-character prompts with correct count and positioning tags.

**Characters tab** — searchable browser for named characters. Search by name, series, or any appearance tag. Each result can copy its tags to the clipboard or load them directly into the forge fields.

## File structure

```
index.html          main UI
app.js              forge logic and character browser
lib.js              pure functions (tag categorisation, prompt assembly)
tags.js             tag data used by the forge
style.css           styles
chars.js            pre-processed version loaded as a script tag
data/
  GirlsDannooru100.txt   source character data (one character per line)
tests/
  test.js           Node.js test suite
```

## Tests

Requires Node.js 18 or later.

```
node --test tests/test.js
```

Tests cover tag categorisation, character data parsing, and prompt assembly for all character configurations.

## Data format

`data/GirlsDannooru100.txt` is a plain text file with one character per line:

```
character name, series, tag, tag, tag, …
```

After editing the source file, regenerate `data/chars.js` by running:

```
node -e "
const fs = require('fs');
const text = fs.readFileSync('data/GirlsDannooru100.txt', 'utf8');
fs.writeFileSync('data/chars.js',
  '// Auto-generated — do not edit by hand\nconst CHAR_RAW = ' +
  JSON.stringify(text) + ';\n');
"
```

## Linking

The active tab is reflected in the URL hash (`#forge`, `#chars`), so both tabs are directly linkable and bookmarkable.

## Licence

No licence. Free to use, copy, modify, and rehost without restriction. No credit required.
