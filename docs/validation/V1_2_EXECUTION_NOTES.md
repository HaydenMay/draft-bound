# v1.2 implementation decisions and review record

Base: `edef1ccdc8b1061c5453c3420a4e5b1b66be904d`, existing task-owned `feat/prospect-broadcast` checkout. The prior paused presentation work was retained and included in verification and whole-branch review.

## Rulings made during execution

1. Reuse the existing feature checkout rather than create another checkout omitting unpublished work. Cost if wrong: the retained presentation draft needs broader review; that review is part of this release.
2. Full means eight manual assignments from offered players with the same three shared rerolls, rather than an unrestricted catalog picker. Cost if wrong: revise the choice rule/UI after playtesting; no player records need recalculation.
3. Implement all five proposed palettes with locally selected readable light counterparts. Cost if wrong: cosmetic palette refinement; no gameplay migration.
4. Use native Windows commands and a durable ledger in place of Unix workflow helper scripts. Cost if wrong: bookkeeping discrepancies; explicit test output and commits provide the record.
5. Move mastery bands relative to the player's own ceiling, retaining the exact original bands at 99. The original design requires mathematical 99 reachability. Cost if wrong: further paired tuning under a new profile; old active runs remain isolated.
6. Work on independent theme/branding/setup tasks while the paired progression audit runs, without claiming calibration before results. Cost if wrong: integration rework, checked by the complete browser journeys.
7. Calibrate recruiting thresholds to 77 / 81 / 84 / 87 while preserving the user-selected potential-heavy blend (implemented as 75/25). The original bands put most unoptimized builds at four stars. Cost if wrong: adjust informational bands; they do not affect rolls, growth or outcomes. The catalog's narrow range remains visible rather than forcing a synthetic one-star quota.

## Verification before final review

- Unit suite: 73/73 passed; 10 files.
- Type check passed.
- GitHub Pages production build passed; initial bundle 494.77 kB raw, 118.00 kB estimated transfer.
- Chromium journeys: 18/18 passed.
- Paired report: 1,000 builds, 3,000 matched school/profile career pairs; zero ceiling/regression violations.
- Coaching report: 1,000 careers; zero elite-hands JUGS, capped skills or within-year repeat violations.
- Visual inspection: five palette home captures, mobile settings/setup, recruiting and broadcast screens, plus 900×1350 exported PNG. DB letters, accent arrow and clearance render in browser and PNG.

Within-offer uniqueness, Full creation/save, versioned growth, palette validation, recruit thresholds and new draft catalog metadata were observed failing before their implementations and then passing. Additional regression coverage verifies the 99 witness under both growth profiles, old missing-profile behavior, complete Full journey, ten appearance/palette contrast combinations and PNG brand colors.

## Review outcome

Fresh whole-branch review completed against `edef1cc..a7d36b6`. No critical or minor findings. One important finding: import preview accepted malformed `lastBlock.games[].events`, allowing a checked backup to crash the broadcast. Fixed with a shared game-record validator used by both history and last-block records. The test observed acceptance before the fix and rejects missing/null/null-member/invalid events and incomplete score/highlight/opponent records afterward, while a valid saved broadcast round-trips.

A separate keyboard check reproduced focus loss after changing a palette because the checked radio was briefly disabled while persisting. The regression test failed before the fix and passes afterward: the selected radio retains focus while other choices wait for persistence, allowing successive arrow-key choices.

After the fix pass: 74/74 unit tests, typecheck, 19/19 browser cases and the Pages build passed. The reviewer independently ran typecheck and reproduced the malformed-backup bug; the executor ran the complete post-fix suites. No second reviewer was dispatched.

The reviewer set aside five areas, all explicitly ruled on: (1) broad source-pool/selection balance and return-versus-declare incentives remain planned long-term; cost is continued generous optimized builds; (2) scene uniqueness/masking/appearances stay deferred to tentative v1.5; cost is existing shared art; (3) additional positions and school/HOF redesign stay outside scope; cost is the existing WR-only experience; (4) keyboard palette behavior is fixed as above; (5) stale planning-only status is corrected to point to current implementation decisions. None is silently treated as completed future functionality.

The first fresh-review attempt and an extra browser check were interrupted by an account usage-limit failure. Work resumed when the user requested continuation; the successful review and checks above supersede that failed attempt.

## Explicit remaining scope

Broader pool quality/selection balance and return-versus-declare incentives remain long-term planning. Existing scene-art duplication, jersey masks and modular faces remain deferred to tentative v1.5. Other playable positions remain out of scope. Hall of Fame rules are unchanged.

## Release preparation

A production smoke check served the built output under the real `/draft-bound/` prefix. App startup, images/fonts, approved brand fetching and PNG export passed without browser errors or failed resource requests.

Publication follows the user’s standing request to implement the game in its public GitHub repository and host it on GitHub Pages, followed by their requests to implement v1.2 and continue. No additional publication-confirmation menu was introduced. Cost if that interpretation is wrong: an unwanted public release; the prior deployed commit is retained in Git and can be restored with a normal revert.
