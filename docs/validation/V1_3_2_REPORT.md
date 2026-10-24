# Draftbound v1.3.2 validation report

**Scope:** Stability and usability only. No v1.4 gameplay or v1.5 artwork work.

## Requirements

| Requirement | Status | Evidence |
|---|---|---|
| Protect 1,000-entry binder boundary | Complete | See persistence and browser tests below. New runs are blocked with export access at capacity; draft append failure retains the valid run and collection. |
| Preserve v1.3.1 saves | Complete | Three synthetic fixtures cover Quick, Full and a populated collection with draft/career entries, customizations, unlocks and preferences. Roundtrip and public backup-flow checks preserve the fixture data. |
| Full default and clear selection counts | Complete | Fresh creator defaults to Full · 8 picks; Quick · 3 picks remains selectable. Existing runs keep their stored creation mode. |
| Mobile editable-control size | Complete | Chromium Playwright emulation measures editable controls at 16px minimum at 320, 375 and 390 CSS-pixel widths and checks page overflow. Physical iOS Safari was not independently tested. |
| Coaching intervention explanation | Complete | Training copy says focus applies to the next game and the selected plan resumes; recap identifies first-game fulfillment. Existing engine coverage exercises both already-compliant and substituted paths. |
| Project documentation | Complete | README, durable agent guidance, release notes, fixture documentation and v1.4 planning reference updated. Legal publication checkpoint retained. |

## Compatibility fixtures

Synthetic fixture files are in `src/app/persistence/fixtures/`. See the directory README for each fixture's scope. `src/app/persistence/save.spec.ts` asserts exact serialized round trips, and `e2e/v1.3.2.spec.ts` exercises export, preview, replacement backup and import using the populated collection. These are future v1.4 migration baselines, not real-player backups.

## Verification

- `npm run typecheck` — passed.
- `npm test -- --reporter=dot` — 79/79 tests passed across 10 files.
- `npm run test:e2e -- --reporter=line` — 40/40 Chromium browser tests passed. These include both 999→1,000 final-card append/reload and active-run-at-capacity rejection; failed-write warning/export recovery at the boundary; v1.3.1 backup import/export; Full default, Quick selection and saved-run resume; mobile font sizes/overflow for creator, binder, settings, import and training controls; and the seeded coach-note case.
- `npm run build:pages` — passed after retrying outside the sandbox when Windows denied creating the initial `dist` directory. Output: `main-ED36WGQD.js` (405.17 kB raw / 107.97 kB estimated transfer) and `styles-AM4HY5BZ.css` (156.71 kB raw / 22.74 kB estimated transfer); base path `/draft-bound/`.
- Mobile browser checks are emulation, not physical iPhone Safari verification.

The release review compared About, Terms, Privacy and Contact with the shipped changes. No copy change was required: the update does not add services, accounts, data collection, or alter the disclosed game loop. Terms and Privacy continue to show their existing draft notices pending owner-approved public contact details; Contact remains disabled as a submission path until delivery is configured. The legal checkpoint was retained unchanged.

### Documentation review

- README describes the release in this branch, Full as the new-prospect default, Quick as optional, IndexedDB/local backups, 16 palettes and independent appearance modes.
- Obsolete v1.3.1 feature-branch/live-v1.2 statements are removed; implementation and release verification are linked.
- AGENTS.md keeps durable UX/DX/AX, data, accessibility and legal guidance while treating old release plans as historical.
- The v1.4 handoff remains a planning reference with open questions and links to frozen v1.3.1 compatibility fixtures.
- Legal draft notices and the Contact activation gate remain in force.

**Integration/deployment:** pending final code review and push. Record the merged commit and GitHub Pages workflow result here after publishing; the local build is not evidence of deployment.

## Deferred

No game balance, player-pool, recruit-rating, training-growth, coaching-trigger, draft/pro-outcome or Hall of Fame tuning. No additional position, team identity, modular face/jersey treatment, artwork or card overhaul. No contact service, account, analytics or cloud-save integration. Legal notices remain governed by `docs/LEGAL_REVIEW_CHECKPOINT.md`.
