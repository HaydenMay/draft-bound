/** Proposed-rule development witness only; not a production run or a frequency claim. */
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {calculateOvr,develop,integrateGrowth,values} from '../src/app/domain/development';
import {COLLEGES} from '../src/app/data/colleges';
import type {TrainingPlan} from '../src/app/domain/models';

const plans:TrainingPlan[]=[
  {mode:'intensive',attributeId:'speed'},
  {mode:'intensive',attributeId:'release'},
  {mode:'focused',attributeId:'vertical'},
  {mode:'intensive',attributeId:'hands'},
  {mode:'intensive',attributeId:'bodyControl'},
  {mode:'intensive',attributeId:'yardsAfterCatch'},
  {mode:'focused',attributeId:'acceleration'},
  {mode:'focused',attributeId:'vertical'},
  {mode:'focused',attributeId:'awareness'},
];
const baseYearFactors=[.85,1,1],schoolEfficiency=[1,.95,.90];
const reps={speed:42,acceleration:42,hands:18,routeRunning:42,release:18,vertical:6,bodyControl:6,yardsAfterCatch:15,awareness:42};
const initial=values(id=>id==='routeRunning'?94:73);
let current={...initial};const trajectory=[];
for(let block=0;block<9;block++){
  const year=Math.floor(block/3)+1,plan=plans[block];
  for(let game=0;game<4;game++){
    const input=develop(current,values(()=>99),plan,year,COLLEGES[2],42,reps,'v1.2');
    const next=values(id=>integrateGrowth(current[id],baseYearFactors[year-1]*schoolEfficiency[year-1]*1.05*(input.practiceWork[id]*(8/7.2)+input.generalWork[id]),99,'v1.2'));
    const implemented=develop(current,values(()=>99),plan,year,COLLEGES[2],42,reps,'v1.4.3',Array(year).fill(COLLEGES[2].id));
    for(const id of Object.keys(next))assert(Math.abs(next[id]-implemented.current[id])<1e-10,`Implemented witness differs for ${id}`);
    for(const id of Object.keys(next)){assert(next[id]>=current[id]);assert(next[id]<=99);}
    current=next;
  }
  trajectory.push({year,block:block%3+1,plan,rawOvr:calculateOvr(current).raw,current:{...current}});
}
assert(Math.abs(calculateOvr(current).raw-98.5495854545)<1e-8);
assert.equal(calculateOvr(current).display,99);
const result={status:'PROPOSED RULES — DEVELOPMENT-ONLY CONSTRUCTIVE WITNESS',
  limitations:'Conditional all-S99 potential and all maximum non-gift starting rolls. Fixed internally coherent42-route game reps. This verifies training mathematics, not a generated prospect seed, end-to-end random career, or the chance of receiving these traits/results. It must not be described as a sampled playable99 career.',
  initial,ceilings:values(()=>99),college:'opportunity',routes:42,reps,practiceBudget:8,experienceBudget:3.6,baseYearFactors,schoolEfficiency,
  netYearFactors:baseYearFactors.map((x,i)=>x*schoolEfficiency[i]),trajectory,final:calculateOvr(current)};
writeFileSync('docs/validation/V1_4_3_TRAINING_SPEC_WITNESS.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({rawOvr:result.final.raw,displayedOvr:result.final.display,limitation:'Development-only witness, not an end-to-end seeded career.'}));
