# Draft Bound icons

The app combines the approved 25-icon theme-aware SVG pack with retained game-specific symbols on a 24-unit grid. There is no emoji font or third-party icon library.

`src/app/shared/icon-paths.ts` is the authoritative geometry catalog. `DraftIcon` in `src/app/shared/icon.ts` renders it inline, inheriting the surrounding light/dark theme color. Names are checked by TypeScript and Angular templates.

```html
<button aria-label="Save and game settings">
  <app-icon name="settings" />
</button>
```

Icons are decorative (`aria-hidden="true"`, unfocusable SVG). Give their containing control a visible label or accessible name. Favorite buttons retain their label and `aria-pressed` state; selected options expose their state independently of their checkmark. Keep mathematical signs in scores, gains, and training-mode names as text.

Interface symbols and collectible stamps share the same path catalog. Approved DB brand geometry lives in public/assets/brand/; npm run brands generates the inline Angular component with instance-unique clearance masks and a self-contained favicon. PNG export resolves the same brand SVG with explicit ink/accent colors. Printed card colors stay independent of the interface theme. Existing scene artwork remains in use; the rebuilt favicon includes both D and B.

`npm run icons` generates standalone SVG assets in `public/assets/icons/`. The native select control uses the generated chevron in a neutral color that works in both themes, defined by `--icon-asset-ink` in `src/colors.css`. Both production build commands regenerate icons and brands automatically. Add or change geometry in the catalog, then regenerate; do not edit generated SVGs directly.

Validation covers accessible control names, vector rendering, selected training marks, saved favorites after refresh, card customization, theme changes, and mobile overflow. The complete journey test also verifies the downloadable PNG, and the palette test checks that stylesheet tokens reach its pixels. Screenshots live in `docs/validation/screenshots/`.
