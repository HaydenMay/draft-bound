# Draftbound

Draftbound is a wide-receiver development and collectible-card browser game. Build a prospect from a natural gift and player-inspired traits, develop through college four-game blocks, and reach draft night. Keep the Draft Edition card or optionally simulate a professional career for a separate Career Edition.

## Play

[Open Draftbound](https://haydenmay.github.io/draft-bound/)

New prospects default to **Full** creation: choose all eight manual potentials in addition to the natural gift. **Quick** remains available with three manual choices and automatic completion of the remaining traits. Only wide receiver is playable; quarterback, running back, and tight end are previews marked as coming soon.

Progress is stored in IndexedDB in this browser on this device. Use **Saves & settings → Export game save** to back up or move a collection. Import previews a replacement and downloads the previous save first. No account, payment or runtime AI service is required. See [v1.3.2 release notes](docs/V1_3_2_RELEASE.md) and the [release validation report](docs/validation/V1_3_2_REPORT.md).

Settings offers 16 interface color palettes. Palette selection is independent from System/Light/Dark appearance. Printed cards and exports retain their own palettes. See [colors and extensibility](docs/COLORS_AND_EXTENSIBILITY.md).

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
npm run balance:paired
```

The production build is static. GitHub Actions verifies tests and publishes `dist/draft-bound/browser` to GitHub Pages. Hash navigation supports refreshes at entry and card screens without server rewrites. The repository name and `build:pages` base path must stay aligned.

## Structure

- `src/app/domain`: saved command transitions, deterministic random streams, development, WR simulation, eligibility and evaluation.
- `src/app/data`: manually authored player profiles, colleges, neutral professional teams, draft board and art catalog.
- `src/app/application`: Angular signals facade and PNG rendering.
- `src/app/persistence`: atomic IndexedDB storage and validated import/export.
- `src/app/shared`: reusable collectible-card display.
- `docs`: design, implementation notes, validation and roadmap.

## Content and legal review

Real receiver names serve as trait inspirations. Grades and physical profiles are illustrative game interpretations, not official ratings or current scouting claims. Colleges, professional team identities, draft order and awards are fictional. The game is independent and has no league, school or player endorsement.

The original scene illustrations were generated for this project and bundled locally. They use shared fictional athletes and fixed uniforms; they are not portraits of the named trait sources. Card frames use the selected college's palette. Team-colored jersey layers and personalized appearances remain shelved for tentative v1.5. See [the roadmap](docs/ROADMAP.md) and [art attribution](public/art/ATTRIBUTION.md).

All game saves remain local. Clearing browser data can remove progress. The app does not include analytics, advertising, account tracking or remote save uploads. Legal pages remain subject to the review and publication requirements in [the legal checkpoint](docs/LEGAL_REVIEW_CHECKPOINT.md); Contact must not be enabled until its delivery service and privacy disclosures are ready.
