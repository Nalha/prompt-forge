// tags.js — all tag data for Prompt Forge
// Edit this file to add/remove/reorder any tags. The UI rebuilds automatically.

const TAGS = {

  // ── Skin tones ─────────────────────────────────────────────────────────
  // Combined with " skin" suffix in the colour-push select.
  skinTones: [
    'pale', 'porcelain', 'ivory', 'fair', 'light',
    'peachy', 'beige', 'natural',
    'olive', 'golden', 'honey',
    'tan', 'tanned', 'bronze', 'caramel',
    'brown', 'warm brown', 'dark brown',
    'dark', 'deep', 'ebony',
  ],

  // ── Shared colour list ──────────────────────────────────────────────────
  // Used for hair, eyes, and any future colour selects.
  colours: [
    // reds
    'red', 'crimson', 'blood red', 'dark red', 'rose red', 'scarlet',
    // whites / silvers
    'white', 'pearl white', 'ivory', 'silver', 'platinum', 'ash grey',
    // blacks / greys
    'black', 'jet black', 'dark', 'charcoal grey', 'grey',
    // golds / yellows
    'golden', 'blonde', 'honey blonde', 'amber', 'yellow',
    // blues
    'blue', 'dark blue', 'midnight blue', 'cobalt', 'ice blue', 'royal blue', 'aqua',
    // purples
    'purple', 'dark purple', 'violet', 'lavender', 'amethyst', 'indigo',
    // greens / teals
    'teal', 'dark teal', 'cyan', 'emerald', 'dark green', 'forest green',
    // pinks
    'pink', 'hot pink', 'rose pink', 'sakura pink', 'magenta',
    // browns / naturals
    'brown', 'chestnut', 'auburn', 'copper', 'orange', 'light brown',
    // multicolour
    'rainbow', 'gradient', 'ombre',
  ],

  // ── Hair features (style, length, texture) ──────────────────────────────
  hairFeatures: [
    // length
    'long hair', 'very long hair', 'absurdly long hair', 'medium hair', 'short hair', 'bobcut',
    // updos / tied
    'twintails', 'low twintails', 'short twintails',
    'ponytail', 'high ponytail', 'side ponytail', 'low ponytail',
    'hair bun', 'single hair bun', 'double bun', 'hair up',
    // braids
    'braided hair', 'braided ponytail', 'twin braids', 'side braid', 'crown braid', 'french braid',
    // accessories
    'hair bow', 'hairclip', 'hairband', 'hair ribbon', 'hair ornament', 'hair flower',
    // texture / condition
    'wavy hair', 'curly hair', 'straight hair', 'fluffy hair', 'messy hair', 'disheveled hair',
    // movement
    'windswept hair', 'floating hair', 'flowing hair', 'hair blowing in wind',
    // placement / coverage
    'hair between eyes', 'hair over one eye', 'hair covering face', 'hair across mouth',
    'hair over shoulder', 'sidelocks',
    // special styles
    'ahoge', 'hime cut', 'antenna hair',
    // colour modifiers (patterns, not hue)
    'two-tone hair', 'colored inner hair', 'streaked hair', 'hair highlights', 'gradient hair',
  ],

  // ── Face features: eyes, nose, lips (colour handled by dropdown) ─────────
  faceFeatures: [
    // eyes — expression
    'glowing eyes',
    'piercing gaze', 'sharp eyes', 'intense eyes',
    'half-closed eyes', 'narrowed eyes', 'bedroom eyes', 'sleepy eyes',
    'slit pupils', 'cat eyes', 'snake eyes',
    'empty eyes', 'hollow eyes',
    'heterochromia', 'multicolored eyes',
    'star-shaped pupils', 'heart-shaped pupils', 'white pupils',
    'teary eyes', 'glassy eyes',
    'eyes visible through hair',
    // glasses
    'glasses', 'round eyewear', 'sunglasses', 'eyewear on head',
    // nose
    'sharp nose', 'pointed nose', 'button nose', 'aquiline nose',
    // lips / mouth / teeth
    'parted lips', 'open mouth',
    'pouty lips', 'plump lips', 'thin lips',
    'glossy lips', 'matte lips',
    'dark lips', 'black lips', 'red lips',
    'lipstick',
    'fang', 'skin fang', 'sharp teeth',
    // marks
    'blush', 'freckles', 'mole', 'mole under eye', 'mole under mouth',
    'facial markings', 'tribal markings',
    // general face
    'sharp features', 'soft features',
    'high cheekbones', 'defined jaw',
  ],

  // ── Body features ───────────────────────────────────────────────────────
  bodyFeatures: [
    // horns
    'horns', 'demon horns', 'dragon horns', 'curved horns', 'curled horns', 'ram horns',
    'single horn', 'black horns',
    // halo
    'halo', 'broken halo', 'dark halo',
    // wings
    'large bat wings', 'feathered wings', 'dragon wings', 'insect wings',
    // ears
    'pointy ears', 'elf ears', 'long ears',
    'cat ears', 'fox ears', 'wolf ears', 'dog ears', 'rabbit ears', 'horse ears',
    'animal ear fluff', 'animal ears', 'fake animal ears',
    // tails
    'cat tail', 'fox tail', 'wolf tail', 'dog tail', 'rabbit tail', 'horse tail',
    'demon tail', 'dragon tail', 'multiple tails',
    // jewellery / piercings
    'earrings', 'hoop earrings', 'ear piercing',
    // crown / headgear
    'crown', 'horned crown', 'circlet',
    // extra eyes
    'third eye', 'extra eyes',
    // skin / body
    'runes on skin', 'scales on skin', 'dragon scales', 'fur', 'feathers on body',
    // claws / limbs
    'long claws', 'sharp nails',
    'multiple arms', 'extra limbs',
  ],

  // ── Subject ─────────────────────────────────────────────────────────────
  subjects: [
    // archetypes
    'knight', 'dark knight', 'paladin', 'valkyrie', 'warlord', 'warrior', 'berserker',
    'assassin', 'rogue', 'kunoichi',
    'sorcerer', 'battle mage', 'witch', 'necromancer', 'lich',
    'pirate captain', 'sea witch',
    // divine / dark
    'succubus', 'incubus', 'demon', 'half-demon',
    'angel', 'fallen angel', 'archangel',
    'deity', 'divine being',
    'vampire',
    // supernatural creatures
    'dragon', 'fox', 'wolf', 'cat', 'rabbit',
    'banshee', 'siren', 'harpy', 'lamia',
    // cultural
    'elf', 'dark elf', 'high elf',
    'shrine maiden', 'miko',
  ],

  // ── Outfit ──────────────────────────────────────────────────────────────
  outfits: [
    'ornate black and gold armor', 'plate armor', 'battle-worn armor',
    'crystal armor', 'bone armor', 'form-fitting armor', 'chainmail',
    'flowing red cape', 'tattered black cloak', 'fur-trimmed mantle',
    'gothic gown', 'flowing silk dress', 'torn ceremonial dress',
    'corset', 'leather bodysuit', 'bodysuit',
    'royal robe', 'ceremonial robes', 'open robe', 'tabard',
    'thigh-highs', 'gauntlets', 'shoulder pauldrons',
    'veil', 'circlet', 'tiara',
    'hakama', 'kimono', 'miko outfit',
    'half-plate', 'brigandine', 'scalemail',
  ],

  // ── Setting ─────────────────────────────────────────────────────────────
  settings: [
    'grand dark cathedral', 'gothic castle', 'obsidian palace',
    'throne room', 'grand hall', 'dungeon',
    'stained glass windows', 'vaulted ceiling', 'stone pillars',
    'battlefield', 'blood-soaked battlefield', 'ruined colosseum',
    'enchanted forest', 'dark forest clearing', 'cursed swamp',
    'volcanic ruins', 'hellscape, lava cracks', 'lava cavern',
    'frozen tundra', 'ice palace', 'snow-covered ruins',
    'moonlit rooftop', 'stormy cliffside', 'mountain peak',
    'misty graveyard', 'ancient altar', 'summoning circle',
    'arcane library', 'floating islands', 'astral plane',
    'underwater temple', 'sunken ruins',
    'abandoned city', 'overgrown ruins',
  ],

  // ── Style (rendering / technique) ────────────────────────────────────────
  styles: [
    // source material feel
    'official art', 'anime screencap', 'key visual',
    // camera / lens
    'cinematic', 'depth of field', 'bokeh', 'vignette', 'lens distortion',
    // line / render style
    'no outline', 'no lineart', 'flat color', 'cel shading',
    'heavy linework', 'intricate detail', 'sketch', 'line art',
    'painterly', 'oil painting style', 'watercolor',
    'traditional media', 'digital painting',
    // composition
    'baroque composition', 'double exposure', 'silhouette',
    'high contrast', 'stark contrast', 'ambient occlusion', 'raytracing',
    // mood / genre
    'dark fantasy', 'art nouveau', 'glitch effect', 'spot color',
    // era
    '1980s (style)', '1990s (style)', '2000s (style)', 'retro artstyle',
  ],

  // ── Colour palettes ──────────────────────────────────────────────────────
  colourPalettes: [
    // named combos
    'crimson gold black', 'black and gold', 'crimson and white',
    'purple and gold', 'midnight blue and silver', 'teal and black',
    'amber and shadow', 'violet and crimson', 'emerald and obsidian',
    'blood red and white', 'ivory and black', 'silver and blue',
    'forest green and copper', 'rose gold and black',
    // tone descriptors
    
    'muted palette', 'desaturated', 'high saturation',
    'warm tones', 'cool tones', 'jewel tones', 'earth tones',
    'monochromatic red', 'monochrome',
    // special
    'neon accents', 'pastel palette', 'complementary colors',
    'iridescent', 'glowing colors', 'limited palette',
  ],

};
