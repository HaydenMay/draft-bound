import {beforeEach,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {GameRepository,emptySave,previewSave} from './save';
import {createRun} from '../domain/engine';
import {createCollege,completeRun} from '../domain/test-fixtures';
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
it('accepts a full exported binder larger than 5 MB',()=>{const save=emptySave(),entry=completeRun().entry!;save.entries=Array.from({length:60},(_,i)=>({...structuredClone(entry),id:`entry-${i}`}));const json=JSON.stringify(save);expect(json.length).toBeGreaterThan(5_000_000);expect(previewSave(json).ok).toBe(true);});
it('rejects impossible active phases and partial creation records',()=>{const save=emptySave();save.run=createCollege();save.run.gameNumber=12;expect(previewSave(JSON.stringify(save)).ok).toBe(false);save.run=createRun('Broken',1,919);save.run.phase='size';expect(previewSave(JSON.stringify(save)).ok).toBe(false);});
it('atomically rejects simultaneous stale writers before they can overwrite a save',async()=>{
 const name=`cas-${Date.now()}`,a=new GameRepository(name),b=new GameRepository(name);await a.read();await b.read();const first=emptySave(),second=emptySave();first.run=createRun('First Prospect',1,1);second.run=createRun('Second Prospect',2,2);
 const result=await Promise.allSettled([a.write(first),b.write(second)]);expect(result.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(result.filter(r=>r.status==='rejected')).toHaveLength(1);expect((await new GameRepository(name).read())?.run?.name).toBe('First Prospect');
});
it('rejects malformed display rows and missing starting OVR before rendering a binder',()=>{const save=emptySave();save.entries=[completeRun().entry!];save.entries[0].display.attributes=[null as any];expect(previewSave(JSON.stringify(save)).ok).toBe(false);save.entries=[completeRun().entry!];delete (save.entries[0].draft.prospect as any).initialOvr;expect(previewSave(JSON.stringify(save)).ok).toBe(false);});
it('accepts legacy saves without a theme and rejects invalid new theme values',()=>{const save=emptySave();delete (save.settings as any).theme;expect(previewSave(JSON.stringify(save)).ok).toBe(true);(save.settings as any).theme='sepia';expect(previewSave(JSON.stringify(save)).ok).toBe(false);});
it('round trips palette preferences without changing a run and rejects unrecognized palettes',()=>{
 const save=emptySave();save.run=createCollege();const before=JSON.stringify(save.run);
 (save.settings as any).palette='navy';const restored=previewSave(JSON.stringify(save));expect(restored.errors).toEqual([]);expect((restored.data!.settings as any).palette).toBe('navy');expect(JSON.stringify(restored.data!.run)).toBe(before);
 (save.settings as any).palette='untrusted';expect(previewSave(JSON.stringify(save)).ok).toBe(false);
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
