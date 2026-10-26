# v1.4.5 Colleges and draft report

## Delivered behavior

Fifteen original fictional programs cover five prestige levels. New prospects receive up to six stable offers; initial assessment preserves the existing 75% natural-potential / 25% starting-ability recruit score. Transfer assessment uses 65% current OVR, 25% latest season grade, 10% natural potential and a two-point latest-season All-American bonus, with 73/77/81/85 thresholds for two through five-star interest. Staying remains available even when current interest falls. Offer ordering consumes no game RNG and cannot be refreshed by reloading.

Specialties support trainable ceilings of 75, 80, 85, 90 and 99. Higher natural ceilings stay available. Growth still requires practice and game experience under the unchanged v1.4.4 budget, mastery and school-continuity rules. A transfer preserves earned ability but does not permanently retain the departed school's unused growth opportunity. Source grades and trait assignments remain immutable.

New prospects carry collegeSystemVersion=v1.4.5; existing runs retain their three-school choices and natural-cap development. New snapshots preserve this marker. Import validation checks sequential attended schools and matching transfer records before accepting above-natural ability. Schema remains 1.

Declaring or finishing junior year creates the existing deterministic draft result and automatic career directly. The report explains 70% unrounded college OVR + 20% college performance + 10% scouting-profile mean. Strengths/development areas are relative trait groupings, not extra rolls or drills. The report stays in the saved college journey. Legacy gauntlet-phase saves can continue through a clearly named report button; their results are not regenerated.

## Measured cohort

Run: npx tsx tools/audit-v1.4.5-colleges.ts. Seeds 2200001–2200100, Quick and Full, identical creation policy and builds across versions, no rerolls. 200 distinct builds reused for 400 scenario careers / 14,400 games. All 4,000 block-review/final-report save checks passed. These are synthetic cases, not independent player telemetry.

| Mode | v1.4.4 mean final OVR | v1.4.5 mean final OVR | v1.4.5 displayed 90+ | v1.4.5 displayed 99 |
| --- | ---: | ---: | ---: | ---: |
| Quick | 85.853 | 85.908 | 2% | 0% |
| Full | 86.104 | 86.130 | 3% | 0% |

The older policy stays at Openwater; the new policy chooses the highest-prestige offered school (alphabetic tie). Policies differ, so this is a comparison of these journeys, not an isolated coefficient experiment. About 8–8.9% of final attribute values exceeded their original natural ceiling under school support. Elite school access remains rare in this cohort; this does not estimate every strategy or the frequency of a maximally optimized 99 build. The conditional all-S development witness remains an existing separate mathematical check. Full data: [audit JSON](v1.4.5-college-audit.json).

## Validation and review

- 156 unit tests passed, including new offers, development, transfer preservation, source immutability, snapshot idempotence and save rejection tests.
- TypeScript typecheck and GitHub Pages production build passed.
- Initial browser pass: 67/68; the changed Full-creation test read its card count before async navigation rendered. It now waits for the first visible card. A subsequent run exposed a pre-existing storage-helper failure: its synchronous IndexedDB DataCloneError (out of memory while transporting a 1,000-card fixture) left a pending promise. The helper now transports JSON strings, reducing protocol object overhead, and rejects request/clone/transaction errors explicitly. A synthetic clone-error regression failed before the fix and passed afterward. All 15 targeted storage/theme cases passed; the final whole-suite result is recorded below. A separate Windows screenshot file-open error did not reproduce in that targeted run.
- New browser tests cover offers and no horizontal overflow at 390px, direct declaration/report, reload and access from the saved college journey. Existing browser cases cover legacy gauntlet saves, backups, collection capacity, themes, reduced motion, keyboard controls and the full career/card flow.
- Fresh gpt-6-astra whole-change review: no Critical, Important or Minor findings. No review fix pass was needed.
- Legal release checkpoint reviewed; fictional schools and local saves add no services or tracking. Publication gates and draft notices remain.
- Build: 807.11 kB initial / estimated 156.85 kB transfer. Existing 750 kB warning remains (57.11 kB over); build succeeds.

Review rulings: browser evidence is Chromium emulation, not physical Safari testing; device-specific behavior remains unverified. Save checks cover explicit malformed cases and generated round trips, not exhaustive fuzzing; untested malformed combinations remain possible.

Screenshots: [mobile offers](screenshots/v145-offers-mobile.png), [draft report](screenshots/v145-draft-report.png). Card cosmetics, autographs, additional playable positions and artwork changes remain outside this release.

Final verification: 69/69 browser tests passed in 2.3 minutes, including the new clone-error regression and the complete large-binder cases. 156/156 unit tests, typecheck, Pages build and deterministic audit passed.
