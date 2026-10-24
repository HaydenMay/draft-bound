# v1.4 Release Checklist

- [x] Achievement registry and Binder destination implemented.
- [x] Legend frame and foil requirements explained; HOF career grant is retroactive, additive and immediately usable.
- [x] Source-player catalog versioned; v1.3.2 active runs and drafts retain the frozen source catalog.
- [x] Professional simulator versioned; new drafts use v1.4, old drafts use legacy rules and saved careers are immutable.
- [x] Professional and source distribution evidence documented with repeatable seeds.
- [x] Current development semantics explained without changing the college/training model.
- [x] Typecheck, 94 unit tests, 44 E2E tests, Pages build, baseline balance, paired progression report and v1.4 balance cohorts pass.
- [x] Imported v1.4 card frames, foil and scene IDs are validated against saved achievements and edition unlocks; frozen pre-v1.4 card finishes remain compatible.
- [x] Browser/mobile visual and navigation checks pass at the tested viewport sizes.
- [ ] Physical iOS/Safari validation (not available in this environment).
- [x] Push v1.4 to GitHub `main`; GitHub Actions build and deploy passed on 2026-10-24, and the public Pages endpoint returned HTTP 200.

## Stop point

Stop after v1.4 is published and Pages status is verified. Leave the next college/recruiting architecture, additional positions, card-art system, real-world teams, accounts and cloud saves for their separately approved releases.

## Publication record

- Published commit: `3b55c3f468afae6cf885fa4d0c5f6c03fc525c93`
- Workflow: [Verify and publish Draft Bound](https://github.com/HaydenMay/draft-bound/actions/runs/40131593178) — build and deploy succeeded.
- Live site: [Draftbound on GitHub Pages](https://haydenmay.github.io/draft-bound/) — HTTP 200; page title and fingerprinted application bundle verified.
