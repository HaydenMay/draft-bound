# Spotlight result visibility fix

## Root cause and fix

The next rolled receiver was published to the page before persistence completed and before the deferred spotlight component appeared. This exposed the next name, team and grades early. The offer block now preserves its layout while hidden, inert and excluded from assistive technology throughout saving and reveal. Completion/skip restores the actual rolled offer; focus waits for the next rendered frame. No RNG, grades, reroll budget, animation timings or card-color rules changed.

## Evidence

The delayed-save browser regression reproduced the bug (expected hidden, received visible). After the fix, all five focused cases passed: initial reveal/reroll concealment, delayed manual-pick save, keyboard skip/focus, natural completion and reduced motion. The first cold-server test attempt also encountered a navigation timeout; the meaningful regression failure was the visible next offer. A temporary template closing-tag omission was corrected before the successful production build.

156 unit tests, typecheck and Pages build pass. Initial bundle 807.38 kB; existing 750 kB warning remains. Full browser-suite and review results are recorded below after completion. Legal checkpoint reviewed; no public policy changes. Tests use Chromium, including existing narrow mobile cases; no physical Safari check.

Fresh read-only review found no scoped issues. Local full browser run: 70/71 passed; the unrelated thousand-card capacity test timed out in readSave after its UI assertions, then passed in isolation (7.3s test / 16.9s run) without source changes. The complete GitHub suite is the final publication check. No thresholds or retries were loosened.
