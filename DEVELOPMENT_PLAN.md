# Dungeon Run Development Plan

Last updated: August 4, 2026  
Production: [https://mguhlin.github.io/dungeonrun/](https://mguhlin.github.io/dungeonrun/)  
Repository: [https://github.com/mguhlin/dungeonrun](https://github.com/mguhlin/dungeonrun)

## Current Status

Dungeon Run is a deployed, playable browser-game foundation with a complete twenty-level campaign outline and a functional real-time combat loop. Levels share the same core procedural gameplay system while their stories, environments, objectives, creature names, mechanics, colors, and bosses are defined separately in campaign data.

The current release is best described as a polished systems prototype and campaign framework. It proves the main loop, establishes the visual identity, and supports expansion without requiring a rewrite of the underlying game.

## Completed

### Foundation and deployment

- Phaser 3, TypeScript, Vite, and Vitest project
- Responsive desktop and mobile-landscape canvas
- GitHub repository and automated GitHub Pages deployment
- Production build and campaign-data tests in the deployment workflow
- Versioned local checkpoint-save format with three slots

### Story and campaign

- Original Underworks setting and sarcastic Ledger narrator
- Bud, Erin, and Gin as selectable protagonists with distinct statistics and signature abilities
- Twenty named levels with individual stories, environments, objectives, pressures, creatures, and bosses
- Four-page Field Guide showing the full campaign roster before play
- Illustrated opening story, level introductions, rest-area scenes, and three ending choices

### Gameplay

- Keyboard, mouse, and touch controls
- Real-time movement, aiming, attacks, dodging, stamina, hero skills, damage, and revival
- Visible ATTACK, DODGE, SKILL, and DOG controls on desktop and mobile
- Health, stamina, and Moxie status bars
- Experience, ranks, attribute points, loot, achievements, and boss progression
- Moxie companion AI with following, attacking, commands, bonding, and one revival per sector
- Dense connected room-and-corridor layouts with cover walls and doorway gaps
- Wall-aware minimap with player, Moxie, enemy, and boss markers
- Rest areas, bathrooms, environmental signs, checkpoint saves, and sarcastic commentary

### Art and presentation

- Original graphic-novel title artwork
- Canonical selection portraits for Bud, Erin, and Gin
- Player-supplied painted white-poodle portrait used for Moxie during gameplay
- Generated fierce-creature and boss gameplay medallions
- Optimized browser-ready image sizes with original source art preserved
- Character-selection layout corrected to avoid portrait/name and text/card overlap

### Recent reliability fixes

- Replaced the unreliable Level One “Enter Sector” container control with a direct fixed-camera hit target
- Replaced game-over Retry and Save controls with direct fixed-camera hit targets
- Added Enter, R, and Escape keyboard fallbacks for critical modal actions
- Explicitly sized generated sprites so enemies and Moxie do not render at source-image dimensions
- Replaced the protagonist’s colored gameplay ball with the selected hero portrait
- Prevented clicks on action controls from also firing attacks into the dungeon

## Known Limitations

- Common enemies currently share one creature medallion, and bosses share one boss medallion
- Hero gameplay pieces use portrait icons rather than animated top-down sprites
- Moxie uses a painted portrait icon rather than an animated top-down poodle sprite
- Level-specific mechanics are described in the campaign data but many still use the shared combat implementation
- Dungeon layouts are denser and connected, but they are generated from one common structural pattern
- Enemy behavior is primarily chase-and-contact combat; boss behavior adds a ranged spread but is not yet unique per boss
- Inventory, equipment, crafting, attribute spending, factions, and branching consequences are represented lightly or reserved for expansion
- Audio, music, captions, and a dedicated audio-settings panel are not yet implemented
- Some older in-game modal screens still use the original reusable container-button helper and should be migrated to the reliable direct-control pattern
- The title artwork depicts the earlier black-poodle concept, while the canonical gameplay Moxie is now the supplied white poodle
- Automated tests validate campaign data but do not yet simulate full scene transitions or combat

## Next Development Priorities

### Priority One: Reliability and usability

1. Replace every remaining in-game modal button with the direct fixed-camera control component
2. Add automated browser tests for New Run, hero selection, Enter Sector, attacks, death, retry, save, continue, level completion, and quit
3. Add a pause menu with resume, controls, settings, save status, and return-to-title confirmation
4. Add input remapping and a persistent control-reference panel
5. Add save validation, backup recovery, slot naming, and explicit overwrite confirmation tests

### Priority Two: Character and creature presentation

1. Create animated top-down sprites for Bud, Erin, Gin, and the white Moxie
2. Generate unique icons or sprites for both creature families on Levels 1–3
3. Generate unique boss art for the Splinter Foreman, Drainback, and Inspector Nine
4. Add health bars and readable attack telegraphs above enemies and bosses
5. Update the title artwork or add a new panel that reflects the canonical white Moxie

### Priority Three: Vertical-slice depth for Levels 1–3

1. **The Fallen Mill:** Add saw blades, conveyors, breakable lumber, a Moxie-rescue objective, and a multi-phase Splinter Foreman fight
2. **Culvert Country:** Add water slowdown, pump controls, ranged pickups, submerged routes, and Drainback ambush behavior
3. **The Safety Department:** Add pressure plates, compliance drones, collectible safety seals, a usable rest terminal, and Inspector Nine inspection phases
4. Give each level a unique handcrafted or seeded layout rather than only changing colors and labels
5. Add optional rooms, lore discoveries, challenge rooms, and level-specific achievements

### Priority Four: Progression systems

1. Build an interactive character sheet for spending attribute points
2. Add inventory slots, equipment comparison, weapon families, rarity, and consumables
3. Implement Moxie’s Guardian, Tracker, and Trickster bond branches
4. Add status effects, resistances, weak points, and enemy-specific loot
5. Add crafting and hero-specific solutions for obstacles and optional encounters

### Priority Five: Campaign expansion

After Levels 1–3 meet the vertical-slice quality bar, expand in validated batches:

- Levels 4–8: poison, roots, rail switches, companion rescue, stealth, conveyors, and machinery
- Levels 9–14: investigation, NPC factions, trade, underwater traversal, moral choices, and persistent relationships
- Levels 15–20: limited vision, faction warfare, gravity changes, hero-specific memory trials, adaptive encounters, and ending consequences

Each batch should include unique maps, enemies, boss patterns, environmental art, dialogue, sound, optional content, balance testing, and browser tests before the next batch begins.

## Recommended Next Release

Target version: `0.2.0 — Fallen Mill Vertical Slice`

Release acceptance criteria:

- Level One has a handcrafted sawmill layout and clear route to the objective
- Bud, Erin, Gin, and Moxie use correctly scaled animated gameplay sprites
- Sawmites and Rafter Bats look and behave differently
- The Splinter Foreman has at least three telegraphed attacks and two phases
- Players can see enemy health, understand how to attack, pause safely, retry, save, quit, and continue
- Attribute points can be spent and persist after reloading
- All critical flows pass automated desktop-browser tests
- Desktop and representative mobile devices maintain a stable frame rate
- Production deployment succeeds without broken assets or stale paths

## Working Notes for Future Sessions

- Campaign content is defined in `src/data.ts`
- Scene and gameplay implementation currently live in `src/main.ts`; split scenes and systems into separate modules before major expansion
- Save behavior lives in `src/save.ts`
- Generated and supplied image provenance is recorded in `ART_ASSET_MANIFEST.md`
- Do not delete the player-supplied original Moxie photograph in `source-art/`
- Preserve the three protagonist identities established by the title art and portrait assets
- Keep the Ledger funny, dry, reactive, and occasionally menacing without allowing commentary to obscure combat controls
- Maintain original lore and visual identity rather than copying protected names, characters, dialogue, or creature designs from other properties
- Every completed change should update this document, pass `npm run build` and `npm test`, and deploy successfully from `main`
