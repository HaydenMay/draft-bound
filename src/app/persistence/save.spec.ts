import {beforeEach,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {GameRepository,emptySave,previewSave} from './save';
import {createRun} from '../domain/engine';
import {createCollege,completeRun,step} from '../domain/test-fixtures';
import quickFixture from './fixtures/v1.3.1-quick.json';
import fullFixture from './fixtures/v1.3.1-full.json';
import collectionFixture from './fixtures/v1.3.1-collection.json';
function compactEntry(id:string){
 const entry=structuredClone(completeRun(82).entry!);entry.id=id;
 entry.draft.history=[];entry.draft.years=[];entry.draft.transfers=[];entry.draft.interventions=[];entry.draft.awards=[];entry.draft.unlocks=[];
 entry.draft.gauntlet=entry.draft.gauntlet.map(check=>({...check,label:'',description:'',attributes:[]}));
 return entry;
}
it('round trips the RNG and settings atomically',async()=>{const repo=new GameRepository('draft-bound-test');const save=emptySave();save.run=createRun('Save Prospect',8,314);save.settings.fastForward=true;await repo.write(save);expect(await repo.read()).toEqual(save);});
it('rejects broken versions, impossible run ratings and hostile JSON before changing state',()=>{
 const save=emptySave();expect(previewSave(JSON.stringify(save)).ok).toBe(true);
 expect(previewSave('{"__proto__":{"polluted":true}}').ok).toBe(false);
 expect(previewSave(JSON.stringify({...save,schemaVersion:99})).ok).toBe(false);
 expect(previewSave(JSON.stringify({...save,run:{id:'x'}})).ok).toBe(false);
});
it('validates nested chronology and intervention state before accepting a save',()=>{
 const save=emptySave();save.run=createCollege();expect(previewSave(JSON.stringify(save)).ok).toBe(true);
 save.run.years=[{} as any];expect(previewSave(JSON.stringify(save)).ok).toBe(false);save.run.years=[];
 save.run.pendingIntervention={} as any;expect(previewSave(JSON.stringify(save)).ok).toBe(false);
});
it('round trips completed entries and rejects malformed professional records',()=>{
 const save=emptySave();save.entries=[completeRun().entry!];expect(previewSave(JSON.stringify(save)).ok).toBe(true);
 save.entries[0].career={seasons:[{stats:{targets:1,receptions:99,yards:100,touchdowns:1}}]} as any;expect(previewSave(JSON.stringify(save)).ok).toBe(false);
});
it('allows a 1,000-entry binder to reload and rejects entry 1,001 with a specific limit error',async()=>{
 const entry=compactEntry('cap-entry-0');
 const save=emptySave();save.entries=Array.from({length:999},(_,i)=>({...structuredClone(entry),id:`cap-entry-${i}`}));
 expect(previewSave(JSON.stringify(save)).ok).toBe(true);
 save.entries.push({...structuredClone(entry),id:'cap-entry-999'});
 const accepted=previewSave(JSON.stringify(save));expect(accepted.ok).toBe(true);
 const name=`binder-cap-${Date.now()}`,repo=new GameRepository(name);await repo.read();await repo.write(accepted.data!);
 const restored=await new GameRepository(name).read();expect(restored?.entries).toHaveLength(1000);expect(previewSave(JSON.stringify(restored)).ok).toBe(true);
 const tooMany=structuredClone(save);tooMany.entries.push({...structuredClone(entry),id:'cap-entry-1000'});
 const rejected=previewSave(JSON.stringify(tooMany));expect(rejected.ok).toBe(false);expect(rejected.errors.join(' ')).toMatch(/1,000/);
});
it('keeps frozen v1.3.1 Quick, Full, collection, career, archive and preference fixtures byte-for-byte intact',()=>{
 for(const fixture of [quickFixture,fullFixture,collectionFixture]){
  const json=JSON.stringify(fixture),restored=previewSave(json);
  expect(restored.errors).toEqual([]);expect(JSON.stringify(restored.data)).toBe(json);
 }
 expect(quickFixture.run?.creationMode).toBe('quick');expect(quickFixture.run?.rng).toBeGreaterThan(0);
 expect(fullFixture.run?.creationMode).toBe('full');expect(fullFixture.run?.rng).toBeGreaterThan(0);
 expect(collectionFixture.entries).toHaveLength(3);
 expect(collectionFixture.entries.some(entry=>entry.career!==null&&entry.careerCard!==null)).toBe(true);
 expect(collectionFixture.entries.some(entry=>entry.positionId==='qb')).toBe(true);
 expect(collectionFixture.entries.some(entry=>entry.favorite)).toBe(true);
 expect(collectionFixture.profile.frames).toHaveLength(6);
 expect(collectionFixture.settings).toMatchObject({fastForward:true,theme:'dark',palette:'navy'});
});
it('round trips a saved broadcast but rejects malformed nested game and event payloads',()=>{
 const save=emptySave();save.run=step(createCollege(314),{type:'train',plan:{mode:'balanced'}});
 expect(previewSave(JSON.stringify(save)).data?.run?.lastBlock).toEqual(save.run.lastBlock);
 for(const events of [undefined,null,[null],[{kind:'catch',yards:'invalid'}]]){
  const malformed=JSON.parse(JSON.stringify(save));(malformed.run!.lastBlock!.games[0] as any).events=events;
  expect(previewSave(JSON.stringify(malformed)).ok,JSON.stringify(events)).toBe(false);
 }
 for(const field of ['opponent','highlights','teamScore']){
  const malformed=JSON.parse(JSON.stringify(save));(malformed.run!.lastBlock!.games[0] as any)[field]=null;
  expect(previewSave(JSON.stringify(malformed)).ok,field).toBe(false);
 }
 const badHistory=structuredClone(save);badHistory.run!.history[0].events=[null as any];
 expect(previewSave(JSON.stringify(badHistory)).ok).toBe(false);
});
it('accepts a full exported binder larger than 5 MB',()=>{const save=emptySave(),entry=completeRun().entry!;save.entries=Array.from({length:60},(_,i)=>({...structuredClone(entry),id:`entry-${i}`}));const json=JSON.stringify(save);expect(json.length).toBeGreaterThan(5_000_000);expect(previewSave(json).ok).toBe(true);});
it('rejects impossible active phases and partial creation records',()=>{const save=emptySave();save.run=createCollege();save.run.gameNumber=12;expect(previewSave(JSON.stringify(save)).ok).toBe(false);save.run=createRun('Broken',1,919);save.run.phase='size';expect(previewSave(JSON.stringify(save)).ok).toBe(false);});
it('atomically rejects simultaneous stale writers before they can overwrite a save',async()=>{
 const name=`cas-${Date.now()}`,a=new GameRepository(name),b=new GameRepository(name);await a.read();await b.read();const first=emptySave(),second=emptySave();first.run=createRun('First Prospect',1,1);second.run=createRun('Second Prospect',2,2);
 const result=await Promise.allSettled([a.write(first),b.write(second)]);expect(result.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(result.filter(r=>r.status==='rejected')).toHaveLength(1);expect((await new GameRepository(name).read())?.run?.name).toBe('First Prospect');
});
it('rejects malformed display rows and missing starting OVR before rendering a binder',()=>{const save=emptySave();save.entries=[completeRun().entry!];save.entries[0].display.attributes=[null as any];expect(previewSave(JSON.stringify(save)).ok).toBe(false);save.entries=[completeRun().entry!];delete (save.entries[0].draft.prospect as any).initialOvr;expect(previewSave(JSON.stringify(save)).ok).toBe(false);});
it('accepts legacy saves without a theme and rejects invalid new theme values',()=>{const save=emptySave();delete (save.settings as any).theme;expect(previewSave(JSON.stringify(save)).ok).toBe(true);(save.settings as any).theme='sepia';expect(previewSave(JSON.stringify(save)).ok).toBe(false);});
it('round trips palette preferences and safely normalizes unknown identifiers without touching game records',()=>{
 const save=emptySave();save.run=createCollege();const before=JSON.stringify(save.run);
 (save.settings as any).palette='navy';const restored=previewSave(JSON.stringify(save));expect(restored.errors).toEqual([]);expect((restored.data!.settings as any).palette).toBe('navy');expect(JSON.stringify(restored.data!.run)).toBe(before);
 (save.settings as any).palette='untrusted';const unknown=previewSave(JSON.stringify(save));expect(unknown.ok).toBe(true);expect(unknown.data!.settings.palette).toBe('forest');expect(JSON.stringify(unknown.data!.run)).toBe(before);
 for(const value of [null,7,{},false]){(save.settings as any).palette=value;expect(previewSave(JSON.stringify(save)).ok).toBe(false);}
 delete (save.settings as any).palette;expect(previewSave(JSON.stringify(save)).ok).toBe(true);
});

it('round trips the expanded coaching catalog without rejecting legacy JUGS saves',()=>{
 const save=emptySave();save.run=createCollege();
 for(const type of ['wr.jugs','wr.press','wr.contested','wr.routes','wr.burst','wr.tracking','wr.yac','wr.film','wr.speed'] as const){
  save.run.pendingIntervention={id:'coach-'+type,type,label:'Coaching',attributeId:'hands',cause:'Measured performance',year:1,sourceBlock:1};
  expect(previewSave(JSON.stringify(save)).ok).toBe(true);
 }
 save.run.usedInterventions=['wr.jugs','wr.press','wr.contested','wr.routes'];
 expect(previewSave(JSON.stringify(save)).ok).toBe(true);
});
