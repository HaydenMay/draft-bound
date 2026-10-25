# Receiver curation implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Curate recognizable receiver pools and fit fresh spotlight boards without scrolling.
**Architecture:** Retain the original profile snapshot and introduce explicit versioned pool membership, pinned on new runs. Presentation consumes the same version as the engine and importer.
**Tech stack:** Existing Angular, TypeScript, Vitest and Playwright.
**Spec:** `docs/superpowers/specs/2026-10-25-receiver-curation-design.md`.

## Global constraints

- At most ten eligible receivers per team for new runs; uniform team-first sampling.
- Preserve archived pool ordering, saves, deterministic checkpoints and cards.
- No grade, training, simulation, service, artwork or schema change.
- Two columns on phones, five on wider screens; remove automatic winner scrolling.

## Review focus

- Missing version means archived pool, never implicitly upgraded.
- Quick autofill and rerolls must use the same catalog as manual picks.
- Unknown versions and forged rolls/traits must fail import validation.
- Long names must wrap and short/zoomed viewports must remain accessible.
- New draft snapshots identify the correct catalog while old cards stay unchanged.

## Task 1: Versioned curated pools

Files: `data/receiver-pools.json`, `data/receiver-catalog.ts`, `domain/models.ts`, `domain/engine.ts`, `persistence/save.ts`, catalog/creation tests and frozen receiver fixtures.

Interface: `eligibleReceiversForTeam(teamId, version?)`, `receiverProfilesForVersion(version?)`, `receiverCatalogVersionForRun(run)`; default direct catalog calls use current; missing run version uses archived.

- [x] Capture old Quick/Full save checkpoints and literal expected continuations before edits.
- [x] Add failing cap/membership, version pin, archived continuation and unknown-version tests; run and observe failure.
- [x] Add explicit ten-player lists, retaining canonical grades and original memberships. Pin new runs and route all engine and import paths by version.
- [x] Run unit suite and typecheck, inspect retained/deferred names and grade distributions.

## Task 2: Spotlight fit and release verification

Files: `app.ts`, `shared/spotlight-reveal.ts`, `shared/spotlight-reveal.css`, spotlight E2E, curation audit/report, roadmap and legal checkpoint.

Interface: Boards receive profiles selected by Task 1's run version; animation remains cosmetic.

- [x] Add failing phone/desktop fit and no-scroll winner tests, including longest names and ten-player boards.
- [x] Use versioned profiles; five/two-column natural-height boards and remove winner scroll. Preserve archived manual overflow.
- [x] Audit seeded current frequencies and archived checkpoint replay; verify new pools have no omitted reachable candidates.
- [x] Run typecheck, whole unit/browser suites and Pages build; review diff and legal checkpoint. Integration follows the owner’s existing authorization to push main.

Pre-flight: Task 2 consumes Task 1's catalog helper; both engine and presentation must pass the run's version. No conflict.

Execution notes: Native implementation in the existing isolated worktree. Task 1: 120 unit tests pass and typecheck passes, including frozen pre-curation Quick/Full continuation and archived draft/card preservation. Task 2: initial fit tests failed with 15 candidates; updated three-viewport fit tests pass. Full-suite branding test exposed a seed-dependent earned-badge assumption; it now uses the existing frozen legacy collection and its original cosmetic profile. Independent review found no blocking regressions. Roadmap updated and archived draft-completion coverage added in response to review.

Final verification: 120 unit tests, 64 browser tests, typecheck and Pages build pass. Frequency audit: 20,000 prospects, 160,000 assignments, all 320 memberships reached. See `docs/validation/RECEIVER_CURATION_RELEASE.md`. No deferred review findings remain in this pass.
