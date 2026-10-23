# Draft Bound — shelved artwork planning (tentative v1.5)

Status: SHELVED by the user on October 23. Tentative release label: v1.5. No artwork generation, editing, masking, implementation or integration is authorized by this document. Artwork is not a v1.2 dependency or release blocker. Preserve supplied files and existing game art.

## Latest direction — takes precedence over earlier proposals below

The user wants reusable modular player appearances: compatible head bases, hair/facial-hair layers, coordinated exposed-skin coloring and independent uniform colors. They are concerned about image count and reuse. A full library of finished scenes for every identity is not the selected solution; the earlier four-profile/48-image proposal is superseded.

The supplied character reference sheets and two complete Draft Night variants are references, not verified interchangeable layers. The Draftbound_Artwork_Collection.zip remains useful source material and has not been integrated. No new image production is needed now.

Bloodline provides an implementation reference in `src/render/spriteHorse.ts` and `SPRITE_MASK.md`: Canvas rendering with aligned PNG material-ID masks, shading-preserving recoloring and a bounded tint cache. This is a reference to evaluate later, not a drop-in face-swapping system or an implemented Draft Bound feature.

If artwork work resumes, first settle the supported poses and asset contract. A possible proof is one composition with two interchangeable heads and recolorable uniforms. Head angle, lighting, hair fit, neck transitions, skin on hands and helmet/foreground occlusion all need explicit treatment. No pilot, profile count or production batch is currently approved. Random assignment once per prospect and card-only names/numbers remain the intended future behavior.

The sections below preserve the earlier fabric-mask research. Their v1.2 labels and per-character scene-library recommendation are historical and do not override this deferral or the modular direction.

## Current behavior

Cards display flattened scene illustrations. Card frames and text are separate, but jersey fabric, caps, signs and embedded logos are pixels in the source image. There is no automatic brand-removal filter or working jersey recoloring compositor today.

The attached Draft Night example contains baked-in team and league marks, team lettering, a surname and a jersey number. Changing a team record cannot replace those pixels reliably. An approved neutral master is the starting point; masks select colorable regions rather than erase branding or reconstruct hidden fabric.

## Recommended v1.2 approach: one scene master plus aligned fabric masks

| Asset | Purpose |
|---|---|
| Neutral base illustration | Complete scene with generic stage/background and blank clothing. Light neutral-gray jersey fabric makes recoloring easier. No baked-in team, league or manufacturer marks, names, numbers or lettering. |
| Primary alpha mask | Select the primary jersey fabric and any explicitly included cap/helmet regions. Exclude skin, hands, hair, ball, scenery and unrelated clothing. |
| Secondary alpha mask | Select trim/panels, kept separate from the primary mask. |
| Optional accent mask | Only if the approved composition has specific neutral stage elements worth recoloring; not a requirement for every scene. |
| Application overlays | Player/team name, pick, rating, badges and card framing outside the illustration's clothing surfaces. |

All source and mask assets must use the same canvas dimensions, coordinates, crop and registration. Prefer PNG alpha masks: opaque white inside selected fabric, transparent outside, soft alpha edges. An opaque black-and-white mask must explicitly be interpreted as luminance or converted to alpha; using its opacity directly would select the black background too.

The future compositor must preserve fabric shading, folds and highlights, with no color spill onto skin or scenery. Test light, dark and saturated colors; a single multiply filter over a strongly colored jersey is not sufficient proof. The card preview and exported PNG should use the same composition function and assets so the saved image matches the browser.

Team/color selection must come from the event's relevant identity. A Draft Night scene should use the saved drafting-team palette rather than blindly using the college palette. College scenes need the appropriate college context; this should be explicit scene metadata rather than a recoloring filter guessing from image pixels.

## Alternatives

- **Green screen:** Useful for extracting a whole subject, but it does not identify jersey panels, remove logos or preserve hands over fabric. Direct transparent assets avoid a separate chroma-key cleanup step.
- **Separate transparent athlete/background/prop layers:** Useful if we later want interchangeable scenes, poses, appearances and scenery. More asset production, registration, lighting and occlusion work. Not necessary just to change fabric colors in a fixed scene.
- **Dynamic stage screens or clothing lettering:** A later feature requiring authored placement/perspective, appropriate clipping and occlusion. A team logo or surname cannot simply be pasted flat onto every jersey pose. Keep the first stage generic and keep dynamic text in card UI.

## One-scene proof before bulk production

1. The user approves one completely neutral Draft Night master.
2. Prepare precisely aligned primary and secondary fabric masks from that exact approved image, not from separately regenerated approximations.
3. After implementation is authorized, render it in at least two contrasting team palettes, plus light/dark edge cases.
4. Inspect fabric texture, skin, fingers, background and seams at full size and inside the card crop.
5. Verify the downloadable PNG matches the card preview.
6. Only then apply the asset contract to the remaining distinct scenes.

Each named scene still requires its own composition. One neutral Draft Night composition can serve multiple drafting teams; that does not mean other collectible scenes reuse the Draft Night image.

## Still open

- Whether v1.2 keeps generic event illustrations or needs consistent personalized prospect appearances across scenes.
- Whether jersey names/numbers and in-art logos are deferred entirely or need a separately scoped later compositor.
- Which existing illustrations the user wants to retain versus replace.

## Technical references

- Canvas compositing and blending: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
- Alpha/luminance masking behavior: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image

## Confirmed appearance and lettering decisions

The game randomly assigns each prospect an appearance profile once; there is no appearance-selection step. Save the stable profile ID and reuse its matching illustration across scenes. Keep cosmetic randomness independent from gameplay randomness and from the rolled physical build. Existing prospects need a legacy fallback, and new appearance-catalog entries must not reroll existing identities.

Names and jersey numbers belong in card UI for v1.2. In-art clothing lettering is deferred. A consistent fictional-person scene library is the proposed asset approach; the starter profile count and reference sheets still need approval. Four profiles across twelve scenes would mean 48 base illustrations, with fabric masks only where relevant. Pilot two characters in Draft Night and one on-field scene before commissioning the whole library.
