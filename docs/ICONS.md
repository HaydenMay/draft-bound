# Draft Bound icons

The app uses 22 original SVG icons drawn on a 24-unit grid. Playbook routes, clipped turns, and an open-center achievement badge connect the interface to the card artwork. There is no emoji font or third-party icon library.

`src/app/shared/icon-paths.ts` is the authoritative geometry catalog. `DraftIcon` in `src/app/shared/icon.ts` renders it inline, inheriting the surrounding light/dark theme color. Names are checked by TypeScript and Angular templates.

```html
<button aria-label="Save and game settings">
  <app-icon name="settings" />
</button>
```

Icons are decorative (`aria-hidden="true"`, unfocusable SVG). Give their containing control a visible label or accessible name. Favorite buttons retain their label and `aria-pressed` state; selected options expose their state independently of their checkmark. Keep mathematical signs in scores, gains, and training-mode names as text.

Collectible brands, stamps, and the canvas PNG renderer share the same badge paths. Printed card colors stay independent of the interface theme. Existing original scene artwork and the custom DB favicon remain in use.

`npm run icons` generates standalone SVG assets in `public/assets/icons/`. The native select control uses the generated chevron in a neutral color that works in both themes. Both production build commands regenerate these assets automatically. Add or change geometry in the catalog, then regenerate; do not edit generated SVGs directly.

Validation: 42 unit tests, 9 browser scenarios, strict type checking, and the production Pages build pass. Browser coverage includes accessible control names, vector rendering, selected training marks, saved favorites after refresh, card customization, theme changes, and mobile overflow. The existing complete journey test also verifies the downloadable PNG. Screenshots live in `docs/validation/screenshots/`.
