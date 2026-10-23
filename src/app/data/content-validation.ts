import type { ArtScene, CollegeProgram, DraftBoardSlot, DraftTeamIdentity, SourcePlayerDefinition } from '../domain/models';
import { ART_SCENES } from './art-scenes';
import { COLLEGES } from './colleges';
import { SOURCE_PLAYERS, VALID_GRADES, WR_ATTRIBUTE_IDS } from './source-players';
import { DRAFT_BOARD, DRAFT_TEAMS } from './teams';

export { VALID_GRADES, WR_ATTRIBUTE_IDS } from './source-players';

export interface ContentCatalog {
  sourcePlayers: SourcePlayerDefinition[];
  colleges: CollegeProgram[];
  teams: DraftTeamIdentity[];
  draftBoard: DraftBoardSlot[];
  artScenes: ArtScene[];
}

const REQUIRED_SCENES = ['prospect_journey', 'draft_night', 'breakaway_star', 'spectacular_catch', 'red_zone_monster', 'breakout_star', 'reliable_hands', 'transfer_breakout', 'award_ceremony', 'rookie_breakout', 'canton_bust', 'gold_jacket'];
const ROUND_COUNTS = [32, 32, 40, 40, 40, 40, 32];
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const STABLE_ID = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const nonempty = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0;
const positive = (value: unknown): boolean => typeof value === 'number' && Number.isFinite(value) && value > 0;

/** Pure catalog validation also accepts overrides for tooling, imports and tests. */
export function validateContent(overrides: Partial<ContentCatalog> = {}): string[] {
  const catalog: ContentCatalog = {
    sourcePlayers: SOURCE_PLAYERS, colleges: COLLEGES, teams: DRAFT_TEAMS, draftBoard: DRAFT_BOARD, artScenes: ART_SCENES,
    ...overrides,
  };
  const errors: string[] = [];
  const checkIds = (key: string, ids: string[]) => {
    const seen = new Set<string>();
    ids.forEach(id => {
      if (!STABLE_ID.test(id)) errors.push(`${key}: invalid stable ID ${id}`);
      if (seen.has(id)) errors.push(`Duplicate ${key} ID: ${id}`);
      seen.add(id);
    });
  };
  const count = (key: string, expected: number, actual: number, noun: string) => {
    if (actual !== expected) errors.push(`${key}: expected ${expected} ${noun}, received ${actual}`);
  };

  count('sourcePlayers', 75, catalog.sourcePlayers.length, 'receivers');
  checkIds('sourcePlayers', catalog.sourcePlayers.map(player => player.id));
  const sourceNames = new Set<string>();
  catalog.sourcePlayers.forEach(player => {
    const prefix = `sourcePlayers.${player.id}`;
    if (!nonempty(player.name) || !nonempty(player.era) || !nonempty(player.build)) errors.push(`${prefix}: missing name, era or build`);
    const normalizedName = player.name.trim().toLowerCase();
    if (sourceNames.has(normalizedName)) errors.push(`${prefix}: duplicate receiver name ${player.name}`);
    sourceNames.add(normalizedName);
    if (!positive(player.heightCm)) errors.push(`${prefix}: invalid heightCm`);
    if (!positive(player.weightKg)) errors.push(`${prefix}: invalid weightKg`);
    WR_ATTRIBUTE_IDS.forEach(attribute => {
      const grade = player.grades?.[attribute];
      if (grade === undefined) errors.push(`${prefix}: missing grade for ${attribute}`);
      else if (!VALID_GRADES.includes(grade)) errors.push(`${prefix}: invalid grade ${grade} for ${attribute}`);
    });
    Object.keys(player.grades ?? {}).filter(id => !WR_ATTRIBUTE_IDS.includes(id as typeof WR_ATTRIBUTE_IDS[number])).forEach(id => errors.push(`${prefix}: unknown attribute ${id}`));
  });
  WR_ATTRIBUTE_IDS.forEach(attribute => {
    if (!catalog.sourcePlayers.some(player => player.grades?.[attribute] === 'S')) errors.push(`sourcePlayers: no S-tier natural-gift source for ${attribute}`);
  });

  count('colleges', 3, catalog.colleges.length, 'programs');
  checkIds('colleges', catalog.colleges.map(college => college.id));
  ['technical', 'explosive', 'opportunity'].forEach(id => {
    if (!catalog.colleges.some(college => college.id === id)) errors.push(`colleges: missing required profile ${id}`);
  });
  catalog.colleges.forEach(college => {
    const prefix = `colleges.${college.id}`;
    if (![college.name, college.shortName, college.location, college.description, college.specialty].every(nonempty)) errors.push(`${prefix}: missing presentation text`);
    if (college.colors.length !== 2 || !college.colors.every(color => HEX_COLOR.test(color))) errors.push(`${prefix}: invalid colors`);
    if (![college.coaching, college.opportunity, college.offense].every(positive)) errors.push(`${prefix}: invalid development multiplier`);
    if (!college.specialties.length || college.specialties.some(id => !WR_ATTRIBUTE_IDS.includes(id as typeof WR_ATTRIBUTE_IDS[number]))) errors.push(`${prefix}: invalid specialty attribute`);
  });

  count('teams', 32, catalog.teams.length, 'teams');
  checkIds('teams', catalog.teams.map(team => team.teamId));
  const teamIds = new Set(catalog.teams.map(team => team.teamId));
  catalog.teams.forEach(team => {
    const prefix = `teams.${team.teamId}`;
    if (![team.displayName, team.city, team.catalogVersion].every(nonempty)) errors.push(`${prefix}: missing identity text or version`);
    if (!HEX_COLOR.test(team.primaryColor)) errors.push(`${prefix}: invalid primaryColor`);
    if (!HEX_COLOR.test(team.secondaryColor)) errors.push(`${prefix}: invalid secondaryColor`);
  });

  count('draftBoard', 256, catalog.draftBoard.length, 'slots');
  let expectedIndex = 0;
  ROUND_COUNTS.forEach((roundSize, roundIndex) => {
    for (let pickInRound = 1; pickInRound <= roundSize; pickInRound++) {
      const slot = catalog.draftBoard[expectedIndex];
      expectedIndex++;
      if (!slot) continue;
      if (slot.overallPick !== expectedIndex) errors.push(`draftBoard.${expectedIndex}: expected consecutive overall pick ${expectedIndex}`);
      if (slot.round !== roundIndex + 1 || slot.pickInRound !== pickInRound) errors.push(`draftBoard.${expectedIndex}: expected round ${roundIndex + 1} pick ${pickInRound}`);
      if (!teamIds.has(slot.teamId)) errors.push(`draftBoard.${expectedIndex}: unknown team ${slot.teamId}`);
    }
  });
  catalog.draftBoard.slice(256).forEach(slot => errors.push(`draftBoard.${slot.overallPick}: unexpected extra slot`));

  count('artScenes', 12, catalog.artScenes.length, 'scenes');
  checkIds('artScenes', catalog.artScenes.map(scene => scene.id));
  REQUIRED_SCENES.forEach(id => {
    if (!catalog.artScenes.some(scene => scene.id === id)) errors.push(`artScenes: missing required scene ${id}`);
  });
  catalog.artScenes.forEach(scene => {
    const prefix = `artScenes.${scene.id}`;
    if (!nonempty(scene.name) || !nonempty(scene.description)) errors.push(`${prefix}: missing presentation text`);
    if (!/^art\/[a-z0-9-]+\.png$/.test(scene.art)) errors.push(`${prefix}: invalid local artwork path`);
    if (!HEX_COLOR.test(scene.accent)) errors.push(`${prefix}: invalid accent color`);
  });
  return errors;
}

export function assertValidContent(overrides: Partial<ContentCatalog> = {}): void {
  const errors = validateContent(overrides);
  if (errors.length) throw new Error(`Invalid content catalog:\n${errors.join('\n')}`);
}
