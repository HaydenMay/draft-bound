import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {calculateOvr,develop,integrateGrowth,values} from '../src/app/domain/development';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {COLLEGES} from '../src/app/data/colleges';
const report=JSON.parse(readFileSync('docs/validation/V1_4_3_TRAINING_EXPERIMENTS.json','utf8'));
const plans=[['focused','bodyControl'],['focused','acceleration'],['focused','yardsAfterCatch'],['focused','release'],['focused','vertical'],['focused','awareness'],['intensive','hands'],['intensive','speed'],['focused','release']] as const;
const witnesses=report.variants.map((v:any)=>{
 let current=values(id=>id==='routeRunning'?94:65+v.uplift);
 plans.forEach(([mode,attributeId],block)=>{for(let i=0;i<4;i++){
  const ref=develop(current,values(()=>99),{mode,attributeId},Math.floor(block/3)+1,COLLEGES[2],36,{},'v1.2');
  current=values(id=>integrateGrowth(current[id],v.years[Math.floor(block/3)]*1.05*(ref.practiceWork[id]*(v.practice/7.2)+ref.generalWork[id]*(v.experience/3.6)),99,'v1.2'));
 }});
 return {variant:v.id,rawOvr:calculateOvr(current).raw,displayedOvr:calculateOvr(current).display};
});
const bounds=report.variants.map((v:any)=>{
 const budget=12*v.years.reduce((s:number,x:number)=>s+x,0)*(v.practice+v.experience*1.2);
 const trials=WR_DEFINITION.attributes.map(gift=>{
  const current=values(id=>id===gift.id?94:65+v.uplift);let remaining=budget;
  while(remaining>1e-9){
   const choices=WR_DEFINITION.attributes.filter(a=>current[a.id]<99-1e-9).map(a=>{
    const [limit,factor]=[[70,1],[85,.8],[95,.5],[99,.25]].find(([limit])=>current[a.id]<limit-1e-9)!;
    const coach=Math.max(...COLLEGES.map(c=>c.specialties.includes(a.id)?c.coaching:1));
    return {a,limit,factor,coach,efficiency:a.weight*factor*coach};
   }).sort((a,b)=>b.efficiency-a.efficiency);
   if(!choices.length)break;const c=choices[0],work=Math.min(remaining,(c.limit-current[c.a.id])/(c.factor*c.coach));
   current[c.a.id]+=work*c.factor*c.coach;remaining-=work;
  }
  return {gift:gift.id,ovr:calculateOvr(current).raw};
 });
 return {variant:v.id,optimisticRawWorkBudget:budget,maxRawOvr:Math.max(...trials.map((x:any)=>x.ovr)),maxDisplayedOvr:Math.round(Math.max(...trials.map((x:any)=>x.ovr)))};
});
assert(Math.abs(witnesses[0].rawOvr-98.763418)<1e-5);
for(const witness of witnesses)assert(bounds.find((bound:any)=>bound.variant===witness.variant).maxRawOvr>=witness.rawOvr-1e-8);
const result={status:'Optimistic upper bound, not a playable witness.',assumptions:'All S99 ceilings, best possible nongift initial65 plus proposal uplift, Natural Gift94, maximum experience budget everygame, freely redistributable work across all attributes, each attribute always receives its best available college coaching without transfer cost. Real four-game allocations cannot outperform this relaxed allocation model.',witnesses,bounds};
writeFileSync('docs/validation/V1_4_3_TRAINING_ATTAINABILITY.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
