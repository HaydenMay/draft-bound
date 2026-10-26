import {writeFileSync,mkdirSync} from 'node:fs';
import {createRun,transition} from '../src/app/domain/engine';
import {calculateOvr} from '../src/app/domain/development';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {LEGACY_COLLEGES as COLLEGES} from '../src/app/data/colleges';
import {GameCommandPayload,RunState,TrainingPlan} from '../src/app/domain/models';
import {SOURCE_PLAYERS} from '../src/app/data/source-players';
const count=Number(process.env['BALANCE_COUNT']??10000),policies=['balanced','speed-focus','weakest-intensive','adaptive'] as const;
function command(run:RunState,p:GameCommandPayload):RunState{return transition(run,{...p,id:`balance-${run.processedCommands.length}`}).run;}
function plan(run:RunState,policy:typeof policies[number]):TrainingPlan{
 if(policy==='balanced')return {mode:'balanced'};
 if(policy==='speed-focus')return {mode:'focused',attributeId:'speed'};
 const a=WR_DEFINITION.attributes.filter(a=>run.prospect!.traits[a.id].ceiling>run.prospect!.current[a.id]).sort((a,b)=>{
  if(policy==='weakest-intensive')return run.prospect!.current[a.id]-run.prospect!.current[b.id];
  return (run.prospect!.traits[b.id].ceiling-run.prospect!.current[b.id])*b.weight-(run.prospect!.traits[a.id].ceiling-run.prospect!.current[a.id])*a.weight;
 })[0];return a?{mode:'intensive',attributeId:a.id}:{mode:'balanced'};
}
const cohorts:Record<string,{n:number;ovr:number[];gains:number[];first:number;undrafted:number;ceiling:number;}>={};
const sampling=Object.fromEntries(SOURCE_PLAYERS.map(p=>[p.id,0]));let best=0,ceilingViolations=0,generalZeroRouteViolations=0;const ceilings99:number[]=[];
const started=Date.now();
for(let i=0;i<count;i++){
 const policy=policies[i%4],college=COLLEGES[Math.floor(i/4)%3],years=i%5===0?2:3;
 let run=createRun('Balance Prospect',11,(0x94f1+i*2654435761)>>>0,'2026-01-01T00:00:00.000Z');delete run.collegeSystemVersion;
 sampling[run.creation.sizeOfferId]++;run=command(run,{type:'choose-gift',index:i%3});run=command(run,{type:'accept-size'});
 for(let n=0;n<3;n++){for(const offer of run.creation.playerOffers)sampling[offer]++;const attributeId=WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id;run=command(run,{type:'choose-trait',sourcePlayerId:run.creation.playerOffers[n%3],attributeId});}
 run=command(run,{type:'continue'});run=command(run,{type:'choose-college',collegeId:college.id});
 const weightedCeiling=calculateOvr(Object.fromEntries(Object.entries(run.prospect!.traits).map(([id,t])=>[id,t.ceiling]))).raw;ceilings99.push(weightedCeiling);
 for(let y=1;y<=years;y++){
  for(let block=0;block<3;block++){run=command(run,{type:'train',plan:plan(run,policy)});run=command(run,{type:'continue'});}
  if(y===years){run=command(run,y===2?{type:'declare'}:{type:'continue'});break;}
  run=command(run,y===2?{type:'return'}:{type:'continue'});run=command(run,{type:'transfer',collegeId:college.id});
 }
 const result=transition(run,{type:'scout',id:'draft'}),d=result.entry!.draft;
 for(const a of WR_DEFINITION.attributes)if(d.prospect.current[a.id]>d.prospect.traits[a.id].ceiling+1e-9||d.prospect.current[a.id]<d.prospect.initial[a.id])ceilingViolations++;
 for(const g of d.history)if(g.stats.routes===0&&Object.values(g.generalGains).some(v=>v!==0))generalZeroRouteViolations++;
 const key=`${college.shortName} / ${policy} / ${years} years`,row=cohorts[key]??={n:0,ovr:[],gains:[],first:0,undrafted:0,ceiling:0};row.n++;row.ovr.push(d.finalOvr);row.gains.push(d.finalOvr-d.prospect.initialOvr);row.ceiling+=weightedCeiling;
 if(d.outcome.status==='undrafted')row.undrafted++;else if(d.outcome.overallPick<=32)row.first++;best=Math.max(best,d.finalOvr);
 if((i+1)%1000===0)process.stdout.write(`${i+1}/${count}\n`);
}
const mean=(xs:number[])=>xs.reduce((a,b)=>a+b,0)/xs.length,percentile=(xs:number[],q:number)=>[...xs].sort((a,b)=>a-b)[Math.min(xs.length-1,Math.floor(q*xs.length))];
const allOvr=Object.values(cohorts).flatMap(r=>r.ovr),allGrowth=Object.values(cohorts).flatMap(r=>r.gains);
const overall={meanStartingOvr:mean(allOvr)-mean(allGrowth),meanFinalOvr:mean(allOvr),meanGrowth:mean(allGrowth),median:percentile(allOvr,.5),p10:percentile(allOvr,.1),p90:percentile(allOvr,.9),min:Math.min(...allOvr),max:best,firstRoundCount:Object.values(cohorts).reduce((s,r)=>s+r.first,0),undraftedCount:Object.values(cohorts).reduce((s,r)=>s+r.undrafted,0)};
const summary={count,overall,seedSchedule:'(0x94f1 + i * 2654435761) unsigned32',durationSeconds:(Date.now()-started)/1000,best,eligible99Ceiling:ceilings99.filter(c=>c>=98.5).length,ceilingViolations,generalZeroRouteViolations,sourceDraws:sampling,cohorts:Object.entries(cohorts).map(([cohort,r])=>({cohort,n:r.n,meanOvr:mean(r.ovr),p10:percentile(r.ovr,.1),median:percentile(r.ovr,.5),p90:percentile(r.ovr,.9),meanGrowth:mean(r.gains),meanCeiling:r.ceiling/r.n,firstRoundRate:r.first/r.n,undraftedRate:r.undrafted/r.n}))};
mkdirSync('docs/validation',{recursive:true});writeFileSync('docs/validation/balance-report.json',JSON.stringify(summary,null,2));
const rows=summary.cohorts.map(r=>`| ${r.cohort} | ${r.n} | ${r.meanOvr.toFixed(2)} | ${r.p10} / ${r.median} / ${r.p90} | ${r.meanGrowth.toFixed(2)} | ${(r.firstRoundRate*100).toFixed(1)}% | ${(r.undraftedRate*100).toFixed(1)}% |`).join('\n');
writeFileSync('docs/validation/BALANCE_REPORT.md',`# Seeded balance report\n\n${count.toLocaleString()} unique prospects, four policies, three schools, sophomore and junior declarations. A reproducible disjoint cohort study; this is not a paired causal estimate. Normal source draws include Size and all offered manual player cards. Choices and training policy do not alter the uniform source sampler.\n\n| Cohort | n | Mean OVR | P10 / median / P90 | Mean growth | First round | Undrafted |\n|---|---:|---:|---|---:|---:|---:|\n${rows}\n\nHighest observed OVR: ${best}. Prospects with weighted ceilings allowing displayed 99: ${summary.eligible99Ceiling}. Ceiling/regression violations: ${ceilingViolations}. Zero-route general-work violations: ${generalZeroRouteViolations}.\n\n99 remains a mathematical possibility for an exceptional ceiling combination; this report does not promise it in ordinary random play. Fixed speed focus spends work at a capped skill and can trail balanced or adaptive training. School opportunity and specialty effects are deliberately retained. No coefficients were adjusted to force equal outcomes. Read the JSON for complete source counts, school/policy cohorts and seed schedule.\n`);
console.log(JSON.stringify({count,overall,eligible99Ceiling:summary.eligible99Ceiling,ceilingViolations,durationSeconds:summary.durationSeconds}));
