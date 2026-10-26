# v1.4.4 systems verification

Owner scope: complete the remaining college simulation, attainable-development, declaration and automatic-career/single-card systems. The owner selected preserving grades and creation rolls. Cosmetic styling, signatures, card inspection and new artwork remain future work. See the [implementation plan](../superpowers/plans/2026-10-26-v1.4.4-systems.md).

## Changes

- New college games use 10–14 possessions, at most62–78 offensive scrimmage plays and a28–42 team pass-attempt budget. Routes are a subset of those passes. Downs, first downs and field position persist within a possession. Receiving TDs contribute to the team's actual possession score. Field goals are chosen before fourth-down scrimmage in range; failed fourth-down conversions cannot score afterward. Catch difficulty and opponent strength affect completion probability. Long gains can finish short of the goal line.
- Grades combine efficiency, production, drops and press losses, with additional headroom above90 before clamping at100. Normal performances no longer routinely max the scale.
- Receiver grades, ceilings, uniform team/player rolls and three rerolls are unchanged. New v1.4.4 runs retain58–73 non-gift starts, Gift94, eight-unit practice and annual school continuity. Non-S ceilings use stronger final mastery bands (.35 for the preceding10 points; .125 for the final4). S99 retains its existing mastery path. Potential remains an upper limit, not an automatic outcome.
- New professional careers use age-based windows: sophomore entry at22 versus junior entry at23. Equal ability/seed yields one additional NFL season when declaring earlier and the same retirement age. Returning can improve ability, draft position and career durability; no NFL attributes develop and no injuries or negative college growth are introduced.
- New prospects automatically receive a deterministic career when their draft result is committed. Draft night remains its own reveal, followed by a career recap and one canonical customizable card. Old card URLs resolve the new entry's canonical career design. Browser/PNG use final college OVR. College/draft/pro scenes remain available where earned. Existing saved games, career results and two-edition entries stay unchanged; no destructive migration.
- Single-card saves require their career and matching compatibility/customization fields. Existing import limits, backup flows, conflict handling and failed-write/export safeguards remain in place. New rules are selected by explicit version fields; historical fixture/audit builders explicitly retain old versions.

## Measurements

[Career audit](V1_4_4_SYSTEMS_AUDIT.json): 200 shared seeds per mode, 400 distinct generated builds reused across two rule versions, three schools and two training policies. **4,800 scenario careers /172,800 simulated college games**, with sophomore-declare versus junior-return branches from the same builds. Highest weighted offered gift, best offered ceiling×weight for manual choices, no rerolls. These are controlled model experiments, not independent samples per condition or real-player telemetry.

Full/Openwater examples:

| Junior result | v1.4.3 Balanced | v1.4.4 Balanced | v1.4.3 adaptive Focused | v1.4.4 adaptive Focused |
|---|---:|---:|---:|---:|
| Mean OVR |88.435|86.414|89.038|87.060|
| Displayed90+ |31%|3%|45%|8%|

Under the new model the Balanced cohort averages83.290 OVR after sophomore year and86.414 after junior year. Only10.125% of its non-gift attributes finish within one point of their ceilings (adaptive8.5%). Higher ceilings have not been silently removed or regraded.

[Fixed-ability probes](V1_4_4_COLLEGE_PROBES.json): eight cases of10,000 games each, using the same seeds across60/80/93/99 current-ability profiles, Openwater and neutral185cm/90kg. These are synthetic simulation inputs, not generated/attainable-prospect probabilities.

At fixed93 ability, mean receiving production changes from171.939 yards/1.837 TD per game to116.030/0.953. Perfect grades fall from29.24% to0.19%. Of639 new-model catches of at least50 yards,410 finish without a touchdown; all6,494 such legacy catches were TDs. The new10,000-game93 probe contains no seven-TD or490-yard game; this sample does not prove those events impossible. The99 probe still produces an exceptional401-yard game and a six-TD game.

[Declaration subset](V1_4_4_DECLARATION_AUDIT.json) reuses the same career audit, not extra independent prospects. Declaring yields higher final NFL yardage in19.5% of Full/Openwater Balanced pairs and13% of adaptive pairs; returning wins the rest in those samples and remains better on average. This introduces a genuine professional opportunity cost without claiming equal expected value or a guaranteed best choice. Users see the age/window tradeoff before deciding.

The conditional all-S/max-start/fixed-rep witness still reaches raw98.5495854545/displayed99 under both v1.4.3 and v1.4.4 development. This remains a mathematical development witness, not an end-to-end generated99 seed or rarity estimate.

## Verification and review

- New domain regressions observed RED before implementation, then GREEN. Full unit suite:146 passed. Typecheck and Pages build pass. Production initial bundle797.49kB /estimated transfer153.75kB; existing750kB warning remains.
- A fresh whole-change review found one Important defect (field-goal scoring after a failed fourth down). Fixed via explicit live-possession eligibility and fourth-down kick choice; regression observed RED→GREEN and146-test suite passed afterward. Grade headroom was recalibrated after its seeded regression exposed excessive top-end saturation.
- Minor coverage gap deferred: the seeded route assertion uses70 although the implemented pass cap is42; total-play/drive termination has no direct public trace assertion. Budgets are enforced in the model and exercised by the seeded suites/probes.
- Full Chromium suite: **66 passed (2.7m)**. Covers automatic career/card creation, one canonical design through old URLs, legacy editions, complete journeys, PNG export, imports, capacity limits, protected writes, themes, accessibility and spotlight/rerolls. An initial full run had one1000-entry `readSave` timeout; that case passed twice in isolation, then the entire clean suite passed without production changes. Viewport checks emulate a phone; no physical iPhone verification is claimed.
- About's description now reflects the owner-approved automatic-career/one-card flow. Terms, Privacy and Contact still describe the game/services accurately; publication gates and draft notices remain unchanged. No new services, uploads, tracking, fonts or artwork.
