import {describe,it,expect} from 'vitest';
import {createRun} from './engine';
import {step,completeRun,createCollege} from './test-fixtures';
import {RECEIVER_CATALOG_VERSION,RECEIVER_PROFILES,RECEIVER_TEAMS,eligibleReceiversForTeam} from '../data/receiver-catalog';
import {WR_DEFINITION} from './positions';
import {emptySave,previewSave} from '../persistence/save';

describe('v1.2 creation modes and offers',()=>{
 it('records the catalog version on new completed drafts',()=>{
  expect(completeRun(82).entry!.draft.contentVersion).toBe(RECEIVER_CATALOG_VERSION);
 });
 it('keeps a legacy active run on its original progression after loading without a profile',()=>{
  const missing=createCollege(82),legacy=structuredClone(missing);delete missing.balanceVersion;legacy.balanceVersion='legacy';
  const a=step(missing,{type:'train',plan:{mode:'balanced'}}),b=step(legacy,{type:'train',plan:{mode:'balanced'}});
  expect(a.prospect).toEqual(b.prospect);expect(a.history).toEqual(b.history);expect(a.rng).toBe(b.rng);
 });
 it('rolls one team before a uniformly eligible receiver and can repeat a receiver on later picks',()=>{
  let laterRepeat=false;
  for(let seed=0;seed<400;seed++){
   let run=createRun('Offer Test',11,seed);
   expect(new Set(run.creation.giftOffers.map(g=>g.sourcePlayerId)).size).toBe(3);
   expect(new Set(run.creation.giftOffers.map(g=>g.attributeId)).size).toBe(3);
   run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
   const first=run.creation.currentRoll!;
   expect(run.creation.playerOffers).toEqual([]);
   expect(eligibleReceiversForTeam(first.teamId).some(p=>p.id===first.receiverId)).toBe(true);
   const attr=WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id;
   run=step(run,{type:'choose-trait',sourcePlayerId:first.receiverId,attributeId:attr});
   if(run.creation.currentRoll?.receiverId===first.receiverId)laterRepeat=true;
   expect(RECEIVER_PROFILES).toHaveLength(498);
   expect(RECEIVER_TEAMS).toHaveLength(32);
  }
  expect(laterRepeat).toBe(true);
 });
 it('lets Full manually assign all eight remaining potentials and round trips mid-creation',()=>{
  let run=createRun('Full Prospect',7,314,'2026-10-23T00:00:00Z','full');
  run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
  for(let i=0;i<8;i++){
   expect(run.phase).toBe('potential');
   const attr=WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id;
   run=step(run,{type:'choose-trait',sourcePlayerId:run.creation.currentRoll!.receiverId,attributeId:attr});
   const save=emptySave();save.run=run;
   const restored=previewSave(JSON.stringify(save));expect(restored.errors).toEqual([]);expect(restored.data!.run).toEqual(run);
  }
  expect(run.phase).toBe('reveal');expect(run.creationMode).toBe('full');
  expect(Object.values(run.prospect!.traits).filter(t=>t.origin==='manual')).toHaveLength(8);
  expect(Object.values(run.prospect!.traits).some(t=>t.origin==='autofill')).toBe(false);
  expect(run.rerolls).toBe(3);
 });
 it('keeps the Quick contract: three manual picks, five team-first automatic assignments',()=>{
  const run=createCollege(139);
  const traits=Object.values(run.prospect!.traits);
  expect(traits.filter(trait=>trait.origin==='manual')).toHaveLength(3);
  const automatic=traits.filter(trait=>trait.origin==='autofill');
  expect(automatic).toHaveLength(5);
  expect(automatic.every(trait=>!!trait.sourceTeamId&&RECEIVER_TEAMS.some(team=>team.id===trait.sourceTeamId))).toBe(true);
  expect(run.creation.currentRoll).toBeNull();
 });
 it('persists and validates the committed roll and its eligible team membership',()=>{
  let run=createRun('Roll Save',11,219);run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
  const save=emptySave();save.run=run;
  expect(previewSave(JSON.stringify(save)).ok).toBe(true);
  const invalid=structuredClone(save);(invalid.run!.creation.currentRoll as any).teamId='not-a-team';
  expect(previewSave(JSON.stringify(invalid)).ok).toBe(false);
  const validTeam=run.creation.currentRoll!.teamId;
  const invalidMember=structuredClone(save);(invalidMember.run!.creation.currentRoll as any).receiverId=RECEIVER_PROFILES.find(profile=>!profile.eligibleTeamIds.includes(validTeam))!.id;
  expect(previewSave(JSON.stringify(invalidMember)).ok).toBe(false);
  const anotherEligible=RECEIVER_PROFILES.find(profile=>profile.id!==run.creation.currentRoll!.receiverId&&profile.eligibleTeamIds.includes(validTeam))!;
  const substituted=structuredClone(save);(substituted.run!.creation.currentRoll as any).receiverId=anotherEligible.id;
  expect(previewSave(JSON.stringify(substituted)).ok).toBe(false);
 });
 it('defaults missing legacy mode to Quick and rejects invalid or mismatched mode data',()=>{
  const save=emptySave();save.run=createRun('Legacy',11,71);delete save.run.creationMode;delete save.run.balanceVersion;
  expect(previewSave(JSON.stringify(save)).ok).toBe(true);
  (save.run as any).creationMode='catalog';expect(previewSave(JSON.stringify(save)).ok).toBe(false);
 });
});
