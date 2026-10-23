# Draftbound SVG Icon & Brand Pack

## Contents
- `icons/`: 25 individually named, transparent, 24×24 vector SVG icons.
- `brand/`: `db-mark`, `header-lockup`, `shield-badge`, `outline-mark`, `horizontal-wordmark`, `favicon-mark`, and `full-wordmark` SVGs.
- `preview.html`: actual inline SVG previews in midnight copper, light, and monochrome. Serve the directory locally (e.g. `python -m http.server 8000`) and open `/preview.html` in your browser. The page uses `fetch` so opening directly as `file://` may be blocked by browser security.

## Theme contract
Icons use `currentColor` for primary geometry and `var(--icon-accent, currentColor)` for optional accent geometry. Brand marks use `currentColor` and `var(--brand-accent, currentColor)`.

```css
.icon { color: var(--ink); --icon-accent: var(--orange); }
.brand { color: var(--ink); --brand-accent: var(--orange); }
```

Your `src/colors.css` defines light and dark values for `--ink` and `--orange`. You may map these to other palette-specific variables when implementing multiple themes. Printed collectible palettes (`--print-*`) and export colors (`--export-*`) should remain separate from UI theme changes.

**Important:** SVGs must be **inline in the DOM** for `currentColor` and inherited custom properties to work. Ordinary `<img src="...svg">` elements do not inherit the surrounding page's `color` or CSS variables. In Angular, use an approved inline-SVG loading strategy (sanitized trusted local assets or compile SVG templates into components), rather than injecting untrusted markup. CSS `mask-image` is an alternative for monochrome-only icons.

## Design notes
- All 25 icons share a 24×24 viewBox, rounded stroke caps and joins, and a consistent approximate 1.9-unit stroke.
- `data-role="primary"` and `data-role="accent"` identify primary and accent geometry.
- Brand typography has been converted into real SVG vector glyph outlines; no runtime fonts or font references are needed.
- No stars are used in the branding. The rising-arrow DB is the unifying brand motif.
- Icons remain identifiable in monochrome. Use a 16px actual-size QA pass before shipping; complex icons such as settings and new-prospect may warrant optical refinement.
- The favicon SVG uses theme-aware colors when inlined. Browser tab favicons loaded through `<link rel="icon">` do **not** inherit CSS variables; generate an explicit-color favicon per theme or use a self-contained favicon with a fixed fallback palette.
- This pack is a vector recreation based on the approved concept, not a mathematically exact tracing of the AI-generated reference. Review against the live app at intended sizes.

## Spacing revision — October 23, 2026

Six brand assets have tighter letter spacing and normalized outer padding. The DB letter gap is reduced to 5 source units; outlined wordmark letters are repositioned individually, with already-tight pairs preserved. Lockup spacing and associated arrows follow the revised lettering. Letter outlines, primary/accent color contracts and aspect ratios of the individual letter shapes are preserved. The single-letter favicon geometry and all 25 UI icons are unchanged. No game integration is included.

The original review findings about missing game icons, renderer adaptation and explicit-color favicon delivery still apply.

## Selected accent-arrow revision — October 23, 2026

This revision supersedes the earlier color treatment: all brand lettering uses currentColor; rising arrows use var(--brand-accent, currentColor). Small accent dots remain accents. All seven brand assets have a transparent clearance mask separating lettering from the arrow. Following user feedback, each diagonal endpoint is now exactly halfway between the previous shortened endpoint and its original arrow tip. Butt caps prevent the old diagonal cap protrusion. Tighter letter spacing is retained. All 25 UI icons are unchanged.

Mask black/white values encode transparency; they are not theme paint colors. When inlining an asset more than once, prefix its mask ID and matching url reference per instance. Canvas export integration must resolve colors and preserve the mask. This deliverable does not alter the game or deployment.

## Consistent favicon and horizontal logo

The favicon now contains the complete approved DB-and-rising-arrow mark, centered on a square 64-unit canvas. The horizontal logo pairs that exact mark with tight-spaced DRAFT BOUND vector lettering. Its unrelated straight arrow has been removed. Canonical arrow geometry, midpoint shaft endpoint, transparent clearance and primary-letter/accent-arrow colors are preserved. The other five brand assets and all 25 UI icons are unchanged by this follow-up. These remain theme-aware source assets; the browser-tab favicon still needs explicit resolved colors when integrated.
