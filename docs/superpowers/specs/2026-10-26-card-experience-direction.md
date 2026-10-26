# Future card experience and autographs

Status: owner-agreed product direction, recorded October 26, 2026. The owner subsequently authorized the system changes: automatic careers and one canonical card are implemented for new v1.4.4 prospects. Autographs, inspection and styling remain planning-only. The user refers to this broader card work as v2; exact release placement remains tentative. Scene-art production remains separately deferred to tentative v1.5.

## Agreed career and collection direction

- Every new prospect proceeds through the automatic NFL career simulation before their finished collectible is created. Preserve the draft-night reveal as a distinct story moment.
- Produce one customizable card per prospect instead of separate Draft and Career editions.
- Use final college OVR. There is no NFL attribute development or distinct peak NFL OVR in the current game. The professional simulation supplies career results and honors.
- Intended flow: college → draft reveal → automatic NFL career → career recap → card customization → save to binder → inspect later.
- Preserve existing cards, customizations and saved outcomes. v1.4.4 preserves existing two-edition entries and their URLs. New entries use one canonical career customization, with compatibility fields kept in storage; no earned cards are deleted or replaced.

## No pack or random-finish system

The owner moved away from packs and random card treatments after discussing how an unwanted pull could disappoint someone excited about their prospect. No pack opening, random foil assignment, surprise autograph applied on save, or cosmetic rarity economy is planned. Users preview and choose their card's appearance. A save animation must preserve their design.

Autograph generation below is a deliberate, optional convenience within customization, not a pack reward or gameplay roll.

## Approved autograph behavior

Autographs live in **card customization**, with one fixed, designed location on the card. Do not add autograph controls to prospect creation, dragging/placement controls, ink selectors, or detailed font/format menus to this scope.

The two controls are:

1. **Show autograph** — on/off.
2. **Try another signature** — generate and preview a different combination.

Assign an initial random combination when the card is first created. Most users can accept it; users who dislike it can try another before saving. Existing saved cards can also change the autograph through customization. The generated choice remains stable until the user explicitly requests another; toggling visibility, inspecting, reopening, rendering and exporting must not rerandomize it.

### Twelve combinations

- Three distinct handwriting font styles; actual fonts remain to be selected.
- First-name section: `FIRST_NAME` or `FIRST_INITIAL` (initial includes a period).
- Last-name section: `LAST_NAME` or `LAST_NAME_NUMBER` (append ` #` and the prospect's jersey number).
- Combine the sections with a space: 3 × 2 × 2 = **12 combinations**.

For Hayden May, jersey11: `Hayden May`, `H. May`, `Hayden May #11`, `H. May #11`, each available in three handwriting styles. The signature represents the fictional generated prospect, not an imitation of a real source athlete's autograph.

Save the chosen style and format with the card customization. Reopening, binder display, inspection and PNG export must reproduce the saved result; export must wait for the selected font to load. A new preview should differ from the currently displayed combination. Cosmetic randomness must not consume the gameplay RNG or change any career outcome. Save must commit the previewed combination without an additional roll.

### Details still requiring implementation design

- Select three visually distinct fonts suitable for bundling/export, with their license requirements checked.
- Choose the fixed autograph area and readable styling across card layouts and finishes. Fit long, hyphenated and apostrophe-containing names without clipping; settle name parsing for multi-part names rather than assuming every name has exactly two words.
- Decide default visibility and how older cards first acquire an optional autograph without silently changing their existing appearance.
- Define storage/default compatibility, keyboard-accessible controls and identical browser/PNG rendering. Retrying signatures must not create additional cards or alter saved player results.

## Broader styling and inspection ideas

Discussed ideas include large inspect views, touch/pointer tilt with responsive foil light, an accessible flat/reduced-motion view, and a card back containing the prospect's college/draft/career story. Additional layouts, coordinated frames, textures, finishes and earned-honor visibility are candidates. These need further visual design and scope approval; no specific new design family, finish count, flip implementation or autograph placement is finalized here. Cosmetic options do not grant gameplay benefits, and honor badges must reflect actual earned results.
