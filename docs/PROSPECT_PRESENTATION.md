# Recruiting, reveals, broadcasts and coaching

This revision implements the user's October 23, 2026 feedback. Schools, their modifiers, uniform trait-source sampling and four-game practice budgets are unchanged. The user confirmed a potential-heavy recruit assessment and distinct artwork per named scene, then took ownership of image generation.

## Recruiting assessment

`src/app/domain/recruiting.ts` computes 75% position-weighted potential OVR + 25% position-weighted **initial** ability. Ratings use the original skill sheet, so college training never changes recruitment history. Stars provide information only; no recruiting bonuses, altered offers, growth modifiers or roll advantages.

| Recruit score | Stars |
|---|---:|
| Below 74 | 1 |
| 74 to below 78 | 2 |
| 78 to below 82 | 3 |
| 82 to below 86 | 4 |
| 86+ | 5 |

The blend was user-confirmed; its exact percentages and fixed bands are implementation defaults, not official recruiting grades. The badge appears after the five automatic potentials and before initial school commitment.

## Automatic potentials

The third manual choice still commits all five uniformly sampled automatic sources, assignments and initial values together. `TraitReveal` then exposes the actual saved assignments individually: attribute, source player, potential grade and ceiling. No replacement rolls or fake player odds are involved.

Next reveals one card; Show all reveals the remainder. Normal reveal cadence is 900 ms per card. Fast reveals and reduced motion show all five immediately. The blueprint is withheld during this presentation so it cannot spoil unrevealed names. A refresh replays the same saved assignments. No new mandatory gameplay phase or save-schema migration is needed.

## Quick broadcast

`GameBroadcast` stages the four games already saved by the training command. Each game presents one actual recorded highlight, its longest completed catch distance, the actual final score and receiving line. It does not invent quarter scores, field positions or a new play simulator. The field graphic represents completed-catch distance only.

Highlights last 1.4 seconds and finals 1.6 seconds, for approximately 12 seconds per block. Pause, Next and Skip are available. Replay opens the same saved block. Fast reveals can bypass playback; Replay explicitly reopens it. Reduced motion goes directly to the full recap. Refresh can replay saved results without consuming RNG. Conflicting next-block actions remain outside the active broadcast. Focus moves to the next relevant action when a user skips or completes a presentation.

Motion also covers incoming choices, revealed cards, the recruit badge, selections and scene previews. Animations use opacity/transforms, preserve readable static layouts and respect reduced motion. Colors consume `src/colors.css`.

## Coaching opportunities

`src/app/domain/coaching.ts` ranks eligible measured problems by severity and current skill need. It consumes no random numbers. Each opportunity requires at least two points of ceiling headroom, an actual performance sample and a skill below its cutoff. An elite skill is not treated as a weakness solely because of one unlucky outcome.

| Opportunity | Target | Required recent-block evidence | Skill below |
|---|---|---|---:|
| JUGS precision | Hands | 18+ targets, 4+ drops and drop rate at least 12% | 90 |
| Beat the press | Release | 16+ press reps, 6+ losses and loss rate at least 40% | 88 |
| Through contact | Body control | 8+ contested targets, at least 65% unfinished | 88 |
| Route timing | Route running | 60+ routes, target rate below 23% | 85 |
| First-step burst | Acceleration | 60+ routes, target rate below 24% | 85 |
| Track the high ball | Vertical | 8+ contested targets, at least 65% unfinished | 88 |
| Run after the catch | After catch | 12+ receptions, below 12 yards per catch | 85 |
| Coverage film room | Awareness | 60+ routes, target rate below 20% | 82 |
| Deep-ball stride | Speed | 12+ receptions, below 14 yards per catch, no 30-yard catch | 85 |

Selection ranks capped performance severity plus developable skill need; deterministic type ID breaks exact ties. These are game coaching heuristics, not claims that a statistic proves a single real-world cause. An opportunity records its measured cause in the UI. Existing one-type-per-year, no final-block prompt and first-game corrective-practice substitution rules remain. A matching intensive plan fulfills the same requirement once, without extra practice work. No generic popup is added merely to fill a quiet block.

Schema-1 import validation accepts both the old and expanded coaching IDs. Existing completed history/cards stay frozen; future blocks of ongoing runs use the revised coaching selection. See `validation/COACHING_REPORT.md` for the 1,000-prospect audit and exact observed distribution.

## User-owned artwork handoff

No generated illustrations from this iteration were added to the app. Current artwork remains while the user prepares approved replacements. `ART_PROMPT_BASELINE.md` contains a reusable prompt, all scene directions and aligned-mask guidance for future primary/secondary jersey colors.

Run `npm run audit:art` to identify shared image content. After approved art is integrated, `npm run audit:art -- --strict` rejects missing or duplicate image content. A separate visual review must confirm distinct compositions; hashes cannot judge whether a recolor is a new illustration. The six scenes awaiting distinct replacements are Red Zone Monster, Breakout Star, Reliable Hands, Transfer Breakout, Rookie Breakout and Gold Jacket. Existing saved scene IDs remain stable.

The aligned jersey-mask compositor is future work; full-scene hue filters or regenerated unaligned masks are not substitutes for it.
