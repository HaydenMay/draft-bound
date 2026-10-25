import { describe, expect, it } from 'vitest';
import { createSpotlightBoards, createSpotlightDelays, createSpotlightSequence } from './spotlight-sequence';
import { RECEIVER_TEAMS, eligibleReceiversForTeam } from '../data/receiver-catalog';

describe('createSpotlightSequence', () => {
  it('always ends on the predetermined winner', () => {
    expect(createSpotlightSequence(['a', 'b', 'c'], 'c', 4, () => 0)).toEqual(['a', 'b', 'a', 'b', 'c']);
  });

  it('does not spotlight the same tile on adjacent stops when alternatives exist', () => {
    const path = createSpotlightSequence(['a', 'b'], 'a', 8, () => 0);
    expect(path.at(-1)).toBe('a');
    expect(path.every((id, index) => index === 0 || path[index - 1] !== id)).toBe(true);
  });

  it('can revisit an earlier tile on a later non-adjacent stop', () => {
    expect(createSpotlightSequence(['a', 'b', 'c'], 'c', 4, () => 0)).toEqual(['a', 'b', 'a', 'b', 'c']);
  });

  it('returns the winner directly when it is the only available tile', () => {
    expect(createSpotlightSequence(['only'], 'only', 4, () => 0)).toEqual(['only']);
  });

  it('rejects empty IDs, unknown winners, and negative hop counts', () => {
    expect(() => createSpotlightSequence([], 'a', 2)).toThrow();
    expect(() => createSpotlightSequence(['a'], 'b', 2)).toThrow();
    expect(() => createSpotlightSequence(['a', 'b'], 'a', -1)).toThrow();
  });
});

describe('createSpotlightBoards', () => {
  it('shows all receiver teams and only the selected team’s eligible receivers', () => {
    const teamId = 'buf';
    const selectedReceiverId = eligibleReceiversForTeam(teamId)[0].id;
    const boards = createSpotlightBoards(RECEIVER_TEAMS, eligibleReceiversForTeam(teamId), teamId, selectedReceiverId);

    expect(boards.teamTiles).toHaveLength(32);
    expect(boards.teamTiles.find(tile => tile.id === teamId)?.detail).toBe('BUF');
    expect(boards.receiverTiles.map(tile => tile.id)).toEqual(eligibleReceiversForTeam(teamId).map(receiver => receiver.id));
    expect(boards.receiverTiles.some(tile => tile.id === selectedReceiverId)).toBe(true);
  });

  it('marks a one-receiver team for direct reveal without a false competition', () => {
    const teams = [{ id: 'team', code: 'TST', displayName: 'Test Team' }];
    const profiles = [{ id: 'receiver', name: 'Test Receiver', eligibleTeamIds: ['team'] }];

    expect(createSpotlightBoards(teams, profiles, 'team', 'receiver').receiverSpotlight).toBe(false);
  });

  it('rejects an empty eligible roster or a receiver outside the selected team', () => {
    const teams = [{ id: 'team', code: 'TST', displayName: 'Test Team' }];
    const profiles = [{ id: 'receiver', name: 'Test Receiver', eligibleTeamIds: ['other'] }];

    expect(() => createSpotlightBoards(teams, profiles, 'team', 'receiver')).toThrow('No eligible receivers');
    expect(() => createSpotlightBoards(teams, [{ ...profiles[0], eligibleTeamIds: ['team'] }], 'team', 'missing')).toThrow('not eligible');
  });
});

describe('createSpotlightDelays', () => {
  it('uses the requested total time and slows each highlight toward the winner', () => {
    const delays = createSpotlightDelays(1200, 7);
    expect(delays).toHaveLength(7);
    expect(delays.reduce((total, delay) => total + delay, 0)).toBe(1200);
    expect(delays.at(-1)).toBeGreaterThan(delays[0]);
  });

  it('rejects invalid durations or stop counts', () => {
    expect(() => createSpotlightDelays(0, 3)).toThrow();
    expect(() => createSpotlightDelays(1000, 0)).toThrow();
  });
});
