# Receiver curation and spotlight fit

The owner moved items 8 and 9 out of the college balance pass and requested them first on October 25, 2026. Earlier direction sets a maximum of ten eligible receivers per team, recognizable names with specialists and memorable disappointments retained, all names visible on new spotlight boards, and no automatic winner scrolling.

## Approach and scope

Use explicit, reviewable team ID lists layered over the existing 498-profile snapshot. Do not select the ten highest grades or use arbitrary rarity weights: either would defeat the requested variety. Do not delete profiles or rewrite the old snapshot: existing deterministic saves depend on its ordered pools. No new team memberships or player grades are introduced in this pass. Document Keep/Review decisions and remaining provisional grading uncertainty.

New runs pin a receiver-catalog version and draw uniformly from 32 teams, then uniformly from the selected team's curated pool. Quick autofill uses the same version. Natural gifts use the curated profile union; physical builds retain the existing physical catalog. Missing receiver version means the original 498-profile catalog, including for rerolls, continuation, import validation and completed draft content versions. Reject unknown explicit receiver versions. Schema and college/professional rules stay unchanged.

New receiver boards use two columns on phones and five on wider screens, natural height, wrapping full names, no internal scrolling, and no automatic winner scrolling. Preserve pacing, skip, focus and reduced-motion behavior. Keep all original candidates available on archived runs; those older larger boards may still scroll manually rather than silently changing their candidate pools. Normal phone portrait sizes down to 320×568 must fit new boards; unusually short windows/zoom retain accessible manual scrolling rather than clip content.

## Validation and stopping point

Test pool membership, uniqueness and bounds; frozen pre-change Quick/Full save continuations; import rejection for unknown versions and substituted results; versioned snapshots; deterministic sampling and actual observed frequencies; phone and desktop board fit and stationary scroll through winner hold. Run unit tests, typecheck, browser tests and Pages build. Review legal pages against unchanged services/references. Commit and push using the owner's existing authorization after verification.

Training, starting OVR, simulation coefficients, artwork, new playable positions, legal draft publication gates and external services remain outside this pass.
