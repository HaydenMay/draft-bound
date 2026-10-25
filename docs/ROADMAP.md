# Draft Bound roadmap

## Near-term target: v1.4.3 college development and simulation

The owner requested an early follow-up on October 25 after a junior season included 17 receptions for 490 yards and seven touchdowns in one game, plus another seven-touchdown game. Many attributes were at or close to their ceilings. This is an investigation/planning priority, not an approved set of replacement coefficients or a completed balance fix.

Confirmed current-model issues in `domain/simulation.ts`:

- The long-catch branch sets `startDistance = yards`, guaranteeing a touchdown for that branch. The model produces no non-scoring 50+ yard catches.
- Each target gets an independent field position; routes do not consume a shared drive, field-position, or team passing-opportunity budget. Team points add receiving touchdowns to a separate random 10–31 points.
- Displayed catch difficulty is stored for highlights but is not used in the catch-probability calculation beyond the separate contested/non-contested classification.
- The game-grade formula saturates at 100 frequently for a strong receiver.

Baseline: [V1_4_3_COLLEGE_BASELINE.json](validation/V1_4_3_COLLEGE_BASELINE.json), reproduced by `npx tsx tools/audit-college-baseline.ts` against commit `5a6de44`. A frozen 92.56-OVR synthetic receiver using the photographed current attributes at Openwater averaged 172.665 yards and 1.845 touchdowns across 20,000 games. Seven or more touchdowns occurred in 50 games; 490+ yards in four. All 12,752 catches of at least 50 yards were touchdowns. Perfect grades occurred in 6,357 games. These are controlled model probes, not production telemetry or an exact replay of the owner's save.

The same audit ran 500 real Full-mode builds with documented deterministic gift/attribute choices, no rerolls, balanced training requests (including existing coaching substitutions), and three years at Openwater. Mean OVR progressed 63.012 → 78.831 → 85.462 → 87.811. By junior year 69.089% of attributes were within one point of their ceilings; mean gap was 1.108. Diminishing returns already exist, so review the work budget and its repeated application rather than assuming no slowdown is implemented.

Plan this pass around credible team opportunities and field position, distinct long gains versus touchdowns, opponent/game context, useful grade differentiation, and training choices with meaningful opportunity costs. Measure distributions and extreme tails as well as averages. Preserve four-game college blocks, exceptional achievable performances, deterministic outcomes, existing saved results/cards, and optional automatic pro careers. Exact targets, formulas and any rules/version migration require a separate implementation specification. Do not introduce artificial injuries, negative growth, or playable pro training as an assumed solution.

## Upcoming receiver curation and spotlight fit

The owner approved a curation target of **at most ten eligible receivers per team** on October 25. Use two columns/five rows on phones and five columns/two rows on wider screens, with every candidate visible and no automatic winner scrolling. Review each team's names and individual grades together, retaining a mix of legends, established starters, specialists, and memorable disappointments. Do not fill the pool with stars alone or preserve obscure depth players solely to meet a quota.

This target has not yet replaced the provisional 498-profile catalog. Prepare a Keep/Review/Replace selection before altering eligibility. Preserve archived catalog data and the eligibility/RNG validity of existing active runs when the curated pool is introduced. Retain uniform team-first sampling within the approved pools unless the owner separately changes the weighting rule.

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
