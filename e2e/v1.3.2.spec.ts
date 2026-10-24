import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {emptySave,previewSave} from '../src/app/persistence/save';
import {createRun} from '../src/app/domain/engine';
import {completeRun,createCollege} from '../src/app/domain/test-fixtures';
import {BinderEntry,SaveEnvelope,RunState} from '../src/app/domain/models';
import {readSave,writeSave} from './storage-helper';
import collectionFixture from '../src/app/persistence/fixtures/v1.3.1-collection.json';

function compactEntry(id:string):BinderEntry{
 const entry=structuredClone(completeRun(81).entry!);entry.id=id;
 entry.draft.history=[];entry.draft.years=[];entry.draft.transfers=[];entry.draft.interventions=[];entry.draft.awards=[];entry.draft.unlocks=[];
 entry.draftCard.sceneId='prospect_journey';
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

test('starting a new prospect at capacity never offers to discard the active run',async({page})=>{
 const save=emptySave();fillBinder(save,1000);save.run=runAtGauntlet();
 const before=JSON.stringify(save.run);await page.goto('/');await writeSave(page,save);await page.goto('/#play');await page.reload();
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:/My binder/}).click();
 await page.getByRole('button',{name:'New prospect',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Binder is full'})).toBeVisible();
 await expect(page.getByText(/active prospect is safe/i)).toBeVisible();
 await expect(page.getByRole('dialog').getByRole('button',{name:'Export save'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Discard run & start fresh'})).toHaveCount(0);
 const persisted=await readSave(page);expect(persisted.entries).toHaveLength(1000);expect(JSON.stringify(persisted.run)).toBe(before);
});

test('a 999-entry binder accepts the final drafted card and reloads at capacity',async({page})=>{
 const save=emptySave();fillBinder(save,999);save.run=runAtGauntlet();expect(previewSave(JSON.stringify(save)).errors).toEqual([]);
 await page.goto('/');await writeSave(page,save);await page.goto('/#play');await page.reload();
 await page.getByRole('button',{name:/Take the scouting gauntlet/}).click();
 await expect.poll(async()=> (await readSave(page)).entries.length).toBe(1000);
 expect((await readSave(page)).entries.some(entry=>entry.id===save.run?.id)).toBe(true);
 await page.reload();const restored=await readSave(page);expect(restored.entries).toHaveLength(1000);expect(previewSave(JSON.stringify(restored)).ok).toBe(true);
});

test('a failed save on the last binder slot warns and keeps an exportable in-tab snapshot',async({page})=>{
 const save=emptySave();fillBinder(save,999);save.run=runAtGauntlet();expect(previewSave(JSON.stringify(save)).errors).toEqual([]);
 await page.goto('/');await writeSave(page,save);await page.goto('/#play');await page.reload();
 await page.evaluate(()=>{IDBObjectStore.prototype.put=function(){throw Error('Quota failure for test');};});
 await page.getByRole('button',{name:/Take the scouting gauntlet/}).click();
 await expect(page.locator('.save-warning')).toContainText('Saving on this device did not finish');await expect(page.locator('.save-warning').getByRole('button',{name:'Export save'})).toBeVisible();
 const persisted=await readSave(page);expect(persisted.entries).toHaveLength(999);expect(JSON.stringify(persisted.run)).toBe(JSON.stringify(save.run));
 const download=page.waitForEvent('download');await page.locator('.save-warning').getByRole('button',{name:'Export save'}).click();const exported=await download,path=await exported.path();
 const recovered=JSON.parse(readFileSync(path!,'utf8')) as SaveEnvelope;expect(recovered.entries).toHaveLength(1000);expect(recovered.entries.some(entry=>entry.id===save.run?.id)).toBe(true);expect(previewSave(JSON.stringify(recovered)).ok).toBe(true);
});

test('an oversized import is rejected before it can replace the current collection',async({page})=>{
 const current=emptySave();current.run=createRun('Keep this run',11,909,'2026-01-01T00:00:00.000Z');await page.goto('/');await writeSave(page,current);await page.reload();
 const tooMany=emptySave();fillBinder(tooMany,1001);
 await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:'Import game save'}).click();
 await page.locator('#save-file').setInputFiles({name:'oversized-binder.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(tooMany))});
 await expect(page.getByRole('alert')).toContainText('more than 1,000 cards');
 const persisted=await readSave(page);expect(JSON.stringify(persisted)).toBe(JSON.stringify(current));
});

test('the public backup flow exports and re-imports a v1.3.1 collection without changing saved outcomes',async({page})=>{
 const save=collectionFixture as unknown as SaveEnvelope;await page.goto('/');await writeSave(page,save);await page.reload();
 await page.getByRole('button',{name:'Settings'}).click();
 const exportedDownload=page.waitForEvent('download');await page.getByRole('button',{name:/Export game save/}).click();
 const exportedFile=await exportedDownload,exportedPath=await exportedFile.path();expect(exportedPath).not.toBeNull();
 const exported=JSON.parse(readFileSync(exportedPath!,'utf8'));expect(JSON.stringify(exported)).toBe(JSON.stringify(save));
 await page.getByRole('button',{name:'Import game save'}).click();
 await page.locator('#save-file').setInputFiles({name:'draft-bound-save.json',mimeType:'application/json',buffer:readFileSync(exportedPath!)});
 await expect(page.locator('.import-preview')).toContainText('SAVE CHECKED');
 const backupDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Replace with this save'}).click();
 expect((await backupDownload).suggestedFilename()).toContain('draft-bound-save-');
 expect(JSON.stringify(await readSave(page))).toBe(JSON.stringify(save));
});

test('fresh creation defaults to Full, preserves Quick, and resets Full for the next new flow',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Create your prospect',exact:true}).click();
 const full=page.getByRole('radio',{name:'Full · 8 picks',exact:true}),quick=page.getByRole('radio',{name:'Quick · 3 picks',exact:true});
 await expect(full).toBeChecked();await expect(quick).toBeVisible();
 await expect(page.locator('#creation-mode-description')).toContainText('manual potential selections');
 await expect(page.locator('#creation-mode-description')).toContainText('natural gift is separate');
 await quick.check();await page.getByRole('button',{name:'Create prospect',exact:true}).click();
 expect((await readSave(page)).run?.creationMode).toBe('quick');await page.reload();expect((await readSave(page)).run?.creationMode).toBe('quick');await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'The game',exact:true}).click();await page.getByRole('button',{name:'Resume your prospect',exact:true}).click();expect((await readSave(page)).run?.creationMode).toBe('quick');
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:/My binder/}).click();
 await page.getByRole('button',{name:'New prospect',exact:true}).click();
 await page.getByRole('button',{name:'Discard run & start fresh',exact:true}).click();
 await expect(full).toBeChecked();await page.getByRole('button',{name:'Create prospect',exact:true}).click();
 expect((await readSave(page)).run?.creationMode).toBe('full');
 await page.reload();expect((await readSave(page)).run?.creationMode).toBe('full');
});

test('editable controls stay at least 16px and fit narrow mobile viewports',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.goto('/');
 await page.getByRole('button',{name:'Create your prospect',exact:true}).click();
 for(const width of [320,375,390]){
  await page.setViewportSize({width,height:800});
  for(const selector of ['#prospect-name','#jersey-number'])expect(await page.locator(selector).evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:/My binder/}).click();
 for(const width of [320,375,390]){
  await page.setViewportSize({width,height:800});
  for(const selector of ['.search-box input','.binder-controls select'])expect(await page.locator(selector).first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.getByRole('button',{name:'Settings'}).click();
 for(const width of [320,375,390]){
  await page.setViewportSize({width,height:800});
  expect(await page.locator('#appearance').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:'Import game save'}).click();
 await page.locator('details.paste-save summary').click();
 for(const width of [320,375,390]){
  await page.setViewportSize({width,height:800});
  expect(await page.locator('#import-text').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('coach prompt describes the one-game focus before training',async({page})=>{
 const save=emptySave(),run=createCollege(904);run.pendingIntervention={id:'coach-copy',type:'wr.jugs',label:'Jugs',attributeId:'hands',cause:'Drops exceeded the target.',year:1,sourceBlock:1};save.run=run;
 expect(previewSave(JSON.stringify(save)).errors).toEqual([]);await page.goto('/');await writeSave(page,save);await page.reload();await page.getByRole('button',{name:'Resume your prospect',exact:true}).click();
 await expect(page.locator('.coach-note .coach-footnote')).toHaveText('Coach’s focus applies to the next game. Your selected plan resumes afterward.');
});

test('the focused training target stays legible on mobile',async({page})=>{
 const save=emptySave();save.run=createCollege(905);await page.goto('/');await writeSave(page,save);await page.reload();await page.getByRole('button',{name:'Resume your prospect',exact:true}).click();
 await page.setViewportSize({width:320,height:800});await page.getByRole('button',{name:/Focused/}).click();
 expect(await page.locator('#training-target').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Settings'}).click();await page.getByLabel('Appearance',{exact:true}).selectOption('dark');
 expect(await page.locator('#training-target').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
});
