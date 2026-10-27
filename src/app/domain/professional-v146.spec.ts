import {it,expect} from 'vitest';
import {simulateProfessional} from './professional';
import {completeRun,createCollege,step} from './test-fixtures';
import {COLLEGES} from '../data/colleges';
import {createRun,transition} from './engine';

it('assigns the new rules only to newly created prospects',()=>{
 expect((createRun('Test',11,123) as any).professionalRulesVersion).toBe('v1.4.6');
});
it('generates deterministic varied careers with team movement and achievable awards',()=>{
 const entry=completeRun(73,3).entry!;
 (entry.draft as any).professionalRulesVersion='v1.4.6';entry.draft.finalOvr=90;
 const careers=Array.from({length:200},(_,i)=>simulateProfessional({...entry,nflSeed:i+1}));
 expect(simulateProfessional({...entry,nflSeed:1})).toEqual(careers[0]);
 expect(careers.some(c=>new Set(c.seasons.map(s=>s.team.teamId)).size>1)).toBe(true);
 expect(careers.some(c=>new Set(c.seasons.map(s=>s.team.teamId)).size===1)).toBe(true);
 expect(careers.some(c=>c.awards.length>0)).toBe(true);
 expect(careers.some(c=>c.seasons.some(s=>s.allPro&&s.stats.yards<1750))).toBe(true);
 for(const career of careers){
  expect(career.awards.length).toBe(career.seasons.filter(s=>s.allPro).length);
  expect(career.totals.yards).toBe(career.seasons.reduce((n,s)=>n+s.stats.yards,0));
  expect(career.seasons.every(s=>s.stats.receptions<=s.stats.targets&&s.stats.touchdowns<=s.stats.receptions)).toBe(true);
 }
});

it('uses the new rules when a new prospect completes college',()=>{
 let run=createCollege(111,'v1.4.4');run.professionalRulesVersion='v1.4.6';
 for(let year=1;year<=2;year++){
  for(let block=0;block<3;block++){run=step(run,{type:'train',plan:{mode:'balanced'}});run=step(run,{type:'continue'});}
  if(year===1){run=step(run,{type:'continue'});run=step(run,{type:'transfer',collegeId:COLLEGES[1].id});}
 }
 const result=transition(run,{type:'declare',id:'new-career'});
 // Historical fixture flow reaches scouting before creating its draft.
 const entry=result.entry??transition(result.run,{type:'scout',id:'new-career-scout'}).entry!;
 expect(entry.draft.professionalRulesVersion).toBe('v1.4.6');
 expect(entry.career).toEqual(simulateProfessional(entry));
});
