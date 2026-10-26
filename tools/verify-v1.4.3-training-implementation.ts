/** Compare actual command-driven careers with the pre-implementation numerical calibration. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRun,transition} from '../src/app/domain/engine';
import {CEILINGS,calculateOvr} from '../src/app/domain/development';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {receiverProfile} from '../src/app/data/receiver-catalog';
import type {CreationMode,GameCommandPayload,RunState,TrainingPlan} from '../src/app/domain/models';

const reference=JSON.parse(readFileSync('docs/validation/V1_4_3_TRAINING_SPEC_CALIBRATION.json','utf8'));
const step=(r:RunState,c:GameCommandPayload)=>transition(r,{...c,id:`production-audit-${r.processedCommands.length}`}).run;
const attrs=[...WR_DEFINITION.attributes].sort((a,b)=>b.weight-a.weight);
function build(seed:number,mode:CreationMode){
 let r=createRun('Synthetic training audit',11,seed,'2026-10-25T00:00:00.000Z',mode);
 const gift=r.creation.giftOffers.map((g,index)=>({index,weight:attrs.find(a=>a.id===g.attributeId)!.weight})).sort((a,b)=>b.weight-a.weight)[0];
 r=step(r,{type:'choose-gift',index:gift.index});r=step(r,{type:'accept-size'});
 while(r.phase==='potential'){
  const p=receiverProfile(r.creation.currentRoll!.receiverId)!;
  const a=WR_DEFINITION.attributes.filter(a=>!r.creation.traits[a.id]).sort((a,b)=>CEILINGS[p.grades[b.id as keyof typeof p.grades]]*b.weight-CEILINGS[p.grades[a.id as keyof typeof p.grades]]*a.weight)[0];
  r=step(r,{type:'choose-trait',sourcePlayerId:p.id,attributeId:a.id});
 }
 return step(r,{type:'continue'});
}
function plan(r:RunState,policy:string,block:number):TrainingPlan{
 if(policy==='balanced')return {mode:'balanced'};
 const available=attrs.filter(a=>r.prospect!.traits[a.id].origin!=='gift');
 const target=policy.endsWith('rotate')?available[block%available.length].id:policy.endsWith('adaptive')?[...available].sort((a,b)=>(r.prospect!.traits[b.id].ceiling-r.prospect!.current[b.id])*b.weight-(r.prospect!.traits[a.id].ceiling-r.prospect!.current[a.id])*a.weight)[0].id:available[0].id;
 return {mode:policy.startsWith('intensive')?'intensive':'focused',attributeId:target};
}
const round=(n:number)=>Math.round(n*1000)/1000;
function stats(xs:number[]){const sorted=[...xs].sort((a,b)=>a-b);return {mean:round(xs.reduce((a,b)=>a+b,0)/xs.length),min:round(sorted[0]),p10:round(sorted[Math.floor((xs.length-1)*.1)]),p50:round(sorted[Math.floor((xs.length-1)*.5)]),p90:round(sorted[Math.floor((xs.length-1)*.9)]),p95:round(sorted[Math.floor((xs.length-1)*.95)]),max:round(sorted.at(-1)!)};}
const checked:any[]=[];
const cases=[...reference.groups.filter((g:any)=>g.variant==='spec_practice8'&&g.interventions).map((g:any)=>({...g,path:[g.school,g.school,g.school],seed:700001})),...reference.continuity.map((g:any)=>({...g,seed:800001}))];
for(const group of cases){
 const checkpoints:number[][]=Array.from({length:10},()=>[]);let games=0;
 for(let i=0;i<group.n;i++){
  let r=build(group.seed+i,group.mode);r=step(r,{type:'choose-college',collegeId:group.path[0]});checkpoints[0].push(calculateOvr(r.prospect!.current).raw);
  for(let year=1;year<=3;year++){
   for(let block=0;block<3;block++){
    r=step(r,{type:'train',plan:plan(r,group.policy,(year-1)*3+block)});checkpoints[(year-1)*3+block+1].push(calculateOvr(r.prospect!.current).raw);r=step(r,{type:'continue'});
   }
   if(year<3){r=step(r,year===2?{type:'return'}:{type:'continue'});r=step(r,{type:'transfer',collegeId:group.path[year]});}
  }
  games+=r.history.length;
 }
 for(const point of group.checkpoints){const index=point.label==='initial'?0:point.label.includes('_block')?(Number(point.label[4])-1)*3+Number(point.label.at(-1)):Number(point.label[4])*3;
  const actual=stats(checkpoints[index]);for(const key of Object.keys(actual) as (keyof typeof actual)[])assert.equal(actual[key],point.ovr[key],`${group.mode}/${group.path}/${group.policy}/${point.label}/${key}`);
 }
 checked.push({mode:group.mode,path:group.path,policy:group.policy,careers:group.n,games,initial:stats(checkpoints[0]),junior:stats(checkpoints[9])});
}
const report={status:'Actual production commands match pre-implementation OVR distributions',referenceSha256:createHash('sha256').update(readFileSync('docs/validation/V1_4_3_TRAINING_SPEC_CALIBRATION.json')).digest('hex'),groups:checked.length,careers:checked.reduce((s,g)=>s+g.careers,0),games:checked.reduce((s,g)=>s+g.games,0),checked};
writeFileSync('docs/validation/V1_4_3_TRAINING_IMPLEMENTATION.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,groups:report.groups,careers:report.careers,games:report.games}));
