# Draft Bound project instructions

"Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout."

"Make the best decision that will elevate all three: the user experience (UX), developer experience (DX), and agent experience (AX) always, without breaking anything."

Keep the complete college-to-draft game playable. Favor clear choices and visible state over decorative explanation. Preserve deterministic saved outcomes, position-specific rules, evidence-backed collectibles, keyboard access, and mobile layouts. Verify meaningful behavior before publication.

Use the original SVG catalog in `src/app/shared/icon-paths.ts` for interface and collectible symbols. Extend that catalog instead of adding stock emoji, symbol fonts, or icon libraries. Keep accessible names on controls; icons are decorative. See `docs/ICONS.md` for asset generation and card export reuse.

Keep application color values in `src/colors.css`. Use its semantic CSS variables in styles and `readColor` for canvas/browser APIs. Keep college/team identity palettes with their data. Preserve independent printed-card colors when changing interface themes. See `docs/COLORS_AND_EXTENSIBILITY.md`.
