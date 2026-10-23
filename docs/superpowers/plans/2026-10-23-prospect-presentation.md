# Prospect presentation and coaching implementation plan

> **For agentic workers:** Use superpowers:executing-plans for native implementation and a fresh whole-change review before publication.

**Goal:** Make prospect creation, coaching and four-game sims readable, animated and worth watching; give each collectible scene original art.

**Architecture:** Preserve domain-first, saved seeded outcomes. Add pure recruiting/coaching/presentation models and focused Angular reveal/broadcast components. UI clocks never draw gameplay RNG. Keep schema-1 saves and completed cards compatible.

**Tech stack:** Existing Angular/TypeScript, native CSS/SVG/canvas, Vitest, Playwright; existing artwork pending user-supplied replacements.

## Confirmed design

- School names and balance remain unchanged while more schools are considered.
- Recruit stars use a potential-heavy blend, confirmed by the user. Default: 75% weighted ceiling OVR + 25% starting OVR, frozen from initial values. Fixed 1–5-star bands; cosmetic information, never a gameplay bonus or official recruiting claim. Show after the five automatic trait reveals and before college commitment.
- Each automatic trait gets a visible player/source, attribute, grade and ceiling reveal. The five rolls remain committed together after the third manual choice; presentation progressively reveals those fixed results. Replay after refresh; never reroll. Show all/skip and reduced-motion alternatives.
- Four-game training blocks remain intact. Default quick broadcast stages each game's actual matchup, result, receiving line and event-backed highlights, then shows the complete recap. Accessible next/skip, fast preference and reduced motion; refresh recovers saved games and can replay the broadcast. No fabricated intermediate scores or unrelated play-by-play.
- Coaching uses both actual recent performance and current skill/headroom. No corrective JUGS at elite hands (90+) and no exercise for an already capped skill. Replace fixed JUGS-first selection with severity plus skill-need ranking, with no gameplay RNG. Add route timing, first-step/burst, tracking/elevation, after-catch and film-room opportunities alongside JUGS, press and contact work. Require meaningful samples and corresponding performance evidence; no random generic popups. Existing first-game substitution, one-per-type-per-year and no final-block intervention rules remain.
- Artwork uniqueness means one different illustration per named collectible scene, confirmed by user. User will supply six distinct illustrations for red-zone, breakout, reliable-hands, transfer, rookie, and gold-jacket scenes. Provide baseline prompt and audit; do not generate or integrate new artwork. Jersey recoloring layers remain the future art pipeline; no runtime AI service.
- More motion: source rolls/trait reveals, recruit badge, broadcast transitions, card entrances, earned stamp/selection feedback. Use transforms/opacity, respect reduced motion and keyboard access, avoid excessive copy and indefinite delays.

## Tasks

- [ ] 1. Recruiting + coaching domain: failing tests for potential-heavy immutable rating, thresholds, 94-hands JUGS regression, distinct performance triggers, severity selection, capped skills and no-repeat/final-block guards. Implement focused pure modules; extend intervention validation compatibly; preserve uniform draws and existing creation outcomes.
- [ ] 2. Trait reveal + recruit summary: tests for five visible saved rolls, no hidden sources leaking through blueprint during reveal, skip/reduced motion, refresh invariance and recruit badge before college. Implement focused component and replay controls without new RNG or mandatory extra gameplay decisions.
- [ ] 3. Quick broadcasts + motion: tests for four real saved games, truthful event highlights, skip/replay/refresh, reduced motion, disabled conflicting actions and mobile containment. Implement broadcast component and presentation controller; keep completed outcomes committed before clocks start. Preserve fast preference.
- [ ] 4. Scene art: use imagegen for six distinct original scenes, inspect and copy into public/art, update catalog and content checks. Test duplicate-path rejection and duplicate-content check. Keep old saved scene IDs and assets readable.
- [ ] 5. Verification + release: unit/typecheck/Pages build; full browser college-to-draft/career/import/export/dark/mobile checks plus new flows. Review rendered screenshots/PNG, collect intervention distribution on varied seeded runs, and review independently. Fix findings, commit and publish through existing authorized Pages workflow; verify public site.

## Review focus / stop criteria

- No changes to school coefficients, normal uniform player rolls or practice budgets.
- No timer changes a committed result; refreshed or skipped reveals/broadcasts preserve identities, stats and RNG.
- Star rating never drifts as current skills improve.
- Elite hands, insufficient samples and capped ceilings do not produce irrelevant coaching. Other types must be reachable from real statistics, not just synthetic flags.
- New intervention IDs validate on reload/import, old IDs still load, yearly usage capacity accounts for expanded catalog.
- Artwork handoff clearly lists reused scenes and required distinct replacements. Uniqueness audit checks paths and file hashes when user assets arrive.
- Complete when all requested flows work, checks pass, assets are inspected, review findings are resolved and deployment is verified. Do not add schools or broader gameplay systems.

## Execution ledger

- Confirmed: user chose potential-heavy blend and distinct art per named scene.
- Ruling: preserve the task-owned clean checkout and use a feature branch in place; no new worktree/approval interruption for this reversible task.
- Defaults such as star thresholds and coaching sample sizes are implementation choices, not user-approved numerical rules. Document exact values and validation results at completion.

- User steering: stop image generation; terminated pending generation cell. No generated assets were copied into the project. Delivered outputs/ART_PROMPT_BASELINE.md and project documentation; user handles approved images while implementation continues.

## Execution stopped — user requested planning only

The user explicitly requested "Plan for now not build. Lets plan v1.2". Do not continue implementation, run release work, commit/merge or publish this draft. The new planning authority is docs/superpowers/specs/2026-10-23-v1.2-planning.md. Duplicate prevention now applies within every three-player offer, with repeats allowed between offers. Hall of Fame thresholds stay unchanged; investigate excessive college OVR progression instead. Existing local implementation is unpublished and not approved as v1.2.
