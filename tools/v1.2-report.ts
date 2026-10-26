import {mkdirSync,writeFileSync} from 'node:fs';
import {createRun,transition,manualPotentialLimit} from '../src/app/domain/engine';
import {calculateOvr,CEILINGS,values} from '../src/app/domain/development';
import {simulateProfessional} from '../src/app/domain/professional';
import {recruitRating} from '../src/app/domain/recruiting';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {LEGACY_COLLEGES as COLLEGES} from '../src/app/data/colleges';
import {SOURCE_PLAYERS,SOURCE_CATALOG_VERSION} from '../src/app/data/source-players';
import {BalanceVersion,CreationMode,GameCommandPayload,RunState,TrainingPlan,WrAttributeId} from '../src/app/domain/models';

const seeds=Number(process.env['PAIRED_SEEDS']??250),attrs=WR_DEFINITION.attributes;
if(!Number.isInteger(seeds)||seeds<1)throw Error('PAIRED_SEEDS must be a positive integer.');
const command=(run:RunState,p:GameCommandPayload)=>transition(run,{...p,id:`audit-${run.processedCommands.length}`}).run;
type Choice='rotated'|'best-available';
function created(seed:number,mode:CreationMode,choice:Choice):RunState{
 let run=createRun('Paired Prospect',11,seed,'2026-01-01T00:00:00.000Z',mode);delete run.collegeSystemVersion;
 const gift=choice==='rotated'?seed%3:run.creation.giftOffers.reduce((best,g,index,all)=>attrs.find(a=>a.id===g.attributeId)!.weight>attrs.find(a=>a.id===all[best].attributeId)!.weight?index:best,0);
 run=command(run,{type:'choose-gift',index:gift});run=command(run,{type:'accept-size'});
 for(let n=0;n<manualPotentialLimit(run);n++){
  const available=attrs.filter(a=>!run.creation.traits[a.id]);
  let attributeId=available[n%available.length].id,sourcePlayerId=run.creation.playerOffers[n%3];
  if(choice==='best-available'){
   const pairs=run.creation.playerOffers.flatMap(id=>available.map(a=>({id,attr:a.id,score:CEILINGS[SOURCE_PLAYERS.find(p=>p.id===id)!.grades[a.id as WrAttributeId]]*a.weight})));
   pairs.sort((a,b)=>b.score-a.score);attributeId=pairs[0].attr;sourcePlayerId=pairs[0].id;
  }
  run=command(run,{type:'choose-trait',attributeId,sourcePlayerId});
 }
 return run;
}
function training(run:RunState,policy:number):TrainingPlan{
 if(policy===0)return {mode:'balanced'};
 const available=attrs.filter(a=>run.prospect!.current[a.id]<run.prospect!.traits[a.id].ceiling);
 available.sort((a,b)=>policy===1?run.prospect!.current[a.id]-run.prospect!.current[b.id]:(run.prospect!.traits[b.id].ceiling-run.prospect!.current[b.id])*b.weight-(run.prospect!.traits[a.id].ceiling-run.prospect!.current[a.id])*a.weight);
 return available.length?{mode:'intensive',attributeId:available[0].id}:{mode:'balanced'};
}
interface Observation{mode:CreationMode;choice:Choice;school:string;policy:string;profile:BalanceVersion;year:number;ovr:number;initial:number;ceiling:number;maxed:number;sTraits:number;first:boolean;undrafted:boolean;hof:boolean;nflYards:number;}
const rows:Observation[]=[],recruits:{mode:CreationMode;choice:Choice;score:number;stars:number}[]=[];let violations=0;
const started=Date.now();
for(let i=0;i<seeds;i++)for(const mode of ['quick','full'] as const)for(const choice of ['rotated','best-available'] as const){
 const base=created((0x94f1+i*2654435761)>>>0,mode,choice),rating=recruitRating(base.prospect!);
 recruits.push({mode,choice,score:rating.score,stars:rating.stars});
 for(const school of COLLEGES)for(const profile of ['legacy','v1.2'] as const){
  let run=structuredClone(base);run.balanceVersion=profile;run=command(run,{type:'continue'});run=command(run,{type:'choose-college',collegeId:school.id});
  for(let year=1;year<=3;year++){
   for(let block=0;block<3;block++){run=command(run,{type:'train',plan:training(run,i%3)});run=command(run,{type:'continue'});}
   if(year>=2){
    const drafting=command(run,year===2?{type:'declare'}:{type:'continue'}),entry=transition(drafting,{type:'scout',id:'audit-draft'}).entry!,d=entry.draft,career=simulateProfessional(entry),p=d.prospect;
    for(const a of attrs)if(p.current[a.id]>p.traits[a.id].ceiling+1e-9||p.current[a.id]<p.initial[a.id])violations++;
    rows.push({mode,choice,school:school.shortName,policy:['balanced','weakest-intensive','adaptive-intensive'][i%3],profile,year,ovr:d.finalOvr,initial:p.initialOvr,ceiling:calculateOvr(values(id=>p.traits[id].ceiling)).raw,maxed:attrs.filter(a=>Math.abs(p.current[a.id]-p.traits[a.id].ceiling)<1e-7).length,sTraits:attrs.filter(a=>p.traits[a.id].grade==='S').length,first:d.outcome.status==='drafted'&&d.outcome.round===1,undrafted:d.outcome.status==='undrafted',hof:career.induction.inducted,nflYards:career.totals.yards});
   }
   if(year<3){run=command(run,year===2?{type:'return'}:{type:'continue'});run=command(run,{type:'transfer',collegeId:school.id});}
  }
 }
 if(choice==='best-available'&&mode==='full'&&(i+1)%50===0)console.log(`${i+1}/${seeds} seed sets`);
}
const mean=(xs:number[])=>xs.reduce((s,v)=>s+v,0)/xs.length;
const pct=(xs:number[],q:number)=>[...xs].sort((a,b)=>a-b)[Math.min(xs.length-1,Math.floor(xs.length*q))];
function summary(rs:Observation[]){return {n:rs.length,meanOvr:mean(rs.map(r=>r.ovr)),median:pct(rs.map(r=>r.ovr),.5),p10:pct(rs.map(r=>r.ovr),.1),p90:pct(rs.map(r=>r.ovr),.9),meanInitial:mean(rs.map(r=>r.initial)),meanCeiling:mean(rs.map(r=>r.ceiling)),atLeast80:mean(rs.map(r=>Number(r.ovr>=80))),atLeast85:mean(rs.map(r=>Number(r.ovr>=85))),atLeast90:mean(rs.map(r=>Number(r.ovr>=90))),atLeast95:mean(rs.map(r=>Number(r.ovr>=95))),meanMaxedTraits:mean(rs.map(r=>r.maxed)),allTraitsMaxed:mean(rs.map(r=>Number(r.maxed===9))),meanSTraits:mean(rs.map(r=>r.sTraits)),firstRound:mean(rs.map(r=>Number(r.first))),undrafted:mean(rs.map(r=>Number(r.undrafted))),hof:mean(rs.map(r=>Number(r.hof))),meanNflYards:mean(rs.map(r=>r.nflYards))};}
const cohortKeys=[...new Set(rows.map(r=>`${r.mode} / ${r.choice} / ${r.profile} / year ${r.year}`))];
const cohorts=cohortKeys.map(cohort=>({cohort,...summary(rows.filter(r=>`${r.mode} / ${r.choice} / ${r.profile} / year ${r.year}`===cohort))}));
const schools=COLLEGES.flatMap(s=>['legacy','v1.2'].map(profile=>({school:s.shortName,profile,...summary(rows.filter(r=>r.school===s.shortName&&r.profile===profile&&r.year===3))})));
const policies=['balanced','weakest-intensive','adaptive-intensive'].flatMap(policy=>['legacy','v1.2'].map(profile=>({policy,profile,...summary(rows.filter(r=>r.policy===policy&&r.profile===profile&&r.year===3))})));
const recruiting=(['quick','full'] as const).flatMap(mode=>(['rotated','best-available'] as const).map(choice=>{const rs=recruits.filter(r=>r.mode===mode&&r.choice===choice);return {mode,choice,n:rs.length,mean:mean(rs.map(r=>r.score)),p10:pct(rs.map(r=>r.score),.1),median:pct(rs.map(r=>r.score),.5),p90:pct(rs.map(r=>r.score),.9),stars:Object.fromEntries([1,2,3,4,5].map(s=>[s,rs.filter(r=>r.stars===s).length]))};}));
const sourceAudit={version:SOURCE_CATALOG_VERSION,players:SOURCE_PLAYERS.length,grades:Object.fromEntries([...new Set(SOURCE_PLAYERS.flatMap(p=>Object.values(p.grades)))].map(g=>[g,SOURCE_PLAYERS.reduce((s,p)=>s+Object.values(p.grades).filter(v=>v===g).length,0)])),attributes:attrs.map(a=>({attribute:a.id,sourcesWithS:SOURCE_PLAYERS.filter(p=>p.grades[a.id as WrAttributeId]==='S').length,meanCeiling:mean(SOURCE_PLAYERS.map(p=>CEILINGS[p.grades[a.id as WrAttributeId]]))}))};
const report={createdProspects:recruits.length,matchedCareerPairs:rows.length/4,draftSnapshots:rows.length,seedSchedule:'(0x94f1 + i * 2654435761) unsigned32',durationSeconds:(Date.now()-started)/1000,violations,cohorts,schools,policies,recruiting,sourceAudit};
mkdirSync('docs/validation',{recursive:true});writeFileSync('docs/validation/v1.2-paired-report.json',JSON.stringify(report,null,2)+'\n');
const percent=(n:number)=>(n*100).toFixed(1)+'%';
writeFileSync('docs/validation/V1_2_PAIRED_REPORT.md',`# v1.2 matched progression and source audit\n\n${report.createdProspects} created builds, ${report.matchedCareerPairs} matched school/profile career pairs, ${rows.length} draft snapshots. Each pair clones the exact same completed build, RNG state, school and training policy into legacy and v1.2 growth. Snapshots at year two are drafted from a clone; the original continues through year three. Policies rotate evenly by seed; schools are crossed, not rebalanced. No rerolls. Best-available greedily chooses the highest weighted ceiling from the current offer; rotated uses index-based choices. These are scripted policies, not player telemetry.\n\n| Mode / creation / profile / year | n | Mean OVR | P10 / median / P90 | 90+ | 95+ | Maxed traits / 9 | All maxed | First round | HOF |\n|---|---:|---:|---|---:|---:|---:|---:|---:|---:|\n${cohorts.map(r=>`| ${r.cohort} | ${r.n} | ${r.meanOvr.toFixed(2)} | ${r.p10} / ${r.median} / ${r.p90} | ${percent(r.atLeast90)} | ${percent(r.atLeast95)} | ${r.meanMaxedTraits.toFixed(2)} | ${percent(r.allTraitsMaxed)} | ${percent(r.firstRound)} | ${percent(r.hof)} |`).join('\n')}\n\n## Interpretation and limits\n\nThis paired comparison isolates progression on the current 90-player catalog. The original 75-player baseline is a separate, unpaired historical cohort; do not subtract it from this report to claim a catalog effect. Source odds remain uniform. Both profiles use the same current coaching rules. Pro careers and HOF criteria are unchanged, so downstream rates reflect changed college ability. A junior season still increases ability; no artificial injury, forced declaration, lost potential or playable pro-development system was added.\n\nThe v1.2 profile moves mastery bands relative to each ceiling; a ceiling of 99 retains the original bands and mathematical 99 witness. It reduces routine ceiling completion, not the underlying elite-heavy source pool or optimal-selection advantage. Those need the separately planned long-term pool and potential-selection review. No claim that the 15 added sources solve that issue.\n\n## Recruiting\n\n75% weighted potential plus 25% weighted initial ability. Fixed bands are implementation defaults.\n\n| Mode / creation | n | Mean score | P10 / median / P90 | 1 / 2 / 3 / 4 / 5 stars |\n|---|---:|---:|---|---|\n${recruiting.map(r=>`| ${r.mode} / ${r.choice} | ${r.n} | ${r.mean.toFixed(2)} | ${r.p10} / ${r.median} / ${r.p90} | ${Object.values(r.stars).join(' / ')} |`).join('\n')}\n\n## Source audit\n\n${sourceAudit.players} original illustrative profiles; grades are game interpretations, not official player ratings. Aggregate grade counts: ${Object.entries(sourceAudit.grades).map(([g,n])=>g+': '+n).join(', ')}.\n\n| Attribute | S sources | Mean source ceiling |\n|---|---:|---:|\n${sourceAudit.attributes.map(a=>`| ${a.attribute} | ${a.sourcesWithS} | ${a.meanCeiling.toFixed(2)} |`).join('\n')}\n\nCeiling/regression violations: ${violations}. Full JSON includes school and training-policy breakdowns, 80+/85+ thresholds, ceiling OVR and NFL yardage.\n`);
console.log(JSON.stringify({createdProspects:report.createdProspects,violations,recruiting,cohorts},null,2));
if(violations)process.exitCode=1;
