# Draftbound project guidance

## Durable product and engineering principles

- Preserve the full college-to-draft experience, four-game blocks, automatic professional careers and one canonical card for new v1.4.4 prospects, legacy optional-career/two-edition entries, binder, local saves, backups, settings, themes, accessibility, and deep links unless an approved scope explicitly changes them.
- Protect saved outcomes. Keep domain rules deterministic and separate from Angular presentation. Validate save/import compatibility and avoid schema/rules-version changes without a documented migration need.
- Keep accessible names on controls, keyboard operation, visible focus, reduced-motion support, and narrow mobile layouts. Keep editable mobile controls usable without disabling browser zoom.
- Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout.
- Make the best decision that will elevate all three: the user experience (UX), developer experience (DX), and agent experience (AX) always, without breaking anything.
- Use the original SVG catalog in `src/app/shared/icon-paths.ts` for interface and collectible symbols. Extend it instead of adding stock emoji, symbol fonts, or icon libraries. Icons are decorative inside controls with accessible names. See `docs/ICONS.md`.
- Keep application colors in `src/colors.css`, use semantic CSS variables in styles and `readColor` for canvas/browser APIs, and keep team/college identity palettes with their data. Preserve independent printed-card colors when interface themes change. See `docs/COLORS_AND_EXTENSIBILITY.md`.
- The user owns collectible image generation. Do not generate or integrate new scene illustrations unless explicitly requested. Artwork improvements, modular player appearance, masking and uniform recoloring are shelved for tentative v1.5. Preserve current scene assets and IDs. See `docs/ART_PROMPT_BASELINE.md`, `docs/PROSPECT_PRESENTATION.md`, and `docs/ROADMAP.md`.
- Keep WR as the only playable position until a later approved position implementation. Locked QB/RB/TE previews are not authorization to add their rules or content.
- Keep real college/NFL identities, new player-pool balance, recruiting/development redesign, and other v1.4 decisions in planning documents until a separate implementation scope is approved. The document `docs/superpowers/specs/2026-10-23-v1.4-preserved.md` is a planning reference, not an executable spec.
- Do not introduce Firebase, sign-in, accounts, cloud saves, analytics, advertising, payments, screenshot uploads, or contact delivery without a separate approved scope and service/privacy review.

## Data, privacy and release requirements

- All saves remain local unless an approved future architecture changes this. Do not collect or expose private user backups, names or credentials in fixtures, logs, screenshots or commits. Test fixtures must be synthetic.
- Preserve the legal publication gate. About, Terms, Privacy and Contact copy can remain reviewable drafts; do not invent operator identity, contact details, jurisdiction, retention terms, or publication approval. Do not activate Contact without working delivery and a corresponding Privacy update. See `docs/LEGAL_REVIEW_CHECKPOINT.md`.
- Before every public release, review Terms, Privacy and Contact against the actual product and services. Revisit when recruiting/progression systems change, real-world team/player references are introduced, advertising/analytics is added, or accounts/cloud saves (including Firebase) are implemented. Do not clear draft notices until checkpoint requirements are satisfied.
- Follow the release-specific scope provided for the current task. Historical plans and reports describe completed work; they are not standing authorization to repeat or extend those releases. The user additionally approved the v1.4.5 fictional college/recruiting and draft-report pass in `docs/superpowers/specs/2026-10-26-v1.4.5-colleges.md`; keep its version boundary for new prospects. The user approved the v1.4.4 systems pass in `docs/superpowers/plans/2026-10-26-v1.4.4-systems.md`, preserving receiver grades and rolls. Autographs, inspection and expanded card styling remain future work; see `docs/superpowers/specs/2026-10-26-card-experience-direction.md`. Do not infer authorization for later gameplay or artwork changes.
- Keep GitHub Pages compatible with the `/draft-bound/` base path. Run appropriate tests and production build; report commands/results accurately and distinguish browser emulation from physical-device verification.
