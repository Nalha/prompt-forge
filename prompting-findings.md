# Anime Prompt Findings & Conclusions

A working summary of what we figured out about prompting HotBunny's anime image model, including the face-quality investigation and the competition strategy that came out of it.

## The model

HotBunny runs an SDXL-based anime checkpoint, almost certainly from the Illustrious / NoobAI family. The tells: output is native SDXL portrait resolution (832x1216), and it responds to `masterpiece, best quality, very aesthetic` rather than the Pony score-tag system. These checkpoints were trained on tag-labeled anime image boards, so they read comma-separated tags, not sentences.

The mechanism that explains almost everything below: each tag is a learned concept, your prompt steers the model toward the cluster of training images that share those tags, the negative steers it away, and the model blends every tag together weighted by its position in the prompt.

## Prompt structure

Front tags carry the most weight, so order matters. The sequence that works:

quality, character count, subject, appearance, outfit, pose, camera, setting, lighting, style.

If a tag is being ignored, moving it earlier is usually enough to fix it.

## Tag dilution, and the nuance

The model splits its attention across every tag, so a bloated prompt weakens each one. But "fewer tags" is not the rule. The real rule is about whether tags compete:

- Tags pushing the same direction (several lighting tags building one scheme) stack and reinforce. A long prompt describing one coherent image is fine.
- Redundant tags waste a slot without adding information.
- Contradictory tags (two hair colors, `long hair` plus `short hair`) make the model blend or randomize, and actively hurt.

So a 30-tag prompt is fine when all 30 describe one unified image, and bad when they pull in different directions.

## Character count

Stating the count is the single biggest fix for "I asked for two characters and got one." Use `1girl`, `1boy`, `2girls`, or `1boy, 1girl`. Two important details:

- For a single character, `solo` goes in the positive prompt. To force two or more, `solo` goes in the negative.
- When prompting multiple characters, group each character's tags together and give them distinct hair or clothing colors, or traits bleed across them.

## Quality tags

`masterpiece` and `best quality` come from score buckets: training images were tiered by community rating, and the top tiers got these labels. So the tags pull output toward the look of highly-rated art (cleaner linework, better composition), without describing anything specific. `very aesthetic` comes from a separate aesthetic-scoring pass. `detailed face` is the most literal, biasing toward fine facial rendering.

These are the same scale the negative's `worst quality` pushes away from, so positive and negative work as two halves of one axis. The effect is real but moderate, a nudge toward polish, not a switch.

## Negative prompts

Real trained tags work; invented descriptive phrases mostly do not. `worst quality`, `low quality`, `extra digits`, `extra limbs`, `extra arms`, `extra legs` are genuine booru tags with learned visual meaning. `mutated hands`, `poorly drawn hands`, and similar were never training tags, they are SD 1.5-era copy-paste habit, and they do close to nothing on modern anime checkpoints.

Conclusion: a lean baseline beats a bloated list, and padding with synonyms only dilutes weight. A solid baseline:

`worst quality, low quality, lowres, jpeg artifacts, bad anatomy, extra digits, extra limbs, watermark, signature, text`

Add situational tags only when you hit the problem: `solo` (force 2+), `extra arms, extra legs` (tangled close poses), `cropped, out of frame` (cut off), `multiple views, reference sheet` (unwanted grid), `3d, realistic, photorealistic` (force flat 2D), `monochrome, greyscale` (force color), `chibi, child` (force adult proportions).

## Faces, the main investigation

This was the hardest problem and the most important conclusion.

Face quality is primarily a pixel-count problem. When a face is small in the frame it only occupies a few dozen pixels, and no amount of rerolling or detail tags can resolve features that have no pixels to live in. HotBunny has no seed control, no upscaler, and no face-fix pass, so the after-the-fact rescues available in other tools (ADetailer, hi-res fix, inpainting) are off the table.

That leaves two levers, and both matter:

1. Face size in frame. Tighter framing (portrait, upper body) plus a vertical aspect gives the face more pixels. This is the biggest lever, but it costs composition, since fitting a full figure or spread wings forces a wide frame and a small face.

2. Tag weight. Front-loading facial detail tags (`detailed face`, `glowing eyes`, `sharp nose`, `defined lips`) genuinely improves faces. This corrected an earlier assumption that tags could not help at small face sizes. Putting these tags at the front does two things: it sharpens the detail where pixels allow, and it nudges the model to render the face larger and with more care in the first place. The pixel ceiling is real, but it is softer and higher than it first appeared, and prompt weight is a more powerful face lever than expected.

Practical takeaway: front-loaded facial tags are the one face fix that works entirely on-site with no crop and no external tools, and combining them with a tighter frame solves the problem outright.

## Camera and framing

Framing controls face size: portrait gives the sharpest face, then upper body, cowboy shot, full body, and wide shot in descending order of face detail. Angle tags (`from below`, `from above`, `dutch angle`, `from side`) change the camera angle but not the face size, so they do not fix a small face on their own. `from below` is a strong dominance angle, `dutch angle` adds energy, and a tighter crop has the side benefit of pushing the hands out of frame, which removes the most common source of artifacts.

## HotBunny-specific behavior

- The tag buttons insert the correct underlying tag names, which often differ from casual words. For acts and positions, using the buttons is more reliable than typing, because a casual typed term can miss while the button hits.
- The force-nudity toggle overrides clothing tags. For a specific outfit or partial-clothing look, turn it off and tag the clothing yourself.
- No seed means no clean testing. You cannot isolate a single tag's effect, because every generation reshuffles. Batch comparison (several images each way) only reveals strong effects; subtle ones get lost in the randomness, so they are not worth chasing on this site.

## Competition strategy

Well-rendered character art is common, so a polished figure standing in the frame is beatable. The leading entries we looked at shared the same weaknesses: flat or muddy lighting, static centered poses, shallow backgrounds, and in one case weapons awkwardly cropped at the edges. They were winning on polish and appeal, not on composition.

The way to beat them is to bring what they lack:

- Dramatic single-source lighting with deep shadow (chiaroscuro). This is the largest jump in perceived quality.
- A sense of moment or motion instead of a static pose (windswept hair, a flowing cape, wings mid-spread).
- Depth and scale (layered foreground and a towering setting).
- A memorable silhouette, the thing a judge registers before any detail.
- A tight, intentional color palette rather than a scattered one.
- Flawless polish through hard culling: on a seedless site, generate many and keep only the one with clean hands, an intact silhouette, and a sharp face.

Differentiating the subject also helps. In a field of armored warrior women, a succubus dark-queen reads as medieval but stands apart.

## The winning recipe

The image that came together combined all of the above:

- A tighter, upper-body hero shot rather than a full-body wide frame, so the face had pixels.
- Front-loaded facial detail tags for a sharp face.
- A cohesive crimson, gold, and black palette.
- Dramatic light (single shaft, god rays, rim light, chiaroscuro) with floating embers.
- A low or dutch angle for dominance and energy.
- Hands out of frame, removing the last artifact risk.

The trade was epic full-body scale for a sharp, commanding face, which is the right call for a competition where judges look closely. Sharp and tightly composed beats large and soft.
