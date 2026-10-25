# Receiver curation release validation — October 25, 2026

Implemented the owner's request to do receiver curation and ten-player spotlight boards before the college balance pass. See [selection and frequency audit](RECEIVER_CURATION.md) and [machine-readable grades/counts](RECEIVER_CURATION.json).

- New runs: 32 teams, ten receivers per team, 299 unique profiles. Uniform team-first then uniform receiver, with three shared rerolls preserved.
- Gifts, manual picks and Quick autofill use the curated catalog. Physical-build sources and individual grades are unchanged.
- Old runs retain the original ordered 498-profile catalog, committed rolls, RNG, source assignments and draft content version. Frozen Quick/Full checkpoints replay unchanged; archived draft/card import checks preserve saved outcomes.
- New receiver boards use two columns on phones and five on wider screens without internal scrolling or automatic winner scrolling. Larger archived pools retain manual scrolling.
- Fit checks pass at 320×568, 390×664 and 1280×800. Winning-name hold leaves board/panel/window scroll positions unchanged. The 320px screenshot was visually inspected, including T.J. Houshmandzadeh. These are Chromium viewport checks, not physical iPhone verification.

## Verification

- `npm run test:unit -- --pool=threads --maxWorkers=1 --no-file-parallelism`: **120 passed**, 16 files.
- `npm run typecheck`: **passed**.
- `npm run test:e2e -- --workers=1 --reporter=dot`: **64 passed**, 2.6 minutes.
- `npm run build:pages`: **passed**. Initial bundle 790.77 kB, estimated transfer 152.03 kB; lazy spotlight 10.28 kB. Existing 750 kB warning budget remains exceeded by 40.77 kB.
- `npx tsx tools/audit-receiver-curation.ts`: **20,000** actual engine prospects, **160,000** assignments, all **320** eligible memberships observed (428–560 draws each; expectation 500).
- `git diff --check`: passed.

New cap/version tests failed before implementation; phone/desktop tests initially showed 15 candidates instead of ten. The complete browser suite exposed a branding test's assumption that two current seeded careers always earn a badge. That test now uses the existing frozen legacy collection, its cosmetic profile, and a consistent classic/non-foil finish. It retains the canonical SVG/PNG pixel checks, earned-badge assertion and saved-outcome preservation checks.

Independent code review found no blocking regressions. Its roadmap and archived-completion coverage notes were addressed. Review did not independently verify the provisional roster's real-world affiliations or scouting grades; no new affiliations or grades are asserted by this pass. Broader pre-existing import hardening is outside this change.

Legal checkpoint reviewed against actual services/references; no public copy change required and all existing publication gates remain. No training, starting OVR, college/professional simulation, artwork or playable-position changes were made.
