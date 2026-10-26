import {AttributeValues, BalanceVersion, Grade, TrainingPlan} from './models';
import {WR_DEFINITION} from './positions';
import {clamp} from './rng';
export const CEILINGS:Record<Grade,number>={S:99,'A+':96,A:93,'A-':90,'B+':87,B:84,'B-':81,'C+':78,C:75,'C-':72,'D+':69,D:66,'D-':63,F:60};
export const values=(fn:(id:string)=>number):AttributeValues=>Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,fn(a.id)]));
export function calculateOvr(current:AttributeValues,weights=WR_DEFINITION.attributes):{raw:number;display:number}{
 const raw=weights.reduce((sum,a)=>sum+(current[a.id]??0)*a.weight,0); const stable=Math.round(raw*1e10)/1e10; return {raw:stable,display:Math.round(stable)};
}
export function integrateGrowth(current:number,work:number,ceiling:number,balanceVersion:BalanceVersion='legacy'):number {
 let result=current, remaining=Math.max(0,work);
 // Mastery is relative to the individual's ceiling. An S ceiling retains the
 // original difficult 99 witness; lower ceilings no longer bypass its final bands.
 const shift=balanceVersion==='legacy'?0:99-ceiling;
 const late=balanceVersion==='v1.4.4'&&ceiling<99;
 for(const [limit,factor] of [[70-shift,1],[85-shift,.8],[95-shift,late?.35:.5],[99-shift,late?.125:.25]]) {
  if(result>=limit||result>=ceiling)continue;
  const destination=Math.min(limit,ceiling),cost=(destination-result)/factor;
  if(remaining<=cost)return Math.min(ceiling,result+remaining*factor);
  result=destination;remaining-=cost;
 }
 return Math.min(ceiling,result);
}
export function practiceAllocation(plan:TrainingPlan,balanceVersion:BalanceVersion='legacy'):AttributeValues {
 if((balanceVersion==='v1.4.3'||balanceVersion==='v1.4.4'))return values(id=>plan.mode==='balanced'?8/9:plan.mode==='focused'?(id===plan.attributeId?4.8:.4):(id===plan.attributeId?8:0));
 return values(id=>plan.mode==='balanced'?.8:plan.mode==='focused'?(id===plan.attributeId?4.32:.36):(id===plan.attributeId?7.2:0));
}
/** Ordered schools including the current season. Returning to A still counts as a second transfer. */
export function schoolContinuity(schools:readonly string[]):number {
 if(schools.length<2)return 1;
 const firstTransfer=schools[0]!==schools[1];
 if(schools.length===2)return firstTransfer?.85:.95;
 const secondTransfer=schools[1]!==schools[2];
 return secondTransfer?(firstTransfer?.65:.75):(firstTransfer?.80:.90);
}
export function develop(current:AttributeValues,ceilings:AttributeValues,plan:TrainingPlan,year:number,college:{coaching:number;specialties:string[]},routes:number,reps:AttributeValues,balanceVersion:BalanceVersion='legacy',schoolHistory:readonly string[]=Array(year).fill('same')){
 const practice=practiceAllocation(plan,balanceVersion),relevant=values(id=>Math.max(0,reps[id]??0));
 const sum=Object.values(relevant).reduce((a,b)=>a+b,0),budget=3.6*clamp(routes/30,0,1.2);
 const general=values(id=>budget*(.5/9+.5*(sum?relevant[id]/sum:1/9)));
 const factor=(balanceVersion==='v1.4.3'||balanceVersion==='v1.4.4')?([.85,1,1][year-1]??1)*schoolContinuity(schoolHistory):[1.5,1.15,.85][year-1]??.85;
 const next=values(id=>integrateGrowth(current[id],factor*(college.specialties.includes(id)?college.coaching:1)*(general[id]+practice[id]),ceilings[id],balanceVersion));
 const gains=values(id=>next[id]-current[id]);
 return {current:next,gains,general:values(id=>gains[id]*(general[id]+practice[id]?general[id]/(general[id]+practice[id]):0)),practice:values(id=>gains[id]*(general[id]+practice[id]?practice[id]/(general[id]+practice[id]):0)),generalWork:general,practiceWork:practice};
}
