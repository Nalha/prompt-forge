// tags.js — all tag data for Prompt Forge
// Edit this file to add/remove/reorder any tags. The UI rebuilds automatically.

const TAGS = {

  // ── Shared colour list ─────────────────────────────────────────────────
  // Used for hair, eyes, and any future colour selects.
  colours: [
    // reds
    "red", "crimson", "blood red", "dark red", "rose red", "scarlet",
    // whites / silvers
    "white", "pearl white", "ivory", "silver", "platinum", "ash grey",
    // blacks / greys
    "black", "jet black", "dark", "charcoal grey", "grey",
    // golds / yellows
    "golden", "blonde", "honey blonde", "amber", "yellow",
    // blues
    "blue", "dark blue", "midnight blue", "cobalt", "ice blue", "royal blue",
    // purples
    "purple", "dark purple", "violet", "lavender", "amethyst", "indigo",
    // greens / teals
    "teal", "dark teal", "cyan", "aqua", "emerald", "dark green", "forest green",
    // pinks
    "pink", "hot pink", "rose pink", "sakura pink", "magenta",
    // browns / naturals
    "brown", "chestnut", "auburn", "copper", "orange",
    // multicolour
    "rainbow", "gradient", "ombre",
  ],

  // ── Hair features (style, length, texture) ────────────────────────────
  hairFeatures: [
    // length
    "long hair", "very long hair", "absurdly long hair", "medium hair", "short hair", "bobcut",
    // updos / tied
    "twin tails", "ponytail", "high ponytail", "side ponytail", "hair bun", "double bun", "hair up",
    // braids
    "braided hair", "twin braids", "side braid", "crown braid", "french braid",
    // texture / condition
    "wavy hair", "curly hair", "straight hair", "fluffy hair", "messy hair", "disheveled hair",
    // movement
    "windswept hair", "floating hair", "flowing hair", "hair blowing in wind",
    // partial coverage
    "hair over one eye", "hair covering face", "hair across mouth",
    // special
    "ahoge", "hime cut", "hair ornament", "hair ribbon", "hair flower",
    // colour modifiers (patterns, not hue)
    "two-tone hair", "streaked hair", "hair highlights", "gradient hair",
  ],

  // ── Face features: eyes, nose, lips (colour is the dropdown) ─────────
  faceFeatures: [
    // eyes
    "glowing eyes",
    "piercing gaze", "sharp eyes", "intense eyes",
    "half-closed eyes", "narrowed eyes", "bedroom eyes", "sleepy eyes",
    "slit pupils", "cat eyes", "snake eyes",
    "empty eyes", "hollow eyes",
    "heterochromia", "multicolored eyes",
    "star-shaped pupils", "heart-shaped pupils",
    "teary eyes", "glassy eyes",
    // nose
    "sharp nose", "pointed nose", "button nose", "aquiline nose",
    // lips / mouth
    "parted lips", "open mouth",
    "pouty lips", "plump lips", "thin lips",
    "glossy lips", "matte lips",
    "dark lips", "black lips", "red lips",
    "lipstick",
    // general face
    "blush", "freckles",
    "sharp features", "soft features",
    "high cheekbones", "defined jaw",
  ],

  // ── Body features (section 03 — chip buttons, target: feat field) ────
  bodyFeatures: [
    "demon horns", "curved horns", "ram horns",
    "halo", "broken halo", "dark halo",
    "large bat wings", "feathered wings", "dragon wings", "insect wings",
    "fangs", "sharp teeth",
    "pointed ears", "elf ears", "long ears",
    "demon tail", "dragon tail", "fox tail", "multiple tails",
    "wolf ears", "fox ears", "cat ears", "rabbit ears",
    "crown", "horned crown", "circlet",
    "third eye", "extra eyes",
    "facial markings", "tribal markings", "runes on skin",
    "long claws", "sharp nails",
    "scales on skin", "dragon scales",
    "fur", "feathers on body",
    "multiple arms", "extra limbs",
  ],

  // ── Subject ───────────────────────────────────────────────────────────
  subjects: [
    "succubus", "dark queen", "mature female",
    "knight", "dark knight", "paladin", "valkyrie",
    "sorceress", "battle mage", "witch", "necromancer", "lich",
    "vampire", "demon", "demoness", "half-demon",
    "angel", "fallen angel", "archangel",
    "goddess", "divine being",
    "assassin", "kunoichi", "rogue",
    "elf", "dark elf", "high elf",
    "dragon girl", "fox girl", "wolf girl", "cat girl", "rabbit girl",
    "shrine maiden", "miko",
    "warlord", "warrior", "berserker",
    "banshee", "siren", "harpy", "lamia",
    "pirate captain", "sea witch",
  ],

  // ── Outfit ────────────────────────────────────────────────────────────
  outfits: [
    "ornate black and gold armor", "plate armor", "battle-worn armor",
    "crystal armor", "bone armor", "form-fitting armor", "chainmail",
    "flowing red cape", "tattered black cloak", "fur-trimmed mantle",
    "gothic gown", "flowing silk dress", "torn ceremonial dress",
    "corset", "leather bodysuit", "bodysuit",
    "royal robe", "ceremonial robes", "open robe", "tabard",
    "thigh-highs", "gauntlets", "shoulder pauldrons",
    "veil", "circlet", "tiara",
    "hakama", "kimono", "miko outfit",
    "half-plate", "brigandine", "scalemail",
  ],

  // ── Setting ───────────────────────────────────────────────────────────
  settings: [
    "grand dark cathedral", "gothic castle", "obsidian palace",
    "throne room", "grand hall", "dungeon",
    "stained glass windows", "vaulted ceiling", "stone pillars",
    "battlefield", "blood-soaked battlefield", "ruined colosseum",
    "enchanted forest", "dark forest clearing", "cursed swamp",
    "volcanic ruins", "hellscape, lava cracks", "lava cavern",
    "frozen tundra", "ice palace", "snow-covered ruins",
    "moonlit rooftop", "stormy cliffside", "mountain peak",
    "misty graveyard", "ancient altar", "summoning circle",
    "arcane library", "floating islands", "astral plane",
    "underwater temple", "sunken ruins",
    "abandoned city", "overgrown ruins",
  ],

  // ── Style (rendering / technique) ────────────────────────────────────
  styles: [
    // source material feel
    "official art", "anime screencap", "key visual",
    // camera / lens
    "cinematic", "depth of field", "bokeh", "vignette", "lens distortion",
    // line / render style
    "no outline", "no lineart", "flat color", "cel shading",
    "heavy linework", "intricate detail", "sketch", "line art",
    "painterly", "oil painting style", "watercolor",
    "traditional media", "digital painting",
    // composition
    "baroque composition", "double exposure", "silhouette",
    "high contrast", "stark contrast", "ambient occlusion", "raytracing",
    // mood / genre
    "dark fantasy", "art nouveau", "glitch effect", "spot color",
    // era
    "1980s (style)", "1990s (style)", "2000s (style)", "retro artstyle",
  ],

  // ── Colour palettes (overall image palette, not single-element colour) ─
  colourPalettes: [
    // named combos
    "crimson gold black", "black and gold", "crimson and white",
    "purple and gold", "midnight blue and silver", "teal and black",
    "amber and shadow", "violet and crimson", "emerald and obsidian",
    "blood red and white", "ivory and black", "silver and blue",
    "forest green and copper", "rose gold and black",
    // tone descriptors
    "muted palette", "desaturated", "high saturation",
    "warm tones", "cool tones", "jewel tones", "earth tones",
    "monochromatic red", "monochrome",
    // special
    "neon accents", "pastel palette", "complementary colors",
    "iridescent", "glowing colors", "limited palette",
  ],

};
