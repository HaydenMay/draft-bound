# Draftbound v1.4 Implementation Report

## Delivered scope

v1.4 makes collection achievements discoverable from My Binder, centralizes their definitions, provides honest progress projections where saved data supports them, explains all six card frames and foil, and links locked finishes to their objectives. A completed Hall of Fame career now grants the additive `Legendary career` collection achievement and Legend frame immediately; older saved HOF careers receive the same collection reward on load/import. Existing career records, scene unlocks, stamps and card customizations remain separate and are not rewritten.

The 90-profile WR catalog now has a separately versioned v1.4 source set with targeted Hall of Fame signature grades and a documented rubric. Runs without the new catalog marker continue using the frozen legacy catalog, including pending offers and accepted grades. Newly created drafts store `professionalRulesVersion: "v1.4"`; unmarked old drafts use the frozen legacy simulator, while previously simulated careers remain saved snapshots.

The new professional simulator uses deterministic `nflSeed` output, production variation, career length, role/opportunity and aging to create a wider range of outcomes. All-Pro and Hall of Fame requirements are stored in each career record. In the matched 500-player Full/best/year-three cohort, the observed induction rate fell from 72.0% under the legacy simulator to 5.6% under v1.4, with the same v1.4-generated drafts and NFL seeds. The older historical 83.9% result is preserved in the original v1.3.2 paired report and is not overwritten by this comparison.

Gameplay explanations now separate current skill, trait ceiling, natural gift, school coaching focus, weighted overall, Quick autofill and post-draft career simulation. Existing gameplay mechanics, themes, legal gates, fictional teams, WR-only playable scope and art remain unchanged.

## Verification

- `npm run typecheck` — pass.
- `npm test` — 91 tests passed across 13 files.
- `PLAYWRIGHT_PORT=4327 npx playwright test --workers=4` — 44 Chromium tests passed. The alternate port avoids an unrelated local service bound to 4200. Mobile viewport behavior, responsive layouts, theme contrast, route refresh, storage preservation, and achievements are covered in Playwright. Physical iOS/Safari device testing was not performed.
- `npm run build:pages` — pass; 428.49 kB raw JavaScript and 156.71 kB raw CSS (133.06 kB estimated total transfer), built with `/draft-bound/` base path.
- `npm run balance` — pass; 10,000 prospects, mean starting OVR 61.58, mean final OVR 88.05, mean growth 26.48, median 88, p10 84, p90 92, first-round 50.47%, undrafted 0, ceiling violations 0.
- `npm run balance:paired` — pass; 1,000 generated prospects, 3,000 matched school/profile career pairs, zero progression violations. Its generated legacy reports were restored afterward so the archived historical v1.2 / v1.3.2 evidence remains frozen.
- `npx tsx tools/v1.4-pro-balance.ts` — pass; eight matched cohorts of 500 each, deterministic seeds 10000–10499, full source selection, ceiling and professional-outcome distributions in [V1_4_PROFESSIONAL_BALANCE.md](./V1_4_PROFESSIONAL_BALANCE.md) and [v1.4-professional-balance.json](./v1.4-professional-balance.json).

The first full Playwright run had one mobile section-anchor failure after reload. It passed three isolated repeat runs and passed in the final full 44-test run with four workers; no product-code change was made for that non-reproducible result.

## Compatibility and release boundary

Frozen v1.3.2 career outputs and balance reports are retained in [v1.4-baseline](./v1.4-baseline/). `V1_4_COMPATIBILITY_REPORT.md` summarizes save/catalog/pro-simulator dispatch; `V1_4_SOURCE_AUDIT.md` documents the WR interpretation and evidence.

This handoff stops at v1.4. It does not implement v1.4.1 recruiting, college development redesign, extra playable positions, real-world teams, v1.5 artwork, contact delivery, accounts, cloud saves or backend services. The architecture/legal checkpoint for later work is limited to [V1_4_FORWARD_ARCHITECTURE.md](./V1_4_FORWARD_ARCHITECTURE.md); those features remain deferred.

## Publication

This document describes local verification. GitHub publication and the Pages deployment result are recorded only after the commit is pushed and the hosted workflow/status is verified.
