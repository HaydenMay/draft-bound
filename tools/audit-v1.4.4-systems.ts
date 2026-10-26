import {writeFileSync} from 'node:fs';
import {createRun,transition} from '../src/app/domain/engine';
import {calculateOvr,CEILINGS} from '../src/app/domain/development';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {receiverProfile} from '../src/app/data/receiver-catalog';
import {COLLEGES} from '../src/app/data/colleges';
import {simulateProfessional} from '../src/app/domain/professional';
import type {RunState,GameCommandPayload,CreationMode,BinderEntry} from '../src/app/domain/models';
const step=(r:RunState,c:GameCommandPayload)=>transition(r,{...c,id:`systems-audit-${r.processedCommands.length}`});
const declarationOnly=process.argv.includes('--declaration-only');
const n=200,groups:any[]=[];
const round=(x:number)=>Math.round(x*1000)/1000;
const mean=(xs:number[])=>round(xs.reduce((a,b)=>a+b,0)/xs.length);
const dist=(xs:number[])=>{const a=[...xs].sort((a,b)=>a-b);return {mean:mean(a),p10:a[Math.floor(a.length*.1)],median:a[Math.floor(a.length*.5)],p90:a[Math.floor(a.length*.9)],max:a.at(-1)};};
function build(seed:number,mode:CreationMode,version:'v1.4.3'|'v1.4.4'){
 let r=createRun('Synthetic systems audit',11,seed,'2026-10-26T00:00:00Z',mode);r.balanceVersion=version;
 if(version==='v1.4.3'){delete r.collegeRulesVersion;delete r.careerFlowVersion;}
 const gift=r.creation.giftOffers.map((g,index)=>({index,weight:WR_DEFINITION.attributes.find(a=>a.id===g.attributeId)!.weight})).sort((a,b)=>b.weight-a.weight)[0];
 r=step(r,{type:'choose-gift',index:gift.index}).run;r=step(r,{type:'accept-size'}).run;
 while(r.phase==='potential'){
  const p=receiverProfile(r.creation.currentRoll!.receiverId)!;
  const a=WR_DEFINITION.attributes.filter(a=>!r.creation.traits[a.id]).sort((a,b)=>CEILINGS[p.grades[b.id as keyof typeof p.grades]]*b.weight-CEILINGS[p.grades[a.id as keyof typeof p.grades]]*a.weight)[0];
  r=step(r,{type:'choose-trait',sourcePlayerId:p.id,attributeId:a.id}).run;
 }
 return step(r,{type:'continue'}).run;
}
function point(r:RunState,e?:BinderEntry){
 const p=r.prospect!,games=r.history,career=e?(e.career??simulateProfessional(e)):null;
 const nonGift=Object.entries(p.traits).filter(([,t])=>t.origin!=='gift');
 const long=games.flatMap(g=>g.events).filter(x=>x.kind==='catch'&&x.yards>=50);
 return {ovr:calculateOvr(p.current).raw,initial:calculateOvr(p.initial).raw,withinOne:nonGift.filter(([id,t])=>t.ceiling-p.current[id]<=1).length/8,
  yards:mean(games.map(g=>g.stats.yards)),td:mean(games.map(g=>g.stats.touchdowns)),routes:mean(games.map(g=>g.stats.routes)),grade:mean(games.map(g=>g.stats.grade)),perfect:games.filter(g=>g.stats.grade===100).length/games.length,
  maxYards:Math.max(...games.map(g=>g.stats.yards)),maxTD:Math.max(...games.map(g=>g.stats.touchdowns)),long:long.length,nonScoringLong:long.filter(x=>!x.touchdown).length,
  nflYears:career?.seasons.length??0,nflYards:career?.totals.yards??0,hof:career?.induction.inducted??false};
}
for(const version of (declarationOnly?['v1.4.4']:['v1.4.3','v1.4.4']) as ('v1.4.3'|'v1.4.4')[])for(const mode of ['quick','full'] as const)for(const school of declarationOnly?[COLLEGES[2]]:COLLEGES)for(const policy of ['balanced','adaptive'] as const){
 const points:any[][]=[[],[],[]];
 for(let i=0;i<n;i++){
  let r=build(1100001+i,mode,version);r=step(r,{type:'choose-college',collegeId:school.id}).run;
  for(let year=1;year<=3;year++){
   for(let block=0;block<3;block++){
    const target=[...WR_DEFINITION.attributes].filter(a=>r.prospect!.traits[a.id].origin!=='gift').sort((a,b)=>(r.prospect!.traits[b.id].ceiling-r.prospect!.current[b.id])*b.weight-(r.prospect!.traits[a.id].ceiling-r.prospect!.current[a.id])*a.weight)[0];
    r=step(r,{type:'train',plan:policy==='balanced'?{mode:'balanced'}:{mode:'focused',attributeId:target.id}}).run;r=step(r,{type:'continue'}).run;
   }
   if(year===1)points[0].push(point(r));
   else {const finished=step(step(r,year===2?{type:'declare'}:{type:'continue'}).run,{type:'scout'});points[year-1].push(point(finished.run,finished.entry));}
   if(year<3){r=step(r,year===2?{type:'return'}:{type:'continue'}).run;r=step(r,{type:'transfer',collegeId:school.id}).run;}
  }
 }
 groups.push({version,mode,school:school.id,policy,n,declaration:{declareHigherNflYardsPct:mean(points[1].map((p,i)=>p.nflYards>points[2][i].nflYards?100:0)),returnHigherNflYardsPct:mean(points[2].map((p,i)=>p.nflYards>points[1][i].nflYards?100:0))},years:points.map((ps,index)=>({year:index+1,initial:mean(ps.map(p=>p.initial)),ovr:dist(ps.map(p=>p.ovr)),displayed90Pct:mean(ps.map(p=>Math.round(p.ovr)>=90?100:0)),displayed95Pct:mean(ps.map(p=>Math.round(p.ovr)>=95?100:0)),nonGiftWithinOnePct:mean(ps.map(p=>p.withinOne*100)),yardsPerGame:mean(ps.map(p=>p.yards)),tdPerGame:mean(ps.map(p=>p.td)),routesPerGame:mean(ps.map(p=>p.routes)),gameGrade:mean(ps.map(p=>p.grade)),perfectGamePct:mean(ps.map(p=>p.perfect*100)),largestGameYards:Math.max(...ps.map(p=>p.maxYards)),largestGameTD:Math.max(...ps.map(p=>p.maxTD)),longCatches:ps.reduce((s,p)=>s+p.long,0),nonScoringLongCatches:ps.reduce((s,p)=>s+p.nonScoringLong,0),nflYears:mean(ps.map(p=>p.nflYears)),nflYards:mean(ps.map(p=>p.nflYards)),hofPct:mean(ps.map(p=>p.hof?100:0))}))});
 console.log(JSON.stringify(groups.at(-1)));
}
writeFileSync(declarationOnly?'docs/validation/V1_4_4_DECLARATION_AUDIT.json':'docs/validation/V1_4_4_SYSTEMS_AUDIT.json',JSON.stringify({method:'200 shared seeds1100001..1100200 per creation mode, reused across versions/schools/policies. Highest weighted offered gift; maximize offered ceiling times attribute weight at each manual pick; no rerolls. Four-game commands with actual coaching, sophomore-declare counterfactual and junior-return career. Not production telemetry or independent samples per condition.',groups},null,2)+'\n');
