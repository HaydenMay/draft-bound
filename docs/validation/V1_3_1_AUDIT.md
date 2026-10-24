# Draftbound v1.3.1 — planning audit

Reviewed October 23, 2026, against local `main` at `cb86e1b1d1a5184430750874f0d11df3eda106f0`. The working tree was clean. This was a source/configuration audit for planning, not a new claim of rendered visual completion or legal clearance.

## Existing implementation

| Area | Evidence and current behavior | Planning implication |
|---|---|---|
| Framework | Angular 21.2.25; standalone root/shared components; TypeScript. `package.json` still says 1.0.0, separate from product release labels. | Extend the existing application; do not assume an unobserved v1.3 release exists. |
| App shell | Most screen assembly lives in `src/app/app.ts`/`app.html`; `GameStore` owns navigation, saved state and actions. | Extract only the new picker/information components needed for polish. |
| Navigation | Custom hash views: home, play, binder, entry, career, card. No Angular Router dependency. | Add information views/deep-link handling without a router migration. |
| Creation | Generated editable name, jersey, Quick/Full; WR/QB/RB currently appear as small radio labels. QB/RB disabled; no TE preview. | Replace presentation with four equal tiles; do not add playable domain positions. |
| Theme catalog | Five implemented IDs: forest, copper, navy, charcoal, teal. Names: Original forest, Midnight copper, Navy & gold, Charcoal & orange, Deep teal & cream. | **Midnight Copper exists and is distinct.** Preserve all saved IDs; the requested Navy Gold can reuse navy. |
| Theme storage | Optional palette/theme fields in schema-1 settings; authoritative IndexedDB, startup localStorage caches. System preference listener exists. | No schema migration is needed for additional IDs. |
| Unknown palette | `readPalette` falls back to forest; import validator currently rejects unknown palette values. `index.html` repeats a five-ID startup allowlist. | Requested safe unknown-ID import fallback needs a targeted compatibility change; generate the startup list to prevent drift. |
| Color files | `src/colors.css` holds UI, print/export and preview colors; `theme.css`, `palette-picker.css` handle layout. | Retain native CSS. Split control boundaries/link/focus roles from decorative `--line`/general accent as needed. |
| Current gallery | Five full miniature previews, one per option, saving immediately. | Rework into compact swatches plus one candidate preview/Apply flow; preserve independent appearance. |
| SVGs | Authoritative `shared/icon-paths.ts`, inline `DraftIcon`, Canvas `drawIcon`, generated standalone icons. Approved DB SVG source variants under `public/assets/brand/`. | Fix shared geometry once; regenerate the static variants. |
| Shields | Approved `shield-badge.svg` exists as a brand asset; card earned stamps currently use a circular CSS/Canvas treatment. | An available brand crest is not yet a reusable honor-badge system. Reuse suitable geometry without a card-system redesign. |
| Cards | Shared `CollectibleCard` renders browser cards; Canvas `renderCard` separately draws exports; `cardView` supplies frozen record data. | Correct both rendering paths and test actual PNG output. |
| Footer | DRAFT BOUND plus decorative mark; How to play and Saves & settings buttons only. | Add informational links, compact disclaimer and an accessible retained Settings route. |
| Information pages | No About/Privacy/Terms/Contact/Cookie routes found in the current app navigation. README has limited independence/privacy statements. | Build dedicated public-readable views, not duplicate modal explanations. |
| Persistence | Schema 1, IndexedDB `draft-bound`/`state`; validated import/export, previous-save backup, stale-writer protection. | Preserve run/entry/profile data byte-for-byte where possible; change presentation at render time. |
| Accessibility | Named icon controls, labels, modal keyboard handling, skip link, reduced motion and theme/focus tests already exist. | Keep these conventions and update tests deliberately when Settings gets its required accessible name. |
| Verification | Vitest, TypeScript, Playwright and Pages build scripts already exist. The preceding release recorded 74 unit/19 browser passes. | These historical counts are not fresh results for this turn; rerun a baseline at implementation start. |

## Card-logo color finding

The current source contains a direct, verified path from **saved school colors to the card logo arrow**:

1. `src/app/domain/presentation.ts`: `cardView(...).colors = entry.display.schoolColors` for both editions.
2. `shared/collectible-card.html`: assigns the first value to `--card-primary`.
3. `src/brand.css`: `.card-brand app-brand` binds `--brand-accent` to `--card-primary`.
4. `application/card-export.ts`: calls `loadBrandImage(exportInk, card.colors[0])`, so the PNG also uses school primary for its arrow.

The lettering normally inherits fixed printed ink; the arrow changes with the saved college palette. This explains a teal-versus-blue **accent** without requiring an alternate logo asset or corrupt save. Header branding, appropriately, uses interface colors.

This is not proof that every older screenshot's entire blue logo has this cause. The implementation audit must render representative historical records, inspect computed colors and compare exports before closing the root-cause report. Recommended correction: canonical print-brand primary/accent tokens in both renderers, while retaining school identity colors elsewhere. No record or artwork regeneration.

## Gear finding

`ICON_PATHS.settings` uses a hand-authored outer path and a hole centered at (12,12), both scaled to 0.86 around the viewBox center. The outer path's opposing coordinates are asymmetric; scaling adds breathing room without correcting that asymmetry. The inline renderer already centers its box with flex layout. The current control is named “Save and game settings,” rather than the newly requested “Settings.”

Geometry is therefore an evidence-based first place to fix—not a reason to add arbitrary CSS offsets. Optical centering, bounds, 16/20/24px recognizability and the final rendered button still need visual verification.

## Star/mark classification

- `mark` is the custom six-point sheriff-like vector; it appears in hero decoration, loading/empty states, footer/card-foot decorations, creation/reveal details, broadcast labeling, seals and honor displays.
- `favorite` is a separate five-point vector used by recruiting ratings and favorite controls. Preserve it and its state/accessible naming.
- Award/Hall of Fame labels represent earned game data; change a badge silhouette without changing eligibility, unlocks or saved distinctions.
- Names/IDs such as `breakaway_star` and `breakout_star` identify scenes, not decorative UI stars. Do not rename them.
- Existing shell, card CSS, inline SVG and Canvas paths must be inspected together. A global replace of every star/`mark` call is not an acceptable implementation.

## Technical privacy/content inventory

- IndexedDB stores active prospects, player-entered/generated names, jersey numbers, completed records, cosmetic state and settings on the device. LocalStorage caches palette and appearance. Export/PNG downloads are local actions; import reads a selected local file.
- No app authentication, account service, remote database, analytics SDK, advertising, payment service, remote error collector or contact form backend was found in the inspected source/dependencies.
- Fonts are bundled through local `@fontsource` packages; original art and SVG assets are local. `brand-image.ts` fetches an SVG from the same origin for Canvas export. These observations do not mean the host receives no network data.
- GitHub states that Pages visitor IP addresses are logged for security. Privacy wording must distinguish host processing from Draftbound's local game storage. Do not invent retention periods or imply the game operator has those logs. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- No cookie-setting or sessionStorage code was found in the inspected application. Runtime cookies/network behavior must still be checked before making public disclosures. No categorical legal conclusion about consent or a separate Cookie Policy is made here.
- The 90-entry source catalog contains real receiver names, illustrative physical profiles and original letter grades. It is not a licensed/verified scouting feed. Current college/pro-team data is fictional; do not migrate it in this release.
- `public/art/ATTRIBUTION.md` describes six generated fictional-athlete images, no official photographs/team logos, and shared scene use. That is provenance documentation, not a new visual or rights audit. All six files still need visual inspection for the v1.3.1 report; do not certify absence of embedded marks based only on filenames or attribution.
- No approved public contact method/operator legal identity was established by this audit. A public repository URL is available, but adopting it as the support channel needs owner approval. Do not publish private repository/account email data.

## Discrepancies and gates

1. The source document's implementation authorization is superseded **for this turn** by the user's request to read, plan and report. No source changes or release were performed.
2. Themes, Quick/Full, random names and several requested visual systems already exist. Improve them rather than duplicate them.
3. Safe unknown-theme fallback is partly present but import behavior differs; the plan includes an explicit test and normalization boundary.
4. The provided twelve palettes are inspiration inputs, not complete mappings. Preserve current selections and derive/measure all 32 resulting appearance mappings.
5. The immediate stopping point is delivery of the plan. After approval, future gameplay remains out of scope; missing public contact/legal facts are publication gates, not permission to invent them.

## Implementation baseline and asset inspection

Baseline verified in the isolated checkout: 74/74 units, typecheck and Pages build passed; browser baseline recorded separately. All six existing illustrations were opened and inspected. No clearly readable NFL/NCAA team logo or real-player photograph was identified, but small swoosh-like apparel marks appear in existing action art (notably gloves/pants in breakaway/spectacular). These are an existing content-review concern; the attribution's blanket unbranded description is not treated as proof of rights clearance. No artwork was changed or generated. Owner-owned replacements/rights review remain outside the visual-code fixes.

Baseline browser suite: 19/19. Production build initially encountered sandbox EPERM creating its output; the same build then passed with normal host permissions. Runtime inventory and actual gear bounds are in v1.3.1-baseline-runtime.json.
