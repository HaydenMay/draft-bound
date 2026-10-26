import {it,expect} from 'vitest';
import {createCollege,step,completeRun} from './test-fixtures';
import {createRun,transition} from './engine';
import {WR_RULES} from './simulation';
import {integrateGrowth,values} from './development';
import {COLLEGES} from '../data/colleges';
import {simulateProfessional} from './professional';
import {cardView} from './presentation';
import {emptySave,previewSave} from '../persistence/save';
import {completionChance,canAttemptFieldGoal} from './college-simulation';

it('a failed fourth-down possession cannot produce a field goal afterward',()=>{
 expect(canAttemptFieldGoal(5,12)).toBe(false);
 expect(canAttemptFieldGoal(4,12)).toBe(true);
 expect(canAttemptFieldGoal(4,45)).toBe(false);
});

it('difficulty lowers completion chance and typical performances retain useful grade headroom',()=>{
 expect(completionChance(90,90,90,.9,true,70,0)).toBeLessThan(completionChance(90,90,90,.5,true,70,0));
 const p=createCollege(20).prospect!;p.current=values(()=>80);let grade=0;
 for(let seed=1;seed<=500;seed++)grade+=WR_RULES.simulateGame({prospect:p,college:COLLEGES[2],year:2,gameNumber:1,seed,collegeRulesVersion:'v1.4.4'}).stats.grade;
 expect(grade/500).toBeGreaterThan(65);expect(grade/500).toBeLessThan(80);
});

it('new college games include non-scoring long catches and avoid routine perfect grades',()=>{
 const p=createCollege(20).prospect!;p.current=values(()=>93);let long=0,nonScoring=0,perfect=0,yards=0,td=0;
 for(let seed=1;seed<=1000;seed++){
  const input={prospect:p,college:COLLEGES[2],year:3,gameNumber:1,seed,collegeRulesVersion:'v1.4.4' as const};
  const g=WR_RULES.simulateGame(input);if(seed===1)expect(WR_RULES.simulateGame(input)).toEqual(g);
  const catches=g.events.filter(e=>e.kind==='catch');expect(catches.reduce((n,e)=>n+e.yards,0)).toBe(g.stats.yards);expect(catches.filter(e=>e.touchdown)).toHaveLength(g.stats.touchdowns);
  expect(g.teamScore).toBeGreaterThanOrEqual(g.stats.touchdowns*7);expect(g.stats.targets).toBeLessThanOrEqual(g.stats.routes);expect(g.stats.receptions).toBeLessThanOrEqual(g.stats.targets);
  expect(g.teamScore).toBeLessThanOrEqual(105);expect(g.stats.routes).toBeLessThanOrEqual(70);
  for(const e of catches){expect(e.yards).toBeLessThanOrEqual(e.startDistance);expect(e.touchdown).toBe(e.yards===e.startDistance);if(e.yards>=50){long++;if(!e.touchdown)nonScoring++;}}
  perfect+=Number(g.stats.grade===100);yards+=g.stats.yards;td+=g.stats.touchdowns;
 }
 expect(long).toBeGreaterThan(0);expect(nonScoring/long).toBeGreaterThan(.2);expect(perfect).toBeLessThan(50);expect(yards/1000).toBeLessThan(150);expect(td/1000).toBeLessThan(1.5);
});
it('non-S mastery requires sustained work near its ceiling while S retains its existing path',()=>{
 expect(integrateGrowth(85,8,93,'v1.4.4')).toBeCloseTo(87.8);
 expect(integrateGrowth(90,4,93,'v1.4.4')).toBeCloseTo(90.5);
 expect(integrateGrowth(95,8,99,'v1.4.4')).toBe(integrateGrowth(95,8,99,'v1.4.3'));
 expect(integrateGrowth(90,4,93,'v1.4.3')).toBe(91);
});
it('entering the professional window a year earlier provides an extra season at equal ability',()=>{
 const younger=completeRun(82,2).entry!,older=structuredClone(younger);younger.draft.professionalRulesVersion='v1.4.4';older.draft.professionalRulesVersion='v1.4.4';
 older.draft.years.push({...older.draft.years[1],year:3});
 const a=simulateProfessional(younger),b=simulateProfessional(older);
 expect(a.seasons[0].age).toBe(22);expect(b.seasons[0].age).toBe(23);expect(a.retirementAge).toBe(b.retirementAge);expect(a.seasons.length).toBe(b.seasons.length+1);expect(simulateProfessional(older)).toEqual(b);
});
it('new runs finish with an automatic career and one canonical card while legacy entries retain both editions',()=>{
 const r=createRun('Systems',11,82);expect(r.balanceVersion).toBe('v1.4.4');
 const result=completeRun(82,2,'v1.4.4'),e=result.entry!;
 expect(e.cardFlowVersion).toBe('single-card-v1.4.4');expect(e.career).not.toBeNull();expect(e.careerCard).not.toBeNull();expect(result.run.phase).toBe('draft-night');
 expect(cardView(e,'draft')).toEqual(cardView(e,'career'));expect(cardView(e,'draft').ovr).toBe(e.draft.finalOvr);
 const save=emptySave();save.run=result.run;save.entries=[e];const restored=previewSave(JSON.stringify(save));expect(restored.errors).toEqual([]);expect(restored.data!.entries).toEqual(save.entries);expect(restored.data!.run).toEqual(save.run);
 const legacy=completeRun(82,2).entry!;expect(legacy.career).toBeNull();expect(legacy.cardFlowVersion).toBeUndefined();
 const replay=transition(result.run,{type:'scout',id:'scout-final'});expect(replay.entry).toBeUndefined();expect(replay.run).toBe(result.run);
});
it('rejects incomplete single-card saves, divergent designs and unknown college versions',()=>{
 const finished=completeRun(85,2,'v1.4.4'),save=emptySave();save.entries=[finished.entry!];save.run=finished.run;
 expect(previewSave(JSON.stringify(save)).ok).toBe(true);
 for(const change of ['missingCareer','differentCard','unknownCollege'] as const){
  const broken=structuredClone(save);
  if(change==='missingCareer')broken.entries[0].career=null;
  else if(change==='differentCard')broken.entries[0].draftCard.showStamp=!broken.entries[0].careerCard!.showStamp;
  else (broken.run as any).collegeRulesVersion='future';
  expect(previewSave(JSON.stringify(broken)).ok,change).toBe(false);
 }
});
