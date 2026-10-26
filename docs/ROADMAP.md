# Draft Bound roadmap

## Current pass: receiver curation and spotlight fit

The owner moved receiver curation and spotlight fit ahead of the college balance pass on October 25. New prospects use explicit ten-player team pools with recognizable names, specialists and memorable disappointments. The original 498-profile snapshot remains archived for existing runs. All player grades remain unchanged pending the separate grading/balance review.

Fresh spotlight receiver boards show two columns/five rows on phones and five columns/two rows on wider screens, with no automatic winner scrolling. Existing runs keep their original candidate pools and may scroll those larger boards manually. Uniform team-first sampling remains unchanged. See the [design](superpowers/specs/2026-10-25-receiver-curation-design.md) and [team-by-team selection and frequency audit](validation/RECEIVER_CURATION.md).

## Next planned pass: v1.4.3 college development and simulation

The owner requested an early follow-up on October 25 after a junior season included 17 receptions for 490 yards and seven touchdowns in one game, plus another seven-touchdown game. Many attributes were at or close to their ceilings. This is an investigation/planning priority, not an approved set of replacement coefficients or a completed balance fix.

Training diagnostics and quantified proposals are now in the [v1.4.3 training review](validation/V1_4_3_TRAINING_REVIEW.md), following the owner's [planning-only brief](superpowers/specs/2026-10-25-v1.4.3-training-owner-brief.md). The refined [numerical specification](superpowers/specs/2026-10-25-v1.4.3-training-numerical-spec.md) proposes 58–73 non-gift starts, eight practice work units, and annual school-history continuity applied once alongside revised year factors. The owner approved these numbers and the transfer table on October25. Implementation is complete; see the [release verification](validation/V1_4_3_TRAINING_RELEASE.md). A conditional all-S development fixture now reaches displayed99, but no end-to-end generated99 career or rarity has been established. New prospects use the approved model; existing runs retain their original numerical rules. These audits use curated receiver pools; the older 498-profile baseline below remains historical evidence.

Confirmed current-model issues in `domain/simulation.ts`:

- The long-catch branch sets `startDistance = yards`, guaranteeing a touchdown for that branch. The model produces no non-scoring 50+ yard catches.
- Each target gets an independent field position; routes do not consume a shared drive, field-position, or team passing-opportunity budget. Team points add receiving touchdowns to a separate random 10–31 points.
- Displayed catch difficulty is stored for highlights but is not used in the catch-probability calculation beyond the separate contested/non-contested classification.
- The game-grade formula saturates at 100 frequently for a strong receiver.

Baseline: [V1_4_3_COLLEGE_BASELINE.json](validation/V1_4_3_COLLEGE_BASELINE.json), reproduced by `npx tsx tools/audit-college-baseline.ts` against commit `5a6de44`. A frozen 92.56-OVR synthetic receiver using the photographed current attributes at Openwater averaged 172.665 yards and 1.845 touchdowns across 20,000 games. Seven or more touchdowns occurred in 50 games; 490+ yards in four. All 12,752 catches of at least 50 yards were touchdowns. Perfect grades occurred in 6,357 games. These are controlled model probes, not production telemetry or an exact replay of the owner's save.

The same audit ran 500 real Full-mode builds with documented deterministic gift/attribute choices, no rerolls, balanced training requests (including existing coaching substitutions), and three years at Openwater. Mean OVR progressed 63.012 → 78.831 → 85.462 → 87.811. By junior year 69.089% of attributes were within one point of their ceilings; mean gap was 1.108. Diminishing returns already exist, so review the work budget and its repeated application rather than assuming no slowdown is implemented.

Plan this pass around credible team opportunities and field position, distinct long gains versus touchdowns, opponent/game context, useful grade differentiation, and training choices with meaningful opportunity costs. Measure distributions and extreme tails as well as averages. Preserve four-game college blocks, exceptional achievable performances, deterministic outcomes, existing saved results/cards, and optional automatic pro careers. Exact targets, formulas and any rules/version migration require a separate implementation specification. Do not introduce artificial injuries, negative growth, or playable pro training as an assumed solution.

### Owner-confirmed training direction — October 25, 2026

These requirements are agreed direction for the balance pass, recorded without changing gameplay:

1. Raise starting OVR so prospects begin college more capable. The exact starting range remains to be set.
2. Slow freshman development; early training currently produces excessive growth. A stronger starting prospect must not simply reach the same ceiling sooner.
3. Give training meaningful opportunity costs: concentrating on one attribute leaves less development available for others.
4. Keep potential ceilings important. High potential is an upper limit, not an automatic grant of current ability or a guaranteed outcome.
5. Make school specialties improve development opportunities, while requiring the player to train to realize those benefits.
6. Account for training continuity and reduced effectiveness when changing training priorities. Preserve the discussed 100% / 95% / 90% sequence as a proposal; the owner's October25 planning brief explicitly requires its meaning, application intervals and switching coefficients to be confirmed before implementation.

The refined numerical proposal interprets the earlier 100/95/90 table as annual school-history continuity, following `superpowers/specs/2026-10-23-v1.4-preserved.md`. Training-priority switching remains a separate design question; this pass proposes no switching penalty. Do not silently reuse transfer penalties for training changes or multiply new annual factors by the old year factors. This numerical scope is approved and implemented for new v1.4.3 runs.

## Long-term prospect variety and balance

The user clarified that this is broader than Andre Johnson: the source pool is dominated by good receivers, and selecting a source's strongest skill amplifies elite ceilings. Plan the pool and potential-selection rules together, including Quick versus Full, rather than fixing a few individual grades or adding arbitrary rarity weights. v1.4.2 introduces a provisional 498-profile, team-first receiver pool and changes the manual selection interaction; this does not constitute final long-term rarity/balance tuning. See `superpowers/specs/2026-10-23-long-term-prospect-variety.md`, the matched progression audit in `validation/V1_2_PAIRED_REPORT.md`, and the v1.4.2 sample in `validation/V1_4_2_RECEIVER_SELECTION_REPORT.md`.

College return-versus-declare incentives also remain a design question: an extra college year still provides growth, and the optional professional career is automatic. Do not pretend playable pro-development time is an existing opportunity cost.

## Collectible artwork deferred to tentative v1.5

Scene uniqueness, aligned primary/secondary fabric masks and modular player appearance are shelved. Do not generate or integrate new scene art as part of v1.2. Approved interface icons and logo assets are separate from that future artwork scope.

## Team-colored uniforms

The user confirmed this long-term artwork direction on October 23, 2026: collectible-card jerseys should support a primary and secondary color, matching the selected college or professional team.

Future illustrations should separate primary jersey fabric, secondary trim, highlights/shadows, skin, equipment, and background. Apply team palette values to the two fabric layers and preserve shading. Reuse the same composed artwork for the browser card and PNG export. Preserve historical palette values in completed entries. Provide a neutral fallback for teams without a known palette.

Current release: original shared illustrations use fixed orange/navy uniforms. College palettes drive the card frame and accents. Artwork represents an earned scene, rather than an exact portrait, jersey number, or uniform of every prospect.

## Additional positions

Only WR is playable. A future position supplies its own attributes, sources, physical interpretation, simulation, evaluation, awards, professional rules, and card statistics through the position boundary. Shared chronology, saved entries, card editions and cosmetic ownership remain reusable.
