import { describe, expect, it } from 'vitest';
import {
  RECEIVER_PROFILES,
  RECEIVER_TEAMS,
  eligibleReceiversForTeam,
  validateReceiverCatalog,
} from './receiver-catalog';

describe('v1.4.2 receiver catalog', () => {
  it('keeps the source snapshot counts and nonempty two-stage team pools', () => {
    const eligible = RECEIVER_PROFILES.flatMap(profile=>profile.eligibleTeamIds.map(teamId=>`${teamId}/${profile.id}`));
    expect(RECEIVER_PROFILES).toHaveLength(498);
    expect(RECEIVER_TEAMS).toHaveLength(32);
    expect(eligible).toHaveLength(521);
    expect(Math.min(...RECEIVER_TEAMS.map(team => eligibleReceiversForTeam(team.id).length))).toBe(14);
    expect(Math.max(...RECEIVER_TEAMS.map(team => eligibleReceiversForTeam(team.id).length))).toBe(19);
    expect(new Set(eligible).size).toBe(521);
  });

  it('preserves canonical profile grades and review provenance', () => {
    const ids = new Set(RECEIVER_PROFILES.map(profile => profile.id));
    expect(ids.size).toBe(RECEIVER_PROFILES.length);
    for (const profile of RECEIVER_PROFILES) {
      expect(Object.keys(profile.grades)).toHaveLength(9);
      expect(profile.provenance.gradingMethod).not.toBe('');
      expect(profile.provenance.reviewStatus).not.toBe('');
      expect(profile.provenance.confidence).not.toBe('');
    }
  });

  it('passes full catalog integrity checks', () => {
    expect(validateReceiverCatalog()).toEqual([]);
  });
});
