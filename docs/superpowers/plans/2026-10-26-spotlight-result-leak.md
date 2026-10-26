# Spotlight result leak fix

The user approved fixing the next receiver appearing before the spotlight. Keep deterministic rolls, odds, three rerolls, timing, skip, reduced motion, saves and card colors unchanged.

Cause: dispatch publishes the next run, awaits persistence, then starts the spotlight. The receiver panel renders during that await and remains exposed underneath the overlay.

Fix: conceal the entire offered receiver block (team, name, grades and reroll action) while either saving an action or revealing. Preserve its layout space; mark it inert and hidden from assistive technology. Reveal the existing result after completion/skip; instant/reduced-motion flows show it as soon as the action finishes.

Verification: failing browser regressions for initial spotlight, a delayed-save manual pick and reroll; then implement and run existing spotlight tests, unit tests, full browser suite, typecheck and Pages build. Review the narrow diff, preserve legal gates, commit/push under standing authorization and verify deployment. No source grades, creation odds or card design changes.
