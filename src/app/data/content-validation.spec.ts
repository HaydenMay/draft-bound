import { describe, expect, it } from 'vitest';
import type { ContentCatalog } from './content-validation';
import { assertValidContent, validateContent } from './content-validation';
import type { WrAttributeId } from '../domain/models';
import { DRAFT_BOARD } from './teams';
import { SOURCE_PLAYERS } from './source-players';

const attributes: WrAttributeId[] = ['speed', 'acceleration', 'hands', 'routeRunning', 'release', 'vertical', 'bodyControl', 'yardsAfterCatch', 'awareness'];

/** Deliberately synthetic fixtures exercise validation without copying the curated catalog. */
function validCatalog(): ContentCatalog {
  const sourcePlayers = Array.from({ length: 75 }, (_, i) => ({
    id: `receiver-${i + 1}`, name: `Receiver ${i + 1}`, era: 'Fixture', heightCm: 185,
    weightKg: 90, build: 'Balanced', grades: Object.fromEntries(attributes.map(id => [id, 'S'])) as ContentCatalog['sourcePlayers'][number]['grades'],
  }));
  const colleges = Array.from({length:15},(_,i)=>['technical','explosive','opportunity'][i]??`fixture-school-${i}`).map(id => ({prestige:1 as const,
    id, name: `${id} College`, shortName: id, location: 'Fixture City', colors: ['#112233', '#eeeeee'] as [string, string],
    description: 'A fixture program.', specialty: 'All skills', specialties: [...attributes], coaching: 1, opportunity: 1, offense: 1,
  }));
  const teams = Array.from({ length: 32 }, (_, i) => ({
    teamId: `team-${i + 1}`, displayName: `Team ${i + 1}`, city: 'Fixture City',
    primaryColor: '#112233', secondaryColor: '#eeeeee', catalogVersion: 'fixture-v1',
  }));
  const draftBoard: ContentCatalog['draftBoard'] = [];
  [32, 32, 40, 40, 40, 40, 32].forEach((count, roundIndex) => {
    for (let pick = 1; pick <= count; pick++) draftBoard.push({
      overallPick: draftBoard.length + 1, round: roundIndex + 1, pickInRound: pick,
      teamId: teams[(pick - 1) % 32].teamId,
    });
  });
  const artScenes = ['prospect_journey', 'draft_night', 'breakaway_star', 'spectacular_catch', 'red_zone_monster', 'breakout_star', 'reliable_hands', 'transfer_breakout', 'award_ceremony', 'rookie_breakout', 'canton_bust', 'gold_jacket'].map(id => ({
    id, name: id, description: 'An earned career moment.', art: 'art/journey.png', accent: '#112233',
  }));
  return { sourcePlayers, colleges, teams, draftBoard, artScenes };
}

describe('content integrity', () => {
  it('broadens receiver styles beyond the original elite-heavy pool and represents Andre signature ceilings',()=>{
    expect(SOURCE_PLAYERS.length).toBeGreaterThan(75);
    expect(SOURCE_PLAYERS.some(p=>p.id==='wayne-chrebet')).toBe(true);
    expect(SOURCE_PLAYERS.find(p=>p.id==='andre-johnson')!.grades.hands).toBe('A+');
    expect(SOURCE_PLAYERS.find(p=>p.id==='andre-johnson')!.grades.bodyControl).toBe('A+');
  });
  it('accepts the shipped source, school, team, board and art catalogs together', () => {
    expect(validateContent()).toEqual([]);
    expect(() => assertValidContent()).not.toThrow();
  });

  it('accepts a complete catalog with seven explicit rounds', () => {
    expect(validateContent(validCatalog())).toEqual([]);
  });

  it.each(['sourcePlayers', 'colleges', 'teams', 'artScenes'] as const)('rejects duplicate IDs in %s', key => {
    const catalog = validCatalog();
    if (key === 'teams') catalog.teams[1].teamId = catalog.teams[0].teamId;
    else catalog[key][1].id = catalog[key][0].id;
    expect(validateContent(catalog).some(error => error.includes('Duplicate') && error.includes(key))).toBe(true);
  });

  it('rejects a missing receiver grade rather than treating it as a low rating', () => {
    const catalog = validCatalog();
    delete (catalog.sourcePlayers[0].grades as Partial<typeof catalog.sourcePlayers[0]['grades']>).hands;
    expect(validateContent(catalog)).toContain('sourcePlayers.receiver-1: missing grade for hands');
  });

  it('rejects an unsupported letter grade', () => {
    const catalog = validCatalog();
    (catalog.sourcePlayers[0].grades as Record<string, string>).hands = 'A++';
    expect(validateContent(catalog)).toContain('sourcePlayers.receiver-1: invalid grade A++ for hands');
  });

  it('rejects a source pool with no natural gift for an attribute', () => {
    const catalog = validCatalog();
    catalog.sourcePlayers.forEach(player => { player.grades.vertical = 'A'; });
    expect(validateContent(catalog)).toContain('sourcePlayers: no S-tier natural-gift source for vertical');
  });

  it('rejects an unknown drafting team', () => {
    const catalog = validCatalog();
    catalog.draftBoard[8].teamId = 'missing-team';
    expect(validateContent(catalog)).toContain('draftBoard.9: unknown team missing-team');
  });

  it('rejects a repeated overall pick', () => {
    const catalog = validCatalog();
    catalog.draftBoard[33].overallPick = 33;
    expect(validateContent(catalog)).toContain('draftBoard.34: expected consecutive overall pick 34');
  });

  it('rejects the tempting 32-picks-per-round shortcut at the first expanded-round boundary', () => {
    const catalog = validCatalog();
    catalog.draftBoard[96].round = 4;
    catalog.draftBoard[96].pickInRound = 1;
    const errors = validateContent(catalog);
    expect(errors).toContain('draftBoard.97: expected round 3 pick 33');
  });

  it('rejects an incomplete board even if its existing slots are consecutive', () => {
    const catalog = validCatalog();
    catalog.draftBoard.pop();
    expect(validateContent(catalog)).toContain('draftBoard: expected 256 slots, received 255');
  });

  it('rejects a missing required art scene', () => {
    const catalog = validCatalog();
    catalog.artScenes = catalog.artScenes.filter(scene => scene.id !== 'canton_bust');
    expect(validateContent(catalog)).toContain('artScenes: missing required scene canton_bust');
  });

  it('rejects an impossible physical profile and invalid presentation color', () => {
    const catalog = validCatalog();
    catalog.sourcePlayers[0].heightCm = 0;
    catalog.teams[0].primaryColor = 'red-ish';
    const errors = validateContent(catalog);
    expect(errors).toContain('sourcePlayers.receiver-1: invalid heightCm');
    expect(errors).toContain('teams.team-1: invalid primaryColor');
  });

  it('blocks invalid content with actionable diagnostics at the assertion boundary', () => {
    const catalog = validCatalog();
    catalog.draftBoard[8].teamId = 'missing-team';
    expect(() => assertValidContent(catalog)).toThrow('draftBoard.9: unknown team missing-team');
  });

  it('keeps late-round bonus slots and their team assignments at explicit board boundaries', () => {
    expect([97, 104, 105, 144, 184, 224, 225, 256].map(pick => DRAFT_BOARD[pick - 1])).toEqual([
      { overallPick: 97, round: 3, pickInRound: 33, teamId: 'anchorage-northlights' },
      { overallPick: 104, round: 3, pickInRound: 40, teamId: 'san-diego-tideglass' },
      { overallPick: 105, round: 4, pickInRound: 1, teamId: 'anchorage-northlights' },
      { overallPick: 144, round: 4, pickInRound: 40, teamId: 'spokane-pinelights' },
      { overallPick: 184, round: 5, pickInRound: 40, teamId: 'tucson-redrock' },
      { overallPick: 224, round: 6, pickInRound: 40, teamId: 'wichita-cloudbreak' },
      { overallPick: 225, round: 7, pickInRound: 1, teamId: 'anchorage-northlights' },
      { overallPick: 256, round: 7, pickInRound: 32, teamId: 'wichita-cloudbreak' },
    ]);
  });
});
