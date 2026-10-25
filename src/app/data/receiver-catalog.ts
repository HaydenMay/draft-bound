import rawCatalog from './receiver-catalog.json';
import curatedPools from './receiver-pools.json';
import type { Grade, ReceiverProfileDefinition, ReceiverTeamDefinition, WrAttributeId } from '../domain/models';

export const LEGACY_RECEIVER_CATALOG_VERSION = rawCatalog.catalogVersion;
export const RECEIVER_CATALOG_VERSION = curatedPools.catalogVersion;
export const RECEIVER_CATALOG_VERSIONS = [LEGACY_RECEIVER_CATALOG_VERSION, RECEIVER_CATALOG_VERSION] as const;
export const RECEIVER_TEAMS = rawCatalog.teams as ReceiverTeamDefinition[];
export const RECEIVER_PROFILES = rawCatalog.profiles as ReceiverProfileDefinition[];

const attributes: readonly WrAttributeId[] = ['speed', 'acceleration', 'hands', 'routeRunning', 'release', 'vertical', 'bodyControl', 'yardsAfterCatch', 'awareness'];
const grades: readonly Grade[] = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const teamsById = new Map(RECEIVER_TEAMS.map(team => [team.id, team]));
const profilesById = new Map(RECEIVER_PROFILES.map(profile => [profile.id, profile]));
const eligibleByTeam = new Map<string, ReceiverProfileDefinition[]>();
for (const profile of RECEIVER_PROFILES) {
  for (const teamId of profile.eligibleTeamIds) {
    const pool = eligibleByTeam.get(teamId) ?? [];
    pool.push(profile);
    eligibleByTeam.set(teamId, pool);
  }
}

export function receiverProfile(id: string): ReceiverProfileDefinition | undefined {
  return profilesById.get(id);
}

export function receiverTeam(id: string): ReceiverTeamDefinition | undefined {
  return teamsById.get(id);
}

export function receiverCatalogVersionForRun(run: {receiverCatalogVersion?:string}): string {
  return run.receiverCatalogVersion ?? LEGACY_RECEIVER_CATALOG_VERSION;
}

const curatedByTeam = new Map(Object.entries(curatedPools.teams).map(([teamId, ids]) => [teamId, ids.map(id => {
  const profile = profilesById.get(id);
  if (!profile || !profile.eligibleTeamIds.includes(teamId)) throw new Error(`Invalid curated receiver ${teamId}/${id}.`);
  return profile;
})]));
const curatedIds = new Set(Object.values(curatedPools.teams).flat());
const curatedProfiles = RECEIVER_PROFILES.filter(profile => curatedIds.has(profile.id));

export function receiverProfilesForVersion(version = RECEIVER_CATALOG_VERSION): readonly ReceiverProfileDefinition[] {
  if (version === LEGACY_RECEIVER_CATALOG_VERSION) return RECEIVER_PROFILES;
  if (version === RECEIVER_CATALOG_VERSION) return curatedProfiles;
  throw new Error('Unknown receiver catalog version.');
}

export function eligibleReceiversForTeam(teamId: string, version = RECEIVER_CATALOG_VERSION): readonly ReceiverProfileDefinition[] {
  if (version === LEGACY_RECEIVER_CATALOG_VERSION) return eligibleByTeam.get(teamId) ?? [];
  if (version === RECEIVER_CATALOG_VERSION) return curatedByTeam.get(teamId) ?? [];
  throw new Error('Unknown receiver catalog version.');
}

export function validateReceiverCatalog(): string[] {
  const errors: string[] = [];
  const teamIds = new Set(RECEIVER_TEAMS.map(team => team.id));
  const profileIds = new Set(RECEIVER_PROFILES.map(profile => profile.id));
  if (teamIds.size !== RECEIVER_TEAMS.length) errors.push('receiverTeams: duplicate team IDs');
  if (profileIds.size !== RECEIVER_PROFILES.length) errors.push('receiverProfiles: duplicate profile IDs');
  if (RECEIVER_TEAMS.length !== 32) errors.push(`receiverTeams: expected 32 teams, received ${RECEIVER_TEAMS.length}`);

  for (const team of RECEIVER_TEAMS) {
    if (!team.displayName.trim() || eligibleReceiversForTeam(team.id).length === 0) errors.push(`receiverTeams.${team.id}: missing name or eligible pool`);
    const pool = eligibleReceiversForTeam(team.id);
    if (pool.length > 10 || new Set(pool.map(profile => profile.id)).size !== pool.length) errors.push(`receiverTeams.${team.id}: invalid curated pool`);
  }
  for (const teamId of curatedByTeam.keys()) if (!teamIds.has(teamId)) errors.push(`receiverTeams.${teamId}: unknown curated team`);
  for (const profile of RECEIVER_PROFILES) {
    const prefix = `receiverProfiles.${profile.id}`;
    if (!profile.name.trim() || !profile.status.trim() || !profile.provenance.reviewStatus.trim()) errors.push(`${prefix}: missing identity or provenance`);
    if (new Set(profile.eligibleTeamIds).size !== profile.eligibleTeamIds.length) errors.push(`${prefix}: duplicate eligible team ID`);
    for (const teamId of profile.eligibleTeamIds) if (!teamIds.has(teamId)) errors.push(`${prefix}: unknown eligible team ${teamId}`);
    if (Object.keys(profile.grades).length !== attributes.length) errors.push(`${prefix}: expected nine grades`);
    for (const attribute of attributes) if (!grades.includes(profile.grades[attribute])) errors.push(`${prefix}: invalid grade for ${attribute}`);
  }
  return errors;
}
