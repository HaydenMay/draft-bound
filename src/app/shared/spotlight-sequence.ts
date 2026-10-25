import type { ReceiverProfileDefinition, ReceiverTeamDefinition } from '../domain/models';

export interface SpotlightTile {
  id: string;
  label: string;
  detail?: string;
}

export interface SpotlightBoards {
  teamTiles: SpotlightTile[];
  receiverTiles: SpotlightTile[];
  receiverSpotlight: boolean;
}

/** Builds display-only boards and validates that the predetermined receiver belongs to the selected team. */
export function createSpotlightBoards(
  teams: readonly Pick<ReceiverTeamDefinition, 'id' | 'code' | 'displayName'>[],
  profiles: readonly Pick<ReceiverProfileDefinition, 'id' | 'name' | 'eligibleTeamIds'>[],
  teamId: string,
  receiverId: string,
): SpotlightBoards {
  const team = teams.find(candidate => candidate.id === teamId);
  if (!team) throw new Error('The selected receiver team is missing from the catalog.');
  const eligible = profiles.filter(profile => profile.eligibleTeamIds.includes(teamId));
  if (!eligible.length) throw new Error(`No eligible receivers are available for ${team.displayName}.`);
  if (!eligible.some(profile => profile.id === receiverId)) throw new Error('The selected receiver is not eligible for the selected team.');
  return {
    teamTiles: teams.map(candidate => ({ id: candidate.id, label: candidate.displayName, detail: candidate.code })),
    receiverTiles: eligible.map(profile => ({ id: profile.id, label: profile.name })),
    receiverSpotlight: eligible.length > 1,
  };
}

/** Allocates a stage duration across highlights, reserving more time for the later stops. */
export function createSpotlightDelays(durationMs: number, stopCount: number): number[] {
  if (!Number.isInteger(durationMs) || durationMs <= 0 || !Number.isInteger(stopCount) || stopCount <= 0 || stopCount > durationMs) {
    throw new Error('Spotlight duration and stop count must be positive integers, with at least one millisecond per stop.');
  }
  const weights = Array.from({ length: stopCount }, (_, index) => 1 + 2 * (index / Math.max(1, stopCount - 1)) ** 2);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const remaining = durationMs - stopCount;
  const delays = weights.map(weight => 1 + Math.floor(remaining * weight / totalWeight));
  let remainder = durationMs - delays.reduce((sum, delay) => sum + delay, 0);
  for (let index = stopCount - 1; remainder > 0; index = (index - 1 + stopCount) % stopCount) {
    delays[index]++;
    remainder--;
  }
  return delays;
}

/** Returns a cosmetic sequence of highlighted IDs that ends on a preselected result. */
export function createSpotlightSequence(
  ids: readonly string[],
  winnerId: string,
  hops: number,
  random: () => number = Math.random,
): string[] {
  const choices = [...new Set(ids.filter(Boolean))];
  if (!choices.length) throw new Error('A spotlight needs at least one choice.');
  if (!choices.includes(winnerId)) throw new Error('The spotlight winner must be one of the available choices.');
  if (!Number.isInteger(hops) || hops < 0) throw new Error('Spotlight hops must be a non-negative integer.');
  if (choices.length === 1) return [winnerId];

  const path: string[] = [];
  for (let index = 0; index < hops; index++) {
    const previous = path.at(-1);
    const candidates = previous ? choices.filter(id => id !== previous) : choices;
    const sample = random();
    const normalized = Number.isFinite(sample) ? Math.min(0.999999999, Math.max(0, sample)) : 0;
    path.push(candidates[Math.floor(normalized * candidates.length)]);
  }
  path.push(winnerId);
  return path;
}
