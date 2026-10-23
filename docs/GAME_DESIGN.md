# Wide Receiver Prospect Development — Game Design

> v1.2 implementation amendment: see V1_2_RELEASE.md and superpowers/specs/2026-10-23-v1.2-planning.md for current creation modes, unique offers, catalog, progression and presentation. Original numeric examples below describe the retained legacy profile unless stated otherwise.

**Document:** GAME_DESIGN.md  
**Version:** 1.2 — focused development and player-experience refinement  
**Prepared:** October 22, 2026  
**Companion:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)  
**Working title:** Undecided. “Prospect Binder” names the collection feature, not necessarily the game.

## 1. Authority, provenance, and decision labels

This is the design baseline for Draft Bound. Implementation, a public GitHub repository and GitHub Pages publication were subsequently authorized on October 23, 2026. See README.md and ROADMAP.md for the current release.


Every requirement belongs to one of these categories:

| Label | Meaning | Implementation treatment |
| --- | --- | --- |
| **AGREED** | Explicit user decision, current request, or a proposal clearly accepted by the user. | Preserve unless the user changes it. |
| **DEFAULT** | A concrete proposal supplied here to make a later implementation possible without another design round. | Use provisionally; keep configurable and report changes. This is not a claim of prior approval. |
| **OPEN** | An unresolved product choice. | Use its stated fallback, or leave the feature disabled where specified. |
| **DEFERRED** | A possible later feature outside the first complete version. | Do not quietly add it. |

Later explicit user corrections take precedence over earlier suggestions. This document's agreed rules take precedence over its defaults. The companion plan must not redefine gameplay. Numeric ratings, school bonuses, probabilities, and example careers are game design proposals, not factual scouting evaluations.

### Decisions that supersede earlier suggestions

- **AGREED:** Four-game training blocks replace earlier three-game, six-game, or weekly-control suggestions.
- **AGREED:** Training improves current attributes; it does not level up potential ceilings.
- **AGREED:** Manually chosen and automatically assigned potentials develop under the same rules.
- **AGREED:** All unfilled skills receive real-player-derived trait assignments. They are not a weaker background-stat category.
- **AGREED:** Uniform receiver rolls replace earlier balancing suggestions that would favor particular builds or players.
- **AGREED:** Training is positive-only for the initial version. Earlier proposals to subtract Hands when training Vertical are superseded.
- **AGREED:** Remove Work Ethic and personality modifiers from the initial version.
- **AGREED:** Account achievements grant cosmetics only. Earlier legacy perks, extra offers, stronger training, and permanent bonuses are superseded.
- **AGREED:** Draft Night is a complete ending. NFL simulation is an optional continuation, rather than a mandatory rookie-season ending.
- **AGREED:** Premium illustrated collectible artwork replaces the earlier suggestion that typography-only cards should be the final art direction.
- **AGREED:** Sophomore declaration is a simplified gameplay rule, rather than an unresolved realism question.
- **AGREED:** A coach intervention replaces one practice week in the next block, then the selected training resumes automatically.
- **AGREED:** WR is the only playable V1 position; shared career infrastructure must support future positions without rewriting it or reinterpreting WR saves.
- **DEFAULT v1.2 refinement:** Recalibrate the total general/practice budgets in §9 and restore Balanced, Focused (+), and Intensive (++). Keep the existing year factors, rating bands, source odds, starting ratings, ceiling map, and school bonuses. This is an analytically checked proposal, not a measured balance claim.

## 2. Product vision

**AGREED:** Build the best overall wide receiver possible by combining an elite natural gift with randomly offered real-player potentials, then developing that fictional prospect through college.

The central promise is: **Luck creates your opportunities; your college and training choices determine how much of that potential you realize.**

The experience combines:

1. The anticipation of receiver spins and surprising trait combinations.
2. A short college development career with visible, understandable improvement.
3. Matchup results and highlights that make the prospect feel like a player.
4. A satisfying Draft Night reveal.
5. A collectible card and persistent binder that preserve each career.
6. An optional simulated NFL career that adds a second chapter.

**AGREED:** The goal is overall excellence, not a system that equalizes every build or rewards optimizing only for a narrow role. A mediocre roll can remain mediocre; an extraordinary combination should feel extraordinary. Even a disappointing prospect can make a memorable collectible.

**DEFAULT:** Target a 5–8 minute main run, with a roughly six-minute median after players understand the controls. This is an experience target, not a measured result or a forced timer. Fast-forward should shorten presentation without changing outcomes.

**AGREED:** Start with WR only. **AGREED architecture:** Position identity and position rules are explicit from the first saved run. **DEFERRED gameplay:** QB, RB, TE, DB, LB, DL, team construction, and a full sports-management simulation. No unplayable position buttons, empty future-position modules, or invented defensive statistics belong in V1.

## 3. Non-negotiable design rules

| ID | Rule |
| --- | --- |
| G01 | One S-tier natural gift, then Size, then exactly three manually selected potentials, then automatic completion. |
| G02 | An assigned attribute disappears from every subsequent selection, regardless of its NFL source. |
| G03 | Normal receiver rolls are uniform over the configured receiver pool, with repeat appearances allowed. |
| G04 | Selected and autofilled potentials share the same grades, ceiling system, starting-ability rules, and development rules. |
| G05 | Current ability and fixed potential ceiling are separate values. |
| G06 | College uses four-game training blocks and individual games within each block. |
| G07 | Development comes from game experience, practice focus, and college coaching; freshman growth is fastest, then sophomore, then junior. |
| G08 | Initial training does not subtract existing attribute points. |
| G09 | Coach interventions react to results, occur at block boundaries, and each intervention type occurs at most once per college year. |
| G10 | Draft Night closes the main game; NFL continuation is optional and cannot change the frozen main result. |
| G11 | Account progression is cosmetic only and never changes roll odds, development, difficulty, opportunity, or evaluation. |
| G12 | Artwork, earned accolades, and account cosmetics are separate systems. |
| G13 | Hall of Fame status supports a stamp, eligible artwork, and binder filtering independently of the chosen main image. |
| G14 | The first playable product is a browser game in Angular/TypeScript with original presentation and a separately testable simulation. |
| G15 | Every prospect and historical result carries stable position and rules identities; shared systems do not require WR skills or receiving statistics. |
| G16 | Artwork eligibility records structured evidence from actual events, statistics, awards, transfers, draft results, or induction. |
| G17 | Drafted outcomes freeze overall pick, round, and drafting-team identity; professional simulation starts from that team without rewriting the draft. |
| G18 | Zero meaningful game participation yields zero game-derived experience; ordinary practice remains available. |
| G19 | Matching full corrective practice fulfills the coach requirement once, without replacement or extra work. |
| G20 | Every completed Draft Night creates one binder entry with a preserved Draft Edition before optional NFL continuation. |
| G21 | Original, polished player-spin reveals present committed results and cannot alter gameplay randomness. |

## 4. Complete player journey

**DEFAULT navigation:**

Home / Resume / Binder → Name Prospect → Natural Gift → Size → Potential Rounds 1–3 → Autofill Reveal → College Choice → College Blocks and Season Summaries → Scouting Gauntlet → Draft Night.

Draft Night offers:

- **Save Draft Card and finish:** Customize the already preserved Draft Edition and finish without professional simulation.
- **Simulate NFL career:** Run the optional epilogue, show career and induction results, then customize a Career Edition card.

**AGREED:** Completing Draft Night freezes the main result and creates/upserts one Prospect Binder entry with an accessible Draft Edition before either branch. Immediate NFL simulation cannot bypass or overwrite that edition. The player can revisit/customize it after professional simulation, or open it later to run the one-time continuation. Both editions are chapters under the same prospect ID; NFL simulation cannot reroll draft outcomes.

**DEFAULT automatic presentation:** Use Draft Night art when drafted, Prospect Journey when Undrafted, a guaranteed base frame, no foil, and eligible college/draft stamps. This is an editable presentation over an immutable Draft Snapshot, not an extra player or a second outcome. Commit the snapshot, default edition, and binder upsert together. If persistence fails, keep them accessible in memory with explicit Unsaved status and retry saving without resimulation.

**DEFAULT:** One active prospect at a time; many completed binder entries. Starting another prospect must not silently destroy an unfinished one. Resume returns to the last committed choice or result.

## 5. Prospect creation

### 5.1 Identity

**AGREED:** The prospect is fictional and has a stable positionId, set to wr in V1 and immutable for that career. **DEFAULT:** Let the user enter a name and optional jersey number; offer a generated name for quick play. Names are presentation data, not seeds or gameplay modifiers.

Creation screens show progress, the remaining reroll budget, and the already assigned attributes with their source players.

### 5.2 Natural gift

**AGREED:** Offer three randomly generated S-tier, Hall-of-Fame-caliber trait options. Choose exactly one. That attribute begins at elite current ability, rather than merely having elite future potential.

**DEFAULT:**

- The three options represent different trainable attributes.
- Size is handled separately and is not offered as the natural gift.
- Choose three distinct skill IDs uniformly, then choose a source uniformly from that skill's curated S-tier sources.
- This explicitly restricted gift pool is separate from normal receiver sampling; ordinary receiver rolls remain uniform over the full receiver pool.
- The gift's source and attribute lock after confirmation. It can still improve normally toward its ceiling.
- Start it at 94 current ability with a 99 ceiling. These numbers are initial balance values.
- No natural-gift reroll in the first version.

### 5.3 Size roll

**AGREED:** After the gift, roll a real receiver's Size profile, allow use of rerolls, and lock the accepted height, weight, and build before potential selection.

**AGREED:** Size does not occupy one of the three manual potential selections. It cannot reappear during potential selection or autofill, and the prospect cannot train into a different height.

**DEFAULT:** Copy height, weight, build label, and an illustrative Size grade from the rolled source. Draw uniformly from the same complete receiver pool. Actual dimensions inform matchup context; do not give taller players a universal automatic advantage.

### 5.4 Three manual potential rounds

**AGREED:** Each of three rounds offers three random NFL receivers. The player selects a receiver, inspects that receiver's available letter-graded traits, and claims one attribute as potential.

The chosen attribute:

- Is unavailable on all other source cards immediately after confirmation.
- Retains its source player and letter grade.
- Establishes a development ceiling, not the source player's present ability.
- Cannot replace the gift, Size, or an already assigned potential.

**DEFAULT:** Allow switching among the three offered receivers before confirming the trait. A reroll replaces the entire current offer of three receivers and costs one reroll.

### 5.5 Reroll budget

**AGREED:** Rerolls exist so players have a bounded way to react to an unwanted roll.

**DEFAULT:** Three shared rerolls across Size and the three manual potential rounds. Spending all three on Size leaves none for potentials. The exact budget and reroll scope were proposed in the conversation but were not conclusively finalized.

**DEFAULT:** No rerolls after a trait is accepted; no rerolls during autofill. Account achievements and ads do not grant extra rerolls.

### 5.6 Automatic completion

**AGREED:** Rapidly fill every remaining trainable attribute using the same real receiver pool and letter-graded trait data. Auto assignments can be S-tier; selected assignments are not inherently stronger.

**DEFAULT algorithm:** While an attribute remains empty, draw one receiver uniformly from the pool, draw one empty skill uniformly, and assign that receiver's grade for that skill. Remove the skill and repeat. Every receiver must have a grade for every core skill so no hidden rejection sampling changes the player odds.

Preserve the source and acquisition method for every assignment: natural gift, manual selection, or autofill. These labels explain the build but do not change development.

### 5.7 Uniform randomness means

**AGREED:**

- No rarity weights, superstar boosts, pity rolls, account effects, or hidden adjustments toward a preferred build.
- The same receiver may appear repeatedly.
- Do not compensate for a poor roll by secretly improving later rolls.
- Do not weaken an incredible combination to make all prospects equal.

**DEFAULT:** Draw with replacement, including within an offer of three. Duplicate receivers are legitimate outcomes. The skill options remain usable because already filled attributes are removed globally.

Uniform player sampling does not imply coin-flip football outcomes. Developed skill must influence performance. The constrained S-tier gift offer is an explicit creation guarantee, not a hidden weighting of normal rolls.

**DEFAULT implementation detail:** Use an unbiased bounded-integer draw over source indices, including rejection of out-of-range 32-bit samples where needed. Rejection corrects integer-range mapping; it does not reject a particular receiver, grade, duplicate, or weak build.

### 5.8 Player-spin and reveal quality

**AGREED:** Creation should feel suspenseful and satisfying, using original animated source cards/reels/reveals for natural gifts, Size, three-player potential offers, rerolls, and automatic trait completion. An unstyled table of names or placeholder animation does not satisfy finished V1 presentation.

**AGREED technical boundary:** Determine and commit each actual offer/assignment before animating toward it. The animation consumes no gameplay RNG, does not decide the winner, and cannot create another offer on repeat clicks. Skip, fast-forward, reduced motion, and refresh all reveal the same saved result. Duplicate source players remain legitimate and are presented honestly; assigned attributes stay excluded throughout.

**DEFAULT presentation:** Brief original card/reel motion, clear settling/highlight state, legible names and available grades, and progressive autofill with persistent source labels. Keep normal reveals short enough for the 5–8 minute run target; offer immediate Skip and a fast-forward preference. Use Angular/CSS and lightweight existing browser capabilities, without an expensive animation library, runtime AI, or 3D engine. Decorative movement may use a fixed visual sequence or a separate cosmetic source, never the gameplay stream.

Respect reduced-motion preferences with an immediate/static or minimal-transition reveal. Provide keyboard-operable selection/skip, visible focus, an accessible result announcement after settling, and readable mobile cards. Do not require following fast-moving text to identify or select the final offer.

**Required later browser review:** Inspect the complete spin flow on desktop and mobile in normal, fast-forward, skipped, and reduced-motion modes. Check anticipation, readability, final-result clarity, responsiveness, keyboard access, repeat-click/refresh safety, and whether it actually feels polished. Capture review evidence and revise weak presentation; functional correctness alone is insufficient.

## 6. Attribute model, grades, and OVR

### 6.1 Terms

| Term | Meaning |
| --- | --- |
| Attribute / current ability | What the prospect can do now; changes through development. |
| Potential grade | A source-derived letter grade describing the attribute's possible level. |
| Ceiling | The numeric upper bound established at creation; fixed during the run. |
| Natural gift | One skill with elite starting ability and an elite ceiling. |
| OVR | A summary of the entire current skill sheet; never the average of only the chosen traits. |
| Source | The real receiver whose grade supplied an attribute. |

**AGREED:** Training develops attributes, not ceilings. A randomly assigned Calvin Johnson-inspired Vertical must develop normally, just like a manually selected Vertical. Its acquisition method cannot impose a penalty.

### 6.2 Core skill list

**OPEN:** The conversation explored several overlapping lists and did not settle the final count or names.

**DEFAULT:** Use nine trainable skills plus a separate Size profile:

| Skill ID | Display name | Primary use | OVR weight |
| --- | --- | --- | ---: |
| speed | Speed | Deep separation and long gains | 0.14 |
| acceleration | Acceleration | Initial burst and short separation | 0.08 |
| hands | Hands | Catch reliability and drops | 0.16 |
| routeRunning | Route Running | Separation and route execution | 0.18 |
| release | Release | Escaping press and entering routes | 0.12 |
| vertical | Vertical | High-point reach and aerial contests | 0.08 |
| bodyControl | Body Control | Contested positioning and sideline catches | 0.10 |
| yardsAfterCatch | After Catch | Production after a completed catch | 0.08 |
| awareness | Awareness | Reading coverage and adapting | 0.06 |

Weights sum to 1.00. Under this default, the completed prospect has one gift, three manually assigned potentials, and five autofilled skills, plus Size.

Contested-catching performance combines Hands, Vertical, Body Control, and Size; it is not a tenth skill in this default. Blocking, separate Strength, Grit, and Agility ratings are outside the initial list. Awareness is a football skill, not a reintroduced personality stat.

### 6.3 Proposed grade mapping and initial ability

**OPEN:** Exact grade conversion, hidden-versus-visible ceilings, and any variation within grades were not finalized.

**DEFAULT:** Use this fixed mapping initially:

| Grade | S | A+ | A | A− | B+ | B | B− | C+ | C | C− | D+ | D | D− | F |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Ceiling | 99 | 96 | 93 | 90 | 87 | 84 | 81 | 78 | 75 | 72 | 69 | 66 | 63 | 60 |

Use ASCII minus signs in stored grade IDs. Non-gift current ability is a uniform integer from 50 through 65, clamped down to its ceiling. This rule is identical for manually selected and autofilled attributes. Gift current ability is 94.

Show current ability and potential letter grade by default. Offer exact numeric ceiling information in the expanded attribute explanation; there is no discovery or fog-of-war mechanic in the first version.

### 6.4 OVR

**DEFAULT:** Compute the weighted sum of all nine current abilities, round to the nearest integer, and clamp to 0–99. Preserve decimals internally. A displayed 99 requires an unrounded weighted value of at least 98.5.

Size affects relevant simulation checks without adding points to OVR. This avoids automatically declaring every tall prospect better. Store the starting OVR and unrounded final OVR so progression can be displayed and sorted consistently.

**AGREED:** A genuine 99 OVR should be exceptionally difficult. Do not special-case a famous source combination into 99. Do not use remaining potential or eventual NFL accolades as current OVR.

**OPEN:** Exact competitive scoring beyond OVR. **DEFAULT:** Use final OVR as the main record, actual draft position as a separate record, and OVR growth as a separate progression measure. Do not invent an opaque combined score.

### 6.5 Shared career foundation and position definitions

**AGREED:** The WR skill table above is a WR definition, not a global requirement for every football prospect. A future QB must not need Hands or receiving yards simply to exist in the domain model.

Use one modest, typed position boundary:

| Shared career responsibility | Supplied by the position definition/rules |
| --- | --- |
| Identity, random streams, trait-roll rounds, and reroll accounting | Attribute IDs/labels, complete source pool, eligible S-tier gifts, physical-profile interpretation |
| Current values, fixed ceilings, generic bounded growth, and OVR calculation | Attribute set, OVR weights, practice allocation rules, learning-rep interpretation |
| College recruitment, four-game chronology, transfers, and season decisions | Position specialties within a school, game simulation, typed statistics/events, intervention catalog |
| Scouting and Draft Night workflow, frozen outcome, and team identity | Scouting challenges, position performance grade, position-specific draft evaluation |
| Optional professional lifecycle, saving seasons, and retirement workflow | Professional production, age/development model, awards, and induction criteria |
| Eligibility ledger, card layers, cosmetics, binder, and export | Event predicates, supported accolades, statistic layouts, position-appropriate scene catalog |
| Navigation, persistence, import/export, and migrations | Versioned position payload validation and read-only historical view descriptors |

**DEFAULT technical shape:** A PositionDefinition contains stable ID, display name, ordered attribute definitions, source catalog ID, OVR weights, physical-profile metadata, and stat-display descriptors. Its associated PositionRules supplies simulation and evaluation functions. A registry has exactly one playable entry in V1: wr. Use a small discriminated type map for position-specific payloads and ordinary shared types for chronology, commands, identity, cosmetics, and collection metadata.

**AGREED requirements:**

- Prospect, game history, draft snapshot, professional result, and binder entry retain positionId and applicable rules/content versions.
- Creation and attribute UI derive their rows from the selected definition. Nine WR skills and five autofills are V1 defaults; shared screens do not hard-code that count.
- Trait sampling uses that position's complete source catalog, with the same uniform-sampling rule.
- OVR receives position-specific weights; validation checks complete, finite, nonnegative weights summing to 1.00.
- College scheduling remains shared; learning, training targets, interventions, and school specialties are position-specific.
- Game statistics and event payloads remain type-safe. Shared binder metadata has no mandatory receiving-yards field.
- Cards receive position-specific stat descriptors and saved display snapshots rather than selecting WR fields in shared rendering code.
- Adding a position cannot change a saved career's position, source traits, results, or eligible artwork.
- Missing position rules or a missing historical rules version produce an understandable unsupported-version state. Completed historical entries remain readable from saved snapshots; an active run cannot silently switch to current WR rules.

**Future QB implementation example:** Add a real QB attribute/source catalog, QB physical-profile interpretation, OVR weights, college simulator and statistics/events, experience mapping, interventions, school specialties, gauntlet, draft grading, professional production, award/induction rules, and artwork/stat descriptors. Register its stable ID and typed payload. Reuse the existing creation orchestration, shared four-game scheduler, transfer/declaration flow, Draft Night shell, card layers, binder, and persistence envelope. Only actual new payload/schema changes require migrations; adding an independent position catalog does not.

**DEFERRED:** The QB content and implementation themselves. Do not build empty QB modules, a dynamic plugin loader, an unrestricted expression engine, or a universal possession simulator to demonstrate extensibility.

## 7. College recruitment and transfers

**AGREED:** College choice changes development strengths. Schools amplify relevant training and normal development rather than granting immediate ratings or higher ceilings.

**DEFAULT:** Offer three initial choices with distinct tradeoffs:

| Program profile | Strength | Opportunity | Suggested game modifiers |
| --- | --- | --- | --- |
| Technical | Route Running and Release | Competitive receiving room | 1.25 coaching for specialties; 0.80 opportunity |
| Explosive | Speed and Vertical | Moderate early opportunity | 1.25 coaching for specialties; 0.90 opportunity |
| Opportunity | Broad access to game reps | More immediate participation | 1.05 coaching for all skills; 1.10 opportunity |

Use 1.00 coaching for non-specialty skills. School identities, exact available programs, offenses, and values remain defaults to tune. Ohio State, LSU, and North Texas were examples in the discussion; their proposed game bonuses are not claims about real coaching quality.

Show specialties, expected role, offensive tendency, and opportunity before commitment. No program should be the best answer for every prospect.

**AGREED:** Transfers are available between seasons. They matter because a different school can develop different skills.

**DEFAULT:** After freshman year and, if returning, after sophomore year, choose Stay or one of two distinct destination offers. Keep existing ability, ceilings, source traits, stats, and history. Change the school modifiers for future games only. No transfer rating penalty, extra season, account advantage, or mid-block transfer.

**OPEN:** Performance-gated offers, recruiting prestige, and detailed depth-chart competition. **DEFAULT:** Use fixed program profiles and disclosed opportunity modifiers initially.

## 8. College seasons and four-game blocks

**AGREED:** Development is fastest as a freshman, slower as a sophomore, and slower again as a junior.

**DEFAULT:** Three college years, 12 regular-season games each, arranged as:

| Block | Games | Main decision |
| --- | --- | --- |
| 1 | 1–4 | Choose focus; simulate four individual games |
| 2 | 5–8 | Review results; choose focus; simulate four games |
| 3 | 9–12 | Review results; choose focus; simulate four games |

This produces nine regular training decisions across a full three-year career, plus college, transfer, intervention acknowledgment, and ending choices.

### Block flow

1. Show current ability, potential, school context, and any pending coach session.
2. Select a training plan for the next four games.
3. Simulate games sequentially; performance and development from one game affect the next.
4. Present a short game-by-game highlight reel and results.
5. Show the block's actual attribute gains and season totals.
6. Evaluate coaching triggers from those four games and announce any intervention for the next block.
7. Return to planning, or to the season summary after Game 12.

**AGREED:** Four-game blocks remain the decision cadence. **DEFAULT:** Each individual game's result can be expanded; the user need not click Continue after every game or offensive drive.

### Draft eligibility

**AGREED:** Complete freshman year, then sophomore year, then choose Declare or Return. Declaring proceeds to scouting and Draft Night after 24 college games. Returning grants a slower but meaningful junior year, then scouting and Draft Night after 36 games. No freshman exit, mandatory junior season, redshirt, or senior season is included.

This is a simplified fictional game rule, not a claim about actual NFL eligibility.

**AGREED:** Returning does not guarantee a better draft outcome. Positive-only college development means current ability cannot fall; capped skills may gain nothing. Extra production contributes to a normalized performance evaluation rather than a bonus for merely playing more games. Scouting results and the pick draw can still produce an equal or worse draft result.

**Design concern:** With no injury, regression, or opportunity-cost penalty, returning weakly dominates early exit when the only objective is maximum final OVR. Saved play time and the choice to bank an existing prospect are the current reasons to leave early. Report this limitation in playtests; do not invent injuries, a hidden junior penalty, or a new scoring mode to conceal it.

**DEFERRED:** Redshirts, senior seasons, full postseason brackets, scheduling management, and eligibility administration.

## 9. Training and development

### 9.1 Available plans

**AGREED:** Ordinary experience, practice, and school bonuses develop current ability only. Initial training remains positive-only; intensity changes allocation, not free work or rating subtraction.

**DEFAULT V1 choices:** Balanced, Focused (+), and Intensive (++), each selected for a four-game block and using the same total WR practice budget of 7.20 work units per game before modifiers.

| Mode | Allocation | WR default per game |
| --- | --- | --- |
| Balanced | Evenly across all configured attributes | 0.80 to each of nine skills |
| Focused (+) | 60% to selected skill; remaining 40% evenly across the other skills | 4.32 to target; 0.36 to each of eight others |
| Intensive (++) | 100% to selected skill | 7.20 to target; 0 to other skills |

The 60/40 split and budget are configurable defaults. Every row sums to 7.20; neither + nor ++ manufactures extra work. The UI shows mode, selected target where required, the allocation, and that other attributes continue learning from actual game reps. Balanced is for broad growth; Focused preserves some broad practice; Intensive accepts the largest practice opportunity cost elsewhere.

A +/++ label never promises a fixed number of rating points. Project emphasis rather than guaranteed gains. Explain a capped target clearly; record unused work instead of secretly reallocating it. Four-game controls and prospective allocations derive from the position definition; only the WR coefficients are specified here.

### 9.2 Development rule

**DEFAULT v1.2 model:** Keep the shared total-budget/band-integration model. Recalibrate WR general work to 3.60 per game at normal participation and practice to 7.20 per game. Apply growth after each individual game before resolving the next.

participationFactor = clamp(routesRun / 30, 0.00, 1.20)

generalBudget = 3.60 × participationFactor

generalAllocation[i] = generalBudget × learningShare[i]

rawWork[i] = yearFactor × coachingMultiplier[i] × (generalAllocation[i] + practiceAllocation[i])

newCurrent[i] = advanceWithinBands(current[i], ceiling[i], max(0, rawWork[i]))

| Factor | Default |
| --- | --- |
| Freshman yearFactor | 1.50 |
| Sophomore yearFactor | 1.15 |
| Junior yearFactor | 0.85 |
| ratingFactor below 70 | 1.00 |
| ratingFactor from 70 to below 85 | 0.80 |
| ratingFactor from 85 to below 95 | 0.50 |
| ratingFactor from 95 upward | 0.25 |
| WR total general-experience budget | 3.60 work units at participationFactor 1.00 |
| participationFactor | 0 routes → 0; 15 → 0.50; 30 → 1.00; 36 or more → 1.20 |
| WR total practice budget | 7.20 work units regardless of game participation |
| learningShare | 50% uniform across attributes + 50% normalized relevant learning reps |
| College coaching | Retain §7: 1.25 for Technical/Explosive specialties, 1.00 otherwise; Opportunity 1.05 for all skills |
| Initial ratings/ceilings | Retain §6: gift 94/99; other current values 50–65 capped at the existing grade ceiling |

**Why this correction:** V1.1 supplied 67.20 raw work per attribute under normal-participation Balanced training over three years before college modifiers. V1.2 supplies 50.40; the Opportunity school's 1.05 yields 52.92. General work falls more than practice, preserving meaningful targeted investment and strong growth while reducing automatic ceiling completion. Nominal work totals 10.80, two-thirds assigned by practice. Year factors, school bonuses, initial ratings, grades, and near-ceiling factors are unchanged to avoid a broader redesign.

**AGREED participation rule:** Zero meaningful participation produces zero game-derived work. In the compact WR simulator, routes run is the participation measure; a bench player with zero routes has no generalBudget even if a fallback learning-share vector is uniform. A player running routes but receiving zero targets still learns from route, release, movement, and coverage reps. Do not use receptions or yards as the participation gate.

Practice is independent of the participation factor: zero routes leaves Balanced/Focused/Intensive practice intact. A future position supplies its own meaningful-rep measure through the existing position rules. School opportunity affects routes and performance first; never multiply the resulting general budget by the opportunity modifier again. Coaching still applies once to its relevant work.

**DEFAULT learning reps:** WR rules map routes, reads, release attempts, catch opportunities, contested attempts, explosive movement and after-catch reps into a nonnegative vector, including failed reps. Normalize it; if its sum is zero, use uniform shares. The uniform 50% component distributes some learning to each uncapped skill only when generalBudget is positive; it is not a participation floor.

**DEFAULT band integration:** Spend raw work within each rating band, advancing to the next threshold before using its factor. Moving 69 → 70 costs 1.00 work, and 70 → 71 costs 1.25 at factor 0.80; 2.00 work from 69 therefore yields 70.8. Do not apply the initial band's factor to an entire large allocation that crosses several bands.

Preserve fractional values internally. Attribute source origin has no effect. Ceilings stay fixed, and unused capped work is not reassigned. Apportion actual realized gain between general/practice work proportionally after integration and clipping, with shares summing to the true gain. For balance analysis, compare the same inputs with specialty coaching set to 1.00 to report its incremental contribution; do not add that counterfactual gain to the actual total.

**AGREED:** Under equivalent uncapped inputs, freshman growth exceeds sophomore, which exceeds junior. A ceiling can make realized gains equal through clipping; that is not a change to year factors.

**Illustrative work at 30 routes and uniform learning shares:** General work is 0.40 per skill. Balanced adds 0.80 everywhere; Focused adds 4.32 to target and 0.36 elsewhere; Intensive adds 7.20 to target and zero elsewhere. At zero routes, those practice allocations remain while all general work becomes zero.

### 9.2.1 Analytical checks and future balance validation

**AGREED:** Low ceilings should be easier to reach, moderate ceilings attainable, A/A+ ceilings meaningful investments, and fully realized S ceilings substantial achievements. Balanced remains useful without guaranteeing every ceiling. True displayed 99 must remain mathematically possible and exceptionally rare; uniform source odds cannot be tuned to fix growth.

**DEFAULT arithmetic examples, not simulated distributions:** Over 36 games, the sum of year factors is 42. Normal-participation Balanced work per skill is (0.40 + 0.80) × 42 = 50.40, or 52.92 with Opportunity coaching. Passive-only work at that school is 17.64. From current 65, reaching ceiling 99 costs 59.75 under the retained bands. Balanced therefore no longer automatically reaches that S ceiling in this example.

With all S ceilings, Route Running gift 94, every other skill 65, uniform learning shares, Opportunity coaching 1.05, no corrective sessions and constant participationFactor 1.00, Balanced ends at raw OVR 97.599850 (display 98); non-gift skills reach 97.292500. Even participationFactor 1.20 yields raw 98.323090 (display 98), not 99.

**Carefully constructed reachability witness:** Keep that exceptional all-S prospect/school and use participationFactor 1.20 (36 routes), uniform learning shares and no corrective sessions. Apply these block plans:

| Year | Block 1 | Block 2 | Block 3 |
| --- | --- | --- | --- |
| Freshman | Focused Body Control (+) | Focused Acceleration (+) | Focused After Catch (+) |
| Sophomore | Focused Release (+) | Focused Vertical (+) | Focused Awareness (+) |
| Junior | Intensive Hands (++) | Intensive Speed (++) | Focused Release (+) |

The arithmetic yields Speed 99, Acceleration 98.9179, Hands 99, Route Running 99, Release 99, Vertical 97.4626, Body Control 98.9179, After Catch 98.9179, Awareness 97.4626. The existing weights yield raw OVR 98.763418 → displayed 99 under the existing 98.5 threshold. Displayed 99 does not require every attribute to equal 99. This is a controlled work-allocation proof, not a guarantee that ordinary random gameplay supplies those inputs.

**Ordinary mixed-potential comparison:** Use Route Running gift 94/99, every other initial skill 55, and ceilings in §6 skill order of 93/84/96/99/87/99/90/81/78. At normal participation, uniform reps, Opportunity coaching, and Balanced practice, starting raw OVR is 62.02 and final raw OVR is 90.860400 (display 91). Hands/Vertical reach 94.585, leaving headroom below 96/99; lower ceilings can legitimately fill. This demonstrates strong growth without universal completion for this fixture, not the population average.

**Required future evidence:** Paired-prospect, controlled-seed comparisons must cover Balanced, moderate Focused, Intensive, specialty-aligned and non-specialty schools, each year, ordinary and exceptional potential mixes, and low/zero/high participation. Report starting/final OVR, total/per-skill/yearly growth, ceiling attainment/gaps, general/practice/coaching contributions, capped work, 90+/95+/99 frequency, strategy sensitivity, policy win/tie rates and same-prospect outcome spread.

The numerical coefficients are analytically checked provisional defaults. Actual football simulation, strategy diversity, natural rarity, and the feel of growth still require implementation, large seeded batches and playtests. Mathematical reachability alone says nothing about appropriate rarity.

Distinguish a fixed focus/button that dominates every build from an adaptive policy that succeeds through different choices. Report both. Do not hide dominance, erase school-opportunity differences with passive floors, or add injuries/regression/account power to force balance.

### 9.3 Coach interventions

**AGREED:**

- Coach interventions respond to understandable performance problems.
- The user sees them at the end of a four-game stretch.
- A JUGS session redirects some planned training toward Hands.
- Each intervention type can occur at most once in a college year.
- Lost focus time is an opportunity cost; no existing skill is subtracted.

**AGREED resolution: one corrective practice week, with matching-plan fulfillment.**

1. Finish the current block unchanged; evaluate actual performance and announce one eligible pending requirement.
2. The player chooses Balanced, Focused (+), or Intensive (++) for the next four games.
3. Compare the plan's base practice allocation with the coach's prescribed full corrective allocation before school/year modifiers.
4. If the chosen plan already assigns the full 7.20 WR practice units to the prescribed target, record fulfillment as already_compliant. Keep the selected plan for all four games; do not replace an identical week or add work.
5. Otherwise record fulfillment as substituted: first game's practice uses the coach's full Intensive target allocation, and Games 2–4 automatically resume the selected plan.
6. Game experience remains participation-dependent and independent of that practice choice in all four games.

Example: JUGS is announced after Games 1–4. Choosing Hands ++ already satisfies it: “Coach's JUGS requirement satisfied — your selected Hands ++ plan already addresses the issue.” Choosing Vertical ++ redirects only Game 5 practice to Hands. Choosing Hands + gives only 4.32 targeted work, below the prescribed 7.20, so Game 5 uses Hands ++ and Games 6–8 resume Hands +.

Matching compares prescribed target/work, not merely labels or expected rating gains. It cannot generate extra work or count as a second session. Both fulfillment modes consume the intervention type for that year.

**DEFAULT trigger catalog:**

| Type | Trigger in completed block | Replacement focus |
| --- | --- | --- |
| JUGS | At least 3 drops in one game, or at least 5 across the block | Hands |
| Press clinic | At least 8 press reps and a press-loss rate of at least 60% | Release |
| Contested-catch clinic | At least 5 contested targets and a failure rate of at least 70% | Body Control |

**AGREED scheduling:** At most one intervention per boundary; each TYPE at most once per year. Different types may occur in the same year. **DEFAULT priority and edge handling:** JUGS, then Press clinic, then Contested-catch clinic. Ignore triggers whose replacement skill is capped. When Game 12 leaves no following block, record the concern in the season report but schedule no session, consume no practice, and carry no banked bonus into the next year. A diagnostic-only concern does not count as a scheduled intervention. At announcement, reserve that type so refreshing or reconsidering an unconfirmed plan cannot trigger it again. At confirmed next-block resolution, atomically mark it used with fulfillmentMode already_compliant or substituted, selected plan, cause and effective first-week allocation. Reset the per-type ledger at the new year. Ledgers and intervention definitions belong to the selected position; a WR JUGS event cannot appear for a future position without that position defining it.

Using the same type under a different display name must not bypass the once-per-year limit. A nonmatching coach session replaces the entire one-game practice allocation with the same 7.20 WR budget assigned to its target; it is not added on top. An already-compliant plan stays unchanged and still records fulfillment/annual usage. Record original mode/target, effective allocation, cause, fulfillment mode, realized gain and any automatic resumption in history.

**DEFERRED:** Injury, fatigue, recovery programs, permanent regressions, Work Ethic, personality systems, and negative training outcomes.

## 10. Football simulation and highlights

**AGREED:** The user manages development and watches results; this does not require sprites, real-time play, or a 3D field.

**DEFAULT:** Use a compact statistical receiver simulation influenced by:

- Current skills and Size.
- Participation, route volume, and target opportunities.
- Program offense and role.
- Opponent coverage strengths.
- Seeded, bounded variation.

For WR, generate routes, targets, receptions, drops, receiving yards, touchdowns, press outcomes, contested outcomes, and a game grade. Use internally consistent event categories: a drop requires a target; a touchdown reception requires a reception; contested targets are a subset of targets. Uncatchable balls and coverage losses are not automatically drops. These receiving fields belong to the WR statistics payload, not every generic GameResult.

**AGREED:** Events are structured data, not only prose. **DEFAULT event envelope:** Stable event ID, prospect ID, positionId, stage, college year/game number or professional season, game ID, opponent identity snapshot, event kind, typed position payload, and rules version. WR catch records include yards, touchdown flag, contested flag, computed catchDifficulty from 0–1, and starting distance to the opponent's goal where relevant. A “game-winning” label requires score/timing evidence showing that the decisive lead was retained; omit it when the compact simulator lacks that evidence.

Store the statistic and event facts used by highlights, learning reps, interventions, awards, and scene eligibility once as engine output. A position-specific presentation adapter derives short text. Card rendering cannot invent new plays.

**DEFAULT:** Team scores and wins are contextual summaries. They should not imply that the receiver personally determines every possession.

Highlights come from actual simulated events, for example:

> “A clean release created room for a 38-yard touchdown.”
>
> “Three drops brought a catching session onto next block's plan.”

**AGREED direction:** Learn from the enjoyable matchup snippets in 84-0. **DEFAULT presentation:** Show 1–3 meaningful highlights per game, grouped within the four-game recap; support normal speed, fast-forward, and immediate results. No mandatory drive-by-drive or per-game confirmations. Block summaries show aggregate statistics, actual skill gains, and links to each game's results; qualifying events can unlock scrapbook scenes in the same committed result.

Do not invent a 60-yard catch when the underlying result has no such play. Changing presentation speed, expanding a result, reloading, or revisiting a screen cannot regenerate results.

**DEFAULT supported college award:** A WR earns a game-defined All-American accolade for a completed season with at least 1,200 receiving yards, 10 receiving touchdowns, and a normalized season performance grade of at least 85. The WR rules create a versioned AwardRecord with that season's qualifying facts. This is a simplified game award, not a real-world selection prediction. Other named college awards remain unavailable until their rules/evidence are defined.

## 11. Scouting gauntlet and Draft Night

### 11.1 Gauntlet

**AGREED direction:** Test the developed prospect through an NFL-caliber matchup gauntlet before the draft.

**OPEN:** The full gauntlet design, combine mechanics, and exact draft impact were not finalized.

**DEFAULT:** Five quick matchup tests: press, man coverage, zone recognition, contested catch, and open-field production. Use defensive archetypes rather than a second real-player data project. Each test reports its relevant attributes, result, and a brief explanation.

No extra development or ceiling increases occur here. The gauntlet tests the prospect the player built. A full combine minigame is deferred.

### 11.2 Draft evaluation

**DEFAULT:** Produce a disclosed draft evaluation from 70% final unrounded OVR, 20% college performance grade, and 10% gauntlet grade, each on a 0–99 scale.

Initial evaluation-to-outcome bands:

| Evaluation | Outcome range |
| --- | --- |
| 95 and above | Picks 1–5 |
| 90 to below 95 | Picks 6–16 |
| 85 to below 90 | Picks 17–32 |
| 80 to below 85 | Picks 33–64 |
| 75 to below 80 | Picks 65–100 |
| 70 to below 75 | Picks 101–160 |
| 65 to below 70 | Picks 161–224 |
| 60 to below 65 | Picks 225–256 |
| Below 60 | Undrafted |

Use a seeded uniform draw within the eligible band. This is an intentionally simplified fictional draft model. The exact bands remain tuning choices. No. 1 overall must be possible but not automatic for every elite prospect.

### 11.2.1 Permanent draft team and round

**AGREED:** Every drafted outcome freezes overallPick, round, pickInRound, and a DraftTeamIdentity containing stable teamId, catalog version, display name, primary color, and secondary color. Draft Night, both card editions, binder details, exports, and the optional NFL career use that saved identity. A catalog rename or color update cannot rewrite the historical draft snapshot.

**DEFAULT:** Use an interchangeable original/neutral 32-team catalog and an explicit versioned 256-slot fictional draft board. Preserve the pick bands above. Seven rounds contain respectively 32, 32, 40, 40, 40, 40, and 32 slots; extra slots are a game abstraction, not a claim about a real draft. Assign teams through a fixed catalog board order, cycling the 32 IDs for each round's base slots and assigning the additional slots through explicit board entries. Store the selected slot, not a live lookup. Validate unique consecutive picks 1–256, valid team IDs, legal round indices, and sequential pickInRound values.

Read round/team from the board; do not infer round with ceiling(overallPick / 32), which is wrong once extra slots occur. Future position-specific draft grading can feed the same board and frozen-outcome workflow.

**AGREED:** Undrafted outcomes have no draft selection, round, or drafting team. Use an explicit undrafted outcome variant, not a fake pick zero. **DEFAULT:** The optional professional module may assign a separate free-agent joining team; it must not mutate the undrafted draft snapshot.

**OPEN:** Real versus fictional drafting-team identities and a more realistic draft-order model. Real-player trait sources remain part of the prototype concept. Original team art and interchangeable identities are the fallback; a non-affiliation disclaimer does not establish asset permission. Public distribution and commercial rights review remain separate decisions.

**DEFAULT:** Undrafted is a valid completed outcome, not a failed workflow. It receives a career recap, card, and optional NFL continuation.

### 11.3 Main ending

**AGREED:** Draft Night recaps the college journey and reveals the actual draft outcome.

Show:

- Name, Size, school history, and source traits.
- Initial-to-final OVR and each skill's growth.
- Year-by-year production and best game.
- Major college accolades and coaching moments.
- Gauntlet results.
- Actual draft pick or Undrafted.
- For drafted prospects, actual game-draft round and permanent drafting team with saved identity/colors.
- The option to save a card or simulate the NFL career.

**AGREED:** Freeze the main result here and create its default Draft Edition under one binder entry before showing either continuation choice. Immediate NFL simulation does not require manual Draft customization and cannot remove the Draft Edition. Optional NFL production and Hall of Fame status do not retroactively change college OVR, attributes, ceilings, college achievements, pick/round/team, Draft artwork eligibility or main records.

## 12. Optional NFL career

**AGREED:** A complete simulated NFL career is an optional epilogue, not a requirement to finish the main game.

**DEFAULT:** A rapid, read-only career simulation, not another interactive training campaign. Use the frozen prospect, permanent drafting-team context, role opportunity, an aging curve, and a dedicated saved random stream. Generate seasons, career production, awards, and retirement. WR professional rules own receiving production; shared professional history must not require receiving fields from other positions.

The first professional team is the saved drafting team, or a separately saved free-agent joining team for an Undrafted prospect. **DEFERRED:** Interactive contracts, trades, and a full professional team-management simulator.

**DEFAULT:** Simulate up to 15 professional seasons, allowing earlier retirement after at least three seasons. Keep the career model and accolade thresholds in a separate configuration. This module may use an independent professional aging curve without modifying the college snapshot.

**AGREED:** Explicitly report Hall of Fame induction or non-induction after a simulated career. If the career has not been simulated, show “Career not simulated”; do not treat missing data as a failed induction.

**OPEN:** Career length distribution, detailed professional development math, additional NFL awards, and final induction tuning. **DEFERRED:** Championship accolades without a modeled team/championship outcome.

**DEFAULT WR induction baseline:** At least 12,000 career receiving yards, 80 receiving touchdowns, and 3 All-Pro selections. This is a simplified game rule, not a prediction or a statement about real induction criteria. Store the thresholds and evaluation version in WR professional configuration; shared lifecycle, cards, and binder code never contain those receiving thresholds.

**DEFAULT supported professional award:** At most one WR All-Pro selection per season when that season records at least 1,400 receiving yards and 10 receiving touchdowns. This is a configurable fictional award criterion. Persist an AwardRecord with stable ID, award type, season, positionId, relevant production values, and rule/version. Induction counts those recorded awards; card UI cannot infer All-Pro status independently.

Season totals and career totals must reconcile. Career accolades reference actual engine-produced award records. Championship and “record-breaking” scenes remain unavailable until appropriate team outcomes or versioned comparison records are implemented. A generic “great career” prose summary cannot supply those facts.

**AGREED architecture:** PositionRules owns professional stat shapes, production, award predicates, and induction evaluation. Shared code stores a tagged result with one of not_simulated, simulated_not_inducted, or simulated_inducted semantics. Serialized implementation may use a nested simulated/result union, but missing data must never become a false induction denial.

Longer-term induction evaluation may consider peak, longevity, awards, and historical dominance. That remains a configurable position-rule evolution, not a V1 election simulator.

The continuation runs once per prospect. Reopening the career screen shows saved results. Preserve a valid Draft Edition even if the optional career cannot complete.

## 13. Collectible cards, artwork, and stamps

### 13.1 Three independent layers

**AGREED:**

| Layer | Earned from | What it controls |
| --- | --- | --- |
| Run artwork and factual accolades | This prospect's actual college/NFL journey | Eligible scenes, stamps, credentials, statistics |
| Account cosmetics | Permanent account achievements | Frames, foil treatments, backgrounds, decorative presentation |
| Card data | Stored run and career results | Name, OVR, school history, draft result, progression, story |

A gold account frame can decorate a weak prospect. It must not label that prospect a 95+ talent or Hall of Famer without the relevant run achievement.

### 13.2 Artwork direction

**AGREED:** Premium illustrated sports-card artwork, developed as a reusable library over time. The user is interested in collaborating on future image generation. Runtime per-player image calls, daily AI quotas, and generating a unique image for every run are not required.

**DEFAULT implementation direction:** Angular renders illustrated image assets, typography, frames, and stamps as layered 2D UI. CSS handles restrained foil and motion effects. Three.js is unnecessary for the initial product.

Artwork is reusable scene art, not an exact depiction of every prospect's height, face, number, and uniform. Do not promise procedural personalization that the assets do not support.

**DEFAULT WR scene catalog:** Exact thresholds are configurable defaults. A scene is a presentation choice; it is not itself an invented award.

| Scene | Unlock rule |
| --- | --- |
| Draft Night — draft_night | Prospect is drafted |
| Prospect Journey — prospect_journey | Any completed run, including Undrafted |
| Breakaway Star — breakaway_star | An actual receiving touchdown of at least 50 yards |
| Spectacular Catch — spectacular_catch | An actual contested completion with computed catchDifficulty at least 0.85 |
| Red Zone Monster — red_zone_monster | At least 3 receiving TD in one game, including at least 2 from plays starting within the opponent's 20-yard line |
| Breakout Star — breakout_star | At least one 150-yard college game; unlocks production art, not a spectacular-catch claim |
| Reliable Hands — reliable_hands | At least 40 receptions and no drops in a completed college season |
| Transfer Breakout — transfer_breakout | After a transfer, end-of-season raw OVR and normalized season performance grade each improve by at least 5 from the pre-transfer season |
| Award Ceremony — award_ceremony | A supported major award actually earned and saved in this run |
| Rookie Breakout — rookie_breakout | NFL rookie season records at least 1,000 receiving yards and 6 receiving TD |
| Canton Bust / Gold Jacket — canton_bust / gold_jacket | Hall of Fame induction in this prospect's simulated career |

Exact scene count, thresholds, and compositions are defaults. The art catalog must support adding new scenes without changing simulation code. If a scene's art is unavailable, show a deliberate labeled fallback; do not claim final illustrated polish.

**AGREED:** College and NFL accomplishments can unlock art. New scene predicates over existing event/stat/award types can be added through the eligibility catalog. A scene requiring genuinely new facts needs explicit position-rule instrumentation; the catalog must not invent missing championship results, record comparisons, or spectacular catches.

### 13.2.1 Structured unlock evidence

**AGREED:** Persist why each scene unlocked. Do not rely on generated prose or recompute historical eligibility using a future rule.

**DEFAULT SceneUnlock record:** Stable unlock ID, scene ID, prospect/position IDs, eligible edition(s), originating stage, rules/eligibility versions, chronology, evidence kind, source entity IDs, and immutable qualifying facts. Evidence variants include gameEvent, gameStats, seasonStats, transferComparison, award, draftOutcome, and induction.

Each EvidenceSnapshot stores those tagged qualifying facts alongside source references and frozen display context; it remains readable without current simulation rules. The implementation plan uses the same SceneUnlock/EvidenceSnapshot distinction.

For a breakaway scene, preserve game/event ID, Sophomore Game 7, opponent identity snapshot, play yards, touchdown flag, and any supported decisive-play evidence. A saved 71-yard TD can then be explained years later without trusting a prose string. A production scene instead stores the game's receptions/yards/TD totals; an award scene references its AwardRecord.

Retain compact evidence snapshots even if full event history is later pruned. Multiple qualifying moments may support the same scene; preserve each distinct source with stable IDs and let the card builder choose a featured moment. Deduplicate on prospectId, sceneId, evidence kind and stable source ID; reprocessing a result cannot duplicate evidence. Text descriptions are derived from these facts.

Draft Edition eligibility includes only evidence existing by Draft Night. Career Edition can use both college and professional evidence. NFL continuation appends evidence without rewriting the Draft Edition or its frozen result. A hidden stamp or a different selected scene never deletes an accolade.

### 13.3 Card editions and fields

**DEFAULT Draft Edition front:** chosen art, prospect name, position label (WR in V1), final college OVR, school, actual draft pick/round/team or Undrafted, signature trait, frame, and earned stamp.

**DEFAULT card back / scrapbook detail:** full current and ceiling sheet, all NFL trait sources, OVR by year, position-appropriate season stats, best game, biggest improvement, transfer history, coach interventions, awards, featured artwork's qualifying moment, and a short factual career story. Shared card layout renders descriptors from the position definition or a stored historical display snapshot; it does not assume receiving yards or nine skills.

**DEFAULT Career Edition:** All Draft Edition facts plus NFL totals, seasons, awards, retirement, and induction status. Professional ratings, if ever displayed, must be labeled separately from the frozen prospect OVR.

**AGREED:** Every completed Draft Night has a Draft Edition, including an immediate-NFL path with no prior customization. Professional completion adds a Career Edition under the same prospect entry. Both remain accessible and independently customizable afterward; changing one edition cannot overwrite the other. Draft stats and eligible moments remain frozen at Draft Night. HOF/professional honors are Career-specific, while college/draft facts remain available on both editions.

### 13.4 Stamps and Hall of Fame

**AGREED:** Major accomplishments can appear as stamps independently of main artwork.

A Hall of Fame prospect unlocks:

1. A selectable Canton bust, gold jacket, or induction scene.
2. An independently earned “HALL OF FAME INDUCTEE” stamp.
3. Persistent Hall of Fame metadata for collection filtering.

Choosing a Draft Night or breakout-catch image must not remove Hall of Fame status.

**DEFAULT:** Show the Hall of Fame stamp automatically near the top-right corner of the Career Edition. Allow hiding it in customization while retaining the earned status and binder filter. Show one major stamp and up to three smaller badges to control clutter; these layout limits remain adjustable.

**DEFAULT initial major stamps:** Hall of Fame Inductee, 1st Overall Pick, First-Round Pick, and supported major college awards. Do not create unsupported National Champion, Super Bowl, MVP, or record claims simply because example stamp names appeared in brainstorming.

Stamp styling can be account cosmetic data. Stamp eligibility must always come from the specific prospect's earned results.

### 13.5 Customization and export

**DEFAULT flow:** Choose eligible scene → Choose unlocked frame/foil → Choose or hide earned stamps → Review front/back → Save to binder.

**DEFAULT:** Export the card front as a PNG. Keep accessible text details and a local data export separately. Card export must preserve layout and factual labels. A missing image must not block saving the run.

## 14. Binder, achievements, and persistence

**AGREED:** Preserve every saved creation in a sortable scrapbook/collector binder.

**AGREED requested sorts:** Point progression, draft pick, creation date. **DEFAULT definition:** “Point progression” means final college OVR minus starting college OVR; also show total skill growth in details so the two measures are not confused.

**DEFAULT additional sorts:** Final OVR, college receiving yards, NFL career receiving yards when available, and favorites.

**AGREED:** Hall of Fame filter. **DEFAULT additional filters:** Draft round/range, Undrafted, school, transfer history, 95+ OVR, career simulated, and available edition.

For NFL-only sorts, unsimulated careers appear after simulated entries and are labeled missing, not zero. For draft sorting, Undrafted appears after numbered picks. Ties use creation timestamp and prospect ID for stable ordering.

**AGREED:** Achievements can unlock frames, holographic effects, title treatments, and similar decoration. They cannot affect any gameplay inputs or difficulty.

**DEFAULT starting achievements:**

| Achievement | Requirement | Cosmetic |
| --- | --- | --- |
| Gym Rat | Improve any skill by at least 30 points in one run | Training frame |
| First-Round Talent | Actually drafted at pick 32 or earlier | Silver frame |
| Generational Talent | Finish with displayed college OVR of at least 95 | Gold frame |
| Transfer Story | Complete a transfer and finish the next season with higher OVR | Transfer border |
| Perfect Prospect | Finish with displayed college OVR of 99 | Premium foil |

These thresholds are starting proposals. A reusable decorative title treatment cannot fabricate an earned run credential.

**DEFAULT:** Local browser persistence first, no required login. Autosave accepted creation choices, training choices, committed block results, season transitions, Draft Night, NFL results, structured artwork evidence, award records, card customizations, cosmetics, and binder entries. Preserve random state so refresh is not a free reroll.

Save schema, position identity, position rules, balance, eligibility, and content versions must be recorded. Each completed entry preserves immutable display snapshots of attribute/stat labels, order, values, team identities, accolades, and evidence needed to read the card without today's catalogs. Adding a new position must not rewrite existing WR entries.

Import/export local data; reject invalid imports without replacing valid data. Known historical schemas use explicit migrations, preserving position, RNG state, results, versions, and evidence. Unsupported/newer position payloads are retained for read-only display/export when safe, with active continuation disabled; do not erase them or interpret them as WR. If storage is unavailable, keep the session playable and make the unsaved state clear.

**DEFERRED:** Cloud accounts, cross-device synchronization, public leaderboards, public profiles, trading, purchases, monetization, paid rerolls, ad integration, and multiplayer. No ad or payment system is required by the design.

## 15. Presentation, accessibility, and content boundaries

**AGREED direction:** A polished sports prospect dashboard with cards, grades, growth bars, readable statistics, concise football commentary, and satisfying reveals.

**DEFAULT:** Responsive desktop and mobile layouts, keyboard-operable controls, visible focus, text labels alongside colors, screen-reader-friendly result summaries, and reduced-motion behavior.

Offer Skip reveal / Fast-forward throughout long presentation sequences. Animations never control simulation truth or consume randomness. All required information remains available as text.

**DEFAULT content approach:** Keep real NFL receivers as trait sources, original game grades, original fictional prospects, and original reusable artwork. Do not scrape competitor grades, copy its interface or art, or require player photographs and official logos.

**OPEN:** Final receiver roster, school names, asset sources, and public-use permissions. Public launch and monetization are separate future decisions; this specification does not establish content clearance. An interchangeable content catalog is useful without replacing the agreed real-player prototype with fictional trait sources.

## 16. Release scope and completion boundary

### First complete local version

**AGREED scope:** All of the following form the complete gameplay loop, using the labeled defaults within each system:

- WR creation including gift, Size, three potentials, rerolls, and source-based autofill.
- Full skill sheet, fixed ceilings, and OVR.
- A WR-only playable registry behind a shared position-aware career framework; no other playable position.
- College choice, four-game blocks, positive development, annual diminishing returns, transfers, and bounded coaching interventions.
- Result-driven highlights and season history.
- Small scouting gauntlet and Draft Night with valid drafted/undrafted outcomes.
- Permanent draft pick, round, and drafting-team snapshot, with separate free-agent identity if needed.
- Both save-now and optional NFL-career branches.
- Run-based art eligibility, independent stamps, cosmetic-only achievements, customization, export, and persistent binder.
- Structured event/award evidence for scene unlocks, position-specific stat layouts, and historical display preservation.
- Local saving/resume, seed preservation, and basic import/export.

The NFL module is optional for players but remains part of this full design's implementation scope. A smaller core-only prototype may be a milestone; it must be labeled incomplete relative to this scope.

### Explicit exclusions

Do not add injuries, negative training, Work Ethic, personality stats, account power, extra positions, full team simulation, real-time football controls, 3D presentation, per-run AI images, authentication, cloud infrastructure, leaderboards, payments.

### Product acceptance examples

| Scenario | Required behavior |
| --- | --- |
| Route Running is the gift | Route Running is absent from every later selectable trait. |
| An autofill lands S-tier Vertical | It uses the same ceiling and growth rules as manually chosen S-tier Vertical. |
| A receiver repeats three times | Accept the result; do not secretly reroll it. |
| JUGS triggers after Game 4 | Reserve its annual type; a nonmatching plan gets one corrective week and then resumes normally. |
| Next plan is already Hands ++ | Record JUGS fulfilled/used without replacing identical practice or adding work. |
| A WR runs zero routes | Zero game-derived work; the full selected practice allocation remains. |
| NFL simulation is chosen immediately | Default Draft Edition already exists; Career Edition is added under the same binder entry. |
| A spin is skipped/refreshed | Show the same committed source offer/assignment; no extra random draw. |
| Drops recur later that year | JUGS cannot trigger again that year. |
| Growth reaches the ceiling | Clamp to the ceiling; never raise it. |
| A player skips the NFL epilogue | They still receive a complete result and collectible. |
| A career earns induction | Unlock HOF art and stamp; preserve HOF filtering when another scene is selected. |
| A user has all cosmetics | Identical seeds and decisions produce identical gameplay to a new account. |
| A user refreshes during a reveal | Resume the already committed result without extra gains or rerolls. |
| Sophomore season ends | Offer Declare after 24 games or Return for junior year; no forced redshirt or mandatory junior season. |
| A game totals 150 yards without an exceptional catch | Unlock Breakout Star if eligible, without inventing Spectacular Catch evidence. |
| A drafted prospect opens the NFL epilogue | Start with the saved drafting-team identity; the draft snapshot remains unchanged. |
| Another position is added later | Existing WR careers retain wr identity, rules, stats, evidence, and readable cards. |

## 17. Open-decision register

These are honest remaining decisions, not missing sections. The listed defaults let a later implementation proceed.

| ID | Open decision | Provisional fallback | Required before |
| --- | --- | --- | --- |
| O01 | Game name and visual identity | Working descriptive title; original sports-card design | Final branding |
| O02 | Exact skill list and OVR weights | Nine skills and weights in §6 | Balance sign-off |
| O03 | Grade mapping and ceiling visibility | Fixed mapping; exact ceiling in expanded details | Balance sign-off |
| O04 | Reroll count and offer scope | Three shared; reroll entire current offer | First creation playtest |
| O05 | Early-declaration incentives under positive-only development | Agreed sophomore choice; measure time-to-result versus extra OVR; add no hidden penalty | Career playtests |
| O06 | Exact training math, Focused split and school bonuses | V1.2 values in §§7–9; retain three modes and conservation of work | Balance sign-off |
| O07 | Intervention thresholds and priority | Agreed matching-plan fulfillment or one corrective week; default priority and no final-block carryover | First career playtest |
| O08 | Detailed gauntlet and draft model | Five archetypes and disclosed bands | Full-loop evaluation |
| O09 | NFL career and induction math | Short read-only career, transparent fictional thresholds | NFL module sign-off |
| O10 | Awards and record systems | Only implement awards with explicit modeled evidence | Adding each accolade |
| O11 | Art library and stamp layout | Reusable illustrations, layered 2D rendering, one major stamp | Visual release sign-off |
| O12 | Exact roster and school identities | Curated real receiver sources; configurable school profiles | Content release sign-off |
| O13 | Rights and distribution choices | Public GitHub Pages release authorized October 23, 2026 | Public release |
| O14 | Drafting-team identities and final board model | Original/neutral 32-team catalog, explicit seven-round 256-slot fictional board | Content and draft-model sign-off |
| O15 | Numeric rarity and decision-impact targets | Report paired-seed distributions before setting final targets | Balance sign-off |
| O16 | Additional professional awards and scene categories | All-Pro, rookie scene, and induction baseline only; unsupported records/championships unavailable | Adding each supported rule |

## 18. How to use this handoff

Read this document first, then [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Preserve all agreed rules. Treat defaults as visible, reversible implementation proposals. Record changes to defaults with a reason rather than presenting them as recovered decisions.

Implementation begins only after an explicit request to build the game. Once authorized, the companion plan is a complete engineering handoff and does not require a particular agent platform or installed skill.

## 19. Revision summary and unresolved design concerns

**Version 1.2 changes:** Recalibrated general/practice work with checked examples and a decision-dependent 99 witness; removed the zero-participation experience floor; restored Balanced/Focused/Intensive allocation choices; defined matching corrective-plan fulfillment; guaranteed automatic Draft Editions before NFL continuation; added original polished spin/reveal and browser visual-review requirements. The V1.1 position architecture and other settled systems remain intact.

**Version 1.1 changes:** Added shared position definitions and typed WR modules; position-preserving saves and card descriptors; revised general/practice budgets and band integration; confirmed sophomore declaration and one-week intervention substitution; tied artwork to structured event evidence; froze draft round/team identities; separated position-specific NFL awards/induction from shared lifecycle; expanded compatibility and balance acceptance requirements.

**Remaining concerns:** Coefficients and source grades are unmeasured defaults; 99 rarity and strategy diversity require the later simulator and playtests. Early declaration has limited strategic leverage under positive-only development with no injury risk. Draft board, award thresholds, professional aging, content permissions, and the final illustration library remain provisional. The position boundary must be validated with small contract/metadata fixtures rather than expanded into speculative gameplay.

No production game has been implemented or tested as part of preparing this specification. Numerical budget reasoning is not a substitute for the planned statistical and end-to-end verification.

