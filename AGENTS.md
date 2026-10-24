# Draft Bound project instructions

"Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout."

"Make the best decision that will elevate all three: the user experience (UX), developer experience (DX), and agent experience (AX) always, without breaking anything."

Keep the complete college-to-draft game playable. Favor clear choices and visible state over decorative explanation. Preserve deterministic saved outcomes, position-specific rules, evidence-backed collectibles, keyboard access, and mobile layouts. Verify meaningful behavior before publication.

Use the original SVG catalog in `src/app/shared/icon-paths.ts` for interface and collectible symbols. Extend that catalog instead of adding stock emoji, symbol fonts, or icon libraries. Keep accessible names on controls; icons are decorative. See `docs/ICONS.md` for asset generation and card export reuse.

Keep application color values in `src/colors.css`. Use its semantic CSS variables in styles and `readColor` for canvas/browser APIs. Keep college/team identity palettes with their data. Preserve independent printed-card colors when changing interface themes. See `docs/COLORS_AND_EXTENSIBILITY.md`.

The user owns collectible image generation. Do not generate or integrate new scene illustrations unless explicitly asked. Use `docs/ART_PROMPT_BASELINE.md` for the handoff and `npm run audit:art -- --strict` once approved assets arrive. Each named scene must ultimately have a distinct illustration. See `docs/PROSPECT_PRESENTATION.md` for current recruiting, reveal, broadcast and coaching behavior; do not change school balance as part of this work.

Collectible artwork improvements are shelved for tentative v1.5. Do not generate, edit, mask, recolor, build modular appearances or integrate new art as part of v1.2, and do not treat art replacement or strict art uniqueness as a v1.2 release gate. Preserve the supplied artwork and existing assets. The user explicitly authorized v1.2 implementation on October 23; follow `docs/superpowers/plans/2026-10-23-v1.2-release.md` and its product spec. Approved interface icons and logo SVGs may be integrated; this does not authorize new collectible scene art.

The user approved v1.3.1 Legal & Visual Polish implementation with the position reference. Follow docs/superpowers/plans/2026-10-23-v1.3.1.md and the supplied master spec. Do not implement v1.4/v1.5 gameplay/artwork. Keep legal documents as reviewable drafts; do not invent public contact/operator details or publication dates. Clear a draft state only after the publication prerequisites in `docs/LEGAL_REVIEW_CHECKPOINT.md` are satisfied.

Before every public release, review the Terms, Privacy Policy and Contact page against the actual product and services. Revisit them when recruiting or progression systems change, real-world team/player references are introduced, advertising or analytics is added, or accounts/cloud saves (including Firebase) are implemented. Follow `docs/LEGAL_REVIEW_CHECKPOINT.md`; do not clear draft notices until the publication requirements listed there are satisfied.
