import { describe, expect, it } from 'vitest';
import {
  RECEIVER_PROFILES,
  RECEIVER_TEAMS,
  eligibleReceiversForTeam,
  LEGACY_RECEIVER_CATALOG_VERSION,
  validateReceiverCatalog,
} from './receiver-catalog';

describe('v1.4.2 receiver catalog', () => {
  it('keeps the source snapshot counts and nonempty two-stage team pools', () => {
    const eligible = RECEIVER_PROFILES.flatMap(profile=>profile.eligibleTeamIds.map(teamId=>`${teamId}/${profile.id}`));
    expect(RECEIVER_PROFILES).toHaveLength(498);
    expect(RECEIVER_TEAMS).toHaveLength(32);
    expect(eligible).toHaveLength(521);
    expect(Math.min(...RECEIVER_TEAMS.map(team => eligibleReceiversForTeam(team.id, LEGACY_RECEIVER_CATALOG_VERSION).length))).toBe(14);
    expect(Math.max(...RECEIVER_TEAMS.map(team => eligibleReceiversForTeam(team.id, LEGACY_RECEIVER_CATALOG_VERSION).length))).toBe(19);
    expect(new Set(eligible).size).toBe(521);
  });

  it('offers at most ten unique, originally eligible receivers on every new team board', () => {
    for (const team of RECEIVER_TEAMS) {
      const pool = eligibleReceiversForTeam(team.id);
      expect(pool.length).toBeGreaterThan(0);
      expect(pool.length).toBeLessThanOrEqual(10);
      expect(new Set(pool.map(profile => profile.id)).size).toBe(pool.length);
      expect(pool.every(profile => profile.eligibleTeamIds.includes(team.id))).toBe(true);
    }
    const detroit = eligibleReceiversForTeam('det').map(profile => profile.name);
    expect(detroit).toContain('Titus Young');
    expect(detroit).toContain('Calvin Johnson');
    expect(eligibleReceiversForTeam('jax').map(profile => profile.name)).not.toContain('CJ Williams');
    expect(eligibleReceiversForTeam('min').map(profile => profile.name)).not.toContain('Myles Price');
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
