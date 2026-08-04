# Art Asset Manifest

## Visual direction

Original graphic-novel 2D illustration with bold ink contours, painterly industrial textures, amber practical light, cool teal dungeon shadows, strong silhouettes, and teen-rated stylized danger. Do not imitate existing franchise covers, characters, logos, or creature designs.

## Generated production asset

### `public/assets/keyart.png`

- **Use:** Title screen, prologue backdrop, and visual style anchor
- **Tool:** Built-in ChatGPT image generation
- **Subjects:** Bud, Erin, Gin, Moxie, the ruined sawmill, and the Underworks
- **Original source:** `/home/mg/.codex/generated_images/019fccca-3c76-7602-b3a1-09e720b1b594/exec-f13733ea-97be-4238-9fbf-fc43fdf3adb9.png`
- **Prompt summary:** Three distinct military-trained sawmill foremen and a full-size standard poodle stand in a ruined mill descending into an original brass-and-stone dungeon; cinematic wide graphic-novel treatment; no embedded text, franchise likenesses, gore, logos, or watermark

### Character-selection portraits

- **Files:** `public/assets/portrait-bud.png`, `portrait-erin.png`, and `portrait-gin.png`
- **Use:** Circular portraits on the Choose the Foreman screen
- **Tool:** Built-in ChatGPT image generation using `keyart.png` as the canonical identity reference
- **Prompt summary:** Match the corresponding left, center, and right protagonist from the key art; preserve face, hair, clothing, lighting, and graphic-novel style; centered head-and-torso crop; simple dungeon background; no text, frames, extra figures, or franchise resemblance

### Gameplay medallions

- **Files:** `public/assets/enemy-icon.png`, `boss-icon.png`, and `moxie-icon.png`
- **Use:** Common-hostile, boss, and companion gameplay sprites
- **Tool:** Built-in ChatGPT image generation using `keyart.png` as the canonical style and Moxie identity reference
- **Prompt summary:** High-contrast icons readable at small size: an original snarling timber-and-iron common creature on crimson, a larger blade-crowned mechanical boss on gold and crimson, and Moxie as the same black standard poodle with red bandana on warm ivory; no words, gore, watermarks, or franchise resemblance
- **Optimization:** Portraits normalized to 512 × 512 and gameplay medallions to 256 × 256 for browser performance

### Player-supplied Moxie photograph

- **Production file:** `public/assets/moxie-photo.png`
- **Original source:** `source-art/moxie-white-poodle-original.png`
- **Use:** Current gameplay sprite for Moxie
- **Treatment:** Center-cropped and reduced to 256 × 256 for browser performance; no generative changes
- **Identity note:** This white standard poodle photograph supersedes the generated black-poodle medallion during gameplay. The generated image remains archived as early concept art.

## Planned generation batches

1. Transparent top-down gameplay poses for each protagonist and Moxie
2. Level 1–3 named common creatures and bosses
3. Modular sawmill, culvert, safety-office, bathroom, rest-area, and sign artwork
4. Level 4–8 environment and creature batch
5. Level 9–14 environment, NPC, and creature batch
6. Level 15–20 environment, antagonist, and ending batch

Wall signs should be generated as blank illustrated plates. The game must render final sign wording as live text for readability and accessibility.
