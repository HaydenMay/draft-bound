# Draftbound v1.3.1 implementation report

Implemented in `feat/legal-visual-polish`, isolated from the live v1.2 `main` at `cb86e1b1d1a5184430750874f0d11df3eda106f0`. Public deployment is deliberately pending the agreed owner/legal review gate. No v1.4 or v1.5 gameplay or artwork work was implemented.

## Changes

The creator now has four equal position tiles: selected WR and disabled, visibly locked QB/RB/TE. Desktop uses four across; phones use a 2×2 grid. Full names, generated editable names, jersey validation and Quick/Full creation remain available. The preview catalog does not expand playable position IDs.

Settings has 16 compact swatches and one theme preview. System/Light/Dark remains independent of palette identity. A candidate changes only the preview; Apply writes it, dismissal cancels it. A failed write keeps the committed palette, exposes an error in the dialog and retains the candidate for retry. The gallery supports successive native radio arrow-key choices.

All twelve researched palettes are included, plus the four other retained identities. The previous `navy` ID supplies Navy Gold rather than creating a duplicate. Burgundy Bronze uses the requested `#382A31` Dark surface. Complete Light/Dark mappings and derived swatches remain in `src/colors.css`; the TypeScript catalog contains IDs and names. The bootstrap allowlist is generated from that catalog. [Palette inventory](V1_3_1_PALETTES.md).

Ornamental sheriff marks were removed. Earned seals and honor symbols use a shared shield path, including PNG export; five-point recruiting/favorite stars retain their function. Printed DB logos use fixed lettering and arrow tokens, independent of saved school colors and interface themes. The gear has symmetric geometry. Essential control boundaries, focus rings, links and semantic status colors have distinct roles. Native select chevrons now have readable generated Light/Dark variants.

About, Privacy, Terms and Contact have direct hash links, refresh and browser Back support. Navigating through them preserves active progress, RNG and saved collections. They also render after a storage-load failure. The footer keeps How to play and adds information links and a short independence statement. Settings remains in the header with the accessible name **Settings**.

## Requirement status

| Requirement | Status | Evidence / limit |
|---|---|---|
| Architecture, runtime, saved-data and asset audit | Complete | [Audit](V1_3_1_AUDIT.md), baseline runtime JSON |
| Remove decorative sheriff marks | Complete | No `mark` icon remains in UI/catalog/public assets; semantic scene IDs unchanged |
| Preserve meaningful stars | Complete | Recruiting, favorite interaction and reload regressions pass |
| Shared earned shield presentation | Complete | Shared `SHIELD_PATH`; browser/PNG seal pixels checked |
| Canonical card logo across saved school colors | Complete | Two saved palettes, both editions and two interface palettes; identical PNG logo crops |
| Existing entries, snapshots, unlocks and ownership | Complete | Deep equality before/after information navigation and card export; no migration |
| Four equal-size position tiles | Complete | Bounding-box checks at 1440, 768 and 390px |
| WR playable; QB/RB/TE locked | Complete | Native disabled controls and locks; only WR domain rules |
| Quick/Full, names and jersey input | Complete | Existing complete Quick and Full journey regressions |
| Settings gear and accessible name | Complete | Bounds centered on 12,12; rendered desktop/mobile inspection |
| Forest & Coral retained | Complete | Existing `forest` ID preserved |
| Twelve researched schemes included | Complete | 16 identities total, including retained five IDs |
| System/Light/Dark independence | Complete | OS-change, override and reload checks |
| Compact candidate gallery and explicit Apply | Complete | Cancel, keyboard comparison, persistence and failure tests |
| Theme-independent printed artwork/branding | Complete | Artwork files unchanged; print/export roles independent |
| Contrast corrections | Complete within tested scope | 32 rendered palette/appearance combinations; text, hover, boundaries, selection, focus roles, semantic states, native select asset and skip-link text |
| Footer navigation | Complete | Links, How to play and Settings retained; mobile inspected |
| About and independence disclaimer | Complete as reviewable copy | Owner publication review remains pending |
| Privacy and Terms drafts | Complete as drafts | No finalized effective date or invented jurisdiction |
| Contact page | Partially complete | Route/content ready; approved public channel missing |
| Storage/cookie disclosure | Complete as draft | Local IndexedDB/localStorage; no application tracking/cookies observed; GitHub hosting disclosure included |
| Rights and real-world identity review | Partially complete | Existing names/art audited; permissions/provenance still require owner review |
| New official logos/photos or scene art | Complete: none added | Existing six illustrations preserved byte-for-byte |
| Gameplay preservation | Complete | Domain engine/content unchanged; full regression suite |
| Production build and prefix smoke | Complete | Local `/draft-bound/`, assets, deep links and PNG exports |
| Desktop/mobile visual inspection | Complete | Eleven screen types in both sizes, two extra palette views; actual exported PNG inspected |
| Fresh whole-branch review | Pending final review | See review record after completion |
| Public release | Blocked | Approved public contact/operator information and publication wording remain outstanding |

## Root-cause findings

**Card logo colors:** `cardView` reads frozen school colors; `.card-brand app-brand` bound its arrow accent to `--card-primary`. PNG export likewise passed `card.colors[0]` to `loadBrandImage`. A blue saved school primary therefore produced a blue arrow. This does not establish that every previously reported blue letter had the same cause: current SVG lettering used inherited print ink. Both lettering and arrow now resolve explicit print-brand roles, with the same resolved values in PNG. School borders/OVR/school text retain their saved colors. No entry regeneration is needed.

**Gear:** the old outer path had bounds x=1..23, y=2..23; its center was (12,12.5), while the hole was centered on (12,12). Scaling both by .86 preserved that discrepancy. The corrected outer path and hole are symmetric around (12,12), without positional CSS compensation.

**Stars:** the six-point `mark` catalog entry fed hero/footer/loading/binder-empty/card-foot ornaments, gift/reveal markers, awards, career honors and circular seals. Redundant ornaments were removed; earned/semantic distinctions now use shields. Recruiting and favorites use the separate five-point `favorite` path and remain intact. Scene keys such as `breakout_star` are persisted meaning, not UI decoration, and were preserved.

**Persistence:** before this release, the five palettes used immediate persistent selection, a manually duplicated pre-paint allowlist, and imported unknown IDs were rejected. The new catalog drives the 16 identities and bootstrap. Unknown string IDs normalize safely to forest without altering run/entry data; non-string values still fail validation. Palette candidates remain local until a successful repository write. Existing schema-1 saves still load, and no schema version changed.

**Additional rendered findings:** a global disabled-button opacity rule faded the new locked position labels; the tiles now retain full token contrast. Appearance styling reset the custom dropdown background, hiding its chevron; generated Light/Dark variants restore it. The skip link used fixed white text on bright Dark accents; it now uses action-label color. The old Canvas stamp palette inverted the browser seal colors; print seal paints are now shared with export. Each behavioral defect was reproduced with a failing regression before its correction.

## Verification

Baseline: 74 unit tests and 19 browser tests, typecheck and production build passed. The first sandboxed baseline build hit an output-directory permission error; a host-permission rerun passed. No unrelated application defect is claimed fixed by that rerun.

Final evidence is recorded below and updated after the final review/fix pass:

- `npm test -- --reporter=dot`: 75/75 units passed.
- `npm run typecheck`: passed.
- `npm run test:e2e -- --reporter=line`: 27/27 browser tests passed on the final implementation, including seal-paint parity.
- `npm run build:pages`: passed; 536.80 kB raw / 124.91 kB estimated transfer, main-E5MJGGLR.js and styles-775M4SWL.css.
- `npx tsx tools/validate-v131.ts`: local production-prefix smoke, 24 screenshots and two PNG downloads. No failed requests/page errors, third-party origins or cookies observed. Repeated successfully after the final seal correction.
- [Contrast measurements](v1.3.1-contrast.json): all 32 combinations meet the tested 4.5:1 text / 3:1 control-state thresholds. This is a scoped engineering check, not a claim of complete accessibility certification.

Browser regressions include complete college/draft/pro-career journeys, Full selection/reload, reveal and broadcast controls, reduced motion, backups/import rejection, cross-tab conflicts, protected unreadable saves, and archived unsupported-position viewing/export. No rule changes were needed.

## Visual evidence

[Screenshot directory](screenshots/v1.3.1/) and [viewport/palette manifest](v1.3.1-production.json).

- Desktop: 1440×1000, Forest & Coral Light.
- Mobile: 390×844, Navy Gold Dark.
- Additional gallery views: Burgundy Bronze Dark and Cobalt Crown Light.
- Home, creator, settings, gallery, binder, Draft card, Career card, About, Privacy, Terms and Contact captured in both primary viewports.
- [Exported Career PNG](v1.3.1-mobile-career.png), 900×1350. Seals inspected at full resolution, not only as thumbnails.

Visual inspection covers layout, wrapping, focus indication, locked-label readability, brand separation and seal labels. Settings remains scrollable on phones to reach backup/reveal controls; palette options have a separate compact scroll area. No new animations or artwork were introduced in this polish release.

## Legal/owner items and stopping point

The implementation stops at the tested feature branch and reviewable drafts. It has not been merged, pushed to the shared release branch or deployed to GitHub Pages. The live v1.2 site remains available.

Before these legal pages are public, supply the approved public contact method and operator identity to disclose, if applicable, and approve the About/disclaimer/Privacy/Terms wording. No private Git identity/email was adopted as publication authority. No governing law, age restriction, retention period or finalized policy date was invented.

GitHub Pages is the actual hosting service. Official documentation says Pages visitor IP addresses are logged for security; a no-game-analytics observation does not imply no hosting processing. Current requests use same-origin bundled fonts/art/assets. Privacy includes storage disclosure; a separate Cookie Policy/consent banner was not manufactured for nonexistent tracking. The owner should confirm applicable disclosure/consent obligations in legal review.

The catalog retains 90 real receiver names and illustrative profiles/grades. Existing fictional college/team identities remain. All six scene files were visually inspected: no clearly readable NFL/NCAA team logo or real-player photo was identified, but existing small swoosh-like apparel marks on action-art gloves/pants remain an owner content-review concern. The attribution document is not proof of rights clearance. No disclaimer is asserted to supply a license. Further rights/legal decisions require appropriate owner/professional review.

Future gameplay, larger player pools, balancing, actual teams/colleges and modular/recolored artwork remain outside this release. v1.4 decisions are [preserved separately](../superpowers/specs/2026-10-23-v1.4-preserved.md); artwork remains shelved for v1.5.
