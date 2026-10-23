# Colors and position expansion

## Interface theme

`src/colors.css` is the source of truth for application colors. It is imported once at the top of `src/styles.css`. The project uses native CSS custom properties, so no Sass dependency or extra compilation step is needed.

- `:root` defines the light interface palette; `:root[data-theme='dark']` overrides its semantic variables.
- Optional `data-palette` selects forest, copper, navy, charcoal or teal. Each has light/dark tokens in the same file; `data-theme` remains independent. IDs and display names live in `src/app/data/palettes.ts`, without color literals.
- Shared tokens cover shadows, overlays, field markings, and finish previews (`--swatch-*`).
- Printed collectible palettes (`--print-*`) and PNG export palettes (`--export-*`) stay independent of the interface theme.
- `--icon-asset-ink` supplies the generated standalone SVG assets; regenerate them with `npm run icons` after editing that token. Production builds do this automatically.

Layouts and components consume `var(--token)` rather than literal colors. `src/theme.css` contains only appearance-control layout. Browser APIs that need resolved color strings, such as canvas export and the browser theme-color metadata, use `readColor` in `src/app/shared/colors.ts`. Change the corresponding palette token rather than adding color literals to TypeScript. The static pre-application theme-color fallback in `src/index.html` and original artwork assets retain their own metadata/art colors.

For example, edit `--orange` / `--orange-hover` in each theme to change primary actions, or `--print-paper` to change the printed collectible background. Light and dark palettes use the same layout.

Appearance is **System / Light / Dark**, under Saves & settings. System is the default and responds to device preference changes. The setting is included in saved backups. A small local-storage cache applies it before Angular starts to avoid a bright initial page. Older schema-1 saves without the optional theme field remain compatible and use System.

Color theme is a separate saved radio choice: Original forest (default), Midnight copper, Navy & gold, Charcoal & orange and Deep teal & cream. Missing legacy palette fields use forest; unknown imported IDs are rejected. The pre-paint cache uses the same ID allowlist. Inline two-tone icons use `currentColor` plus `--icon-accent`, with a single contextual color on primary buttons. Brand arrows use `--brand-accent`; printed brands use the saved college primary color. Standalone favicon colors are self-contained and follow device light/dark, independently of the selected app palette.

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
