import {trainingCeilings} from './college-system';
import {Intervention,RunState} from './models';
import {sumStats} from './simulation';

export const COACHING_TYPES=['wr.jugs','wr.press','wr.contested','wr.routes','wr.burst','wr.tracking','wr.yac','wr.film','wr.speed'] as const;

/** Rank measured performance problems by severity and developable skill need, never by RNG. */
export function detectIntervention(run:RunState):Intervention|null {
 if(!run.lastBlock||!run.prospect||run.gameNumber>=12)return null;
 const s=sumStats(run.lastBlock.games),p=run.prospect;
 const dropRate=s.targets?s.drops/s.targets:0,pressRate=s.pressReps?s.pressLosses/s.pressReps:0;
 const contactRate=s.contestedTargets?(s.contestedTargets-s.contestedCatches)/s.contestedTargets:0;
 const targetRate=s.routes?s.targets/s.routes:0,yardsPerCatch=s.receptions?s.yards/s.receptions:0;
 const bigCatch=run.lastBlock.games.some(g=>g.events.some(e=>e.kind==='catch'&&e.yards>=30));
 type Candidate={type:Intervention['type'];attributeId:string;label:string;cause:string;eligible:boolean;severity:number;maxSkill:number};
 const candidates:Candidate[]=[
  {type:'wr.jugs',attributeId:'hands',label:'JUGS precision',cause:`${s.drops} drops on ${s.targets} targets (${Math.round(dropRate*100)}%).`,eligible:s.targets>=18&&s.drops>=4&&dropRate>=.12,severity:dropRate/.12,maxSkill:90},
  {type:'wr.press',attributeId:'release',label:'Beat the press',cause:`${s.pressLosses} press losses in ${s.pressReps} reps.`,eligible:s.pressReps>=16&&s.pressLosses>=6&&pressRate>=.4,severity:pressRate/.4,maxSkill:88},
  {type:'wr.contested',attributeId:'bodyControl',label:'Through contact',cause:`${s.contestedCatches} catches on ${s.contestedTargets} contested targets.`,eligible:s.contestedTargets>=8&&contactRate>=.65,severity:contactRate/.65,maxSkill:88},
  {type:'wr.routes',attributeId:'routeRunning',label:'Route timing',cause:`${s.targets} targets from ${s.routes} routes; work on creating separation.`,eligible:s.routes>=60&&targetRate<.23,severity:.23/Math.max(.08,targetRate),maxSkill:85},
  {type:'wr.burst',attributeId:'acceleration',label:'First-step burst',cause:`${s.targets} targets from ${s.routes} routes; sharpen the first steps.`,eligible:s.routes>=60&&targetRate<.24,severity:.24/Math.max(.08,targetRate),maxSkill:85},
  {type:'wr.tracking',attributeId:'vertical',label:'Track the high ball',cause:`${s.contestedCatches} catches on ${s.contestedTargets} contested targets; improve reach and elevation.`,eligible:s.contestedTargets>=8&&contactRate>=.65,severity:contactRate/.65,maxSkill:88},
  {type:'wr.yac',attributeId:'yardsAfterCatch',label:'Run after the catch',cause:`${yardsPerCatch.toFixed(1)} yards per catch across ${s.receptions} receptions.`,eligible:s.receptions>=12&&yardsPerCatch<12,severity:12/Math.max(4,yardsPerCatch),maxSkill:85},
  {type:'wr.film',attributeId:'awareness',label:'Coverage film room',cause:`${s.targets} targets from ${s.routes} routes; study coverage windows.`,eligible:s.routes>=60&&targetRate<.2,severity:.2/Math.max(.08,targetRate),maxSkill:82},
  {type:'wr.speed',attributeId:'speed',label:'Deep-ball stride',cause:`No 30-yard catches across ${s.receptions} receptions; ${yardsPerCatch.toFixed(1)} yards per catch.`,eligible:s.receptions>=12&&yardsPerCatch<14&&!bigCatch,severity:14/Math.max(5,yardsPerCatch),maxSkill:85},
 ];
 const eligible=candidates.filter(c=>c.eligible&&!run.usedInterventions.includes(c.type)&&p.current[c.attributeId]<c.maxSkill&&trainingCeilings(run)[c.attributeId]-p.current[c.attributeId]>=2);
 const priority=(c:Candidate)=>Math.min(3,c.severity)*.65+(99-p.current[c.attributeId])/30*.35;
 eligible.sort((a,b)=>priority(b)-priority(a)||a.type.localeCompare(b.type));
 const choice=eligible[0];
 return choice?{id:`${run.id}-${run.year}-${choice.type}`,type:choice.type,attributeId:choice.attributeId,label:choice.label,cause:choice.cause,year:run.year,sourceBlock:run.gameNumber/4}:null;
}
