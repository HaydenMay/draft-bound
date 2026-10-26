import {describe,it,expect} from 'vitest';
import {COLLEGES} from '../data/colleges';
import {collegeOffers,trainingCeilings,schoolTarget} from './college-system';
import {createCollege,step} from './test-fixtures';
import {transition} from './engine';
import {develop,values} from './development';
import {emptySave,previewSave} from '../persistence/save';
import {WR_DEFINITION} from './positions';

describe('versioned college opportunities',()=>{
 it('covers all traits and five prestige levels in fifteen fictional programs',()=>{
  expect(COLLEGES).toHaveLength(15);
  expect(new Set(COLLEGES.map(c=>c.prestige)).size).toBe(5);
  for(const a of WR_DEFINITION.attributes)expect(COLLEGES.some(c=>c.prestige===5&&c.specialties.includes(a.id))).toBe(true);
 });
 it('keeps old runs on three programs and natural caps',()=>{
  const run=createCollege();expect(collegeOffers(run)).toHaveLength(3);
  expect(trainingCeilings(run).speed).toBe(run.prospect!.traits.speed.ceiling);
 });
 it('offers six stable choices without consuming RNG and responds to performance',()=>{
  const run=createCollege();run.collegeSystemVersion='v1.4.5';run.phase='college-choice';run.collegeId='';
  const before=JSON.stringify(run),offers=collegeOffers(run);expect(offers).toHaveLength(6);
  expect(collegeOffers(run)).toEqual(offers);expect(JSON.stringify(run)).toBe(before);
  run.phase='transfer';run.collegeId='opportunity';run.prospect!.current=Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,95]));
  run.years=[{year:1,schoolId:'opportunity',startOvr:65,endOvr:95,stats:{grade:95} as any}];
  expect(collegeOffers(run).some(c=>c.prestige===5)).toBe(true);
  expect(collegeOffers(run).some(c=>c.id==='opportunity')).toBe(true);
 });
 it('lets an established 88 OVR player earn five-star transfer interest from a solid season',()=>{
  const run=createCollege();run.collegeSystemVersion='v1.4.5';run.phase='transfer';
  run.prospect!.current=values(()=>88);run.years=[{year:1,schoolId:run.collegeId,startOvr:65,endOvr:88,stats:{grade:80} as any}];
  expect(collegeOffers(run).some(c=>c.prestige===5)).toBe(true);
 });
 it('raises only specialties, never reduces natural potential or earned ability',()=>{
  const run=createCollege();run.collegeSystemVersion='v1.4.5';const school=COLLEGES.find(c=>c.prestige===5)!;run.collegeId=school.id;
  const id=school.specialties[0];run.prospect!.traits[id].ceiling=75;
  expect(trainingCeilings(run)[id]).toBe(99);expect(run.prospect!.traits[id].ceiling).toBe(75);
  run.prospect!.current[id]=97;run.collegeId='opportunity';expect(trainingCeilings(run)[id]).toBe(97);
  expect([1,2,3,4,5].map(schoolTarget)).toEqual([75,80,85,90,99]);
 });
 it('never repeats the safety when staying at that same school',()=>{
  const run=createCollege();run.collegeSystemVersion='v1.4.5';run.phase='transfer';run.collegeId='';
  const safety=collegeOffers(run).find(c=>c.prestige===1)!;run.collegeId=safety.id;
  expect(new Set(collegeOffers(run).map(c=>c.id)).size).toBe(collegeOffers(run).length);
 });
 it('higher school caps require work and preserve earned ability after a transfer',()=>{
  const run=createCollege();run.collegeSystemVersion='v1.4.5';const elite=COLLEGES.find(c=>c.prestige===5)!;run.collegeId=elite.id;
  const id=elite.specialties.find(id=>run.prospect!.traits[id].ceiling<99)!;
  const initial=run.prospect!.current[id],natural=run.prospect!.traits[id].ceiling;
  expect(run.prospect!.current[id]).toBe(initial);
  for(let i=0;i<100;i++)run.prospect!.current=develop(run.prospect!.current,trainingCeilings(run),{mode:'intensive',attributeId:id},2,elite,30,values(()=>30),'v1.4.4',[elite.id,elite.id]).current;
  expect(run.prospect!.current[id]).toBe(99);expect(run.prospect!.traits[id].ceiling).toBe(natural);
  run.collegeId='opportunity';const next=step(run,{type:'train',plan:{mode:'balanced'}});
  expect(next.prospect!.current[id]).toBe(99);
 });
 it('rejects selecting a program that has not offered a place',()=>{
  const run=createCollege();run.collegeSystemVersion='v1.4.5';run.phase='college-choice';run.collegeId='';
  const missing=COLLEGES.find(c=>!collegeOffers(run).some(o=>o.id===c.id))!;
  expect(()=>step(run,{type:'choose-college',collegeId:missing.id})).toThrow(/offer/i);
 });
 it('builds the report and career once on declaration, and round-trips the new save',()=>{
  let run=createCollege(82,'v1.4.4');run.collegeSystemVersion='v1.4.5';
  for(let y=1;y<=2;y++){
   for(let b=0;b<3;b++){run=step(run,{type:'train',plan:{mode:'balanced'}});run=step(run,{type:'continue'});}
   if(y===1){run=step(run,{type:'continue'});run=step(run,{type:'transfer',collegeId:run.collegeId});}
  }
  const result=transition(run,{type:'declare',id:'declare-now'});expect(result.run.phase).toBe('draft-night');expect(result.entry?.career).toBeTruthy();
  expect(result.entry?.draft.collegeSystemVersion).toBe('v1.4.5');
  const save={...emptySave(),run:result.run,entries:[result.entry!]};expect(previewSave(JSON.stringify(save)).ok).toBe(true);
  expect(transition(result.run,{type:'declare',id:'declare-now'}).entry).toBeUndefined();
 });
 it('imports school-earned ability only with supported attended-school evidence',()=>{
  const run=createCollege(82,'v1.4.4');run.collegeSystemVersion='v1.4.5';
  const school=COLLEGES.find(c=>c.prestige===5)!;run.collegeId=school.id;
  const id=school.specialties.find(id=>run.prospect!.traits[id].ceiling<99)!;run.prospect!.current[id]=98;
  expect(previewSave(JSON.stringify({...emptySave(),run})).ok).toBe(true);
  run.collegeId='opportunity';expect(previewSave(JSON.stringify({...emptySave(),run})).ok).toBe(false);
  run.collegeId=school.id;delete run.collegeSystemVersion;expect(previewSave(JSON.stringify({...emptySave(),run})).ok).toBe(false);
 });
});
