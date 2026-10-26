/** Planning experiments only. Imports production rules; never changes or saves application state. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {createRun,transition} from '../src/app/domain/engine';
import {calculateOvr,CEILINGS,develop,integrateGrowth,values} from '../src/app/domain/development';
import {detectIntervention} from '../src/app/domain/coaching';
import {Random} from '../src/app/domain/rng';
import {WR_RULES} from '../src/app/domain/simulation';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {COLLEGES} from '../src/app/data/colleges';
import {receiverProfile,RECEIVER_CATALOG_VERSION} from '../src/app/data/receiver-catalog';
import type {CollegeProgram,CreationMode,GameCommandPayload,Intervention,RunState,TrainingPlan} from '../src/app/domain/models';

const ids=WR_DEFINITION.attributes.map(a=>a.id);
const sortedAttributes=[...WR_DEFINITION.attributes].sort((a,b)=>b.weight-a.weight);
const n=200;
const specCalibration=process.argv.includes('--spec-calibration');
const policies=['balanced','focused_stay','intensive_stay','focused_rotate','intensive_rotate','focused_adaptive'] as const;
type Policy=typeof policies[number];
interface Variant {id:string;uplift:number;years:readonly number[];practice:number;experience:number;specialties:boolean;}
const baseline:Variant={id:'baseline',uplift:0,years:[1.5,1.15,.85],practice:7.2,experience:3.6,specialties:true};
const variants:Variant[]=specCalibration?[baseline,{id:'spec_practice8',uplift:8,years:[.85,.95,.90],practice:8,experience:3.6,specialties:true}]:[baseline,
  {id:'A_readiness_and_years',uplift:8,years:[.85,.95,.90],practice:7.2,experience:3.6,specialties:true},
  {id:'B_lower_shared_work',uplift:8,years:[.85,.95,.90],practice:5.4,experience:1.8,specialties:true},
  {id:'C_preserve_focus_reduce_experience',uplift:8,years:[.85,.95,.90],practice:7.2,experience:1.2,specialties:true}];
const controls:Variant[]=specCalibration?[]:[
  {...baseline,id:'control_no_specialty',specialties:false},
  {...baseline,id:'control_no_intervention'},
  {...baseline,id:'control_no_experience',experience:0},
  {...baseline,id:'control_no_practice',practice:0},
  {...baseline,id:'control_neutral_years',years:[1,1,1]}];
const round=(x:number)=>Math.round(x*1000)/1000;
const mean=(xs:number[])=>xs.reduce((a,b)=>a+b,0)/xs.length;
function dist(xs:number[]){
  const a=[...xs].sort((x,y)=>x-y),q=(p:number)=>a[Math.floor((a.length-1)*p)];
  return {n:a.length,min:round(a[0]),p10:round(q(.1)),p50:round(q(.5)),p90:round(q(.9)),p95:round(q(.95)),max:round(a.at(-1)!),mean:round(mean(a))};
}
const step=(run:RunState,command:GameCommandPayload)=>transition(run,{...command,id:`training-audit-${run.processedCommands.length}`}).run;
function build(seed:number,mode:CreationMode):RunState{
  let run=createRun('Synthetic training audit',11,seed,'2026-10-25T00:00:00.000Z',mode);
  run.balanceVersion='v1.2'; // Freeze pre-implementation initialization for historical experiments.
  const gift=run.creation.giftOffers.map((g,index)=>({index,weight:WR_DEFINITION.attributes.find(a=>a.id===g.attributeId)!.weight})).sort((a,b)=>b.weight-a.weight)[0];
  run=step(run,{type:'choose-gift',index:gift.index});run=step(run,{type:'accept-size'});
  while(run.phase==='potential'){
    const profile=receiverProfile(run.creation.currentRoll!.receiverId)!;
    const attr=WR_DEFINITION.attributes.filter(a=>!run.creation.traits[a.id]).sort((a,b)=>CEILINGS[profile.grades[b.id as keyof typeof profile.grades]]*b.weight-CEILINGS[profile.grades[a.id as keyof typeof profile.grades]]*a.weight)[0];
    run=step(run,{type:'choose-trait',sourcePlayerId:profile.id,attributeId:attr.id});
  }
  return step(run,{type:'continue'});
}
function requestedPlan(run:RunState,policy:Policy,block:number):TrainingPlan{
  if(policy==='balanced')return {mode:'balanced'};
  const available=sortedAttributes.filter(a=>run.prospect!.traits[a.id].origin!=='gift');
  const target=policy.endsWith('rotate')?available[block%available.length].id:
    policy.endsWith('adaptive')?[...available].sort((a,b)=>(run.prospect!.traits[b.id].ceiling-run.prospect!.current[b.id])*b.weight-(run.prospect!.traits[a.id].ceiling-run.prospect!.current[a.id])*a.weight)[0].id:available[0].id;
  return {mode:policy.startsWith('intensive')?'intensive':'focused',attributeId:target};
}
interface Point {ovr:number;potential:number;gap:number;withinOne:number;nonGiftWithinOne:number;atCap:number;nonGiftAtCap:number;primaryGain:number;otherGain:number;interventions:number;meanYards:number;meanTD:number;perfectGamePct:number;}
function point(run:RunState):Point{
  const p=run.prospect!,nongift=ids.filter(id=>p.traits[id].origin!=='gift');
  const target=sortedAttributes.find(a=>nongift.includes(a.id))!.id,others=nongift.filter(id=>id!==target);
  const gaps=ids.map(id=>p.traits[id].ceiling-p.current[id]);
  return {ovr:calculateOvr(p.current).raw,potential:calculateOvr(values(id=>p.traits[id].ceiling)).raw,gap:mean(gaps),
    withinOne:gaps.filter(g=>g<=1).length/9*100,nonGiftWithinOne:nongift.filter(id=>p.traits[id].ceiling-p.current[id]<=1).length/8*100,
    atCap:gaps.filter(g=>g<=1e-8).length/9*100,nonGiftAtCap:nongift.filter(id=>p.traits[id].ceiling-p.current[id]<=1e-8).length/8*100,
    primaryGain:p.current[target]-p.initial[target],otherGain:mean(others.map(id=>p.current[id]-p.initial[id])),interventions:run.interventions.length,
    meanYards:run.history.length?mean(run.history.map(g=>g.stats.yards)):0,meanTD:run.history.length?mean(run.history.map(g=>g.stats.touchdowns)):0,
    perfectGamePct:run.history.length?run.history.filter(g=>g.stats.grade===100).length/run.history.length*100:0};
}
function summarize(points:Point[]){
  return {ovr:dist(points.map(p=>p.ovr)),weightedPotential:dist(points.map(p=>p.potential)),meanAttributeGap:dist(points.map(p=>p.gap)),
    attributeShareWithinOnePct:round(mean(points.map(p=>p.withinOne))),nonGiftAttributeShareWithinOnePct:round(mean(points.map(p=>p.nonGiftWithinOne))),
    attributeShareAtCeilingPct:round(mean(points.map(p=>p.atCap))),nonGiftAttributeShareAtCeilingPct:round(mean(points.map(p=>p.nonGiftAtCap))),
    prospectsAt90Pct:round(points.filter(p=>Math.round(p.ovr)>=90).length/points.length*100),prospectsAt95Pct:round(points.filter(p=>Math.round(p.ovr)>=95).length/points.length*100),
    primaryGain:dist(points.map(p=>p.primaryGain)),otherNonGiftMeanGain:dist(points.map(p=>p.otherGain)),meanInterventions:round(mean(points.map(p=>p.interventions))),
    meanGameYards:round(mean(points.map(p=>p.meanYards))),meanGameTD:round(mean(points.map(p=>p.meanTD))),meanPerfectGamePct:round(mean(points.map(p=>p.perfectGamePct)))};
}
function simulate(base:RunState,school:CollegeProgram,policy:Policy,variant:Variant,interventions=true,schoolPath:readonly CollegeProgram[]=[school,school,school]){
  const run=step(structuredClone(base),{type:'choose-college',collegeId:school.id}),p=run.prospect!;
  if(variant.uplift){p.current=values(id=>p.traits[id].origin==='gift'?94:Math.min(p.traits[id].ceiling,p.current[id]+variant.uplift));p.initial={...p.current};p.initialOvr=calculateOvr(p.current).display;}
  const rng=new Random(run.rng),points:Point[]=[point(run)];
  for(let year=1;year<=3;year++){
    const activeSchool=schoolPath[year-1];run.collegeId=activeSchool.id;
    run.year=year;run.gameNumber=0;run.usedInterventions=[];run.pendingIntervention=null;
    for(let block=0;block<3;block++){
      const plan=requestedPlan(run,policy,(year-1)*3+block),start={...p.current},startOvr=calculateOvr(start).raw,games=[];
      const pending=run.pendingIntervention;let fulfilled:Intervention|null=null;
      if(pending){fulfilled={...pending,fulfillment:plan.mode==='intensive'&&plan.attributeId===pending.attributeId?'already_compliant':'substituted',selectedPlan:plan};run.interventions.push(fulfilled);run.pendingIntervention=null;}
      for(let gameIndex=0;gameIndex<4;gameIndex++){
        const effective:TrainingPlan=gameIndex===0&&fulfilled?{mode:'intensive',attributeId:fulfilled.attributeId}:plan;
        const game=WR_RULES.simulateGame({prospect:p,college:activeSchool,year,gameNumber:++run.gameNumber,seed:rng.int(0,0xffffffff)}),s=game.stats;
        const reps={speed:s.routes,acceleration:s.routes,hands:s.targets,routeRunning:s.routes,release:s.pressReps,vertical:s.contestedTargets,bodyControl:s.contestedTargets,yardsAfterCatch:s.receptions,awareness:s.routes};
        const ceilings=values(id=>p.traits[id].ceiling),production=develop(p.current,ceilings,effective,year,activeSchool,s.routes,reps,'v1.2');
        let growth=production;
        if(variant.id!=='baseline'&&variant.id!=='control_no_intervention'){
          const practice=values(id=>production.practiceWork[id]*variant.practice/7.2),experience=values(id=>production.generalWork[id]*variant.experience/3.6);
          const next=values(id=>integrateGrowth(p.current[id],variant.years[year-1]*(variant.specialties&&activeSchool.specialties.includes(id)?activeSchool.coaching:1)*(practice[id]+experience[id]),ceilings[id],'v1.2'));
          const gains=values(id=>next[id]-p.current[id]);
          growth={...production,current:next,gains,general:values(id=>gains[id]*(practice[id]+experience[id]?experience[id]/(practice[id]+experience[id]):0)),practice:values(id=>gains[id]*(practice[id]+experience[id]?practice[id]/(practice[id]+experience[id]):0))};
        }
        for(const id of ids){assert(growth.current[id]>=p.current[id]-1e-9);assert(growth.current[id]<=ceilings[id]+1e-9);}
        p.current=growth.current;const record={...game,gains:growth.gains,generalGains:growth.general,practiceGains:growth.practice};games.push(record);run.history.push(record);
      }
      run.lastBlock={year,block:block+1,games,gains:values(id=>p.current[id]-start[id]),startOvr,endOvr:calculateOvr(p.current).raw,intervention:null,fulfilled,training:plan};
      const next=interventions?detectIntervention(run):null;run.lastBlock.intervention=next;run.pendingIntervention=next;if(next)run.usedInterventions.push(next.type);
      points.push(point(run));
    }
  }
  run.rng=rng.state;
  return {run,points};
}

// Guard the experimental harness against accidentally changing baseline chronology or coaching.
let parityCases=0;
for(const mode of ['quick','full'] as const)for(const school of [COLLEGES[0],COLLEGES[2]])for(const policy of policies){
  const base=build(600001,mode),audit=simulate(base,school,policy,baseline);let real=step(base,{type:'choose-college',collegeId:school.id});
  for(let year=1;year<=3;year++){
    for(let block=0;block<3;block++){real=step(real,{type:'train',plan:requestedPlan(real,policy,(year-1)*3+block)});real=step(real,{type:'continue'});}
    if(year<3){real=step(real,{type:year===2?'return':'continue'});real=step(real,{type:'transfer',collegeId:school.id});}
  }
  assert.deepEqual(audit.run.prospect,real.prospect);assert.deepEqual(audit.run.history,real.history);assert.deepEqual(audit.run.interventions,real.interventions);assert.equal(audit.run.rng,real.rng);parityCases++;
}
const groups:any[]=[];const controlsReport:any[]=[];const starting:any[]=[];
for(const mode of ['quick','full'] as const){
  const bases=Array.from({length:n},(_,i)=>build(700001+i,mode));
  const potentials=bases.map(b=>point(b).potential).sort((a,b)=>a-b),low=potentials[Math.floor(n*.2)-1],high=potentials[Math.floor(n*.8)];
  const stratum=(base:RunState)=>point(base).potential<=low?'low_potential':point(base).potential>=high?'exceptional_potential':'typical_potential';
  starting.push({mode,n,startingAbility:summarize(bases.map(point)),potentialStrataCutoffs:{lowAtMost:low,exceptionalAtLeast:high},strata:['low_potential','typical_potential','exceptional_potential'].map(name=>({name,...summarize(bases.filter(b=>stratum(b)===name).map(point))}))});
  for(const variant of variants)for(const school of COLLEGES)for(const policy of policies)for(const interventions of [false,true]){
    const results=bases.map(base=>simulate(base,school,policy,variant,interventions));
    groups.push({variant:variant.id,mode,school:school.id,policy,interventions,n,
      checkpoints:Array.from({length:10},(_,i)=>({label:i===0?'initial':`year${Math.ceil(i/3)}_block${(i-1)%3+1}`,...summarize(results.map(r=>r.points[i]))})),
      juniorByPotentialStratum:['low_potential','typical_potential','exceptional_potential'].map(name=>({name,...summarize(results.filter((_,i)=>stratum(bases[i])===name).map(r=>r.points[9]))}))});
  }
  for(const variant of controls)for(const school of COLLEGES){
    const results=bases.map(base=>simulate(base,school,'balanced',variant,variant.id!=='control_no_intervention'));
    controlsReport.push({variant:variant.id,mode,school:school.id,policy:'balanced',interventions:variant.id!=='control_no_intervention',n,
      checkpoints:[0,3,6,9].map(i=>({label:i===0?'initial':`year${i/3}_end`,...summarize(results.map(result=>result.points[i]))}))});
  }
  console.log(`Completed ${mode} grid.`);
}
// Isolate the practice-mode cost on identical game reps, without coaching or changing route opportunities.
const allocationProbe=(['balanced','focused','intensive'] as const).map(mode=>{
  const result=develop(values(()=>60),values(()=>99),mode==='balanced'?{mode}:{mode,attributeId:'routeRunning'},1,{coaching:1,specialties:[]},30,values(()=>1),'v1.2');
  return {mode,current:60,ceiling:99,routes:30,eachAttributeReps:1,year:1,specialties:[],practiceWork:result.practiceWork,generalWork:result.generalWork,gains:result.gains};
});
// Absolute synthetic ceilings complement the relatively narrow low/high quintiles of real builds.
// These sources are fictional audit IDs and are never written into game saves or the receiver catalog.
const synthetic:any[]=[];
for(const level of [{name:'low',grade:'C-' as const,ceiling:72},{name:'typical',grade:'B+' as const,ceiling:87},{name:'exceptional',grade:'S' as const,ceiling:99}]){
  const bases=Array.from({length:n},(_,i)=>{
    const run=build(900001+i,'full'),p=run.prospect!,rng=new Random(900001+i);
    for(const id of ids){const gift=id==='routeRunning';p.traits[id]={attributeId:id,sourcePlayerId:`synthetic-${level.name}-${id}`,grade:gift?'S':level.grade,ceiling:gift?99:level.ceiling,origin:gift?'gift':'manual'};}
    p.current=values(id=>id==='routeRunning'?94:rng.int(50,65));p.initial={...p.current};p.initialOvr=calculateOvr(p.current).display;p.physical.heightCm=185;p.physical.weightKg=90;run.creation.traits=structuredClone(p.traits);return run;
  });
  for(const variant of variants)for(const policy of ['balanced','focused_adaptive'] as const){
    const results=bases.map(base=>simulate(base,COLLEGES[2],policy,variant,true));
    synthetic.push({level:level.name,n,nonGiftCeiling:level.ceiling,giftCeiling:99,school:'opportunity',policy,variant:variant.id,
      checkpoints:[0,3,6,9].map(i=>({label:i===0?'initial':`year${i/3}_end`,...summarize(results.map(result=>result.points[i]))}))});
  }
}
const heldOut:any[]=[];
for(const mode of ['quick','full'] as const){
  const bases=Array.from({length:n},(_,i)=>build(800001+i,mode));
  for(const variant of [baseline,variants.at(-1)!])for(const school of COLLEGES)for(const policy of ['balanced','focused_adaptive'] as const){
    const results=bases.map(base=>simulate(base,school,policy,variant,true));
    heldOut.push({mode,n,variant:variant.id,school:school.id,policy,checkpoints:[0,3,6,9].map(i=>({label:i===0?'initial':`year${i/3}_end`,...summarize(results.map(result=>result.points[i]))}))});
  }
}
const continuityEfficiencies=(path:readonly CollegeProgram[])=>{
  const first=path[0].id!==path[1].id,second=path[1].id!==path[2].id;
  return [1,first?.85:.95,second?(first?.65:.75):(first?.80:.90)];
};
const continuity:any[]=[];
if(specCalibration)for(const mode of ['quick','full'] as const){
  const bases=Array.from({length:n},(_,i)=>build(800001+i,mode));
  for(const a of COLLEGES)for(const b of COLLEGES)for(const c of COLLEGES)for(const policy of ['balanced','focused_adaptive'] as const){
    const path=[a,b,c],efficiency=continuityEfficiencies(path),variant={...variants[1],years:efficiency.map((x,i)=>x*[.85,1,1][i])};
    const results=bases.map(base=>simulate(base,a,policy,variant,true,path));
    continuity.push({mode,n,policy,path:path.map(s=>s.id),efficiency,netYears:variant.years,checkpoints:[0,3,6,9].map(i=>({label:i===0?'initial':`year${i/3}_end`,...summarize(results.map(result=>result.points[i]))}))});
  }
}
assert.deepEqual(continuityEfficiencies([COLLEGES[0],COLLEGES[0],COLLEGES[0]]),[1,.95,.90]);
assert.deepEqual(continuityEfficiencies([COLLEGES[0],COLLEGES[1],COLLEGES[1]]),[1,.85,.80]);
assert.deepEqual(continuityEfficiencies([COLLEGES[0],COLLEGES[0],COLLEGES[1]]),[1,.95,.75]);
assert.deepEqual(continuityEfficiencies([COLLEGES[0],COLLEGES[1],COLLEGES[2]]),[1,.85,.65]);
assert.deepEqual(continuityEfficiencies([COLLEGES[0],COLLEGES[1],COLLEGES[0]]),[1,.85,.65]);
const report={status:'PLANNING EXPERIMENTS — NOT APPROVED BALANCE CONSTANTS',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),catalogVersion:RECEIVER_CATALOG_VERSION,
  sourceHashes:Object.fromEntries(['engine','development','coaching','simulation'].map(name=>[name,createHash('sha256').update(readFileSync(`src/app/domain/${name}.ts`)).digest('hex')])),
  method:{parityCases,distinctBuilds:n*2,buildSeeds:[700001,700000+n],modes:['quick','full'],cohortPolicy:'Highest-weight offered gift; at each manual pick maximize offered ceiling times attribute weight; no rerolls. Identical original prospects, initial RNG and per-game seed stream paired across schools, policies and variants.',
    strategies:'Stay focuses highest-weight non-gift trait; rotate cycles all eight non-gift traits by descending OVR weight; adaptive picks largest weighted unrealized gap per block. Decisions cover four-game blocks. Interventions ON means automatic one-game substitution, not clicking Use coach’s focus.',
    potential:'Weighted mean of stored trait ceilings, not current ability. Low/excellent strata are within-mode bottom/top quintile cutoffs, not athlete labels. Ties can enlarge strata.',
    experimentalInitial:specCalibration?'Proposed new spec adds eight to each non-gift starting attribute, clipped at its own ceiling (paired58–73 draws); Natural Gift94. Practice8, experience3.6. Base yearly factors[.85,1,1] multiply annual school-history efficiency exactly once. Staying gives[.85,.95,.90]. No source/ceiling changes.':'All A/B/C add eight to each non-gift starting attribute, clipped at its own ceiling (equivalent paired 58–73 integer draws); Natural Gift remains94. No source/ceiling changes. No 100/95/90 modifier included.',
    limitations:specCalibration?'Controlled planning experiments, not telemetry or real-football calibration. Same200 builds per mode reused across conditions. Proposed annual continuity tested over all27school paths; no training-focus switching penalty, recruiting or new school ceilings. Current game simulator and known scoring defects retained. No upper-tail frequency guarantee.':'Controlled deterministic model experiments, not telemetry or a real-football calibration. Same200 builds per mode reused across conditions; condition totals are not independent samples. No continuity coefficients, recruiting or new school ceiling system. Current game simulator including known scoring defects is retained; production-stat outputs do not demonstrate realism. Upper-tail estimates in small strata are uncertain.'},
  additionalCohorts:{syntheticSeeds:[900001,900200],syntheticProfiles:'Fictional low72 / typical87 / exceptional99 non-gift ceilings; fixed route-running Natural Gift starts94 with ceiling99; all other initial abilities50..65. Neutral185cm/90kg physical profile. These are not changed grades for real receivers.',heldOutBuildSeeds:[800001,800200],heldOutUse:specCalibration?'Independent seeds for baseline and proposed practice8 refinement, same production creation policy; conditions reuse each build.':'Independent seeds for baseline and candidate C after the initial three-way comparison; same production creation policy. Repeated conditions reuse each build.'},
  variants,controls,starting,groups,controlsReport,allocationProbe,synthetic,heldOut,
  ...(specCalibration?{continuity,calibrationNote:'PROPOSED specification refinement only: practice8 replaces7.2 with allocation fractions unchanged. Base learning [.85,1,1] multiplied once by annual school-history efficiency. Staying yields [.85,.95,.90]. Training-focus switching penalty remains outside scope. Held-out candidate here is spec_practice8, not old candidate C.'}:{})};
const outputStem=specCalibration?'V1_4_3_TRAINING_SPEC_CALIBRATION':'V1_4_3_TRAINING_EXPERIMENTS';
writeFileSync(`docs/validation/${outputStem}.json`,JSON.stringify(report,null,2)+'\n');
const main=groups.filter(g=>g.school==='opportunity'&&g.policy==='balanced'&&g.interventions);
writeFileSync(`docs/validation/${specCalibration?'V1_4_3_TRAINING_SPEC_TABLES':'V1_4_3_TRAINING_TABLES'}.md`,`# Training diagnostic tables\n\nPlanning experiments only, source ${report.sourceCommit}, catalog ${report.catalogVersion}. ${parityCases} baseline cases matched production prospect ratings, complete game histories/gains, interventions and final RNG exactly. ${n} shared seeded builds per mode; these are not independent across conditions. Full matrix, quantiles and controls: [JSON](${outputStem}.json).\n\n## Openwater / Balanced / automatic interventions\n\n| Mode | Variant | Initial OVR mean | Freshman | Sophomore | Junior (p10–p90) | Junior displayed90+ | Junior non-gift within1 of ceiling |\n|---|---|---:|---:|---:|---|---:|---:|\n${main.map(g=>{const c=g.checkpoints;return `| ${g.mode} | ${g.variant} | ${c[0].ovr.mean} | ${c[3].ovr.mean} | ${c[6].ovr.mean} | ${c[9].ovr.mean} (${c[9].ovr.p10}–${c[9].ovr.p90}) | ${c[9].prospectsAt90Pct}% | ${c[9].nonGiftAttributeShareWithinOnePct}% |`;}).join('\n')}\n\n## Baseline schools and strategies — automatic interventions\n\n| Mode | School | Strategy | Freshman OVR | Junior OVR | Junior non-gift within1 | Primary gain | Other non-gift mean gain |\n|---|---|---|---:|---:|---:|---:|---:|\n${groups.filter(g=>g.variant==='baseline'&&g.interventions).map(g=>{const c=g.checkpoints;return `| ${g.mode} | ${g.school} | ${g.policy} | ${c[3].ovr.mean} | ${c[9].ovr.mean} | ${c[9].nonGiftAttributeShareWithinOnePct}% | ${c[9].primaryGain.mean} | ${c[9].otherNonGiftMeanGain.mean} |`;}).join('\n')}\n\nPractice/experience numbers in each variant are work inputs per game, not rating points. No production constants or player saves were changed. ${specCalibration?'Annual school continuity is a proposed rule in this calibration, pending numerical specification approval.':'No continuity rule has been inferred.'}\n`);
console.log(JSON.stringify({parityCases,distinctBuilds:n*2,main:main.map(g=>({mode:g.mode,variant:g.variant,ovr:g.checkpoints.filter((_:unknown,i:number)=>i%3===0).map((c:any)=>c.ovr.mean),junior90:g.checkpoints[9].prospectsAt90Pct,withinOne:g.checkpoints[9].nonGiftAttributeShareWithinOnePct}))}));
