import {describe,it,expect} from 'vitest';
import {createRun} from './engine';
import {step} from './test-fixtures';
import {WR_DEFINITION} from './positions';
import {emptySave,previewSave} from '../persistence/save';

describe('v1.2 creation modes and offers',()=>{
 it('never repeats a player within a gift or potential offer, but permits later repeats',()=>{
  let laterRepeat=false;
  for(let seed=0;seed<400;seed++){
   let run=createRun('Offer Test',11,seed);
   expect(new Set(run.creation.giftOffers.map(g=>g.sourcePlayerId)).size).toBe(3);
   expect(new Set(run.creation.giftOffers.map(g=>g.attributeId)).size).toBe(3);
   run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
   const first=[...run.creation.playerOffers];expect(new Set(first).size).toBe(3);
   run=step(run,{type:'reroll'});expect(new Set(run.creation.playerOffers).size).toBe(3);
   if(run.creation.playerOffers.some(p=>first.includes(p)))laterRepeat=true;
  }
  expect(laterRepeat).toBe(true);
 });
 it('lets Full manually assign all eight remaining potentials and round trips mid-creation',()=>{
  let run=createRun('Full Prospect',7,314,'2026-10-23T00:00:00Z','full');
  run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
  for(let i=0;i<8;i++){
   expect(run.phase).toBe('potential');
   const attr=WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id;
   run=step(run,{type:'choose-trait',sourcePlayerId:run.creation.playerOffers[0],attributeId:attr});
   const save=emptySave();save.run=run;
   const restored=previewSave(JSON.stringify(save));expect(restored.errors).toEqual([]);expect(restored.data!.run).toEqual(run);
  }
  expect(run.phase).toBe('reveal');expect(run.creationMode).toBe('full');
  expect(Object.values(run.prospect!.traits).filter(t=>t.origin==='manual')).toHaveLength(8);
  expect(Object.values(run.prospect!.traits).some(t=>t.origin==='autofill')).toBe(false);
  expect(run.rerolls).toBe(3);
 });
 it('defaults missing legacy mode to Quick and rejects invalid or mismatched mode data',()=>{
  const save=emptySave();save.run=createRun('Legacy',11,71);delete save.run.creationMode;delete save.run.balanceVersion;
  expect(previewSave(JSON.stringify(save)).ok).toBe(true);
  (save.run as any).creationMode='catalog';expect(previewSave(JSON.stringify(save)).ok).toBe(false);
 });
});
