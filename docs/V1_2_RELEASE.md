# Draft Bound v1.2

## Player-facing changes

- Approved custom interface SVGs and DB branding, including both letters in the favicon, tighter lettering and the accent arrow with clearance through the B. PNG cards use the same logo geometry.
- Five saved color themes: Original forest, Midnight copper, Navy & gold, Charcoal & orange and Deep teal & cream. Appearance remains an independent System / Light / Dark setting. Card paper, illustrations, school palettes and exports keep their own colors.
- Generated, editable prospect names with a randomize action. Position appears above Create prospect: WR is playable; QB/RB are disabled Coming soon previews, without a promised date.
- Quick creation keeps three manual potential selections and five automatic assignments. Full creation lets players choose all eight remaining potentials from three-player offers. Both keep the same gift, size and three shared rerolls. The mode is chosen before creation.
- Every opening gift and three-player offer uses distinct players within that offer. Players may appear again in later offers. Already-saved historical offers are accepted unchanged.
- Quick's five automatic assignments reveal their saved source, attribute, grade and ceiling individually before the recruit rating. Full proceeds directly to the completed build.
- Potential-heavy recruiting assessment before college, frozen to initial ability and inherited ceilings. Default score = 75% potential OVR + 25% initial OVR; fixed thresholds 77 / 81 / 84 / 87 produce 2 / 3 / 4 / 5 stars. These are game defaults, not official recruiting rankings, and give no hidden bonuses.
- Nine evidence-based coaching opportunities, with skill, sample and headroom checks. No automatic JUGS prompt for already elite hands.
- Quick broadcasts present the four already-saved games, real highlights, receiving totals and actual final scores. Pause, Next, Skip and Replay do not change outcomes. Four-game training blocks remain intact.
- Added finite roll, build, selection, training-gain and milestone motion. Fast reveals, keyboard access and reduced motion remain supported.
- Fixed help-list alignment and college meter layout at narrower widths.

## Progression and content

New runs use ceiling-relative mastery bands. Practice/general allocations, year factors and school coefficients remain unchanged. At a 99 ceiling, the bands equal the retained original formula; the constructed displayed-99 witness passes under both profiles. Missing profile fields in old active runs retain legacy development. Existing completed drafts and careers are not recalculated.

The illustrative WR catalog now has 90 stable source IDs, adding 15 slot, possession and deep-receiver profiles. Andre Johnson's hands, release and body-control grades are A+. The catalog remains elite-heavy. These coverage additions **do not solve** the broader source-pool and best-skill selection problem identified by the user. That redesign is a long-term planning item, together with meaningful return-versus-declare incentives. An extra college year still increases ability; professional careers are automatic and provide no playable development alternative.

Hall of Fame criteria, schools, school coefficients and existing collectible scene art are unchanged. Scene uniqueness, jersey masks and modular player appearance remain deferred to tentative v1.5. No extra position is playable.

## Validation

- 74 unit tests; TypeScript check and GitHub Pages production build passed.
- 19 Chromium browser tests passed, including complete Quick/Full journeys, reloads, backup validation, optional professional career, PNG export, mobile layouts, palette persistence and keyboard focus, unique logo masks and readable control colors across all ten palette/appearance combinations.
- The exported PNG contains both explicit brand colors and background clearance; screenshots and the downloaded PNG were inspected visually. A production smoke check under the real `/draft-bound/` URL prefix passed app startup, resources, brand fetching and PNG export.
- Fresh whole-branch review found one important malformed-backup validation gap and no critical or minor findings. The gap and a separately reproduced keyboard-focus issue were fixed with failing-then-passing regression tests; the complete suites passed afterward.
- [Matched progression audit](validation/V1_2_PAIRED_REPORT.md): 1,000 created builds, 3,000 school/profile pairs, 12,000 year-two/year-three draft snapshots; zero ceiling/regression violations. Quick rotated-choice year-three mean OVR 90.97 legacy → 89.94 v1.2; mean maxed traits 7.55 → 3.65. Optimized Quick still reaches 90+ frequently (96.5% in this scripted junior cohort); Full best-available remains stronger. The long-term issue is explicitly unresolved.
- [Coaching audit](validation/COACHING_REPORT.md): 1,000 careers, eight of nine types observed, zero elite-hands JUGS, capped-skill or within-year repeat violations. Film room was eligible in targeted unit tests but not selected in this cohort; no artificial frequency guarantee was added.

These are reproducible scripted cohorts, not player telemetry or claims about exact real-world football probabilities. Baseline, paired growth and selection-policy effects are distinguished in the reports.

## Compatibility and maintenance

Schema remains 1. Optional palette, mode and progression-profile values are validated. Missing legacy palette/mode values mean forest/Quick. Gameplay RNG remains separate from names, palette changes, animations and replay clocks. New drafts record the source catalog version; completed historic snapshots keep their stored versions.

Color tokens live in `src/colors.css`. Icon geometry lives in `src/app/shared/icon-paths.ts`. Approved brand source SVGs live in `public/assets/brand`; production builds regenerate their Angular/static variants. No new runtime dependencies or hosted AI services were added.

See [implementation decisions and review record](validation/V1_2_EXECUTION_NOTES.md) for defaults selected during execution, verification evidence and remaining limitations.
