import {writeFileSync} from 'node:fs';
import {createCollege} from '../src/app/domain/test-fixtures';
import {WR_RULES} from '../src/app/domain/simulation';
import {values} from '../src/app/domain/development';
import {COLLEGES} from '../src/app/data/colleges';
const cases:any[]=[];
for(const version of ['legacy','v1.4.4'] as const)for(const ability of [60,80,93,99]){
 const p=structuredClone(createCollege(20).prospect!);p.id='synthetic-college-probe';p.current=values(()=>ability);p.physical.heightCm=185;p.physical.weightKg=90;
 // Fixed ability probes exercise simulation, not source selection or attainable development.
 const games=Array.from({length:10000},(_,i)=>WR_RULES.simulateGame({prospect:p,college:COLLEGES[2],year:3,gameNumber:i%12+1,seed:1200001+i,...(version==='v1.4.4'?{collegeRulesVersion:version}:{})}));
 const mean=(xs:number[])=>Math.round(xs.reduce((a,b)=>a+b,0)/xs.length*1000)/1000;
 const long=games.flatMap(g=>g.events).filter(e=>e.kind==='catch'&&e.yards>=50);
 cases.push({version,ability,games:games.length,yardsPerGame:mean(games.map(g=>g.stats.yards)),tdPerGame:mean(games.map(g=>g.stats.touchdowns)),grade:mean(games.map(g=>g.stats.grade)),perfectGradePct:mean(games.map(g=>g.stats.grade===100?100:0)),sevenTdGames:games.filter(g=>g.stats.touchdowns>=7).length,gamesAt490Yards:games.filter(g=>g.stats.yards>=490).length,maxYards:Math.max(...games.map(g=>g.stats.yards)),maxTD:Math.max(...games.map(g=>g.stats.touchdowns)),maxRoutes:Math.max(...games.map(g=>g.stats.routes)),longCatches:long.length,nonScoringLongCatches:long.filter(e=>!e.touchdown).length});
}
writeFileSync('docs/validation/V1_4_4_COLLEGE_PROBES.json',JSON.stringify({method:'10,000 shared seeds1200001..1210000 per fixed-ability case; Openwater,185cm/90kg. Same seeds reused across eight cases. Synthetic current abilities, not generated prospects, telemetry or a real-football statistical calibration.',cases},null,2)+'\n');
console.log(JSON.stringify(cases));
