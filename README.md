# Draft Bound

A wide-receiver development and collectible-card browser game.

Combine real-player trait inspirations, develop a prospect through four-game college blocks, and reach draft night. Save the Draft Edition immediately or simulate an optional professional career for a separate Career Edition. Every finished prospect stays in your binder.

## Play

[Open Draft Bound](https://HaydenMay.github.io/draft-bound/)

Progress saves in this browser on this device. Use **Saves & settings → Export game save** for backups or to move devices. Import previews a replacement and downloads your previous save first. No account, payments, or runtime AI services.

Choose **Saves & settings → Appearance** for System, Light or Dark. Interface themes preserve the printed card palette and exported artwork. See `docs/COLORS_AND_EXTENSIBILITY.md` for team palettes and current position-expansion boundaries.

## Development

Requires Node 24.13.1+ within the Angular 21 supported Node range.

```sh
npm ci
npm start
```

```sh
npm test
npm run typecheck
npx playwright install chromium
npm run test:e2e
npm run build:pages
npm run balance
```

The production build is static. GitHub Actions verifies tests and publishes `dist/draft-bound/browser` to GitHub Pages. Hash navigation supports refreshes at entry and card screens without server rewrites. The repository name and `build:pages` base path must stay aligned.

## Structure

- `src/app/domain`: saved command transitions, deterministic random streams, development, WR simulation, eligibility and evaluation.
- `src/app/data`: manually authored player profiles, colleges, neutral professional teams, draft board and art catalog.
- `src/app/application`: Angular signals facade and PNG rendering.
- `src/app/persistence`: atomic IndexedDB storage and validated import/export.
- `src/app/shared`: reusable collectible-card display.
- `docs`: design, implementation notes, validation and roadmap.

Only WR is playable. Position-specific skills and statistics live behind typed rule boundaries. Completed draft snapshots preserve team identities, school colors, source traits, evidence and versioned outcomes. Optional careers use an independent saved seed.

## Content

Real receiver names serve as trait inspirations. All grades and physical profiles are original, illustrative game interpretations, not official ratings or current scouting claims. Colleges, professional team identities, draft order and awards are fictional game content. This is an independent fan game without league, school or player endorsement.

The original scene illustrations were generated for this project and bundled locally. They use shared fictional athletes and fixed uniforms; they are not portraits of the named trait sources. Card frames use the selected college's palette. Two-color jersey layers are a planned refinement. See `docs/ROADMAP.md` and `public/art/ATTRIBUTION.md`.

All saves remain local. Clearing browser data can remove progress. No analytics, advertising, account tracking or remote save uploads are included.
