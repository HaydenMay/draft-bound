# Colors and position expansion

## Interface theme

`src/theme.css` is the source of truth for interface colors. Semantic variables represent paper/background, text, muted text, surfaces, selection, borders, actions, honors and errors. Light and dark palettes use the same layout. App screen styles consume those variables.

Appearance is **System / Light / Dark**, under Saves & settings. System is the default and responds to device preference changes. The setting is included in saved backups. A small local-storage cache applies it before Angular starts to avoid a bright initial page. Older schema-1 saves without the optional theme field remain compatible and use System.

## Team colors and collectible artwork

- College palettes are `colors: [primary, secondary]` in `src/app/data/colleges.ts`.
- Professional palettes are `primaryColor` and `secondaryColor` in `src/app/data/teams.ts`.
- Completed entries retain school display colors and drafted team identity by value.
- Current card accents use the saved college palette in both editions. Professional team colors are stored, but do not yet replace the college card palette.
- Card paper, earned finishes, scene illustrations and PNG colors stay independent of the interface theme. A dark screen does not invert artwork or alter an exported card.
- Jersey fabric colors remain fixed in the illustrations. The long-term primary/secondary uniform-layer approach is tracked in ROADMAP.md.

## Current expansion effort

| Addition | Relative effort | Main work |
|---|---|---|
| More WR source players | Small | Add an illustrative physical profile and complete nine-grade row; update catalog size validation/tests. |
| Another college or coaching specialty | Small | Add a program palette, specialties, coaching and opportunity; check layout and balance. |
| A new training mode | Medium | Add its allocation rule, controls, validation and tests; preserve the total practice budget. |
| A new position | Medium to large for the first addition | Supply its catalog, skills/OVR weights, simulator, learning mapping, interventions, scouting, draft evaluation, professional stats, awards and art rules; remove remaining WR assumptions from orchestration and display. |

The shared prospect identity, chronology, binder, card view model and saved display records provide reuse. There are typed position boundaries and a definition registry. The current implementation is **not yet a data-only position plug-in system**: creation/development still import the WR definition; several payloads, validators, training assumptions and screen labels assume WR and nine skills. Position-specific rules are currently partly in engine.ts rather than entirely behind PositionRules.

Before implementing the first additional position, extract those assumptions into the position adapter and a shared resolver. Validate the existing WR game unchanged, then add the new position. Adding data alone would produce incorrect simulation, grading and presentation.
