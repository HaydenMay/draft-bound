import {test,expect} from '@playwright/test';
import {emptySave,previewSave} from '../src/app/persistence/save';
import {createRun} from '../src/app/domain/engine';
import {completeRun} from '../src/app/domain/test-fixtures';
import {BinderEntry,SaveEnvelope,RunState} from '../src/app/domain/models';
import {readSave,writeSave} from './storage-helper';

function compactEntry(id:string):BinderEntry{
 const entry=structuredClone(completeRun(81).entry!);entry.id=id;
 entry.draft.history=[];entry.draft.years=[];entry.draft.transfers=[];entry.draft.interventions=[];entry.draft.awards=[];entry.draft.unlocks=[];
 entry.draft.gauntlet=entry.draft.gauntlet.map(check=>({...check,label:'',description:'',attributes:[]}));
 return entry;
}
function fillBinder(save:SaveEnvelope,count:number):void{
 const entry=compactEntry('binder-card-0');save.entries=Array.from({length:count},(_,i)=>({...structuredClone(entry),id:`binder-card-${i}`}));
}
function runAtGauntlet(seed=214):RunState{
 const run=structuredClone(completeRun(seed).run);run.phase='gauntlet';run.draft=null;run.processedCommands=run.processedCommands.filter(id=>id!=='scout-final');
 return run;
}

test('a full binder blocks a new prospect and offers an honest backup action',async({page})=>{
 const save=emptySave();fillBinder(save,1000);await page.goto('/');await writeSave(page,save);await page.reload();
 await page.getByRole('button',{name:'Create your prospect',exact:true}).click();
 await expect(page.getByRole('alert').filter({hasText:'1,000'})).toContainText('Export');
 await expect(page.getByRole('alert').filter({hasText:'1,000'})).toContainText('does not increase capacity');
 await expect(page.getByRole('button',{name:'Create prospect',exact:true})).toBeDisabled();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export save before making room',exact:true}).click();
 const file=await download;expect(file.suggestedFilename()).toContain('draft-bound-save-');
 const content=JSON.parse((await file.path())?await (await import('node:fs/promises')).readFile((await file.path())!,'utf8'):'{}');expect(content.entries).toHaveLength(1000);
});

test('an active run at binder capacity stays valid and exportable when draft append is blocked',async({page})=>{
 const save=emptySave();fillBinder(save,1000);save.run=runAtGauntlet();
 const validation=previewSave(JSON.stringify(save));expect(validation.errors).toEqual([]);
 const before=JSON.stringify(save.run);await page.goto('/');await writeSave(page,save);await page.goto('/#play');await page.reload();
 await page.getByRole('button',{name:/Take the scouting gauntlet/}).click();
 await expect(page.getByRole('alert')).toContainText('Your prospect is still saved; no card was added');
 await expect(page.getByRole('alert').getByRole('button',{name:'Export save'})).toBeVisible();
 const persisted=await readSave(page);expect(persisted.entries).toHaveLength(1000);expect(JSON.stringify(persisted.run)).toBe(before);
 expect(persisted.entries.some(entry=>entry.id===persisted.run?.id)).toBe(false);
});

test('an oversized import is rejected before it can replace the current collection',async({page})=>{
 const current=emptySave();current.run=createRun('Keep this run',11,909,'2026-01-01T00:00:00.000Z');await page.goto('/');await writeSave(page,current);await page.reload();
 const tooMany=emptySave();fillBinder(tooMany,1001);
 await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:'Import game save'}).click();
 await page.locator('#save-file').setInputFiles({name:'oversized-binder.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(tooMany))});
 await expect(page.getByRole('alert')).toContainText('more than 1,000 cards');
 const persisted=await readSave(page);expect(JSON.stringify(persisted)).toBe(JSON.stringify(current));
});
