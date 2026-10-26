# v1.4.3 training implementation verification

The owner approved the [numerical specification](../superpowers/specs/2026-10-25-v1.4.3-training-numerical-spec.md) on October 25, 2026 after reviewing the transfer factors. This release changes new-run development, not source grades or college scoring rules.

## Shipped behavior

- New runs are stamped `v1.4.3`. Non-gift current abilities start at 58–73, clipped at the stored ceiling; Gift stays 94. Creation uses the same number of random draws.
- Practice has eight work units per game. Focused allocates 4.8 to the selected skill and 0.4 to each other skill; Intensive allocates all eight to its target; Balanced shares equally.
- Experience work, ceiling-relative mastery and existing school specialties are preserved. Annual learning replaces the old year factors and multiplies school continuity once: staying `.85/.95/.90`; ABB `.85/.85/.80`; AAB `.85/.95/.75`; ABC and ABA `.85/.85/.65`.
- A forced coach plan covers only the next game; the submitted plan resumes for the other three. The misleading persistent-coach shortcut is removed.
- Missing, explicit legacy and v1.2 balance versions keep old development. Existing prospects are not reinitialized. Frozen outcomes/cards and catalog/pro identities are preserved. Import validation accepts the new discriminator without a schema bump.

## Verification evidence

- New regression suite observed failing before implementation: 15 failures, four passes; after implementation all 19 passed. Full suite: **139 tests passed**. Typecheck passes.
- `npx tsx tools/verify-v1.4.3-training-implementation.ts`: **144 scenario groups, 28,800 careers, 1,036,800 games** using actual production commands. Initial and year/block OVR distributions match the pre-implementation calibration at its stored three-decimal precision (mean, minimum, p10, median, p90, p95 and maximum). This includes six policies/both modes/all three staying schools, and Balanced/adaptive Focused across all 27 school histories. The same seeded prospects are reused across conditions; this is not 28,800 independent builds. See [implementation JSON](V1_4_3_TRAINING_IMPLEMENTATION.json).
- `npx tsx tools/verify-v1.4.3-training-witness.ts` compares every development step with the independent planned calculation. Raw98.5495854545, displayed99 remains possible in the conditional all-S/max-start/fixed-rep fixture. This is not a generated career or rarity measurement.
- Pages production build passes: initial791.05kB / estimated transfer152.14kB. Existing750kB warning remains (41.05kB over); previous release initial790.77kB.
- Fresh read-only whole-change review found no Critical/Important issues. Minor coverage gap deferred: explicit missing/legacy pre-creation range cases are not separately parameterized; the v1.2 pre-creation case and missing/legacy development cases pass, and those initialization branches share the old range.
- Full Chromium browser suite: **65 passed (2.6m)**, including the new390×844 coach/plan/save regression and the existing complete journey, imports, frozen branding, contrast, mobile controls, rerolls and spotlight tests. Browser viewport testing is emulation, not a physical iPhone test. The initial sandbox run could not connect to its local server; the final suite ran outside that restriction in a separate output directory. An earlier diagnostic run overlapped trace output with a suite and was discarded. The new regression's incorrect post-reload Home-button expectation was corrected to verify direct `#play` restoration; no app change was needed.

## Boundaries

Starting readiness and freshman pacing change while typical junior OVR remains similar. Frequent elite ceilings, early declaration incentives, training-focus switching, drive/scoring realism, and excessive receiving totals remain separate design work. No promise of a measured 99-career probability is made.

The required legal checkpoint reviewed About, Terms, Privacy and Contact against the shipped training changes. No public copy/service change was required; existing publication gates remain intact.
