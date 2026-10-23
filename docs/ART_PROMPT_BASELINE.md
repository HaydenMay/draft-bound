# Draft Bound — artwork prompt baseline

Use the master prompt once per scene. Replace the bracketed scene description. Generate one illustration per request, not a contact sheet.

## Master prompt

Create original illustration artwork for a premium American-football trading card in the browser game Draft Bound.

SCENE: [Describe one scene from the list below.]

STYLE: Detailed painted sports illustration with convincing anatomy, fabric, lighting and stadium atmosphere. Use a consistent collectible-card art style across the series, while making this scene's camera angle, pose, action and setting visibly different from every other scene.

FORMAT: Portrait 2:3, ideally 1024 × 1536 or higher. Full-bleed illustration only. Do not draw a card frame, labels, names, rating, badge, signature, lettering or watermark. The game adds those. Keep the face, football and defining action within the central 80% of the image. Keep the lower 18% visually quiet for the player-name overlay. Important feet and the defining action must still read when the art is cropped into a card window.

ATHLETE AND EQUIPMENT: Fictional adult American-football receiver. Correct shoulder pads, helmet, face mask, gloves and cleats where appropriate. If a ball is visible, it must be a regulation-looking American football: elongated pointed oval, narrow ends, brown pebbled leather, a short straight row of white laces along one long side, believable scale relative to the hands. Both pointed ends should be readable whenever the pose allows. No round ball, rugby ball, basketball-like seams, floating equipment or malformed hands.

UNIFORM: Simple unbranded uniform with large clean fabric panels and restrained trim. Primary fabric: [PRIMARY COLOR]. Secondary panels/trim: [SECONDARY COLOR]. No team logo, manufacturer mark, name, number or lettering. Preserve fabric highlights and shadows so separate jersey color layers can be prepared later. Do not tint skin, gloves, football, grass or the whole image to achieve the team colors.

FIELD AND FOOTBALL ACTION: Make the event physically believable. Where a completed in-bounds catch is depicted, both feet must be clearly on the playable surface with visible turf between the cleats and any sideline/end line. Avoid an ambiguous boundary beside the feet. If the sideline is unnecessary, omit it. Use one coherent field perspective. Keep defenders, possession, ball location and body contact consistent with the described action.

COMPOSITION: One unmistakable focal moment, expressive but believable action, clean silhouette, strong separation from the background. This must be a new illustration, not a recolor or crop of another scene.

## Scene list

| Scene ID | Distinct scene direction |
|---|---|
| prospect_journey | A young prospect entering an empty practice stadium at dawn; the start of the journey. |
| draft_night | A prospect at a draft celebration, holding a blank jersey; no printed names or logos. |
| breakaway_star | A receiver who already possesses the football accelerating through open field with defenders behind. |
| spectacular_catch | A receiver securing a difficult airborne catch through coverage; clear ball control and believable hands. |
| red_zone_monster | A physical touchdown catch several feet inside the end zone. Show secure possession and both cleats clearly surrounded by playable turf; avoid the corner pylon composition. |
| breakout_star | A receiver celebrating a dominant college performance after the game, with an unmistakably different pose and camera from Breakaway Star. |
| reliable_hands | A precise, controlled practice reception with attention on correct hands and a properly shaped football. Use a side-on ball view so its pointed silhouette is clear. |
| transfer_breakout | Arrival at a new program: a receiver stepping from a tunnel toward a new field with helmet and equipment bag. |
| award_ceremony | An award presentation with an original generic football trophy and a formal stage; no branded trophy or lettering. |
| rookie_breakout | A first-year professional receiver making a confident sideline reception well inside the boundary, with a large stadium behind him. |
| canton_bust | A retired player's bronze bust as the main subject in an induction display; no jacket portrait reused as the main illustration. |
| gold_jacket | A retired player being fitted with a gold jacket at an induction celebration; no bronze bust as the main subject. |

Existing distinct illustrations may be retained if you like them. The immediate replacements needed to stop reuse are Red Zone Monster, Breakout Star, Reliable Hands, Transfer Breakout, Rookie Breakout and Gold Jacket.

## Future jersey-color layers

Keep the original full-resolution artwork. After approving a scene, prepare two precisely aligned grayscale PNG masks at the exact same dimensions: `scene-primary-mask.png` for primary jersey/helmet fabric and `scene-secondary-mask.png` for trim/secondary panels. White selects fabric; black excludes everything else; use smooth edges. Masks must match the approved image exactly. A separately regenerated image is not an aligned mask. Do this as a separate editing step after the composition is approved.

## Before accepting an image

- Check the football silhouette, laces, hands, helmet and anatomy at full size.
- Check that a supposed completed catch does not visibly touch or cross the boundary.
- Check the card crop: the defining action and expression must remain readable.
- Check there are no incidental logos, brand marks, numbers or text.
- Compare against the other scenes: changing colors alone does not make unique artwork.
- Keep primary and secondary jersey areas easy to isolate for recoloring.
