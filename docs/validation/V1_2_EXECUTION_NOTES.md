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
- GitHub Pages production build passed; initial bundle 494.43 kB raw, 117.83 kB estimated transfer.
- Chromium journeys: 18/18 passed.
- Paired report: 1,000 builds, 3,000 matched school/profile career pairs; zero ceiling/regression violations.
- Coaching report: 1,000 careers; zero elite-hands JUGS, capped skills or within-year repeat violations.
- Visual inspection: five palette home captures, mobile settings/setup, recruiting and broadcast screens, plus 900×1350 exported PNG. DB letters, accent arrow and clearance render in browser and PNG.

Within-offer uniqueness, Full creation/save, versioned growth, palette validation, recruit thresholds and new draft catalog metadata were observed failing before their implementations and then passing. Additional regression coverage verifies the 99 witness under both growth profiles, old missing-profile behavior, complete Full journey, ten appearance/palette contrast combinations and PNG brand colors.

## Review outcome

Fresh whole-branch review pending. No final release claim or publication yet.

## Explicit remaining scope

Broader pool quality/selection balance and return-versus-declare incentives remain long-term planning. Existing scene-art duplication, jersey masks and modular faces remain deferred to tentative v1.5. Other playable positions remain out of scope. Hall of Fame rules are unchanged.
