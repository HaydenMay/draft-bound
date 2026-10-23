# Wide Receiver Prospect Development — Implementation Plan

> v1.2 implementation amendment: see V1_2_RELEASE.md and superpowers/specs/2026-10-23-v1.2-planning.md for current creation modes, unique offers, catalog, progression and presentation. Original numeric examples below describe the retained legacy profile unless stated otherwise.

> **Release authorization:** Implementation, a public GitHub repository and GitHub Pages publication were explicitly authorized on October 23, 2026. The earlier document-only and local-only boundaries below are superseded by that request. See PROGRESS.md and ROADMAP.md for the delivered release.

**Version:** 1.2 — portable engineering handoff. Use the coding environment's available tools and applicable local instructions. No named skill, agent platform, or delegation framework is required; optional workflows may be used when available and authorized.

**Goal:** Build a complete local Angular/TypeScript WR prospect game from creation through college, Draft Night, collectible cards, and an optional NFL career.

**Architecture:** A pure TypeScript career engine owns shared chronology, trait-roll orchestration, bounded development, commands, and immutable results. One registered WR position module supplies attributes, simulation, statistics, awards, evaluation, and artwork predicates. Angular owns accessible screens and a thin store; local persistence and layered 2D cards preserve position-tagged historical snapshots.

**Tech stack:** Angular, strict TypeScript, HTML/CSS, the Angular CLI's compatible test tooling, Playwright for browser flows, and browser IndexedDB for local persistence. No backend or runtime AI service is required.

**Spec:** [GAME_DESIGN.md](GAME_DESIGN.md), version 1.2, October 22, 2026. Read both documents; the spec wins on gameplay.

## 1. Executable implementation brief

The following brief applies when the user explicitly authorizes implementation. It is transferable between Codex, ChatGPT Work, Claude, and comparable coding agents.

> Build the complete WR-only Angular/TypeScript game in GAME_DESIGN.md and this plan. Deliver creation, college, sophomore declaration, scouting, Draft Night, optional NFL career, cards, and binder. Use shared career infrastructure with one real WR position module; add no other playable positions. Preserve uniform player rolls and cosmetic-only progression. Implement event-backed scene eligibility, frozen draft team/round identity, deterministic saves, and the required verification. Use labeled defaults, centralize coefficients, document changes, and report unresolved balance or asset concerns honestly. Do not add deferred gameplay features. Public GitHub Pages publication is authorized for this release.

Do not reopen settled design decisions. Ask for input only when a necessary choice has neither a safe default nor an available fallback, when existing project constraints conflict with the required stack, or when completing the task would exceed its authorized scope.

### Global constraints

- Angular/TypeScript browser game; WR only, with stable positionId and position-specific rules behind shared career systems.
- One S-tier natural gift, then Size, then exactly three manually selected potentials, then automatic completion.
- Normal receiver rolls are uniform over the configured receiver pool, with repeat appearances allowed.
- Selected and autofilled potentials share the same grades, ceiling system, starting-ability rules, and development rules.
- Current ability and fixed potential ceiling are separate values.
- College uses four-game training blocks and individual games within each block.
- Initial training does not subtract existing attribute points.
- Each intervention type occurs at most once per college year; one boundary schedules at most one corrective requirement. Matching full practice fulfills it unchanged; otherwise replace one next-block practice week, then resume the normal plan.
- Zero meaningful participation produces zero game-derived experience while ordinary practice continues.
- Balanced, Focused (+) and Intensive (++) conserve one shared practice budget; only allocation differs.
- Every completed Draft Night preserves a default Draft Edition before either ending branch.
- Polished original spins reveal committed offers; presentation cannot consume gameplay RNG or change results.
- Sophomore declaration is AGREED: Declare after 24 games or Return for junior year and finish after 36.
- Drafted results preserve overall pick, round, and drafting-team identity; Undrafted has none.
- Scene unlocks preserve structured evidence from recorded run outcomes.
- Draft Night closes the main game; NFL continuation is optional and cannot change the frozen main result.
- Account progression is cosmetic only and never changes roll odds, development, difficulty, opportunity, or evaluation.
- Artwork, earned accolades, and account cosmetics are separate systems.
- Hall of Fame (HOF) status supports eligible art, an independent earned stamp, and binder filtering regardless of the chosen image.
- No required login, backend, payment, advertisement, or runtime AI call.

### Default values to preserve initially

Numeric values below remain configurable DEFAULTS. The sophomore declaration row states an AGREED rule; it is no longer an open realism choice:

| Area | Initial setting | Spec reference |
| --- | --- | --- |
| Skills | Nine trainable skills plus separate Size | §6.2 |
| Gift | 94 current; 99 ceiling; three distinct offered skill IDs | §5.2 |
| Other starting skills | Uniform integer 50–65, capped at ceiling | §6.3 |
| Rerolls | Three shared across Size and manual potential offers | §5.5 |
| Creation counts | One gift + three manual + five autofill | §6.2 |
| College | Up to three years; 12 games/year; three four-game blocks/year | §8 |
| Early exit — AGREED | Declare after sophomore or return; automatic junior finish | §8 |
| Year factors | Freshman 1.50; sophomore 1.15; junior 0.85 | §9.2 |
| WR practice | 7.20 total work units per game, conserved by all three modes | §9.1 |
| Training allocation | Balanced: 0.80 each; Focused (+): target 4.32, other eight 0.36 each; Intensive (++): target 7.20, others 0 | §9.1 |
| WR general experience | 3.60 total × clamp(routesRun / 30, 0.00, 1.20); 50% uniform + 50% normalized learning reps | §9.2 |
| Coaching | Technical/explosive specialty 1.25; opportunity program all skills 1.05 | §7 |
| Intervention | Full matching practice fulfills unchanged; otherwise one corrective week; one type/year and one boundary requirement | §9.3 |
| Gauntlet | Five defensive archetype tests | §11.1 |
| Draft evaluation | 70% OVR + 20% college grade + 10% gauntlet grade | §11.2 |
| NFL continuation | Up to 15 seasons; no retirement before three seasons | §12 |
| WR induction | 12,000 yards + 80 TD + 3 recorded All-Pro selections | §12 |
| WR All-Pro | At least 1,400 receiving yards and 10 receiving TD in that season | §12 |
| WR All-American | At least 1,200 receiving yards, 10 receiving TD and normalized grade 85 in a completed college season | §10 |
| Draft board | 32 neutral teams; 256 explicit slots; round counts 32/32/40/40/40/40/32 | §11.2.1 |
| Card presentation | 2D illustration + frame/foil + earned stamps | §13 |

Copy the complete grade map, OVR weights, rating bands, draft bands, and intervention thresholds from the spec into configuration once. Do not maintain divergent copies inside components.

### Review focus

Each risk below has a named acceptance check in the owning task:

1. Refresh or repeated clicks during a reveal must not create another roll, block, achievement, career, or binder entry. Tasks 2, 5, 8, and 9.
2. A nearly complete or capped skill sheet must never offer an already filled skill, raise a ceiling, lose fractional progress, or trap the user. Tasks 3 and 4.
3. Intervention triggers at Games 4, 8 and 12, matching/nonmatching plans, and year rollover must preserve the annual limit, conserve work and restore normal training. Task 5.
4. Skipping the NFL career, immediately continuing without card customization, finishing Undrafted, or hiding a HOF stamp must preserve an accessible Draft Edition and truthful metadata. Tasks 6–8.
5. Storage failure, malformed import, missing artwork, unknown position/rules versions, and narrow or reduced-motion screens must leave readable outcomes or a clear recovery path. Tasks 1, 8–10.

Also review the extension boundary: shared models/scheduling/rendering must not require WR fields. Contract and metadata fixtures in Tasks 1, 3, 8, and 9 test that boundary without implementing a second position.

## 2. Scope and milestone policy

The full deliverable includes creation, college, transfers, interventions, agreed sophomore declaration, gauntlet, Draft Night with round/team, optional NFL simulation, event-backed collectibles, cosmetic achievements, export, binder, and position-preserving local persistence. Shared position boundaries are part of V1; other playable positions are not.

Phases are checkpoints within one coherent implementation. Passing an early milestone is not permission to call the entire game complete.

| Phase | Deliverable | Exit evidence |
| --- | --- | --- |
| A | Deterministic prospect creation | Creation tests and browser walkthrough |
| B | Complete college development | Full three-year seeded run, transfer and intervention checks |
| C | Gauntlet and Draft Night | Drafted and undrafted endings; frozen results |
| D | Optional NFL career | Save-now and career paths; induction semantics |
| E | Collectible reward loop | Cards, stamps, cosmetics, binder, export, resume |
| F | Balanced and verified local build | Automated checks, batch report, responsive walkthrough |

Exclude injuries, negative training, Work Ethic, personality bonuses, account power, additional positions, full team management, public rankings, cloud accounts, purchases, ads, live gameplay, 3D fields, and per-run image generation.

An asset or optional module blocker does not erase the rest of the scope. Complete unaffected work, identify the exact missing deliverable, and label the result accordingly.

## 3. Architecture and ownership

### 3.1 Shared foundation versus position-specific rules

| Unit | Owns | Must not own |
| --- | --- | --- |
| Shared domain | Position/identity envelopes, commands, chronology, random streams, fixed-ceiling mechanics, draft lifecycle | A universal WR attribute union or mandatory receiving fields |
| Shared creation | Gift/Size/manual/autofill stages, uniform sampling, reroll budget, exclusions | Hard-coded receiver pools, nine rows, or five autofill iterations |
| Shared college career | Four-game sequencing, year/transfer/declaration workflow, practice substitution ledger | WR game equations, WR rep mapping, or WR intervention names |
| Position definition/rules | Attributes, source grades, physical profile, OVR weights, game stats/events, training/experience, school specialties, gauntlet, draft/pro rules, awards and art predicates | Storage, DOM, account power, or navigation side effects |
| Shared draft/pro lifecycle | Frozen outcome, board/team identity, optional continuation, saved seasons, status | Receiving thresholds or professional award invention |
| Eligibility ledger | Deduplicated scene unlocks with stable evidence references/snapshots | Fabricated plays or UI-generated accolades |
| Content catalogs | Versioned source players, schools, teams/board, art, cosmetics | Gameplay side effects |
| Application store | Command sequencing, save coordination, selectors, result presentation | A second set of balance formulas |
| Persistence | Validated versioned data, atomic commits, migrations, historical read-only fallback | Silently changing position or rules versions |
| Angular features | Input, navigation, accessible reveal/result screens | Gameplay random draws |
| Shared cards/binder | Layering, generic stat descriptors, sorting, evidence detail, export | Assumptions that every athlete has receiving yards |

All gameplay randomness passes through the domain RNG. Reading a selector, hovering, exporting, changing art, or fast-forwarding consumes no gameplay randomness.

**Why these abstractions exist:** PositionDefinition prevents shared UI/data from assuming WR skills. PositionRules isolates irreducibly different football simulations. A small static registry selects the correct rules. Position-tagged payloads preserve type safety. Historical display snapshots preserve readable collectibles after content changes. Do not add abstraction layers that lack one of these concrete responsibilities.

### 3.2 Proposed repository structure

Future project-relative paths; adapt naming to a compatible existing repository while preserving ownership.

~~~text
src/app/
  domain/
    shared/
      models.ts
      commands.ts
      rng.ts
      ratings.ts
      development.ts
      creation.ts
      college-career.ts
      draft-workflow.ts
      professional-lifecycle.ts
      eligibility-ledger.ts
      achievements.ts
      reducer.ts
    positions/
      position-contracts.ts
      position-types.ts
      position-registry.ts
      position-validation.ts
      wr/
        definition.ts
        config.ts
        college-game.ts
        learning-reps.ts
        interventions.ts
        gauntlet.ts
        draft-evaluation.ts
        professional-career.ts
        awards.ts
        artwork-eligibility.ts
        presentation.ts
        index.ts
    *.spec.ts and tests beside the modules they verify
  data/
    wr-source-players.ts
    colleges.ts
    draft-teams.ts
    draft-board.ts
    art-scenes.ts
    cosmetics.ts
  application/
    game-store.ts
    selectors.ts
    command-dispatcher.ts
  persistence/
    save-schema.ts
    indexeddb-repository.ts
    import-export.ts
    migrations.ts
    historical-display.ts
  features/
    home/
    creation/
    recruitment/
    college/
    gauntlet/
    draft-night/
    nfl-career/
    card-builder/
    binder/
  shared/
    attribute-sheet/
    source-player-card/
    highlight-reel/
    collectible-card/
    stat-panel/
    status-message/
  app.routes.ts
  app.config.ts
public/art/
  scenes/
  frames/
  stamps/
e2e/
  creation.spec.ts
  full-run.spec.ts
  nfl-career.spec.ts
  binder.spec.ts
  persistence.spec.ts
tools/balance-report.ts
docs/
  DECISIONS.md
  VALIDATION.md
  ASSET_MANIFEST.md
~~~

Only wr is a playable position directory. No empty qb/rb modules, unused source databases, dynamic plugin loader, or universal possession engine.

### 3.3 Typed models and position extension contract

**DEFAULT TypeScript strategy:** A small PositionPayloadMap initially has one key, wr, associating its attribute IDs, physical profile, game stats/events, and professional stats. PositionId is the map's key union. A few types at this boundary, such as `ProspectFor<P>` and `PositionRules<P>`, use that map. Shared chronology and binder metadata remain ordinary types; aggregate position results use a discriminated union derived from the map. Do not turn every service into a deeply generic framework.

| Type | Required data / responsibility |
| --- | --- |
| ProspectCore | prospectId, identity, immutable positionId, creation timestamp, rules/content versions; no WR skill fields |
| `PositionDefinition<P>` | Stable id, display name, ordered AttributeDefinition list, sourceCatalogId, gift sources, OVR weights, physical/stat display descriptors |
| `PositionRules<P>` | Validated definition plus typed position capabilities described below |
| WrAttributeId | speed, acceleration, hands, routeRunning, release, vertical, bodyControl, yardsAfterCatch, awareness; confined to WR types |
| `AttributeValues<P>` | Complete numeric map keyed by that position's attribute IDs |
| Grade | S, A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F |
| `TraitAssignment<P>` | Attribute ID, sourcePlayerId, sourceGrade, fixed ceiling, gift/manual/autofill origin |
| `SourcePlayerDefinition<P>` | Stable source ID, name, typed physical profile, complete grade map for the position |
| `ProspectFor<P>` | ProspectCore plus typed current/initial attributes, assignments, accepted physical profile, initial OVR |
| WrPhysicalProfile | Source ID, heightCm, weightKg, buildLabel, Size grade; other positions may interpret profiles differently |
| CollegeProgram | Shared school identity/offense/opportunity plus explicit specialties keyed by position and attribute |
| TrainingPlan | Discriminated mode balanced, focused, or intensive; focused/intensive require a validated attributeId; plan is bound to the run's position |
| PracticeAllocation | Complete nonnegative attribute work map; WR sum 7.20 in every mode before modifiers |
| RngState / `RandomResult<T>` | Algorithm ID and unsigned 32-bit state; value plus nextRng |
| OvrResult | raw number and rounded display integer |
| CareerPoint | Stage, college year/block/game or professional season, stable chronology index |
| `GameRecord<P>` | Shared identity/opponent/chronology/rules envelope plus typed position stats/events and learning inputs |
| WrGameStats | Routes, targets, receptions, drops, yards, TD, press/contested/red-zone counters and normalized game grade |
| WrGameEvent | Discriminated football events, including receiving-play facts used by learning, highlights and art |
| DevelopmentResult | Updated attributes and realized/general/practice/capped-work breakdown, with unchanged ceilings |
| Intervention | Position-scoped type ID, cause, prescribed target/work, source block, reserved/used annual state, selected plan, fulfillmentMode already_compliant/substituted, and effective first-week allocation |
| CollegeHistory | Chronological games, blocks, yearly snapshots, transfers, per-year intervention ledgers |
| DraftTeamIdentity | teamId, catalogVersion, displayName, primaryColor, secondaryColor saved by value |
| DraftBoardSlot | overallPick, round, pickInRound, teamId |
| DraftOutcome | Drafted variant with pick/round/slot/team snapshot, or Undrafted variant with none |
| `DraftSnapshot<P>` | Immutable position-tagged prospect/college/gauntlet evaluation, DraftOutcome, main records, display/evidence snapshots and versions |
| AwardRecord | awardRecordId/type, positionId, stage/season, qualifying values/source IDs, rule ID/version |
| `ProfessionalCareerFor<P>` | Position-tagged seasons/stats, team continuity, awards, retirement and induction evaluation |
| CareerStatus | not_simulated; simulated_not_inducted; simulated_inducted, or equivalent explicit tagged union |
| EvidenceSnapshot | Tagged gameEvent/gameStats/seasonStats/transferComparison/award/draftOutcome/induction facts plus stable source IDs, chronology, opponent/team snapshots, rule versions |
| SceneUnlock | unlockId, sceneId, prospectId, positionId, eligible editions, chronology, evidence IDs/snapshots and eligibility version |
| DisplaySnapshot | Ordered attribute/stat labels and values, units, position label, frozen team/accolade/evidence text inputs; no executable functions |
| CardCustomization | Edition, eligible scene/evidence IDs, owned frame, foil, visible earned stamps; Draft default exists at Draft Night and each edition edits independently |
| BinderEntryCore | Prospect/position IDs, dates, favorite, main records, edition availability, display/evidence references; no required receiving fields |
| BinderEntry | Core plus frozen typed draft payload, optional typed professional result, earned awards/unlocks and edition customizations |
| CosmeticProfile | Account achievements and owned cosmetic IDs; never an input to simulation/evaluation |

GameContext contains validated position registry, content catalogs, shared career configuration, and position configuration. CosmeticProfile is absent. Catalog IDs, attribute IDs, event kinds, and position IDs are validated at runtime at save/import boundaries; do not replace typed runtime payloads with unvalidated string maps.

`PositionRules<P>` supplies these capabilities:

| Capability | WR implementation | Shared caller |
| --- | --- | --- |
| Definition/source/gift/physical validation | WR attributes and complete real-receiver grades | Creation/content validation |
| Practice and learning allocation | WR total budgets and relevant rep map | Shared development |
| College simulation and event formatting | WR stats/events and derived text | Shared block scheduler/highlights |
| Intervention candidates and specialty validation | JUGS, Press, Contested-catch definitions | Shared boundary scheduler |
| Scouting and college/draft grade | Five WR tests and normalized evaluation | Shared gauntlet/draft workflow |
| Professional production, awards, induction | WR seasons, All-Pro records, WR threshold baseline | Shared optional-career lifecycle |
| Scene predicates/stat presentation | WR evidence qualification and display descriptors | Eligibility ledger and shared cards |

**Creation state:** Represent incomplete attributes explicitly. Promote to a complete position-tagged Prospect only when all required attributes and the physical profile validate. Autofill count is definition.attributes.length minus gift/manual assignments; nine minus four equals five for WR defaults.

**RunState:** Immutable positionId; schema, rules, balance and content versions; phase; typed creation/prospect; rerolls; college/year/block; plan; chronology/history; pending intervention/annual ledger; main/NFL RNG; draft/pro results; processed command IDs; scene/award evidence. Store current skills by stable attribute ID, not display-array index.

**Run phases:** gift → size → manualPotential → autofillReveal → collegeChoice → trainingChoice → blockReview → seasonReview → transferChoice or declaration → gauntlet → draftNight → cardBuilder or nflSummary → completed.

After freshman: Stay/Transfer then sophomore. After sophomore: Declare or Return; only Return leads to Stay/Transfer then junior. After junior: scouting. No active run can change position through routing or a catalog update.

### 3.4 Engine interfaces

Task 1 defines these named input/output types. A small number of typed position adapters sit behind shared orchestration; this is an interface plan, not implementation code.

~~~typescript
nextRandom(state: RngState): RandomResult<number>; // [0, 1)
sampleUniform<T>(items: readonly T[], state: RngState): RandomResult<T>;
getPositionRules(id: string, rulesVersion: string, registry: PositionRegistry): PositionLookupResult;
validatePosition(definition: PositionDefinition, content: PositionContent): ValidationIssue[];
calculateOvr(current: AttributeNumberMap, weights: AttributeNumberMap): OvrResult;
advanceWithinBands(current: number, ceiling: number, rawWork: number, bands: readonly GrowthBand[]): number;
applyCreationCommand(run: RunState, command: CreationCommand, context: GameContext): CommandResult;
resolveTrainingBlock(run: RunState, plan: TrainingPlan, context: GameContext): CommandResult;
scheduleIntervention(input: InterventionBoundaryInput, config: CareerConfig): Intervention | null;
resolveDraft(input: DraftWorkflowInput, rng: RngState, context: GameContext): RandomResult<DraftSnapshot>;
resolveProfessionalCareer(draft: DraftSnapshot, rng: RngState, context: GameContext): RandomResult<ProfessionalCareerResult>;
collectSceneUnlocks(input: EligibilityInput, context: GameContext): readonly SceneUnlock[];
evaluateAchievements(entry: BinderEntry, context: GameContext): readonly AchievementId[];
getEligibleCardOptions(entry: BinderEntry, edition: CardEdition): CardOptions;
buildCardView(entry: BinderEntry, edition: CardEdition): CardViewModel;
reduceGame(run: RunState | null, command: GameCommand, context: GameContext): CommandResult;
~~~

AttributeNumberMap is the shared read-only numeric-map view accepted by generic arithmetic after position validation. Position-specific code still uses `AttributeValues<P>`. PositionDefinition/PositionContent/DraftSnapshot in shared aggregate signatures denote the validated discriminated union of the registered typed definitions/results.

`PositionRules<P>` methods have exact semantic inputs/outputs: simulateCollegeGame accepts a typed prospect, physical profile, school, opponent and CareerPoint plus RngState and returns RandomResult<`GameRecord<P>`>; getLearningReps maps that record to `AttributeValues<P>`; allocatePractice maps TrainingPlan to `AttributeValues<P>`; getInterventionCandidates consumes recorded performance and returns typed candidates; runGauntlet returns a position-tagged gauntlet; gradeDraft returns a 0–99 evaluation from current OVR, normalized college grade and gauntlet; simulateProfessionalCareer returns the typed professional history and AwardRecords; evaluateInduction returns a versioned induction decision; qualifyScenes returns evidence-backed candidates. None reads storage, DOM, wall clock, or account cosmetics.

CommandResult is success with next run and domain events, or failure with unchanged prior run and a domain error. Illegal commands never partially mutate state. PositionLookupResult distinguishes supported, missing position, and missing compatible rules version; there is no default-to-WR branch.

### 3.5 Determinism, immutable outcomes, and command safety

**DEFAULT:**

- Use a documented/tested Mulberry32 implementation with unsigned 32-bit arithmetic and saved state.
- Derive an independent NFL seed once from original seed, immutable positionId, and a documented nfl namespace/hash. Never derive it from account cosmetics.
- IDs/timestamps originate outside gameplay randomness and are passed into commands.
- A repeated accepted commandId returns the committed state without duplicate events, awards, unlock evidence, growth, career results or binder entries.
- Reject wrong-phase commands; serialize commits and disable advancing controls while committing.
- Resolve all four games sequentially before entering block presentation. Persist the results, gains, intervention decision, awards, and scene evidence together.
- Results are committed before reveals; fast-forward and refresh read the same result.
- On storage failure retain the committed in-memory outcome and show Unsaved; retry persistence, not simulation.
- Never apply current balance rules retroactively to frozen outcomes. Active continuation requires a compatible saved position/rules version or an explicit, tested migration.

### 3.6 How QB can be added later

Once separately authorized, implement a QB module containing its real-player source pool, Throw Power/accuracy/decision attributes, natural gifts, physical interpretation, weights, college simulation/stat/event types, rep allocation, interventions, college specialties, gauntlet, draft grading, professional production, awards/induction, and scene/stat descriptors. Extend the small PositionPayloadMap, register qb, and validate its content.

Creation stages, uniform-roll helper, reroll budget, four-game scheduler, year/declaration/transfer decisions, frozen draft/team workflow, professional continuation shell, shared card layers, cosmetics, binder metadata, and versioned persistence remain in place. Existing WR entries retain wr, their versions and display/evidence snapshots. New UI choices route a new prospect to its selected definition; they do not convert an old one.

**Extension verification without another position:** Use compile-time assertions that shared core types have no WR fields, and a test-only two-attribute/two-stat metadata fixture for generic validation, OVR arithmetic, and rendering. It is not registered as playable and has no football simulator. Additive registry/content tests preserve the exact WR save bytes/results, and unknown-position/version tests exercise readable errors/fallbacks.

## 4. Local persistence and rendering

### Persistence

**DEFAULT:** Use a small IndexedDB repository with a versioned save envelope for active run, position-tagged binder entries, cosmetic profile, and schema version. Package art as local assets rather than storing image blobs in every entry.

~~~typescript
load(): Promise<LoadResult>;
commit(envelope: SaveEnvelope): Promise<void>;
exportData(): Promise<Blob>;
validateImport(text: string): ImportValidationResult;
replaceWithValidatedImport(envelope: SaveEnvelope): Promise<void>;
migrateKnownSchema(input: HistoricalSaveEnvelope): MigrationResult;
~~~

LoadResult distinguishes empty, valid, migrated, incompatible, and corrupt states. Initial shipping schemaVersion is 1; do not invent a previously shipped schema. Implement version dispatch and migration contracts now; add actual transformation steps only when a real supported shape changes. Registering a future position alone does not require rewriting WR payloads.

Store positionId, position-rules version, balance/content/eligibility versions, RNG algorithm/state, immutable draft pick/round/team, professional statuses/awards, unlock evidence, and frozen display descriptors. A position's attributes and stats cannot be inferred from the application's current selection.

Validate identifiers, finite values, grades/ceilings, position payloads, stat relationships, phases, scene/award references, team/board snapshots, and versions. Runtime-invalid known data cannot replace valid data. A structurally safe historical entry with unavailable position rules may remain read-only from its DisplaySnapshot and available local art, with export preserved. Treat an unknown/incompatible active run as unsupported rather than coercing it into WR. Corrupt/newer data is not automatically overwritten.

Migrations must preserve position, factual outcomes, existing evidence, random state, and frozen identities; do not rerun simulations or reconstruct awards. If a genuinely older record lacks evidence/team metadata, display an explicit historical-unknown value unless its stored board/version facts make reconstruction certain.

Provide an import preview before replacing a collection and a backup export. Invalid imports leave existing data unchanged. User-authored names render as text, not HTML.

### Cards and assets

Use one shared card composition for binder, customization, and export. CardViewModel contains position label, attribute/stat descriptor arrays, selected scene/evidence, frame, stamps, team identity, and truthful edition data. Render the arrays rather than indexing WR fields. Load a saved DisplaySnapshot when compatible live descriptors are unavailable.

Export via tested 2D canvas/SVG composition with local art and loaded fonts. Preserve readable front/back details, scene evidence captions, and pick/round/team or Undrafted. No Three.js or runtime image-generation dependency.

The art manifest records scene ID, position/stage eligibility, local file/crop, source/permission status, and fallback. Missing art is visible and cannot prevent saving. Scene eligibility is a rules-engine result; hiding a stamp changes no saved accolade.

## 5. Tasks and phase gates

For each task: write meaningful behavior tests, confirm they fail for the missing behavior, implement, and rerun the relevant suite. Do not write tests that merely assert a component exists or duplicate a formula without checking its product invariant.

If using Git in a later repository, commit coherent passing milestones. Use the repository's applicable source-control workflow when implementation is authorized; do not impose a particular hosting or review service.

### Task 1 — Establish typed career and WR position contracts

**Phase:** A  
**Files:** Project/test configuration; domain/shared/models.ts, commands.ts; domain/positions/position-contracts.ts, position-types.ts, position-registry.ts, position-validation.ts; positions/wr/definition.ts, config.ts; content catalogs; app routing; tests.

**Consumes:** Both documents and any supplied compatible repository.  
**Produces:** §3 models/input-output unions, PositionDefinition/PositionRules, one registered wr module, CareerConfig, WR config, GameContext, catalog validation and project scripts.

- [ ] Inspect project instructions, framework, dependencies and tests. Reuse a compatible Angular app; scaffold only under an implementation authorization.
- [ ] Verify compatible stable Angular/Node/TypeScript versions against official documentation at execution time; pin the lockfile.
- [ ] Configure strict TypeScript, production build, unit tooling, Playwright, and scripts build, test:unit, test:e2e, balance. Document actual commands.
- [ ] Define ProspectCore and BinderEntryCore without WR attribute/stat fields; derive typed position payloads from a small map containing wr only.
- [ ] Define immutable positionId/version envelopes, incomplete creation, frozen results, commands, errors, CareerPoint, team/board records, awards, scene evidence, and historical DisplaySnapshot.
- [ ] Define the WR attribute/weight table and complete grade-to-ceiling mapping from the spec. Create a small real-receiver fixture first, then expand to the default 75-source release target. Every source has all nine WR grades and a Size profile; gift sources are explicitly S-tier.
- [ ] Add validation tests: duplicate IDs, missing attributes/grades, invalid grades, empty source pool, wrong position references, unknown specialties, invalid gift sources, negative/nonfinite/missing weights, and weights not summing to 1.00 fail clearly.
- [ ] Add compile-time checks that shared core models require neither Hands nor receiving yards. A test-only two-attribute/two-stat metadata fixture validates generic OVR/schema/descriptor handling without adding another playable position.
- [ ] Assert the playable registry contains wr only. Unknown IDs and missing compatible versions produce named errors, never a WR fallback.
- [ ] Add school profiles and a validated original/neutral 32-team catalog plus explicit draft board. Keep all numerical defaults and changes in docs/DECISIONS.md.
- [ ] Verify shell rendering and production build.

**Gate:** Contracts are position-aware, only WR is playable, valid content loads, invalid content fails readably, and the shell builds.

### Task 2 — Implement deterministic dispatch and command safety

**Phase:** A  
**Files:** domain/shared/rng.ts, reducer.ts, commands.ts and tests; position-registry.ts; application/command-dispatcher.ts.

**Consumes:** Task 1 contracts.  
**Produces:** nextRandom, sampleUniform, getPositionRules, reduceGame, reproducible stream/state transitions and commit sequencing.

- [ ] Add a fixed-seed fixture: repeated runs produce identical unsigned-state sequences, each output at least 0 and below 1.
- [ ] Test unbiased bounded-integer sampling from the saved 32-bit stream: accepted index 0 chooses first, accepted index n−1 chooses last, out-of-range samples are rejected before index mapping, and an empty pool returns a domain error. Never reject by receiver identity or grade.
- [ ] Test with replacement: one receiver can appear three times in one controlled offer.
- [ ] Dispatch simulation/evaluation through the saved run's PositionRules. Reject commands attempting to change an existing run's position.
- [ ] Test duplicate commandId: state, RNG and all emitted events/awards/unlocks remain unchanged on replay.
- [ ] Test wrong-phase or invalid-ID commands preserve prior state without partial mutation.
- [ ] Implement independent saved creation/main and professional streams; professional consumption cannot affect the main outcome. Presentation consumes none.
- [ ] For paired balance comparisons, use stable opponent schedules and per-game random stream keys, or an equivalent fixed test fixture, so changing training does not change the test's opponent identities. Persist the actual production stream identities/state; never replay a committed game.
- [ ] Serialize gameplay dispatch and storage commits; guard rapid advance clicks while pending.
- [ ] Compare identical gameplay seeds/commands under empty versus fully unlocked cosmetic profiles through the application boundary; offers, rerolls, growth, evaluation and professional results are identical.

**Gate:** A seed plus accepted commands reproduces position-correct gameplay; duplicate actions have no duplicate effects.

### Task 3 — Build complete, definition-driven prospect creation

**Phase:** A  
**Files:** domain/shared/creation.ts, ratings.ts and tests; WR definition/source catalog; features/creation; shared/source-player-card and attribute-sheet.

**Consumes:** Uniform sampling, selected position definition, source catalog, config, command contracts.  
**Produces:** applyCreationCommand, calculateOvr, a complete position-tagged Prospect, creation screens and saved offers.

- [ ] Test exactly three distinct natural-gift attribute offers, valid S-tier sources, and selected gift current 94/ceiling 99.
- [ ] Test Size copies accepted source dimensions, uses no manual potential slot, and is unavailable for later trait assignment/training.
- [ ] Test three manual rounds with three receiver offers each. Selection shows grades and excludes previously assigned attributes globally.
- [ ] Test the shared three-reroll default: Size and manual offer rerolls use one budget; fourth reroll and changing confirmed assignments are rejected.
- [ ] Test autofill uses a fresh uniform source and uniform empty attribute at each step. With nine WR attributes, one gift plus three manual selections leaves five autofills; no accepted slot is overwritten.
- [ ] Derive attribute rows and autofill completion from definition data, not literals nine/five. A two-row metadata-only attribute component test proves the renderer has no fixed row count.
- [ ] Compare manual/autofill copies of the same grade: identical ceilings, initial-rating distribution and subsequent development rules.
- [ ] Test all-nine 80 yields OVR 80; adding 10 only to Route Running adds raw 1.8; 98.49 rounds to 98 and 98.50 to 99. Generic arithmetic tests use a separate two-weight metadata fixture.
- [ ] Preserve source IDs, positionId, grades, initial values and frozen ceilings in the full-sheet reveal. Randomness is resolved before spin animation.
- [ ] Implement original, satisfying reveals for gift options, Size, potential offers, rerolls and autofill. The engine commits each result before animation; final cards clearly settle into usable choices with names, grades and source labels.
- [ ] Browser-check duplicate offers, exhausted rerolls, switching selection before confirmation, fast-forward/skip, refresh mid-reveal and rapid repeated clicks. Results/RNG/exclusions remain identical; duplicate receivers are displayed honestly.
- [ ] Perform an actual desktop/mobile visual review of every spin stage in normal, fast-forward, skipped and reduced-motion states. Check anticipation, readability, settling clarity, responsiveness, keyboard selection/skip and accessible result announcements. Capture evidence; placeholder motion or an unstyled name table cannot pass the polish gate.
- [ ] Use Angular/CSS/lightweight existing browser APIs; add no runtime AI, expensive animation package, 3D dependency or copied competitor visual assets.

**Gate:** A complete source-traceable WR can be built/resumed with polished, accessible browser-reviewed spins; shared rendering has no fixed WR row count and presentation cannot change committed rolls.

### Task 4 — Implement WR games and shared bounded development

**Phase:** B  
**Files:** positions/wr/college-game.ts, learning-reps.ts, config.ts and tests; shared/development.ts, ratings.ts; school specialties.

**Consumes:** Typed WR prospect/profile, school, opponent, year, practice and RNG.  
**Produces:** PositionRules.simulateCollegeGame/getLearningReps/allocatePractice, shared advanceWithinBands, auditable GameRecord and DevelopmentResult.

- [ ] Define structured events before prose: routes/targets/catches/drops, press and contested attempts/results, play yards, TD, catchDifficulty, and red-zone starting distance. Include stable event/game/opponent IDs and CareerPoint.
- [ ] Test seeded stat invariants: receptions + drops ≤ targets ≤ routes; TD ≤ receptions; receiving yards equal recorded completed-play yards; contested and red-zone counters derive from the relevant events.
- [ ] Implement compact attribute-driven WR performance. Centralize opportunity, catch/drop, separation, contest difficulty and yardage coefficients; label newly chosen coefficients DEFAULT in DECISIONS.md.
- [ ] Compare a fixed seed batch: higher Hands lowers mean drops and higher Route Running improves mean separation. Do not require monotonic results for every individual random play.
- [ ] Test generalBudget = 3.60 × clamp(routesRun / 30, 0.00, 1.20): routes 0/15/30/36/60 yield factors 0/0.50/1.00/1.20/1.20 and budgets 0/1.80/3.60/4.32/4.32.
- [ ] Test zero routes gives zero general work even when fallback learning shares are uniform; practice still develops uncapped skills. At 30 routes and zero targets, route/release/read reps still produce positive game experience.
- [ ] Test shares sum to 1.00 and the uniform component applies only to an existing general budget; school opportunity is not multiplied again after it has influenced routes.
- [ ] Test all practice modes sum to 7.20: Balanced nine × 0.80; Focused target 4.32 plus eight × 0.36; Intensive target 7.20. Reject missing/invalid targets. Non-targets receive only their mode's allocation plus actual game experience.
- [ ] Test practice is independent of route count, and capped work is recorded rather than reassigned. School/year modifiers apply to the conserved allocation, not a larger intensity-generated budget.
- [ ] Test band integration: current 69, ceiling 99, rawWork 2 produces 70.8; current 98, ceiling 99, rawWork 4 produces 99. Negative work adds nothing.
- [ ] Test uncapped equal-input growth ordering freshman > sophomore > junior, unchanged ceilings, nonnegative realized gains and fractional accumulation.
- [ ] Test equal manual/autofill current/ceiling/rep/practice/school inputs give equal results. Gift source origin supplies no hidden multiplier.
- [ ] Implement proportional realized-gain attribution so general/practice components sum to actual gain after band changes and clipping.
- [ ] Reproduce design §9.2.1 arithmetic: normal Balanced work 50.40 before coaching, 52.92 with Opportunity 1.05; passive-only 17.64; current 65 → 99 costs 59.75. Preserve bands/year/starting/ceiling/school defaults.
- [ ] Test the all-S fixture with Route Running gift 94 and others 65: normal Balanced gives raw OVR 97.599850, high-participation Balanced 98.323090, both displayed 98. Use the exact nine-block Focused/Intensive witness in the design at participation 1.20 to reach raw 98.763418, displayed 99, with specified final attributes.
- [ ] Test the ordinary mixed-ceiling fixture in the design: starting raw OVR 62.02, final 90.860400, Hands/Vertical 94.585 below their ceilings. These fixed-input growth checks are not population balance tests.
- [ ] Under matched unclipped inputs test target gain Intensive > Focused > Balanced, non-target practice Balanced > Focused > Intensive, and equal total work. Compare contrasting prospects and school alignments under identical conditions; measure strategy sensitivity without assuming one mode is universally best.
- [ ] Highlights reference actual recorded plays. A 150-yard box score without an exceptional contested completion cannot create a spectacular-catch event.

**Gate:** Typed WR performance and shared development work without Angular; zero-participation behavior, conserved three-mode practice, meaningful growth/headroom and the constructed decision-dependent 99 path pass. Population balance still requires Task 10.

### Task 5 — Connect shared blocks, interventions, transfers and declaration

**Phase:** B  
**Files:** shared/college-career.ts, reducer.ts; positions/wr/interventions.ts; recruitment/college features; highlight-reel; tests.

**Consumes:** PositionRules simulation/learning/intervention hooks, shared development, college catalogs and run state.  
**Produces:** resolveTrainingBlock, scheduleIntervention, college commands, recaps, transfer and agreed declaration flows.

- [ ] Test four sequential games: Game 2 receives Game 1's developed attributes; training and experience apply once per game in chronology.
- [ ] Test three blocks/12 games per year and 36 games across a full career.
- [ ] Test JUGS after a three-drop Game 4 with selected Vertical ++: Game 5 uses Hands ++ with 7.20 work, then Games 6–8 resume Vertical ++. Game experience follows actual participation; ratings never decrease.
- [ ] Test selected Hands ++ already supplies the full prescribed 7.20 target work: record already_compliant, keep all four planned weeks unchanged, add no work and mark JUGS used for the year.
- [ ] Test Hands + supplies only 4.32 targeted work: Game 5 is substituted with Hands ++, then Games 6–8 resume Hands +. Balanced likewise does not satisfy full corrective focus.
- [ ] Reserve the type when announced; confirm fulfillment/used state atomically with next-block resolution. Refresh, repeat confirmation, or changing an unconfirmed plan cannot duplicate a requirement. Compare base allocation/target before modifiers, not labels or anticipated rating gains.
- [ ] Test JUGS cannot recur that year, while a different Press clinic can follow Game 8. Ledgers key by stable position-scoped type and year, not a single global “intervention used” boolean.
- [ ] Test priority JUGS → Press → Contested, at most one scheduled per boundary, insufficient reps/zero denominators, capped targets, and display-name changes not bypassing a type limit.
- [ ] Test Game 12 triggers become visible diagnostic-only concerns: no scheduled practice, invisible bonus, ledger misuse, or cross-year carryover. Reset annual usage at next year.
- [ ] Test both fulfillment modes conserve the same 7.20 practice budget and use the same once-per-type/year limit. Log cause, original mode/target, effective first-week allocation, fulfillment mode, realized gain and any automatic resumption; show a clear already-satisfied acknowledgment for a matching plan.
- [ ] Test transfer keeps position, attributes, ceilings, source traits, chronology and statistics while changing future specialties/opportunity. Reject mid-block transfers and undefined specialties.
- [ ] Test freshman flows to sophomore; after 24 games, Declare proceeds to scouting/Draft Night and Return proceeds to junior; junior exits after 36. No freshman entry, mandatory junior, redshirt or senior option.
- [ ] Compare declaration/return fixtures: junior gains are slower but useful below ceiling; frozen ceilings stay fixed; later draft outcome is not guaranteed better. Report that final OVR itself cannot decline under positive-only rules.
- [ ] Implement planning/recap screens with total block stats, gain explanations, expandable individual games, actual-event highlights and clear coach substitution.
- [ ] Commit result/evidence before presentation; fast-forward changes no stats, RNG, awards or scene eligibility.

**Gate:** A full or sophomore-exit career reaches scouting; chronology, transfers and per-type interventions are correct, and only position rules know WR intervention names.

### Task 6 — Implement scouting and a frozen draft with team identity

**Phase:** C  
**Files:** positions/wr/gauntlet.ts, draft-evaluation.ts; shared/draft-workflow.ts; draft teams/board catalogs; gauntlet/draft-night features; tests.

**Consumes:** Completed college history/prospect, position grading, explicit board and neutral team identities.  
**Produces:** resolveDraft, immutable DraftSnapshot with DraftOutcome, main records and both ending choices.

- [ ] Test five WR scouting checks with relevant attribute explanations and no attribute/ceiling growth.
- [ ] Test WR evaluation 70% OVR + 20% college grade + 10% gauntlet: 90/80/70 yields 86.
- [ ] Define normalized college grade as the mean recorded opportunity-aware game grade, and gauntlet grade as the mean five test grades. More years do not receive an automatic cumulative-stat bonus.
- [ ] Test all draft band edges and controlled first/last picks in each band; below 60 yields Undrafted with both ending branches available.
- [ ] Validate the explicit board: 256 consecutive picks, seven round counts 32/32/40/40/40/40/32, valid team IDs and pickInRound sequences. Pick 65 is round 3/pick 1; pick 105 is round 4/pick 1, demonstrating why ceiling(pick/32) is invalid.
- [ ] Test a drafted outcome stores pick, round, pickInRound and copied team ID/name/colors/catalog version; changing the live team catalog later changes none of those facts.
- [ ] Test Undrafted has no pick/round/drafting-team identity. A later free-agent team is separate.
- [ ] Test game-defined WR All-American at 1,200 receiving yards, 10 TD and normalized season grade 85; falling short of any threshold yields none. Record the award and qualifying season facts through WR rules; unsupported award names cannot be invented for a recap.
- [ ] Implement Draft Night with sources, before/after attributes, school changes, production, development, scouting, actual pick/round/team, earned moments and save-now/NFL options.
- [ ] Before either continuation branch, atomically freeze main-result fields and upsert one binder entry with an accessible default Draft Edition. Default to Draft Night art if drafted or Prospect Journey if Undrafted, base frame, no foil and eligible college/draft stamps.
- [ ] Test immediately choosing NFL simulation without manual Draft customization still preserves that Draft Edition. A save error keeps it in memory with Unsaved status and retries persistence rather than rebuilding the result.
- [ ] Test main-result deep equality after NFL simulation, card edits, export, reload and later catalog updates; default presentation is editable but statistics/eligible Draft moments are frozen.
- [ ] Browser-check drafted and undrafted save-now completion without running the professional module.

**Gate:** Both main endings are complete and truthful; the immutable pick/round/team snapshot carries through cards, history and professional initialization.

### Task 7 — Add position-specific NFL production, awards and induction

**Phase:** D  
**Files:** shared/professional-lifecycle.ts; positions/wr/professional-career.ts, awards.ts, config.ts; NFL feature; continuation commands; tests.

**Consumes:** Frozen position-tagged DraftSnapshot, saved independent professional RNG and WR professional rules.  
**Produces:** resolveProfessionalCareer, one typed career history/status, team continuity and AwardRecords per prospect.

- [ ] Implement a compact WR production/opportunity/age/retirement model with all initial coefficients in WR config and DECISIONS.md. Shared lifecycle code contains no receiving thresholds.
- [ ] Test 3–15 season bounds, coherent opportunity/catch/yard/TD values, season sums matching career totals, and deterministic same-snapshot/same-seed results.
- [ ] Test drafted careers start on the copied drafting team; an Undrafted career may receive a separately recorded free-agent team without altering DraftOutcome. Trades/contracts are not added.
- [ ] Test WR All-Pro qualification: 1,400 receiving yards and 10 TD in a season yields one AwardRecord; falling short of either threshold yields none. Award IDs/season evidence remain stable on replay.
- [ ] Test WR induction at 12,000 career yards, 80 TD and 3 recorded All-Pro selections; missing any requirement fails. The shared career store/card renderer does not calculate these thresholds.
- [ ] Test explicit statuses not_simulated, simulated_not_inducted and simulated_inducted across save data, filters and display.
- [ ] Reject repeated continuation/reroll attempts; reopen saved results. Account cosmetics cannot enter simulation or award evaluation.
- [ ] Test no championship or record-breaking accolade is emitted without an implemented team outcome or versioned comparison record. No card or prose layer creates awards.
- [ ] Test original college values, ceilings, pick/round/team, college awards and main records remain deeply equal.
- [ ] Produce rookie/award/induction eligibility evidence from actual professional outputs, including relevant season/stat/award IDs.
- [ ] Implement a concise professional recap and add Career Edition to the existing prospect entry. Test immediate and later continuation both retain the default/customized Draft Edition, make both accessible, and create no second player.

**Gate:** Optional WR professional careers produce coherent typed history, supported accolades and distinct induction statuses without changing the main run.

### Task 8 — Build evidence-backed collectibles and the binder

**Phase:** E  
**Files:** shared/eligibility-ledger.ts, achievements.ts; positions/wr/artwork-eligibility.ts, presentation.ts; art/cosmetic catalogs; card-builder/binder features; shared card/stat components; assets/manifest; tests.

**Consumes:** Structured typed games, seasons, transfers, awards, draft/pro results, existing unlocks, and CosmeticProfile for presentation only.  
**Produces:** collectSceneUnlocks, evaluateAchievements, getEligibleCardOptions, buildCardView, persistent SceneUnlock/EvidenceSnapshot, customization, PNG export and binder.

- [ ] Test scene predicates separately: actual 50+ yard TD → Breakaway Star; contested completion with difficulty ≥0.85 → Spectacular Catch; 150-yard game alone → Breakout Star only.
- [ ] Test Red Zone Monster requires three receiving TD with two supported red-zone starting positions; Reliable Hands requires 40 season receptions and zero drops.
- [ ] Test Transfer Breakout compares saved pre/post-transfer raw OVR and normalized performance grade with both improvements ≥5. Cosmetic Transfer Story remains the separate simpler account achievement from the spec.
- [ ] Test Draft Night requires drafted status; Prospect Journey accepts Undrafted. Rookie Breakout requires first-season 1,000 yards and 6 TD; Award Ceremony requires a saved supported award; Canton requires induction.
- [ ] Persist each unlock's qualifying game/event/season IDs, chronology, opponent snapshot, facts and eligibility version. A 71-yard TD keeps its facts; do not label it game-winning without score/timing evidence.
- [ ] Test reprocessing produces no duplicate source evidence; multiple actual moments can support one scene; pruning full play history leaves compact evidence readable.
- [ ] Test Draft Edition uses evidence available by Draft Night; Career Edition can use college/pro moments; future rules do not rewrite historical unlock reasons.
- [ ] Test owned gold frame on a 72 OVR prospect grants no HOF art/stamp or gameplay benefit. Hiding a HOF stamp or choosing different art preserves induction and binder filtering.
- [ ] Implement 2D front/back card layers and position-provided stat arrays, with separate Draft/Career customizations under one entry. A two-stat metadata-only fixture renders without WR field names.
- [ ] Browser-test save Draft without NFL, immediate NFL without Draft customization, both editions afterward, editing Draft after NFL, then editing Career. Neither customization overwrites the other; Draft eligibility excludes professional/HOF honors and college/draft records remain unchanged.
- [ ] Implement progression/pick/date sorts, the additional spec sorts/filters, stable ties, Undrafted-last pick ordering, missing-NFL-data handling, favorites and empty states.
- [ ] PNG export includes accurate name/position/OVR/pick/round/team, selected eligible art/frame/stamp and saved factual labels. Inspect exports visually.
- [ ] Handle missing illustrations/frames and unknown historical descriptors with readable fallbacks. Keep asset sources/status in ASSET_MANIFEST.md; placeholder art is unfinished visual work.

**Gate:** Prospects and their specific memories are saved, customized, filtered, reopened and exported accurately; shared rendering never invents football facts.

### Task 9 — Persist, resume and preserve historical positions

**Phase:** E  
**Files:** persistence modules and tests; application store/dispatcher; resume/recovery UI; e2e/persistence.spec.ts.

**Consumes:** Versioned, position-tagged active/binder/cosmetic models and repository contracts in §4.  
**Produces:** Autosave, atomic resume, safe import/export, migration dispatch and read-only historical rendering.

- [ ] Round-trip position/rules/content/balance/eligibility versions, offers, three-mode plans/allocations, source assignments, fractional values, RNG streams, chronology, reserved/used intervention fulfillment, frozen team/round, awards, evidence, automatic Draft Edition and independent Career customization, plus cosmetics.
- [ ] Implement initial schemaVersion 1 validation and future migration dispatch. Add actual migration transformations only for supported historical versions; do not invent a fictional shipped predecessor.
- [ ] Test malformed JSON, invalid known enums/IDs, nonfinite values, impossible stat relations, inconsistent position/attribute payloads, duplicate IDs, invalid references, and unsupported active versions.
- [ ] Test invalid imports leave valid existing data unchanged; valid replacements use preview/backup and a single transaction.
- [ ] Test a safe completed WR entry remains readable with its saved descriptors/evidence/team when current content labels change or its exact historical rules are unavailable. Resume is disabled without compatible rules.
- [ ] Test additive registry/content metadata updates leave old WR position and frozen results intact; unknown position data is never relabeled WR. A test-only metadata fixture is not registered as playable.
- [ ] Test unavailable historical art uses fallback; export preserves original stored payload/version rather than dropping unknown fields.
- [ ] Test migrations preserve original position, frozen results, RNG and structured evidence; absent legacy facts remain explicitly unknown, not invented.
- [ ] Atomically persist result, achievements, awards/unlocks and binder updates. A storage-error fixture keeps the committed in-memory outcome with Unsaved status and retries saving without resimulation.
- [ ] Refresh at gift/size offers, autofill, block recap, sophomore declaration, Draft Night, NFL summary and card save; no extra draw/gain/career/entry occurs.
- [ ] Test double clicks and rapid pending actions accept one transition. Provide JSON export/import and recovery UI without required login.

**Gate:** Results survive refresh/import and future additive positions; invalid/unavailable data has a clear recovery/read-only path without silent reinterpretation.

### Task 10 — Measure decisions, verify the complete local product and hand off

**Phase:** F  
**Files:** tools/balance-report.ts, e2e suites, responsive styles, README, DECISIONS.md, VALIDATION.md and reports.

**Consumes:** Complete WR rules/content/UI and shared infrastructure.  
**Produces:** Actual correctness/accessibility evidence, measured distributions, documented default changes and honest local handoff.

- [ ] Run at least 10,000 unique seeded initial WR prospects using the explicit policies in §6, including Balanced, moderate Focused (+) and Intensive (++) under shared target schedules, headroom/weighted decisions and specialty alignment. Cover ordinary and exceptional potential mixes; record unique prospects and total policy/school trajectories separately.
- [ ] Reuse exact creation snapshots, controlled opponent schedules/game seeds and learning inputs where practical. Isolate training-mode allocation with matched target schedules; isolate coaching alignment using identical participation and relevant reps. Then run full school profiles with their actual opportunity/participation differences instead of holding those effects artificially equal.
- [ ] Compare each year on equal uncapped inputs and measure zero/low/normal/high participation. Practice persists on the bench; zero game experience and strong-rep caps must remain correct.
- [ ] Record seed range, versions, configuration, sample size, starting/final OVR (mean/median/quantiles), year-by-year growth, per-attribute gains and ceiling gap/attainment, and frequencies of displayed 90+, 95+ and 99.
- [ ] Record total/per-skill realized growth, game/practice attribution, capped/wasted work, and incremental coaching contribution from matched 1.00-coaching counterfactuals (not an extra additive award). Report ceiling attainment, policy win/tie rates, same-prospect best-minus-worst OVR/draft-grade spread, school effects, intervention/fulfillment incidence and S-tier realization.
- [ ] Compare sophomore exit with junior return from identical sophomore snapshots; report added OVR, extra time, pick distributions and the positive-only early-exit limitation.
- [ ] Report supported professional production, award, induction and longevity distributions with season/career consistency checks.
- [ ] Compare policies on contrasting high-ceiling/low-ceiling, high-skill/weak-skill and school-match fixtures. Identify near-universal strategy dominance rather than hiding it behind an overall mean.
- [ ] Maintain the exact mixed-mode all-S 99 witness and its Balanced controls from design §9.2.1. Explain observed rarity through uniform source/ceiling combinations, decisions and growth—not changed source odds. A mathematical witness is not evidence of appropriate rarity; report finite-sample uncertainty.
- [ ] Enforce batch invariants: finite values, fixed ceilings, nonnegative growth, exact 24/36 game paths, valid board/team results, no repeated annual intervention type, truthful award/evidence references and unchanged main snapshots after NFL.
- [ ] Run a separate 90,000-draw uniform-source diagnostic on the default 75-source roster; report counts without substituting a flaky statistical threshold for uniform-index unit tests.
- [ ] Complete browser paths: ordinary/elite/weak prospects, polished spin stages, exhausted rerolls, all training modes, transfer, matching/nonmatching interventions, sophomore Declare/Return, Undrafted, save-now, immediate NFL, both induction outcomes, independent editions, evidence detail, sorting/filtering, PNG/data export/import, refresh and storage failure.
- [ ] Verify 1440×900 desktop and 390×844 mobile, keyboard completion, visible focus, labels independent of color, accessible results and reduced motion/skip. Visually review every spin stage for polished anticipation, readable settling and responsive interaction; placeholder motion is unfinished.
- [ ] Verify missing position/version errors and metadata-only variable attribute/stat rendering; no extra playable position or fake position simulation exists.
- [ ] Run production build, complete unit/browser suites and balance harness; record exact commands/results, meaningful failures and fixes. Inspect PNGs/screenshots and browser errors/assets.
- [ ] Document observed session length, unapproved-number changes with reasons, remaining balance concerns, content/asset status and known limitations.

**Gate:** Complete correctness checks pass; empirical evidence shows training/college choices matter. Routine 99s, passive growth erasing practice decisions, or near-universal strategy dominance require transparent tuning and remeasurement. No claim that the product is balanced follows merely from compilation or a hand-crafted fixture.

## 6. Verification strategy

### Unit and property checks

Prioritize deterministic engine tests, seeded batch invariants, and boundary values. Mock RNG only where selecting an exact boundary is essential; also run real seeded sequences.

Required coverage includes:

- Uniform sampling, repeat receivers, and distinct gift skills.
- Exclusion of assigned skills and exact creation counts.
- Shared rerolls and immutable confirmed choices.
- Equal manual/autofill rules.
- Fixed ceilings, nonnegative growth, fractional accumulation, conserved three-mode work, and zero/low/high participation.
- Four-game ordering and annual diminishing returns.
- Intervention trigger thresholds, pending reservation, matching fulfillment, annual usage, priority, reset and resumption.
- Transfers, simplified early entry, and final college exit.
- Statistical consistency and factual highlights.
- Event/award-backed scene predicates and deduplicated historical evidence.
- Draft bands, explicit round/team board lookup and immutable main results.
- Optional NFL determinism and induction status.
- Run-specific credentials versus account cosmetics; automatic Draft Edition and independent Career/Draft edits.
- Stable binder ordering and missing data.
- Transaction failures, save validation, and idempotent actions.
- Definition-driven attributes/stat layouts, typed position payloads and historical compatibility.

### Position extensibility contract checks

- Shared ProspectCore and BinderEntryCore require no WR attributes or receiving statistics.
- Stable wr identity survives registry/content updates; unknown position/rules IDs never silently select WR.
- Position-specific weight tables, required source attributes, school specialties, intervention IDs and event payloads validate against their own definition.
- Shared OVR and attribute/stat rendering accept a metadata-only two-attribute/two-stat fixture; it has no playable route, source pool or simulator.
- Draft and professional workflows dispatch to position rules rather than embedding WR evaluation/induction thresholds.
- Saved WR attributes, stats, frozen teams, awards, scene evidence and display descriptors survive additive position metadata and future supported migrations.
- Missing compatible rules prevent active continuation but allow safe historical read-only display/export.

These checks test actual seams in V1. They do not require fake QB or RB gameplay.

### Browser checks

Use a test-only seeded entry point available only in development/test builds. Do not expose a normal production control that grants arbitrary prospect stats or unlocks. Stub fixtures for rare HOF and Undrafted paths; use real simulation for at least one complete run.

Assert outcomes and state persistence, not animation durations. Fast-forward must be used in automated flows so tests do not depend on cosmetic timing.

### Commands expected in the future project

~~~text
npm run build
npm run test:unit
npm run test:e2e
npm run balance -- --runs=10000 --seed=20261022
~~~

Task 1 must make these scripts real and document any environment-specific browser setup. Run them when implementing; the plan itself supplies no claim that a production build or game test has already passed.

### Balance interpretation

There is no approved numeric target distribution for final OVR, draft picks, or induction. Report the distributions before choosing release thresholds. Rarity should emerge from the uniform source pool, ceiling combinations, growth, and choices—not secret account effects or pity systems.

Use same-seed comparisons to evaluate coaching and training changes. A desirable strategy should improve expected outcomes for some prospects without becoming a universal answer. Keep exploratory simulation evidence separate from hard correctness tests.

Use explicit reproducible policy definitions:

| Policy | Default decision rule |
| --- | --- |
| Balanced | Balanced every block |
| Fixed Focused (+) | Route Running + every block, even when capped; simple moderate baseline |
| Fixed Intensive (++) | Same target schedule as the fixed Focused baseline, but Intensive; isolates allocation |
| Highest headroom + | Focused on largest ceiling-minus-current gap, ties use definition order |
| Highest headroom ++ | Intensive using the same selection rule; include a fixed shared-target replay to separate mode from adaptive target changes |
| Weighted-OVR allocation | Project Balanced and each Focused/Intensive target over four games with current bands/school and baseline reps; choose greatest raw OVR gain, ties Balanced then definition order |
| School-specialty allocation | Compare Focused/Intensive on specialty attributes using projected weighted gain; if no specialty, use highest headroom + |

Do not use future actual draws to select actions. Compare specialty-aligned versus non-specialty development with identical reps first, then compare full school opportunity profiles. A fixed button dominating all builds is different from an adaptive policy choosing different allocations intelligently.

The v1.2 WR baseline is general work 3.60 × participationFactor and practice work 7.20. At normal participation, uniform shares and Opportunity 1.05, Balanced supplies 52.92 work per skill over 36 games versus 59.75 needed for 65 → 99. The high-participation mixed-mode witness yields raw OVR 98.763418; its Balanced control yields 98.323090. These are analytical fixture values, not observed population distributions.

Report actual post-band/cap development, starting/final OVR, total attribute/year growth, ceiling attainment, game/practice/coaching contributions, 90+/95+/99 rates, strategy sensitivity and sample uncertainty. Mathematical reachability does not establish rarity or balance. Final numerical acceptance targets remain open pending implementation and large seeded measurements.

## 7. Release acceptance checklist

- [ ] Gift → Size → three potentials → autofill works, with no duplicate assigned skill.
- [ ] Receiver draws use the uniform configured pool and allow repeats.
- [ ] All configured WR attributes (nine by default) and ceilings are visible/source-traceable; shared components derive their count from the definition.
- [ ] Manual/autofill origin never changes development.
- [ ] College decisions occur in four-game blocks; all three practice modes conserve 7.20 work and games develop sequentially.
- [ ] Zero routes means zero game work; practice remains intact; zero-target route participation still provides general learning.
- [ ] Positive-only training, school specialties, diminishing returns, transfers, and coach substitution work as specified.
- [ ] Each intervention type occurs at most once per year; matching full practice fulfills unchanged with no extra work, otherwise one corrective week precedes automatic resumption.
- [ ] Different intervention types can occur in one year; one boundary schedules at most one; Game 12 creates no invisible or carried practice.
- [ ] After sophomore year, Declare exits at 24 games and Return exits after junior at 36; no unwanted eligibility subsystem was added.
- [ ] A full main run reaches an accurate Draft Night recap.
- [ ] Drafted outcomes preserve pick, round, pickInRound and copied team identity/colors; Undrafted has no drafting team.
- [ ] Save-now completes without NFL; an accessible default Draft Edition already exists before either branch.
- [ ] Optional NFL runs once and never changes the main result; immediate continuation retains Draft and adds Career under the same entry, with independent later edits.
- [ ] Unsimulated, not inducted, and inducted are distinct statuses.
- [ ] HOF art, stamp, and filter remain independent.
- [ ] College/pro awards exist as versioned engine records; no championship/record accolade is fabricated.
- [ ] Distinct artwork scenes have distinct event/stat predicates; eligibility stores readable structured source evidence.
- [ ] Account achievements change presentation only.
- [ ] Binder supports progression, pick, date, and HOF filtering/sorting as specified.
- [ ] Cards use reusable art and export accurately; missing art is handled and disclosed.
- [ ] Refresh preserves outcomes, RNG, and pending intervention state.
- [ ] Invalid imports and storage errors cannot silently erase valid data or duplicate results.
- [ ] Stable position IDs, typed payloads, generic card/stat descriptors and saved historical display/evidence support future positions without converting WR careers.
- [ ] Only WR is playable; there are no empty future-position modules, universal simulator or dynamic plugin framework.
- [ ] Paired-seed balance reports measure starting/final OVR, yearly/per-skill growth, ceiling realization, 90+/95+/99 frequency, policy/school effects, wasted work and decision spread.
- [ ] Build, unit/browser tests, batch invariants, responsive checks and PNG checks pass; actual browser visual review verifies polished original spins/reveals across normal/fast/skipped/reduced-motion modes.
- [ ] No excluded feature or public deployment was added.
- [ ] README, decisions, content/asset manifests, and validation evidence match the actual implementation.

## 8. Stop criteria and blocker handling

### Stop successfully

Stop implementing when the complete authorized local scope passes the release checklist and the handoff contains actual verification evidence. Report what was built, how to run it, what passed, and any material limitations. Do not continue into monetization, cloud services, more positions, public launch, or endless balance experimentation.

### Stop for a concrete blocker

Pause only the affected work when:

- A supplied repository conflicts with the required stack and cannot support the plan without an unapproved rewrite.
- A required environment, dependency installation, or build operation cannot be accessed after available compatible alternatives are checked.
- A necessary product decision has no documented default and changes an agreed rule.
- Requested production art or content cannot be supplied; use the specified fallback for functional work and identify visual completion separately.
- A contemplated next action requires new authority, such as publishing publicly or connecting a paid external service.

Preserve completed work and evidence. Describe the exact missing input or failed operation and the smallest next action needed. Do not use an unresolved cosmetic or balance choice as a reason to abandon core development.

### Do not stop prematurely

Builder-only completion, hard-coded mock outcomes, a static card gallery, passing compilation without gameplay checks, or a stubbed NFL branch do not satisfy this plan. A milestone with missing modules must be described as a milestone.

Do not claim final balance without reporting simulated distributions and basic playtest evidence. Do not call placeholder imagery the finished premium illustrated library.

## 9. Handoff package for a future implementation

Deliver:

1. Complete source and pinned dependencies.
2. README with setup, development, test, build, seed/fixture, and data-backup instructions.
3. A concise decisions log identifying defaults changed during implementation.
4. Content and art manifests, including incomplete or placeholder assets.
5. Validation evidence: command results, browser scenarios, screenshots, export samples, paired-prospect/school/policy comparisons, and the batch report.
6. Known limitations and remaining open product decisions.

No hosted deployment, paid account, cloud service, or source-control integration is required unless separately requested.

The authorization statement at the start gates execution. Once a build is authorized, this handoff requires the complete playable WR product and evidence above; no obsolete document-only assignment limits apply.

## 10. Final specification review and traceability

This table records coverage in the handoff, not production test results. Each check must also be verified during implementation.

| Review question | Required specification and implementation coverage |
| --- | --- |
| 1. Entire WR experience without major invented product decisions? | Design §§4–16; labeled numeric fallbacks; Tasks 1–10 and complete release checklist |
| 2. Future QB/RB without replacing shared career engine? | Design §6.5; plan §3.6; actual position module added only in a later assignment |
| 3. Clear shared/position ownership? | Plan §§3.1–3.4; one static registry and typed boundary |
| 4. Uniform source rolls independent of account? | Design §5.7; Tasks 2–3 and sampling diagnostic |
| 5. Current ability distinct from ceiling? | Design §6; Tasks 3–4; immutable ceiling and cap checks |
| 6. Meaningful training/school decisions? | V1.2 budgets, conserved three-mode allocation, zero-aware participation and analytic controls in design §9; paired mode/school/year reports in Task 10 |
| 7. Sophomore declaration? | AGREED design §8; 24/36-game tests in Task 5 |
| 8. Correct annual intervention limits? | Design §9.3; reserved/used type ledger, matching-plan fulfillment, nonmatching substitution and Game 12 checks in Task 5 |
| 9. Highlights reflect actual events? | Design §10; structured event/stat checks in Task 4 |
| 10. Career artwork reflects earned outcomes? | Design §13.2; evidence ledger/predicate tests in Task 8 |
| 11. Cosmetics isolated from gameplay? | GameContext excludes profile; Tasks 2, 7–8; identical-seed account comparison |
| 12. Permanent draft team identity? | Design §11.2.1; frozen by-value board/team tests in Task 6 |
| 13. NFL leaves college result untouched? | Frozen DraftSnapshot and guaranteed default Draft Edition before branching; preservation and independent edits in Tasks 6–8 |
| 14. HOF art, stamp and binder independent? | Design §13.4; Task 8 art/hide/filter checks |
| 15. Old WR data survives future positions/rules? | Position/version tags, snapshots and migration contracts; Task 9 |
| 16. Approved concepts versus provisional numbers? | Design authority labels/open register; config and DECISIONS.md |
| 17. Portable future build prompt? | Authorization gate and executable §1 brief; no mandatory named skill/framework |
| 18. Concrete detection of unfinished work? | Task gates, release checklist, stop conditions and evidence handoff |

### Remaining decisions and concerns

Exact WR skill/grade/weight values, reroll budget, growth coefficients, scene/award/induction thresholds, professional aging and neutral/real team choices remain labeled defaults or open tuning choices in the design register. Public-use content permissions and the final illustrated library remain unresolved production decisions.

The development coefficients have a documented feasibility witness, not empirical balance approval. The implementation must still measure whether training choices matter across ordinary prospects, whether a strategy dominates and how rarely 99 appears. Early declaration's strongest current incentive is a shorter run; positive-only growth without injuries makes returning weakly better for final OVR. Do not conceal that concern with unapproved penalties or claim it solved before playtesting.

### Version 1.2 changelog

- Recalibrated general/practice budgets while retaining the V1.1 position architecture, year factors, rating bands, school bonuses, starting distributions and ceiling map.
- Corrected participation to zero-based scaling; practice remains independent of game snaps.
- Restored Balanced, Focused (+) and Intensive (++) with conserved work; updated types, controls, examples and comparison policies.
- Defined deterministic already-compliant coach fulfillment without replacement or bonus work.
- Guaranteed a default Draft Edition before immediate NFL simulation and independent editing of both editions.
- Required polished original spin presentation and desktop/mobile browser visual review.

### Version 1.1 changelog (historical)

- Added shared career/position-rule boundaries, typed WR payloads, definition-driven UI and an explicit future-QB extension path.
- Reallocated growth into total general/practice budgets with piecewise near-ceiling integration and deeper paired-seed balance requirements.
- Confirmed sophomore declaration and exact next-block coaching substitution.
- Added structured scene-unlock evidence and differentiated football-moment art predicates.
- Added persistent draft round/team snapshots, supported award records and position-owned induction rules.
- Strengthened historical save/card compatibility and removed obsolete document-generation/agent-framework requirements from the executable brief.


