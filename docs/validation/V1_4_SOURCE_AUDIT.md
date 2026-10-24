# v1.4 Wide Receiver Source Catalog Audit

## Scope and versioning

v1.4 introduces `wr-original-illustrations-v1.4-90`, an intentionally same-size (90 entries) revision of the WR source-player catalog. Existing source IDs, physical data, pool size, and offer-selection rules remain stable. Sixteen Hall of Fame references receive a single S-tier signature trait; no source-player IDs were added or removed. The prior catalog is preserved verbatim in `src/app/data/source-players-legacy.ts` as `wr-original-illustrations-v1.2-90` so unfinished runs and old drafts continue to resolve the exact grades they originally offered.

The grade rubric is relative to this fictional gameplay pool, not a real scouting scale: S is a signature natural gift; A+/A/A- represent extraordinary through high-end ability; B grades represent strong to functional tools; C grades represent situational or developmental tools; D/F represent significant game limitations. A+ through A- are grade refinements and do not change offer odds. Each catalog entry is sampled uniformly for normal offers; natural-gift pools are selected by attribute and the S grade.

Every name is used as inspiration for a fictional prospect. Height, weight, build, trait grades and game outcomes are game-authored interpretations, not verified scouting grades, player evaluations, or endorsements. The official career references below justify a signature-gift theme but do not establish an objective letter grade.

## New signature-grade assignments

| Source | v1.4 signature trait | Basis for the gameplay interpretation |
|---|---|---|
| Tim Brown | Yards after catch | Hall of Fame profile documents 1,094 receptions and his return-game role, supporting a versatile ball-in-hands identity. [Pro Football Hall of Fame](https://www.profootballhof.com/news/tim-brown-honored-at-hometown-hall-of-fame-program) |
| Isaac Bruce | Route running | Hall profile describes his precise route discipline and records 15,208 yards, 1,024 catches, and 91 TDs. [Pro Football Hall of Fame](https://www.profootballhof.com/players/isaac-bruce) |
| Andre Reed | Yards after catch | Hall profile explicitly highlights his ability to turn short catches into long gains; 13,198 career yards. [Pro Football Hall of Fame](https://www.profootballhof.com/players/andre-reed) |
| Art Monk | Hands | 940 catches and the first 100-catch season in league history support a reliable-catch gameplay identity. [Pro Football Hall of Fame](https://www.profootballhof.com/players/art-monk) |
| Michael Irvin | Hands | His 750 catches, 11,904 yards, 65 TDs, and 1,603-yard 1995 season support a high-volume receiving signature. [Pro Football Hall of Fame](https://www.profootballhof.com/players/michael-irvin) |
| Sterling Sharpe | Hands | The Hall profile records a 112-catch season, a receiving triple crown, and three first-team All-Pro seasons. [Pro Football Hall of Fame](https://www.profootballhof.com/players/sterling-sharpe) |
| James Lofton | Speed | The Hall profile describes his deep-threat speed and records 14,004 yards at 18.3 yards per catch. [Pro Football Hall of Fame](https://www.profootballhof.com/players/james-lofton) |
| Lance Alworth | Speed | Hall profile records 18.9 yards per catch and describes explosive after-catch runs and leaping ability. [Pro Football Hall of Fame](https://www.profootballhof.com/players/lance-alworth) |
| Fred Biletnikoff | Route running | Hall material emphasizes precise routes and sure hands rather than exceptional breakaway speed. [Pro Football Hall of Fame](https://www.profootballhof.com/news/not-so-fast-freddy) |
| Paul Warfield | Vertical | Hall profile documents a 20.1 yards-per-catch average and a long-ball identity. [Pro Football Hall of Fame](https://www.profootballhof.com/players/paul-warfield) |
| Don Maynard | Speed | Hall profile describes his track background and 18.7 yards per catch. [Pro Football Hall of Fame](https://www.profootballhof.com/players/don-maynard) |
| Charlie Joiner | Route running | Hall profile emphasizes route discipline, deep receiving, and an 18-season career. [Pro Football Hall of Fame](https://www.profootballhof.com/players/charlie-joiner) |
| John Stallworth | Body control | Hall material highlights his leaping ability and the sideline body control implied by signature deep catches. [Pro Football Hall of Fame](https://www.profootballhof.com/news/stallworth-honored-in-tuscaloosa) |
| Drew Pearson | Body control | Hall coverage documents his iconic Hail Mary reception and 16.0 yards per catch. [Pro Football Hall of Fame](https://www.profootballhof.com/news/hall-of-fame-knocks-hail-mary-tandems-final-completion) |
| Harold Carmichael | Vertical | The Hall profile highlights his 6-foot-8 catch radius and 8,985 career yards. [Pro Football Hall of Fame](https://www.profootballhof.com/players/harold-carmichael) |
| Andre Johnson | Route running | Hall profile records back-to-back league-leading receiving-yard seasons and five 100-catch seasons; route-running S is a game interpretation of his sustained separation and production. [Pro Football Hall of Fame](https://www.profootballhof.com/players/andre-johnson) |

The 25-player Hall of Fame reference roster is enumerated by stable ID in `HOF_SOURCE_IDS`. The generated audit reports zero Hall of Fame references without at least one S signature trait. That check protects catalog coverage; it does not mean all Hall of Famers receive newly assigned S grades.

## Distribution and generated-build comparison

| Attribute | S sources before | S sources in v1.4 |
|---|---:|---:|
| Speed | 4 | 7 |
| Acceleration | 2 | 2 |
| Hands | 3 | 6 |
| Route running | 8 | 12 |
| Release | 2 | 2 |
| Vertical | 2 | 4 |
| Body control | 5 | 7 |
| Yards after catch | 4 | 6 |
| Awareness | 6 | 6 |

No source dominates generated manual selections in the deterministic 500-build cohorts. Each cohort selects all 90 profiles at least once; the most-used profile accounts for 3.0% of Quick/best manual selections or 2.3% of Full/best selections (rotated selection peaks at 2.1% Quick and 1.5% Full). The source counts are conditional on these scripted offers and policies, not user telemetry.

| Mode and policy | Mean trait ceiling | Mean S ceilings per player | Mean final OVR (2-year / 3-year) |
|---|---:|---:|---:|
| Quick · rotated | 91.12 | 1.50 | 86.38 / 89.62 |
| Quick · best available | 92.60 | 1.83 | 87.56 / 91.17 |
| Full · rotated | 91.06 | 1.55 | 86.33 / 89.58 |
| Full · best available | 94.83 | 2.46 | 88.59 / 92.60 |

Each cohort is evenly spread across the three current fictional schools (166–167 players per school). Source grades changed independently of professional induction rules; matched pro simulations use each same generated draft and `nflSeed` for both algorithms.

## Verification

`docs/validation/v1.4-professional-balance.json` records the complete old/new grade distribution for all nine attributes, donor lists for every S grade, catalog sizes, Hall of Fame signature coverage, and the seeded career-balance cohorts. `src/app/domain/catalog-version.spec.ts` asserts the Hall signature coverage and proves Andre Johnson's revised route-running gift applies only to new-catalog runs; an unfinished legacy offer still resolves to its historical A grade.
