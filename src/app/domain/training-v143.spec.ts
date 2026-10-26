import {describe,it,expect} from 'vitest';
import {createRun,buildDraft} from './engine';
import {createCollege,step} from './test-fixtures';
import {calculateOvr,develop,integrateGrowth,values} from './development';
import {Random} from './rng';
import {WR_RULES} from './simulation';
import {COLLEGES} from '../data/colleges';
import {WR_DEFINITION} from './positions';
import {emptySave,previewSave} from '../persistence/save';
import type {BalanceVersion,RunState,TrainingPlan} from './models';

const profile='v1.4.3' as BalanceVersion;
function finishCreation(run:RunState){
 run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
 while(run.phase==='potential')run=step(run,{type:'choose-trait',attributeId:WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id,sourcePlayerId:run.creation.currentRoll!.receiverId});
 return run;
}
describe('approved v1.4.3 training',()=>{
 it('raises new starting rolls without changing RNG, trait choices, gifts or old in-progress creation',()=>{
  for(let seed=1;seed<=25;seed++){
   const fresh=createRun('Synthetic',11,seed,'2026-01-01T00:00:00Z'),old=structuredClone(fresh);old.balanceVersion='v1.2';
   const modern=finishCreation(fresh),previous=finishCreation(old);
   expect(modern.balanceVersion).toBe('v1.4.3');expect(modern.rng).toBe(previous.rng);expect(modern.creation).toEqual(previous.creation);
   for(const [id,trait] of Object.entries(modern.prospect!.traits)){
    const value=modern.prospect!.current[id];
    if(trait.origin==='gift')expect(value).toBe(94);
    else {expect(value).toBeGreaterThanOrEqual(Math.min(58,trait.ceiling));expect(value).toBeLessThanOrEqual(Math.min(73,trait.ceiling));if(trait.ceiling>=65)expect(value).toBe(Math.min(trait.ceiling,previous.prospect!.current[id]+8));}
   }
  }
 });
 it.each(['balanced','focused','intensive'] as const)('spends eight practice work units in %s, with no route experience',mode=>{
  const r=develop(values(()=>50),values(()=>99),{mode,attributeId:'hands'},1,{coaching:1,specialties:[]},0,{},profile,['A']);
  expect(Object.values(r.practiceWork).reduce((a,b)=>a+b,0)).toBeCloseTo(8);
  expect(Object.values(r.general).every(x=>x===0)).toBe(true);
  expect(r.current.hands).toBeCloseTo(mode==='balanced'?50+(.85*8/9):mode==='focused'?54.08:56.8);
  expect(r.current.speed).toBeCloseTo(mode==='balanced'?50+(.85*8/9):mode==='focused'?50.34:50);
 });
 it.each([
  [['A'],1,.85], [['A','A'],2,.95], [['A','B'],2,.85],
  [['A','A','A'],3,.90], [['A','B','B'],3,.80], [['A','A','B'],3,.75],
  [['A','B','C'],3,.65], [['A','B','A'],3,.65],
 ] as const)('applies the annual factor once for %j', (history,year,factor)=>{
  const r=develop(values(()=>20),values(()=>99),{mode:'intensive',attributeId:'hands'},year,{coaching:1,specialties:[]},0,{},profile,history);
  expect(r.current.hands).toBeCloseTo(20+8*factor);
 });
 it('preserves relative mastery, specialty multipliers, experience caps and gain attribution',()=>{
  expect(integrateGrowth(90,4,93,profile)).toBe(91); // final band: four work yields one rating point
  for(const school of COLLEGES){
   const r=develop(values(()=>20),values(()=>99),{mode:'balanced'},1,school,60,values(()=>1),profile,['A']);
   expect(Object.values(r.generalWork).reduce((a,b)=>a+b,0)).toBeCloseTo(4.32);
   for(const id of Object.keys(r.gains)){
    expect(r.gains[id]).toBeCloseTo(.85*(8/9+4.32/9)*(school.specialties.includes(id)?school.coaching:1));
    expect(r.general[id]+r.practice[id]).toBeCloseTo(r.gains[id]);
   }
   const clipped=develop(values(()=>98.9),values(()=>99),{mode:'balanced'},1,school,60,values(()=>1),profile,['A']);
   for(const id of Object.keys(clipped.gains)){expect(clipped.current[id]).toBeLessThanOrEqual(99);expect(clipped.gains[id]).toBeGreaterThanOrEqual(0);expect(clipped.general[id]+clipped.practice[id]).toBeCloseTo(clipped.gains[id]);}
  }
 });
 it('uses recorded school history and resumes the submitted plan after one coach game',()=>{
  let run=createCollege(82);run.balanceVersion=profile;run.year=3;run.collegeId=COLLEGES[2].id;
  run.years=[{year:1,schoolId:COLLEGES[0].id},{year:2,schoolId:COLLEGES[1].id}] as RunState['years'];
  run.prospect!.current=values(()=>50);Object.values(run.prospect!.traits).forEach(t=>t.ceiling=99);
  run.pendingIntervention={id:'coach-v143',type:'wr.jugs',label:'Jugs',attributeId:'hands',cause:'Measured drops',year:3,sourceBlock:1};
  const rng=new Random(run.rng),p=structuredClone(run.prospect!),requested:TrainingPlan={mode:'focused',attributeId:'speed'};
  const expected=[];
  for(let n=0;n<4;n++){
   const g=WR_RULES.simulateGame({prospect:p,college:COLLEGES[2],year:3,gameNumber:n+1,seed:rng.int(0,0xffffffff)}),s=g.stats;
   const r=develop(p.current,values(()=>99),n===0?{mode:'intensive',attributeId:'hands'}:requested,3,COLLEGES[2],s.routes,{speed:s.routes,acceleration:s.routes,hands:s.targets,routeRunning:s.routes,release:s.pressReps,vertical:s.contestedTargets,bodyControl:s.contestedTargets,yardsAfterCatch:s.receptions,awareness:s.routes},profile,['A','B','C']);
   p.current=r.current;expected.push({...g,gains:r.gains,generalGains:r.general,practiceGains:r.practice});
  }
  const next=step(run,{type:'train',plan:requested});expect(next.history).toEqual(expected);expect(next.prospect!.current).toEqual(p.current);expect(next.rng).toBe(rng.state);
  expect(next.lastBlock!.training).toEqual(requested);expect(next.lastBlock!.fulfilled!.selectedPlan).toEqual(requested);expect(next.interventions).toHaveLength(1);
 });
 it.each([undefined,'legacy','v1.2'] as const)('keeps %s development independent of transfer history',version=>{
  const run=createCollege(83);if(version)run.balanceVersion=version;else delete run.balanceVersion;
  run.year=3;const transferred=structuredClone(run);transferred.years=[{year:1,schoolId:'different'},{year:2,schoolId:'another'}] as RunState['years'];
  const a=step(run,{type:'train',plan:{mode:'balanced'}}),b=step(transferred,{type:'train',plan:{mode:'balanced'}});
  expect(a.prospect).toEqual(b.prospect);expect(a.history).toEqual(b.history);expect(a.rng).toBe(b.rng);
 });
 it('imports the new balance version and freezes it in draft metadata',()=>{
  const save=emptySave();save.run=createCollege(84);save.run.balanceVersion=profile;
  const restored=previewSave(JSON.stringify(save));expect(restored.ok).toBe(true);expect(restored.data!.run).toEqual(save.run);
  const entry=buildDraft(save.run,new Random(99));expect(entry.draft.balanceVersion).toBe('1.4.3');expect(entry.draft.professionalRulesVersion).toBe('v1.4');
  const frozen=JSON.stringify(entry.draft);save.run.prospect!.current.hands=0;expect(JSON.stringify(entry.draft)).toBe(frozen);
 });
 it('retains a conditional displayed99 development path with the approved practice/continuity rules',()=>{
  let current=values(id=>id==='routeRunning'?94:73);
  const plans=[['intensive','speed'],['intensive','release'],['focused','vertical'],['intensive','hands'],['intensive','bodyControl'],['intensive','yardsAfterCatch'],['focused','acceleration'],['focused','vertical'],['focused','awareness']] as const;
  const reps={speed:42,acceleration:42,hands:18,routeRunning:42,release:18,vertical:6,bodyControl:6,yardsAfterCatch:15,awareness:42};
  plans.forEach(([mode,attributeId],block)=>{const year=Math.floor(block/3)+1;for(let n=0;n<4;n++)current=develop(current,values(()=>99),{mode,attributeId},year,COLLEGES[2],42,reps,profile,Array(year).fill(COLLEGES[2].id)).current;});
  expect(calculateOvr(current).raw).toBeCloseTo(98.5495854545,8);expect(calculateOvr(current).display).toBe(99);
 });
});
