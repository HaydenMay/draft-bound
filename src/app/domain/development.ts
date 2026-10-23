import {AttributeValues, Grade, TrainingPlan} from './models';
import {WR_DEFINITION} from './positions';
import {clamp} from './rng';
export const CEILINGS:Record<Grade,number>={S:99,'A+':96,A:93,'A-':90,'B+':87,B:84,'B-':81,'C+':78,C:75,'C-':72,'D+':69,D:66,'D-':63,F:60};
export const values=(fn:(id:string)=>number):AttributeValues=>Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,fn(a.id)]));
export function calculateOvr(current:AttributeValues,weights=WR_DEFINITION.attributes):{raw:number;display:number}{
 const raw=weights.reduce((sum,a)=>sum+(current[a.id]??0)*a.weight,0); const stable=Math.round(raw*1e10)/1e10; return {raw:stable,display:Math.round(stable)};
}
export function integrateGrowth(current:number,work:number,ceiling:number):number {
 let result=current, remaining=Math.max(0,work);
 for(const [limit,factor] of [[70,1],[85,.8],[95,.5],[99,.25]]) {
  if(result>=limit||result>=ceiling)continue;
  const destination=Math.min(limit,ceiling),cost=(destination-result)/factor;
  if(remaining<=cost)return Math.min(ceiling,result+remaining*factor);
  result=destination;remaining-=cost;
 }
 return Math.min(ceiling,result);
}
export function practiceAllocation(plan:TrainingPlan):AttributeValues {
 return values(id=>plan.mode==='balanced'?.8:plan.mode==='focused'?(id===plan.attributeId?4.32:.36):(id===plan.attributeId?7.2:0));
}
export function develop(current:AttributeValues,ceilings:AttributeValues,plan:TrainingPlan,year:number,college:{coaching:number;specialties:string[]},routes:number,reps:AttributeValues){
 const practice=practiceAllocation(plan),relevant=values(id=>Math.max(0,reps[id]??0));
 const sum=Object.values(relevant).reduce((a,b)=>a+b,0),budget=3.6*clamp(routes/30,0,1.2);
 const general=values(id=>budget*(.5/9+.5*(sum?relevant[id]/sum:1/9)));
 const factor=[1.5,1.15,.85][year-1]??.85;
 const next=values(id=>integrateGrowth(current[id],factor*(college.specialties.includes(id)?college.coaching:1)*(general[id]+practice[id]),ceilings[id]));
 const gains=values(id=>next[id]-current[id]);
 return {current:next,gains,general:values(id=>gains[id]*(general[id]+practice[id]?general[id]/(general[id]+practice[id]):0)),practice:values(id=>gains[id]*(general[id]+practice[id]?practice[id]/(general[id]+practice[id]):0)),generalWork:general,practiceWork:practice};
}
