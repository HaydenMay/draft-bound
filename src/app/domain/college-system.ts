import {COLLEGES,LEGACY_COLLEGES} from '../data/colleges';
import {CollegeProgram,Prospect,RunState} from './models';
import {calculateOvr,values} from './development';
import {recruitRating} from './recruiting';

export const schoolTarget=(stars:number)=>[75,80,85,90,99][stars-1]??0;
export function schoolCeiling(prospect:Prospect,school:CollegeProgram|undefined,id:string):number {
 return Math.max(prospect.traits[id].ceiling,school?.specialties.includes(id)?schoolTarget(school.prestige??1):0);
}
/** An active school offers growth; already earned ability is never removed. */
export function trainingCeilings(run:RunState){
 const p=run.prospect!,school=run.collegeSystemVersion==='v1.4.5'?COLLEGES.find(c=>c.id===run.collegeId):undefined;
 return values(id=>Math.max(p.current[id],schoolCeiling(p,school,id)));
}
/** Historical upper bounds for import validation, independent of user-supplied current ability. */
export function attendedCeilings(prospect:Prospect,schoolIds:readonly string[]){
 return values(id=>Math.max(prospect.traits[id].ceiling,...schoolIds.map(s=>schoolCeiling(prospect,COLLEGES.find(c=>c.id===s),id))));
}
export function recruitingAssessment(run:RunState){
 const base=recruitRating(run.prospect!);
 if(!run.years.length)return {...base,kind:'Recruiting' as const};
 const latest=run.years.at(-1)!;
 const score=.65*calculateOvr(run.prospect!.current).raw+.25*latest.stats.grade+.10*base.potentialOvr+(run.awards.some(a=>a.season===latest.year&&a.type==='all_american')?2:0);
 return {score,stars:score>=85?5:score>=81?4:score>=77?3:score>=73?2:1,kind:'Transfer' as const};
}
function rank(seed:number,id:string){let n=seed>>>0;for(const c of id)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;return n;}
export function collegeOffers(run:RunState):CollegeProgram[]{
 if(run.collegeSystemVersion!=='v1.4.5')return LEGACY_COLLEGES;
 const {stars}=recruitingAssessment(run),eligible=COLLEGES.filter(c=>(c.prestige??1)<=stars);
 const ordered=eligible.sort((a,b)=>(b.prestige??1)-(a.prestige??1)||rank(run.seed+run.years.length,a.id)-rank(run.seed+run.years.length,b.id));
 const current=COLLEGES.find(c=>c.id===run.collegeId),safety=ordered.find(c=>c.prestige===1)!;
 const selected=[...(current?[current]:[]),...(current?.id===safety.id?[]:[safety])];
 for(const school of ordered)if(!selected.some(c=>c.id===school.id)&&selected.length<6)selected.push(school);
 return selected.sort((a,b)=>(b.prestige??1)-(a.prestige??1)||a.name.localeCompare(b.name));
}
