/** Position-specific payloads stay at this boundary; career chronology is shared. */
export type WrAttributeId = 'speed' | 'acceleration' | 'hands' | 'routeRunning' | 'release' | 'vertical' | 'bodyControl' | 'yardsAfterCatch' | 'awareness';
export type Grade = 'S' | 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F';
export type AttributeValues = Record<string, number>;
export interface AttributeDefinition { id: string; label: string; short: string; description: string; weight: number; }
export interface PositionDefinition { id: string; displayName: string; rulesVersion: string; attributes: readonly AttributeDefinition[]; sourceCatalogId: string; }
export interface PhysicalProfile { heightCm: number; weightKg: number; build: string; grade: Grade; sourcePlayerId: string; }
export interface SourcePlayerDefinition { id: string; name: string; era: string; heightCm: number; weightKg: number; build: string; grades: Record<WrAttributeId, Grade>; }
export interface GiftOption { attributeId: string; sourcePlayerId: string; grade: 'S'; }
export interface TraitAssignment { attributeId: string; sourcePlayerId: string; grade: Grade; ceiling: number; origin: 'gift'|'manual'|'autofill'; }
export interface ProspectCore { id: string; name: string; jerseyNumber: number; positionId: string; createdAt: string; }
export interface Prospect extends ProspectCore { physical: PhysicalProfile; current: AttributeValues; initial: AttributeValues; traits: Record<string,TraitAssignment>; initialOvr: number; }
export interface CreationState { traits: Record<string,TraitAssignment>; giftOffers: GiftOption[]; sizeOfferId: string; playerOffers: string[]; manualCount: number; physical: PhysicalProfile|null; }
export interface CollegeProgram { id: string; name: string; location: string; shortName: string; colors: [string,string]; description: string; specialty: string; specialties: string[]; coaching: number; opportunity: number; offense: number; }
export type TrainingPlan = { mode: 'balanced' } | { mode: 'focused'|'intensive'; attributeId: string };
export interface WrGameStats { routes: number; targets: number; receptions: number; yards: number; touchdowns: number; drops: number; pressReps: number; pressLosses: number; contestedTargets: number; contestedCatches: number; redZoneTouchdowns: number; grade: number; }
export interface WrGameEvent { id: string; kind: 'catch'|'drop'|'coverage'; yards: number; touchdown: boolean; contested: boolean; catchDifficulty: number; startDistance: number; }
export interface GameRecordCore { id: string; positionId: string; rulesVersion: string; year: number; gameNumber: number; opponent: string; opponentColors: [string,string]; won: boolean; teamScore: number; opponentScore: number; }
export type GameRecord = GameRecordCore & { positionId:'wr'; stats: WrGameStats; events: WrGameEvent[]; highlights: string[]; gains: AttributeValues; generalGains: AttributeValues; practiceGains: AttributeValues; };
export interface AwardRecord { id: string; type:'all_american'|'all_pro'; label:string; stage:'college'|'nfl'; season:number; evidence:Record<string,number>; rulesVersion:string; }
export interface EvidenceSnapshot { id:string; kind:'gameEvent'|'gameStats'|'seasonStats'|'transferComparison'|'award'|'draftOutcome'|'induction'; stage:'college'|'draft'|'nfl'; sourceId:string; year?:number; gameNumber?:number; opponent?:string; facts:Record<string,string|number|boolean>; description:string; rulesVersion:string; }
export interface SceneUnlock { id:string; sceneId:string; evidence:EvidenceSnapshot; }
export interface Intervention { id:string; type:'wr.jugs'|'wr.press'|'wr.contested'|'wr.routes'|'wr.burst'|'wr.tracking'|'wr.yac'|'wr.film'|'wr.speed'; label:string; attributeId:string; cause:string; year:number; sourceBlock:number; fulfillment?:'already_compliant'|'substituted'; selectedPlan?:TrainingPlan; }
export interface YearSummary { year:number; schoolId:string; startOvr:number; endOvr:number; stats:WrGameStats; }
export interface TransferRecord { afterYear:number; from:string; to:string; previousOvr:number; previousGrade:number; }
export interface BlockReview { year:number; block:number; games:GameRecord[]; gains:AttributeValues; startOvr:number; endOvr:number; intervention:Intervention|null; fulfilled:Intervention|null; training:TrainingPlan; }
export interface GauntletCheck { id:string; name:string; label:string; description:string; score:number; attributes:string[]; }
export interface DraftTeamIdentity { teamId:string; displayName:string; city:string; primaryColor:string; secondaryColor:string; catalogVersion:string; }
export interface DraftBoardSlot { overallPick:number; round:number; pickInRound:number; teamId:string; }
export type DraftOutcome = {status:'drafted';overallPick:number;round:number;pickInRound:number;team:DraftTeamIdentity} | {status:'undrafted'};
export interface DraftSnapshot { creationMode?:CreationMode;positionId:'wr';rulesVersion:string;balanceVersion:string;contentVersion:string;prospect:Prospect;schoolId:string;history:GameRecord[];years:YearSummary[];transfers:TransferRecord[];interventions:Intervention[];awards:AwardRecord[];unlocks:SceneUnlock[];gauntlet:GauntletCheck[];collegeGrade:number;evaluation:number;finalOvr:number;outcome:DraftOutcome; }
export interface WrProfessionalStats { targets:number;receptions:number;yards:number;touchdowns:number; }
export interface ProfessionalSeason { year:number;age:number;team:DraftTeamIdentity;stats:WrProfessionalStats;allPro:boolean; }
export interface ProfessionalCareer { positionId:'wr';rulesVersion:string;status:'simulated_not_inducted'|'simulated_inducted';seasons:ProfessionalSeason[];totals:WrProfessionalStats;awards:AwardRecord[];induction:{inducted:boolean;criteria:string;};retirementAge:number;team:DraftTeamIdentity;unlocks:SceneUnlock[]; }
export interface PositionPayloadMap { wr:{attributeId:WrAttributeId;gameStats:WrGameStats;gameEvent:WrGameEvent;professionalStats:WrProfessionalStats}; }
export type PositionId = keyof PositionPayloadMap;
export type CreationMode='quick'|'full';
export type BalanceVersion='legacy'|'v1.2';
export type RunPhase='gift'|'size'|'potential'|'reveal'|'college-choice'|'training'|'block-review'|'season-review'|'transfer'|'gauntlet'|'draft-night'|'complete';
export interface RunState { creationMode?:CreationMode;balanceVersion?:BalanceVersion;id:string;positionId:'wr';rulesVersion:string;createdAt:string;seed:number;rng:number;nflSeed:number;name:string;jerseyNumber:number;phase:RunPhase;rerolls:number;creation:CreationState;prospect:Prospect|null;collegeId:string;year:number;gameNumber:number;history:GameRecord[];years:YearSummary[];transfers:TransferRecord[];interventions:Intervention[];usedInterventions:string[];pendingIntervention:Intervention|null;lastBlock:BlockReview|null;yearStartOvr:number;awards:AwardRecord[];unlocks:SceneUnlock[];draft:DraftSnapshot|null;processedCommands:string[]; }
export type CardEdition='draft'|'career';
export interface CardCustomization { sceneId:string;frame:'classic'|'silver'|'gold'|'training'|'transfer'|'legend';foil:boolean;showStamp:boolean;featuredEvidenceId?:string; }
export interface HistoricalDisplay { positionLabel:string;attributes:{id:string;label:string;value:number;ceiling:number}[];schoolName:string;schoolColors:[string,string]; }
export interface BinderEntry { id:string;positionId:string;createdAt:string;completedAt:string;favorite:boolean;draft:DraftSnapshot;career:ProfessionalCareer|null;nflSeed:number;draftCard:CardCustomization;careerCard:CardCustomization|null;display:HistoricalDisplay; }
export interface CosmeticProfile { achievements:string[];frames:CardCustomization['frame'][]; }
export type PaletteId='forest'|'copper'|'navy'|'charcoal'|'teal';
export type ThemePreference='system'|'light'|'dark';
export interface SaveEnvelope { schemaVersion:1;rulesVersion:string;run:RunState|null;entries:BinderEntry[];profile:CosmeticProfile;settings:{fastForward:boolean;theme?:ThemePreference;palette?:PaletteId}; }
export interface ArtScene { id:string;name:string;description:string;art:string;accent:string; }
export interface CardViewModel { name:string;position:string;ovr:number;title:string;subtitle:string;school:string;team:string;draftLabel:string;edition:CardEdition;art:string;sceneName:string;frame:CardCustomization['frame'];foil:boolean;stamp:string;statLines:{label:string;value:string}[];colors:[string,string];year:string; }
export type GameCommandPayload = {type:'choose-gift';index:number}|{type:'reroll'}|{type:'accept-size'}|{type:'choose-trait';sourcePlayerId:string;attributeId:string}|{type:'continue'}|{type:'choose-college';collegeId:string}|{type:'train';plan:TrainingPlan}|{type:'declare'}|{type:'return'}|{type:'transfer';collegeId:string}|{type:'scout'};
export type GameCommand = GameCommandPayload & {id:string};
export interface Transition { run:RunState;entry?:BinderEntry;message?:string; }
export interface PositionRules { definition:PositionDefinition;sourcePlayers:readonly SourcePlayerDefinition[];simulateGame:(input:{prospect:Prospect;college:CollegeProgram;year:number;gameNumber:number;seed:number})=>Omit<GameRecord,'gains'|'generalGains'|'practiceGains'>; }
