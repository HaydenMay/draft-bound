# v1.4 Compatibility Report

## Preserved data paths

- New runs store `wr-original-illustrations-v1.4-90`; runs without a marker use the frozen `wr-original-illustrations-v1.2-90` definitions. The marker is persisted with unfinished runs and drafts.
- The save validator accepts absent version markers as legacy and validates pending offers against the corresponding catalog. Unsupported explicit catalog or professional-rules versions are rejected rather than silently interpreted as current.
- New v1.4 drafts store `professionalRulesVersion: "v1.4"`. Older drafts with the field absent use the unchanged historical simulator. Already simulated careers remain persisted snapshots; the app does not automatically rerun them.
- The existing 79 baseline unit tests and 41 baseline E2E tests were captured before implementation in `v1.4-baseline/`; new frozen fixtures pin three v1.3.2 professional career outputs. The current suite adds achievement, save/catalog, and route coverage.
- Unknown-position records remain read-only. Existing college growth, recruiting, stored RNG, Quick/Full choices, and theme/legal gates are outside this release's changes.

## Known boundaries

This report verifies deterministic source/save dispatch and frozen professional output fixtures. Playwright browser coverage is reported separately from physical iOS/Safari testing; a passing browser test does not certify behavior on every mobile browser or on a live GitHub Pages deployment.

## Commands and evidence

Results for final `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build:pages`, `npm run balance`, and `npm run balance:paired` are recorded in `V1_4_REPORT.md` after final verification. Seeded v1.4-versus-legacy career outcomes are in `V1_4_PROFESSIONAL_BALANCE.md` and its JSON data.
