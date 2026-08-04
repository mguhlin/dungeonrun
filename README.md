# Dungeon Run

An original, browser-based LitRPG action game about a backcountry sawmill foreman, a heroic standard poodle, and twenty increasingly dangerous sectors of an impossible underground machine.

**Play the production build:** [mguhlin.github.io/dungeonrun](https://mguhlin.github.io/dungeonrun/)

## Play locally

```bash
npm install
npm run dev
```

Open the local address shown by Vite. Desktop controls are WASD or arrow keys to move, pointer or Space to attack, Shift to dodge, E for the hero skill, and Q to command Moxie. Touch controls appear automatically on mobile devices; landscape orientation is required.

## Included

- Bud, Erin, and Gin as mechanically distinct selectable protagonists
- Moxie as an active AI companion with combat and revival behavior
- Twenty story-driven levels with original environments, creatures, bosses, and objectives
- Real-time combat, minimap, health and stamina bars, loot, ranks, achievements, rest areas, bathroom humor, checkpoint saving, and three endings
- Responsive desktop and mobile presentation
- Original generated graphic-novel key art with code-generated fallback game textures

## Production status

This build provides the full playable campaign framework and a polished systems prototype. The twenty sectors are data-driven and playable, while future releases will deepen the first three levels into a complete vertical slice before expanding unique mechanics across the remaining campaign.

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for completed milestones, known limitations, current priorities, and the next planned release.

Run `npm test` for campaign-data validation and `npm run build` for a production build.
