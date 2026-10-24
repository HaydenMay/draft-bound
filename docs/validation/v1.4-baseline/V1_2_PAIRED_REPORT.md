# v1.2 matched progression and source audit

1000 created builds, 3000 matched school/profile career pairs, 12000 draft snapshots. Each pair clones the exact same completed build, RNG state, school and training policy into legacy and v1.2 growth. Snapshots at year two are drafted from a clone; the original continues through year three. Policies rotate evenly by seed; schools are crossed, not rebalanced. No rerolls. Best-available greedily chooses the highest weighted ceiling from the current offer; rotated uses index-based choices. These are scripted policies, not player telemetry.

| Mode / creation / profile / year | n | Mean OVR | P10 / median / P90 | 90+ | 95+ | Maxed traits / 9 | All maxed | First round | HOF |
|---|---:|---:|---|---:|---:|---:|---:|---:|---:|
| quick / rotated / legacy / year 2 | 750 | 88.52 | 87 / 89 / 90 | 26.9% | 0.0% | 4.30 | 0.0% | 48.9% | 33.3% |
| quick / rotated / legacy / year 3 | 750 | 90.97 | 89 / 91 / 93 | 81.6% | 0.5% | 7.55 | 23.2% | 92.5% | 60.7% |
| quick / rotated / v1.2 / year 2 | 750 | 86.58 | 84 / 87 / 89 | 2.5% | 0.0% | 1.35 | 0.0% | 16.8% | 12.7% |
| quick / rotated / v1.2 / year 3 | 750 | 89.94 | 88 / 90 / 92 | 64.0% | 0.0% | 3.65 | 0.0% | 78.5% | 48.7% |
| quick / best-available / legacy / year 2 | 750 | 89.85 | 88 / 90 / 91 | 62.9% | 0.0% | 3.69 | 0.0% | 76.3% | 46.4% |
| quick / best-available / legacy / year 3 | 750 | 92.81 | 91 / 93 / 94 | 100.0% | 5.5% | 7.10 | 16.5% | 99.9% | 79.7% |
| quick / best-available / v1.2 / year 2 | 750 | 88.10 | 86 / 88 / 90 | 13.7% | 0.0% | 1.10 | 0.0% | 41.9% | 24.8% |
| quick / best-available / v1.2 / year 3 | 750 | 91.69 | 90 / 92 / 93 | 96.5% | 0.1% | 3.10 | 0.0% | 98.7% | 67.1% |
| full / rotated / legacy / year 2 | 750 | 88.39 | 86 / 88 / 90 | 25.3% | 0.0% | 4.33 | 0.0% | 46.1% | 30.1% |
| full / rotated / legacy / year 3 | 750 | 90.87 | 89 / 91 / 93 | 78.7% | 0.7% | 7.52 | 24.1% | 91.3% | 56.8% |
| full / rotated / v1.2 / year 2 | 750 | 86.48 | 84 / 87 / 88 | 1.5% | 0.0% | 1.41 | 0.0% | 14.7% | 14.4% |
| full / rotated / v1.2 / year 3 | 750 | 89.83 | 88 / 90 / 92 | 60.5% | 0.0% | 3.75 | 0.0% | 77.2% | 45.6% |
| full / best-available / legacy / year 2 | 750 | 90.60 | 89 / 91 / 92 | 83.5% | 0.0% | 2.37 | 0.0% | 86.5% | 53.3% |
| full / best-available / legacy / year 3 | 750 | 94.30 | 93 / 94 / 95 | 100.0% | 43.5% | 5.33 | 1.2% | 100.0% | 93.1% |
| full / best-available / v1.2 / year 2 | 750 | 89.20 | 88 / 89 / 91 | 42.3% | 0.0% | 0.87 | 0.0% | 62.7% | 37.5% |
| full / best-available / v1.2 / year 3 | 750 | 93.25 | 92 / 93 / 94 | 100.0% | 9.5% | 2.36 | 0.0% | 99.9% | 83.9% |

## Interpretation and limits

This paired comparison isolates progression on the current 90-player catalog. The original 75-player baseline is a separate, unpaired historical cohort; do not subtract it from this report to claim a catalog effect. Source odds remain uniform. Both profiles use the same current coaching rules. Pro careers and HOF criteria are unchanged, so downstream rates reflect changed college ability. A junior season still increases ability; no artificial injury, forced declaration, lost potential or playable pro-development system was added.

The v1.2 profile moves mastery bands relative to each ceiling; a ceiling of 99 retains the original bands and mathematical 99 witness. It reduces routine ceiling completion, not the underlying elite-heavy source pool or optimal-selection advantage. Those need the separately planned long-term pool and potential-selection review. No claim that the 15 added sources solve that issue.

## Recruiting

75% weighted potential plus 25% weighted initial ability. Fixed bands are implementation defaults.

| Mode / creation | n | Mean score | P10 / median / P90 | 1 / 2 / 3 / 4 / 5 stars |
|---|---:|---:|---|---|
| quick / rotated | 250 | 83.86 | 81.94 / 84.09 / 85.64 | 0 / 7 / 115 / 127 / 1 |
| quick / best-available | 250 | 85.67 | 84.35 / 85.73 / 86.94 | 0 / 0 / 17 / 210 / 23 |
| full / rotated | 250 | 83.79 | 81.94 / 83.8 / 85.66 | 0 / 11 / 126 / 109 / 4 |
| full / best-available | 250 | 87.17 | 86.06 / 87.26 / 88.14 | 0 / 0 / 0 / 99 / 151 |

## Source audit

90 original illustrative profiles; grades are game interpretations, not official player ratings. Aggregate grade counts: B+: 134, A-: 152, A+: 137, S: 36, A: 209, B-: 26, B: 60, C+: 28, C: 17, D+: 6, C-: 4, D: 1.

| Attribute | S sources | Mean source ceiling |
|---|---:|---:|
| speed | 4 | 86.63 |
| acceleration | 2 | 89.00 |
| hands | 3 | 91.53 |
| routeRunning | 8 | 92.23 |
| release | 2 | 90.33 |
| vertical | 2 | 86.80 |
| bodyControl | 5 | 92.23 |
| yardsAfterCatch | 4 | 88.50 |
| awareness | 6 | 92.33 |

Ceiling/regression violations: 0. Full JSON includes school and training-policy breakdowns, 80+/85+ thresholds, ceiling OVR and NFL yardage.
