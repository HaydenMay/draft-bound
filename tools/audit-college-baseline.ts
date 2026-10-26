import { writeFileSync } from 'node:fs';
import { createRun, transition } from '../src/app/domain/engine';
import { createCollege } from '../src/app/domain/test-fixtures';
import { WR_RULES } from '../src/app/domain/simulation';
import { calculateOvr, CEILINGS } from '../src/app/domain/development';
import { WR_DEFINITION } from '../src/app/domain/positions';
import { receiverProfile } from '../src/app/data/receiver-catalog';
import { LEGACY_COLLEGES as COLLEGES } from '../src/app/data/colleges';
import type { GameCommandPayload, RunState } from '../src/app/domain/models';

const school = COLLEGES.find(c => c.shortName === 'OPENWATER')!;
const prospect = createCollege(123).prospect!;
prospect.current = { speed: 92, acceleration: 90, hands: 99, routeRunning: 92, release: 93, vertical: 90, bodyControl: 90, yardsAfterCatch: 87, awareness: 96 };
const games = Array.from({ length: 20000 }, (_, index) => WR_RULES.simulateGame({ prospect, college: school, year: 3, gameNumber: index % 12 + 1, seed: 1000001 + index }));
const round = (value: number) => Math.round(value * 1000) / 1000;
const mean = (xs: number[]) => round(xs.reduce((a,b) => a+b, 0) / xs.length);
const count = (test: (game: typeof games[number]) => boolean) => games.filter(test).length;
const longCatches = games.flatMap(g => g.events.filter(e => e.kind === 'catch' && e.yards >= 50));
const progression: { year: number; ovr: number; gap: number; withinOne: number }[] = [];
let command = 0;
const step = (run: RunState, payload: GameCommandPayload) => transition(run, { ...payload, id: `audit-${command++}` }).run;
for (let seed = 300001; seed <= 300500; seed++) {
  let run = createRun('Synthetic college audit', 11, seed, '2026-10-25T00:00:00Z', 'full');delete run.collegeSystemVersion;
  const gift = run.creation.giftOffers.map((g,index) => ({ index, weight: WR_DEFINITION.attributes.find(a => a.id === g.attributeId)!.weight })).sort((a,b) => b.weight-a.weight)[0];
  run = step(run, { type:'choose-gift', index: gift.index });
  run = step(run, { type:'accept-size' });
  while (run.phase === 'potential') {
    const profile = receiverProfile(run.creation.currentRoll!.receiverId)!;
    const attr = WR_DEFINITION.attributes.filter(a => !run.creation.traits[a.id]).sort((a,b) => CEILINGS[profile.grades[b.id as keyof typeof profile.grades]] * b.weight - CEILINGS[profile.grades[a.id as keyof typeof profile.grades]] * a.weight)[0];
    run = step(run, { type:'choose-trait', sourcePlayerId: profile.id, attributeId: attr.id });
  }
  run = step(run, { type:'continue' }); run = step(run, { type:'choose-college', collegeId: school.id });
  const record = () => {
    const p = run.prospect!;
    const gaps = WR_DEFINITION.attributes.map(a => p.traits[a.id].ceiling - p.current[a.id]);
    progression.push({ year: run.year, ovr: calculateOvr(p.current).raw, gap: mean(gaps), withinOne: gaps.filter(gap => gap <= 1).length });
  };
  record();
  for (let year = 1; year <= 3; year++) {
    for (let block = 0; block < 3; block++) { run = step(run, {type:'train',plan:{mode:'balanced'}}); run = step(run, {type:'continue'}); }
    record();
    if (year < 3) { run = step(run, {type:year === 2 ? 'return':'continue'}); run = step(run, {type:'transfer',collegeId:school.id}); }
  }
}
const report = {
  baselineCommit: '5a6de44bc5b9b120377a101d107c3030837a3a22',
  generatedAt: new Date().toISOString(),
  scope: 'Investigation only; no gameplay changes. Controlled domain simulations, not production telemetry or an exact replay of the photographed save.',
  frozenGameProbe: {
    n: games.length, school: school.name, attributes: prospect.current, ovr: calculateOvr(prospect.current).raw, seedRange: [1000001,1020000],
    meanYards: mean(games.map(g => g.stats.yards)), meanTouchdowns: mean(games.map(g => g.stats.touchdowns)), meanReceptions: mean(games.map(g => g.stats.receptions)),
    gamesWithAtLeast7TDs: count(g => g.stats.touchdowns >= 7), gamesWithAtLeast400Yards: count(g => g.stats.yards >= 400), gamesWithAtLeast490Yards: count(g => g.stats.yards >= 490), gamesGraded100: count(g => g.stats.grade === 100),
    longCatches: longCatches.length, longCatchesScoredAsTDs: longCatches.filter(e => e.touchdown).length,
  },
  growthProbe: {
    n: 500, seedRange: [300001,300500], policy: 'Full mode; highest-weight offered gift; maximum grade-ceiling times positional weight among open attributes at each pick; no rerolls; balanced training requested every block, including existing coaching substitutions; remain at Openwater for three years.',
    snapshots: ['initial','freshmanEnd','sophomoreEnd','juniorEnd'].map((label,index) => {
      const rows = progression.filter((_,i) => i%4 === index);
      return { label, n: rows.length, meanOvr: mean(rows.map(r => r.ovr)), meanGapToCeiling: mean(rows.map(r => r.gap)), attributeShareWithinOnePointOfCeiling: round(rows.reduce((sum,r) => sum+r.withinOne,0)/(rows.length*9)*100) };
    }),
  },
};
writeFileSync('docs/validation/V1_4_3_COLLEGE_BASELINE.json', JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
