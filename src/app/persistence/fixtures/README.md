# v1.3.1 save compatibility fixtures

These synthetic JSON files freeze representative v1.3.1 save envelopes for compatibility checks before the planned v1.4 data migration:

- `v1.3.1-quick.json` — active Quick prospect in the potential-selection phase, with its RNG state intact.
- `v1.3.1-full.json` — active Full prospect at the same partial-creation point.
- `v1.3.1-collection.json` — completed Draft Edition and Career Edition entries, an archived QB display-only entry, favorites, earned frames, a saved achievement, card customizations, and appearance/theme preferences.

All people, seasons, school data, and outcomes are synthetic. No player's personal backup was used. The files were generated from deterministic seeds and frozen on 2026-10-24; they are test data, not a recipe to regenerate them from future game rules.

`src/app/persistence/save.spec.ts` validates the fixtures and asserts byte-for-byte preservation through save preview. `e2e/v1.3.2.spec.ts` exercises the public backup export, import preview, replacement backup, and round-trip.

Do not rewrite these files to make a future migration test pass. If a future schema intentionally changes, add migration tests that read these original v1.3.1 envelopes, assert the expected migrated result, and retain these originals unchanged as the source baseline.
