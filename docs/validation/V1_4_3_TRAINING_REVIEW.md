# v1.4.3 training review and proposed scope

**Planning only. Stop before gameplay implementation.** Based on commit `5a5db5f` and the curated `wr-curated-10-v1.4.2` catalog. The owner's [planning brief](../superpowers/specs/2026-10-25-v1.4.3-training-owner-brief.md) remains authoritative for this audit's scope. Its reroll constraint is interpreted alongside the owner's later-approved three shared rerolls: preserve those existing rerolls; add no replacement offer/reroll system.

## Recommendation

Use **A: stronger readiness and smoother yearly development** as the conservative first direction. It addresses low starting ability and the freshman growth spike while retaining the current practice/experience budgets and their existing tradeoffs. The trial numbers below are proposals, not an approved numerical specification.

Do **not** ship either stronger budget-cut option unchanged. Although they reduce widespread ceiling saturation, an optimistic resource bound shows B cannot exceed 95.31 raw OVR and C cannot exceed 96.73, even with all-S potential, maximum starting rolls, maximum experience and unrealistically perfect work allocation/coaching. They would make displayed 99 unreachable under the current schools and three-year limit. This is a design consequence, not an ordinary sample failing to happen upon an elite result.

A does not yet have a demonstrated new 99 witness: its optimistic bound permits displayed 99, but the existing nine-block showcase reaches 97.96 rather than 98.76 after the trial changes. Final calibration must supply a reproducible exceptional-build witness before an implementation specification is approved. A also leaves broad junior ceiling attainment relatively high; it is a conservative first direction, not a complete solution to the long-term elite-potential pool.

## Formula and data-flow audit

| Stage | Actual production behavior | Reference |
|---|---|---|
| Source selection | Grades assign fixed trait ceilings. Gift is S/99 potential. Other source selections do not grant their current skill. | `src/app/domain/engine.ts:59`, `src/app/domain/development.ts:4` |
| Starting ability | Gift becomes **94 current ability**. Eight other attributes independently draw integer **50–65**, clipped to their own ceilings. Initial/current values and initial OVR are stored. | `src/app/domain/engine.ts:125` |
| OVR | Weighted sum; route running18%, hands16%, speed14%, release12%, body control10%, acceleration/vertical/YAC8% each, awareness6%. Raw OVR is retained; display is rounded. | `src/app/domain/positions.ts:3`, `src/app/domain/development.ts:5` |
| Chronology | Three four-game blocks per year; game simulation precedes that game's growth. Improved ability influences later games inside the same block. | `src/app/domain/engine.ts:136` |
| Practice | Balanced: `.8×9`; Focused: `4.32` selected plus `.36×8`; Intensive: `7.2` selected and zero elsewhere. Each totals **7.2 work/game**, **28.8/block**, **86.4/year**, before multipliers. | `src/app/domain/development.ts:22` |
| Game experience | Budget `3.6 × clamp(routes/30,0,1.2)`: half equally across nine skills and half in proportion to relevant reps. At30 routes: **3.6/game**, **14.4/block**; maximum4.32/game. Zero routes yields zero experience, while practice remains available. | `src/app/domain/development.ts:25`, `src/app/domain/engine.ts:144` |
| Year / school | Combined practice **and** experience get year factors **1.50 / 1.15 / .85**, then the school specialty coaching multiplier. | `src/app/domain/development.ts:29` |
| Mastery | For v1.2 runs, work-to-ability factors are1 below `ceiling−29`, .8 to `ceiling−14`, .5 to `ceiling−4`, then .25 to the ceiling. Excess work on a capped attribute is lost, not redistributed. These are ceiling-relative bands. | `src/app/domain/development.ts:9` |
| Schools | Meridian:1.25× routes/release, .8 opportunity; Cinder:1.25× speed/vertical, .9 opportunity; Openwater:1.05× all attributes,1.1 opportunity. All offense values are1; offense is displayed but currently unused in simulation. | `src/app/data/colleges.ts:5`, `src/app/domain/simulation.ts:14`, `src/app/app.html:70` |
| Coaching | Last-block measured problems trigger a deterministic intervention. Each type can be used once per season; only the first two block reviews can trigger, so at most two actual interventions/year. Next block's **first game** uses compulsory Intensive on that skill; the submitted plan resumes for games2–4. | `src/app/domain/coaching.ts:8`, `src/app/domain/engine.ts:139` |
| Coaching button | “Use coach’s focus” sets the selected plan to Intensive. This makes the entire submitted block Intensive and persists until the player changes it, rather than merely accepting the automatic one-game substitution. | `src/app/app.ts:269`, `src/app/app.html:73` |
| Declaration | Sophomores declare after24 games or return; juniors finish after36. There is no playable professional development period to give up by staying. | `src/app/domain/engine.ts:151` |
| Draft / cards | Evaluation is70% raw OVR +20% mean college game grade +10% mean scouting checks. Draft/card outcomes and historical displays are cloned/stored, not recalculated on load. | `src/app/domain/engine.ts:75`, `src/app/persistence/save.ts:87` |

Practice and experience are separate resources. Attribution currently splits realized gain in proportion to each resource's work after combined mastery/clipping; those numbers are not two independent applications of growth.

## Measured baseline

The full experiment matched **24** harness cases against production transitions: complete prospect values, every game/event/gain, intervention records and final RNG matched exactly. This guards the audit's simplified orchestration before using it for counterfactual experiments.

Main grid: **200 actual builds per mode**, shared seeds700001–700200, three schools, six training strategies, interventions on/off and baseline plus three trial variants. Creation chooses the highest-weight offered gift, then the highest offered ceiling×OVR-weight among unfilled attributes, with no rerolls. These are guided-choice model cohorts, not production telemetry or a random sample of human strategy. Reused conditions are not additional independent prospects.

| Current initial distributions | Quick | Full |
|---|---:|---:|
| Mean current OVR | 63.10 | 63.24 |
| Current OVR p10–p90 | 60.56–65.48 | 61.06–65.48 |
| Mean weighted potential | 89.29 | 89.76 |

The initial gap is real: source choices mostly raise future ceilings while eight current skills remain50–65. Natural Gift is already immediate elite ability in one skill. Raising every inherited trait to its source grade would collapse this distinction and is not proposed.

### Openwater / Full / existing automatic coaching

| Strategy | Freshman OVR | Junior OVR | Junior displayed90+ | Non-gift skills within1 of ceiling at junior end |
|---|---:|---:|---:|---:|
| Balanced | 79.36 | 88.73 | 34.5% | 61.1% |
| Focused, same primary trait | 78.19 | 85.73 | 1.0% | 23.3% |
| Intensive, same primary trait | 75.14 | 81.32 | 0/200 | 14.1% |
| Focused, rotating | 80.07 | 88.81 | 37.5% | 62.8% |
| Intensive, rotating | 79.38 | 88.76 | 38.0% | 62.6% |
| Focused, largest weighted gap each block | 80.38 | 89.42 | 50.5% | 79.0% |

“Same primary trait” deliberately keeps investing after it caps; it is a specialization stress test, not recommended play. “Rotating” cycles the eight non-gift skills; “adaptive” selects the largest weighted remaining gap each block. Switching is currently cost-free; a spread of focused choices can develop almost the whole build near potential. Fixed specialization already sacrifices other attributes, so the claim that no opportunity cost exists is not supported.

For example, fixed Intensive gained29.80 points in the primary skill but17.47 on average in the other non-gift skills; Balanced gained29.45 and29.00 respectively. Capped work forfeiture explains part of that cost. A like-for-like resource probe with all skills60, ceilings99, year1,30 routes, equal reps and no specialty coaching also shows lower non-target growth under Focused/Intensive; see `allocationProbe` in the JSON.

### School and intervention controls

Full/Balanced junior mean OVR: Meridian88.02, Cinder88.33, Openwater88.73. Opportunity and specialist coaching both matter; this cohort does not prove any school universally dominates every targeted build.

At Openwater, disabling interventions changes junior mean OVR88.73→88.67; disabling specialty coaching while retaining route opportunity gives88.40. Disabling experience gives84.45, disabling practice76.53. These are complete feedback experiments, not additive effects: ability changes subsequent performance and coaching triggers.

Removing year acceleration alone gives freshman74.96 instead of79.36 and junior87.53 instead of88.73. This strongly implicates the early multiplier in the freshman spike, rather than a broken ceiling check or merely the number of four-game blocks.

### Broad ceiling coverage and validation seeds

The real builds' “low” quintiles still have weighted potentials around the high80s. Additional fictional profiles therefore test non-gift ceilings72,87 and99, each retaining a route-running gift94/99. They are synthetic audit identities, not altered grades for any actual receiver. Baseline adaptive junior means are76.86,88.87 and96.91 respectively.

Independent real-build seeds800001–800200 repeat baseline/C across schools and Balanced/adaptive strategies. Full/Openwater adaptive junior displayed90+ is53% baseline versus4% C; within-one non-gift skills78.1% versus17.5%. Quick equivalents are42.5% versus3.5%, and83.8% versus21.4%. These support the direction of the stronger cut, but do not resolve its unacceptable 99-attainability consequence. No observed0/200 rate should be interpreted as an impossible outcome.

## Three tuning proposals — trial numbers only

All three trial options retain the Natural Gift94, add **8** to each non-gift starting draw (paired integer58–73, clipped to the original ceiling), and replace—not multiply—the existing year factors with **.85 / .95 / .90**. Those factors are independent experimental smoothing coefficients, not a reinterpretation of100/95/90 continuity.

| Option | Practice work/game | Experience budget at30 routes | Intended tradeoff |
|---|---:|---:|---|
| **A — readiness and yearly smoothing** | 7.2 | 3.6 | Smallest change; stronger entry and roughly halved freshman OVR gain; leaves more late ceiling saturation. Recommended first direction, subject to an exceptional-build guard. |
| **B — lower total shared work** | 5.4 | 1.8 | Largest general slowdown; makes specialization costly and weakens its direct payoff as well. Reject these coefficients if99 remains earnable. |
| **C — retain practice, reduce experience** | 7.2 | 1.2 | Keeps current direct-practice allocations while reducing passive all-around progress. Better lever for agency than B, but these particular totals still prohibit99. Recalibrate before any approval to implement. |

Full/Openwater/Balanced,200 paired prospects:

| Case | Initial | Freshman | Sophomore | Junior | Junior90+ | Non-gift within1 at junior end |
|---|---:|---:|---:|---:|---:|---:|
| Current | 63.24 | 79.36 | 86.23 | 88.73 | 34.5% | 61.1% |
| A | 70.01 | 78.62 | 85.00 | 88.33 | 22.5% | 49.3% |
| B | 70.01 | 76.02 | 81.38 | 84.97 | 0/200 | 10.1% |
| C | 70.01 | 76.86 | 82.67 | 86.29 | 1.0% | 18.2% |

Current→A freshman growth is16.12→8.61 OVR, while college entry rises6.77. These are model observations under the documented policy, not owner-approved targets.

None of these options creates an early-declaration opportunity cost. For this cohort, A's extra junior year adds3.33 OVR on average, compared with2.50 currently. Delaying growth can make the third college year more valuable; it does not itself give the player a reason to declare earlier. Keep that decision in the separate declaration/recruiting design discussion; do not invent playable pro-development time, injuries or negative ability growth to force it.

The existing development-only displayed99 showcase reproduces98.763418 on production. Applying the proposed inputs and the same nine-block allocation produces A97.957452, B94.024255 and C95.382220. A's relaxed upper bound is98.978256, so99 is not ruled out, but a legal allocation witness still needs to be found or the coefficients adjusted. B/C's upper bounds rule it out even before actual strategy restrictions.

## Prioritized findings

1. **Balance concern, confirmed by measurements:** low initial readiness followed by very fast freshman growth. The1.5 multiplier and per-game practice+experience economy are primary levers.
2. **Balance concern:** adaptive spread of focus choices reaches a large share of ceilings. Existing fixed-focus opportunity costs are real. Do not add punitive switching losses or lower receiver grades as an automatic workaround.
3. **Product ambiguity:**100/95/90 has no implementation. The earlier preserved table applies to school-history paths across freshman/sophomore/junior years; the latest discussion describes training-focus continuity. Meaning, cadence, forced-coach exceptions, reset/recovery and replacement-versus-stacking need confirmation.
4. **UX/design ambiguity:** the coach button changes the persistent chosen plan, while compulsory enforcement is a one-game override. Decide whether the button should retain its current meaning or accept only the temporary override.
5. **Confirmed simulation defect, separate scope:** the long-catch branch guarantees a touchdown by setting field distance equal to gain. Independent per-target field position, team-score construction, unused displayed difficulty and frequent perfect grades also constrain realism. Training tuning will not fix these. Current simulation is held fixed across these experiments; no NFL-career overhaul or scoring patch was made.
6. **Current safeguard works:** all simulated growth stayed nonnegative and within stored ceilings. No evidence of a training formula exceeding a ceiling was found.

## Approval and implementation checkpoint

Before writing production changes, confirm:

- The readiness/year-smoothing direction and a desired late-college range; the measured proposal is not itself approval.
- Whether displayed95 and99 must remain possible with rare exceptional builds. Recommendation: retain them as earned outcomes and require a constructive witness.
- Whether100/95/90 is annual school continuity, annual training specialization or block-level training continuity. The source does not settle this; do not compound it with current or proposed year factors by default.
- Whether to include the coach-button behavior clarification in this pass. No extra intervention system is proposed.

Then produce a narrow numerical implementation specification: version only the behavior that needs to differ for old active runs; leave initial/current values, fixed ceilings and frozen cards intact. Changing bounded starting values/growth alone does not require a broad schema migration. Only a separately approved school ceiling above natural potential would require a distinct ability/potential/training-ceiling model.

Regression gates for that later implementation: exact old-save/card roundtrips, deterministic rerolls/selection, four-game chronology, once-per-type-per-season coaching, correct temporary override, resource accounting, nonnegative bounded growth, block/year distributions, useful focused tradeoffs and an achievable exceptional witness. Recheck draft/achievement/card effects before release. Retain the existing optional automatic pro career and three shared rerolls.

## Reproduction and scope limits

Run:

```powershell
npx tsx tools/audit-v1.4.3-training.ts
npx tsx tools/audit-v1.4.3-attainability.ts
npm run typecheck
```

Artifacts: [readable tables](V1_4_3_TRAINING_TABLES.md), [full distributions and controls](V1_4_3_TRAINING_EXPERIMENTS.json), [attainability assumptions and bounds](V1_4_3_TRAINING_ATTAINABILITY.json). The full JSON includes per-block checkpoints, within-mode potential strata, school/strategy/intervention combinations, held-out seeds and production source hashes.

The main grid contains57,600 three-year scenario careers, controls6,000, absolute synthetic cases4,800 and held-out cases4,800: **73,200 scenario careers / 2,635,200 games**, plus parity validation. There are400 main real builds,400 independent held-out real builds and600 absolute synthetic initial profiles, repeatedly reused across conditions. Sample tail percentages have considerable uncertainty. Production game formulas, UI, receiver grades, saves and deployed site are unchanged.

Verification: typecheck and all120 unit tests passed; a second full audit reproduced the main JSON byte-for-byte. Attainability assertions reproduce the existing development-only99 fixture and check all trial witnesses against their upper bounds. Independent read-only review confirmed the formulas, cohort accounting and bound calculation without blocking findings. No browser/build/deployment run is needed for these planning artifacts; application sources and browser tests have no diff.

**Stopping point:** audit, reproducible experiments, issue separation and quantified proposals complete. No production balance constants have been changed or committed; implementation remains unapproved.
