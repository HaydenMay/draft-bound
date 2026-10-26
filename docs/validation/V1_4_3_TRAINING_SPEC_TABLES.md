# Training diagnostic tables

Planning experiments only, source 5a5db5fdcf53d3c51db66e68d047bb753d26e8ba, catalog wr-curated-10-v1.4.2. 24 baseline cases matched production prospect ratings, complete game histories/gains, interventions and final RNG exactly. 200 shared seeded builds per mode; these are not independent across conditions. Full matrix, quantiles and controls: [JSON](V1_4_3_TRAINING_SPEC_CALIBRATION.json).

## Openwater / Balanced / automatic interventions

| Mode | Variant | Initial OVR mean | Freshman | Sophomore | Junior (p10–p90) | Junior displayed90+ | Junior non-gift within1 of ceiling |
|---|---|---:|---:|---:|---|---:|---:|
| quick | baseline | 63.097 | 79.112 | 85.892 | 88.344 (85.814–90.482) | 26% | 65.625% |
| quick | spec_practice8 | 69.866 | 78.94 | 85.331 | 88.35 (85.882–90.339) | 25.5% | 63.688% |
| full | baseline | 63.241 | 79.36 | 86.233 | 88.731 (86.213–90.9) | 34.5% | 61.125% |
| full | spec_practice8 | 70.007 | 79.144 | 85.626 | 88.75 (86.304–90.85) | 35.5% | 59.5% |

## Baseline schools and strategies — automatic interventions

| Mode | School | Strategy | Freshman OVR | Junior OVR | Junior non-gift within1 | Primary gain | Other non-gift mean gain |
|---|---|---|---:|---:|---:|---:|---:|
| quick | technical | balanced | 78.207 | 87.664 | 45.75% | 29.863 | 27.311 |
| quick | technical | focused_stay | 77 | 84.143 | 18.688% | 30.285 | 21.697 |
| quick | technical | intensive_stay | 73.981 | 79.33 | 13.375% | 30.285 | 14.46 |
| quick | technical | focused_rotate | 79.133 | 87.719 | 47.375% | 30.278 | 27.235 |
| quick | technical | intensive_rotate | 78.435 | 87.601 | 47.688% | 30.285 | 27.114 |
| quick | technical | focused_adaptive | 79.401 | 88.44 | 51.688% | 30.147 | 28.335 |
| quick | explosive | balanced | 78.507 | 87.92 | 52.063% | 29.26 | 27.928 |
| quick | explosive | focused_stay | 77.494 | 84.865 | 20.75% | 30.285 | 22.808 |
| quick | explosive | intensive_stay | 74.412 | 80.181 | 13.25% | 30.285 | 15.714 |
| quick | explosive | focused_rotate | 79.327 | 88.108 | 57.938% | 30.28 | 27.878 |
| quick | explosive | intensive_rotate | 78.732 | 88 | 56.75% | 30.285 | 27.763 |
| quick | explosive | focused_adaptive | 79.587 | 88.716 | 64.875% | 30.125 | 28.809 |
| quick | opportunity | balanced | 79.112 | 88.344 | 65.625% | 29.942 | 28.417 |
| quick | opportunity | focused_stay | 77.989 | 85.429 | 22.813% | 30.285 | 23.803 |
| quick | opportunity | intensive_stay | 75.018 | 81.069 | 13.563% | 30.285 | 17.185 |
| quick | opportunity | focused_rotate | 79.924 | 88.423 | 66.875% | 30.285 | 28.405 |
| quick | opportunity | intensive_rotate | 79.26 | 88.358 | 63.063% | 30.285 | 28.318 |
| quick | opportunity | focused_adaptive | 80.233 | 88.994 | 81.5% | 30.26 | 29.269 |
| full | technical | balanced | 78.438 | 88.019 | 44.938% | 29.34 | 27.838 |
| full | technical | focused_stay | 77.228 | 84.42 | 18.625% | 29.8 | 22.045 |
| full | technical | intensive_stay | 74.12 | 79.535 | 13.125% | 29.8 | 14.647 |
| full | technical | focused_rotate | 79.282 | 88.092 | 46.125% | 29.795 | 27.77 |
| full | technical | intensive_rotate | 78.526 | 87.961 | 44.625% | 29.8 | 27.632 |
| full | technical | focused_adaptive | 79.536 | 88.814 | 49.125% | 29.645 | 28.937 |
| full | explosive | balanced | 78.755 | 88.332 | 49.5% | 28.754 | 28.548 |
| full | explosive | focused_stay | 77.704 | 85.171 | 20.5% | 29.8 | 23.233 |
| full | explosive | intensive_stay | 74.581 | 80.374 | 13.438% | 29.8 | 15.904 |
| full | explosive | focused_rotate | 79.483 | 88.527 | 53.188% | 29.795 | 28.507 |
| full | explosive | intensive_rotate | 78.864 | 88.423 | 52.563% | 29.8 | 28.402 |
| full | explosive | focused_adaptive | 79.74 | 89.088 | 60.563% | 29.65 | 29.409 |
| full | opportunity | balanced | 79.36 | 88.731 | 61.125% | 29.447 | 28.999 |
| full | opportunity | focused_stay | 78.189 | 85.725 | 23.313% | 29.8 | 24.198 |
| full | opportunity | intensive_stay | 75.138 | 81.315 | 14.063% | 29.8 | 17.468 |
| full | opportunity | focused_rotate | 80.074 | 88.81 | 62.75% | 29.8 | 28.979 |
| full | opportunity | intensive_rotate | 79.38 | 88.76 | 62.563% | 29.8 | 28.931 |
| full | opportunity | focused_adaptive | 80.383 | 89.423 | 79% | 29.779 | 29.954 |

Practice/experience numbers in each variant are work inputs per game, not rating points. No production constants or player saves were changed. Annual school continuity is a proposed rule in this calibration, pending numerical specification approval.
