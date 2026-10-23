import {describe,it,expect} from 'vitest';
import {createRun, transition, detectIntervention} from './engine';
import {simulateProfessional} from './professional';
import {GameCommandPayload,RunState} from './models';
import {WR_DEFINITION} from './positions';
import {COLLEGES} from '../data/colleges';
import {createCollege,completeRun,step} from './test-fixtures';
describe('complete playable run',()=>{
 it('creates one gift, three manual potentials and five uniformly sourced automatic traits',()=>{
  const run=createCollege();expect(Object.keys(run.prospect!.traits)).toHaveLength(9);
  expect(Object.values(run.prospect!.traits).filter(t=>t.origin==='manual')).toHaveLength(3);
  const gift=Object.values(run.prospect!.traits).find(t=>t.origin==='gift')!;expect(run.prospect!.initial[gift.attributeId]).toBe(94);expect(gift.ceiling).toBe(99);
 });
 it('rejects out-of-phase commands and makes a repeated command id harmless',()=>{
  const run=createCollege();expect(()=>transition(run,{type:'scout',id:'bad'})).toThrow();
  const cmd={type:'train' as const,plan:{mode:'balanced' as const},id:'one'};const next=transition(run,cmd).run;expect(transition(next,cmd).run).toEqual(next);expect(next.history).toHaveLength(4);
 });
 it('plays 24 or 36 games and guarantees an immutable draft card before optional career',()=>{
  for(const years of [2,3]){const {run,entry}=completeRun(82,years);expect(run.history).toHaveLength(years*12);expect(entry?.draftCard).toBeDefined();expect(entry?.career).toBeNull();expect(entry?.draft.gauntlet).toHaveLength(5);
   const before=JSON.stringify(entry!.draft);const career=simulateProfessional(entry!);expect(career.seasons.length).toBeGreaterThanOrEqual(3);expect(career.seasons.length).toBeLessThanOrEqual(15);expect(JSON.stringify(entry!.draft)).toBe(before);expect(simulateProfessional(entry!)).toEqual(career);
  }
 });
 it('reserves at most one priority intervention and stops at the last block',()=>{
  const run=createCollege();run.gameNumber=4;run.lastBlock={games:[{stats:{drops:5,pressReps:10,pressLosses:10,contestedTargets:10,contestedCatches:0}}] as any} as any;
  expect(detectIntervention(run)?.type).toBe('wr.jugs');run.usedInterventions=['wr.jugs'];expect(detectIntervention(run)?.type).toBe('wr.press');run.gameNumber=12;expect(detectIntervention(run)).toBeNull();
 });
 it('fulfills a matching intensive plan once; focused substitutes only the first game',()=>{
  for(const mode of ['focused','intensive'] as const){let run=createCollege();run.pendingIntervention={id:'coach',type:'wr.jugs',label:'Jugs',attributeId:'hands',cause:'5 drops',year:1,sourceBlock:1};
   run=step(run,{type:'train',plan:{mode,attributeId:'hands'}});
   expect(run.lastBlock!.fulfilled!.fulfillment).toBe(mode==='intensive'?'already_compliant':'substituted');
   expect(run.lastBlock!.games[0].practiceGains['hands']).toBeGreaterThan(0);expect(run.interventions).toHaveLength(1);expect(run.pendingIntervention?.id).not.toBe('coach');
  }
 });
 it('retains current skills and ceilings when transferring, and resets yearly coach usage',()=>{
  let run=createCollege();for(let i=0;i<3;i++){run=step(run,{type:'train',plan:{mode:'balanced'}});run=step(run,{type:'continue'});}run=step(run,{type:'continue'});const before=structuredClone(run.prospect);run=step(run,{type:'transfer',collegeId:COLLEGES[2].id});expect(run.prospect).toEqual(before);expect(run.usedInterventions).toEqual([]);expect(run.transfers).toHaveLength(1);
 });
});

