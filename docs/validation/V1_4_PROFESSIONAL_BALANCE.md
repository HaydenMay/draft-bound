# v1.4 Professional Balance

Seeded paired synthetic cohorts; baseline source commit 7fbee924894217052d14d6a83eeb04b469bccfe8. Each row pairs legacy and v1.4 simulator rules on the same v1.4-created prospect and stored NFL seed. This isolates the professional algorithm in the primary comparison. It is a deterministic scripted experiment, not player telemetry or a claim of NFL-realistic outcomes.

New induction criteria: 14,500 receiving yards · 85 receiving TDs · 2 All-Pro seasons · 8 professional seasons; All-Pro season >=1,750 yards and 11 TDs. All-Pro season: at least 1,750 yards and 11 receiving touchdowns. Trait policy “rotated” deterministically selects from the current offer index; “best” chooses the highest grade for each manually selected attribute. Each cohort contains 500 seeds (10000–10499) and is distributed across all three fictional schools; detailed school counts, draft rates, final OVR percentiles, production, career length, outcome buckets, All-Pro rates, ceiling distributions and top source selections are in the JSON report.

| Mode | Seasons | Trait policy | n | Mean OVR (p10–p90) | Drafted | HOF legacy | HOF v1.4 | Any All-Pro career v1.4 | Mean All-Pro seasons | Mean career seasons | Mean yards |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| quick | 2 | rotated | 500 | 86.38 (85–88) | 100% | 49/500 (9.8%) | 0/500 (0%) | 14/500 (2.8%) | 0.03 | 10.5 | 9821.4 |
| quick | 2 | best | 500 | 87.56 (86–89) | 100% | 95/500 (19%) | 0/500 (0%) | 20/500 (4%) | 0.04 | 10.83 | 10403.2 |
| quick | 3 | rotated | 500 | 89.62 (87–92) | 100% | 213/500 (42.6%) | 6/500 (1.2%) | 49/500 (9.8%) | 0.12 | 11.08 | 11210.8 |
| quick | 3 | best | 500 | 91.17 (90–93) | 100% | 288/500 (57.6%) | 14/500 (2.8%) | 82/500 (16.4%) | 0.21 | 11.41 | 11940.3 |
| full | 2 | rotated | 500 | 86.33 (84–88) | 100% | 49/500 (9.8%) | 1/500 (0.2%) | 13/500 (2.6%) | 0.03 | 10.49 | 9805.8 |
| full | 2 | best | 500 | 88.59 (87–90) | 100% | 161/500 (32.2%) | 2/500 (0.4%) | 33/500 (6.6%) | 0.07 | 10.98 | 10823.6 |
| full | 3 | rotated | 500 | 89.58 (87–92) | 100% | 205/500 (41%) | 4/500 (0.8%) | 51/500 (10.2%) | 0.12 | 11.06 | 11185.2 |
| full | 3 | best | 500 | 92.6 (91–94) | 100% | 360/500 (72%) | 28/500 (5.6%) | 118/500 (23.6%) | 0.33 | 11.86 | 12755.8 |

The original v1.3.2 reports are archived in [v1.4-baseline](./v1.4-baseline/); the prior paired report reproduces its historical Full/best/year-three and Full/rotated/year-three induction rates under that report's seed schedule. Rates here are cohort observations, not targets or guarantees; rare-tail percentages have substantial sampling uncertainty at n=500.

Full machine-readable percentile, production, outcome-bucket, school/source frequency and seed evidence is in [v1.4-professional-balance.json](./v1.4-professional-balance.json).
