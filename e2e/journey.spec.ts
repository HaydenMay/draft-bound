import {finishBroadcast} from './broadcast-helper';
import {test,expect,Page} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
import {SaveEnvelope} from '../src/app/domain/models';
import {completeRun} from '../src/app/domain/test-fixtures';
import {emptySave} from '../src/app/persistence/save';
async function saved(page:Page):Promise<SaveEnvelope>{return page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result;const get=db.transaction('state').objectStore('state').get('current');get.onsuccess=()=>{db.close();resolve(get.result);};get.onerror=()=>reject(get.error);};request.onerror=()=>reject(request.error);}));}
async function phase(page:Page,value:string){await expect.poll(async()=>(await saved(page))?.run?.phase).toBe(value);}
async function skip(page:Page){const button=page.getByRole('button',{name:/Skip reveal/});if(await button.isVisible())await button.click();}
async function create(page:Page,name='Jordan Hayes'){
 await page.goto('/');await page.getByRole('button',{name:/Create your prospect/}).click();await page.getByLabel('Prospect name',{exact:true}).fill(name);await page.getByRole('radio',{name:'Quick · 3 picks',exact:true}).check();await page.getByRole('button',{name:/Create prospect/}).click();await phase(page,'gift');await skip(page);
 await page.locator('.gift-card').first().click();await phase(page,'size');await skip(page);await page.getByRole('button',{name:/This is my build/}).click();await phase(page,'potential');await skip(page);
 for(let n=0;n<3;n++){await page.locator('.trait-option').first().click();await phase(page,n===2?'reveal':'potential');await skip(page);}
 await page.getByRole('button',{name:/Find my college/}).click();await phase(page,'college-choice');await page.getByRole('button',{name:/Choose MERIDIAN/}).click();await phase(page,'training');
}
test('complete college, draft card, saved refresh, later NFL career and PNG export',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await create(page);
 for(let year=1;year<=2;year++){
  for(let block=0;block<3;block++){await page.getByRole('button',{name:/Play next block/}).click();await phase(page,'block-review');await finishBroadcast(page);await expect(page.locator('.game-list details')).toHaveCount(4);await page.locator('.stage-actions .button.primary').click();await phase(page,block===2?'season-review':'training');}
  if(year===1){await page.getByRole('button',{name:/Plan my next season/}).click();await phase(page,'transfer');await page.getByRole('button',{name:/Choose CINDER RIDGE/}).click();await phase(page,'training');}
 }
 await page.getByRole('button',{name:/Declare for the draft/}).click();await phase(page,'gauntlet');await page.getByRole('button',{name:/Take the scouting gauntlet/}).click();await phase(page,'draft-night');await skip(page);
 const before=await saved(page);expect(before.entries).toHaveLength(1);expect(before.entries[0].draft.history).toHaveLength(24);expect(before.entries[0].career).toBeNull();const draft=before.entries[0].draft;
 await page.getByRole('button',{name:/Create draft card/i}).click();await expect(page.locator('.card-builder')).toBeVisible();
 await expect(page.locator('.preview-card img')).toHaveJSProperty('complete',true);mkdirSync('docs/validation/screenshots',{recursive:true});await page.screenshot({path:'docs/validation/screenshots/card-desktop.png',fullPage:true});
 const download=page.waitForEvent('download');await page.getByRole('button',{name:/Download card PNG/}).click();const card=await download;expect(card.suggestedFilename()).toMatch(/draft\.png$/);await card.saveAs('test-results/draft-card.png');
 const exported=readFileSync('test-results/draft-card.png').toString('base64');
 const metadataPixels=await page.evaluate(async(base64)=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const context=canvas.getContext('2d')!;context.drawImage(image,0,0);const pixels=context.getImageData(50,950,800,280).data;let dark=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]+pixels[i+1]+pixels[i+2]<350)dark++;return dark;},exported);expect(metadataPixels).toBeGreaterThan(2000);
 await page.getByRole('button',{name:/Save to my binder/}).click();await expect(page.locator('.binder-grid')).toBeVisible();await page.reload();await expect(page.locator('.binder-grid')).toBeVisible();
 await page.getByRole('button',{name:/View Jordan Hayes/}).click();await page.getByRole('button',{name:/Simulate pro career/}).click();await expect(page.locator('.career-metrics')).toBeVisible();
 const after=await saved(page);expect(after.entries[0].draft).toEqual(draft);expect(after.entries[0].career!.seasons.length).toBeGreaterThanOrEqual(3);expect(after.entries[0].careerCard).not.toBeNull();
 await page.screenshot({path:'docs/validation/screenshots/career-desktop.png',fullPage:true});expect(errors).toEqual([]);
});
test('normal reveal, skip, reduced motion, rerolls and mobile layout',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.hero-card img')).toHaveJSProperty('complete',true);mkdirSync('docs/validation/screenshots',{recursive:true});await page.screenshot({path:'docs/validation/screenshots/home-mobile.png',fullPage:true});
 await page.getByRole('button',{name:/Create your prospect/}).click();await page.getByLabel('Prospect name',{exact:true}).fill('Mobile Prospect');await page.getByRole('button',{name:/Create prospect/}).click();await phase(page,'gift');await skip(page);await expect(page.locator('.gift-card')).toHaveCount(3);await page.locator('.gift-card').first().click();await phase(page,'size');await skip(page);await page.getByRole('button',{name:/Reroll build/}).click();await skip(page);await expect.poll(async()=>(await saved(page)).run!.rerolls).toBe(2);
 await page.getByRole('button',{name:/This is my build/}).click();await phase(page,'potential');await skip(page);await expect(page.locator('.source-option').first()).toBeEnabled();await expect(page.getByRole('button',{name:/Reroll offers/})).toBeVisible();expect((await page.locator('.stage-body').boundingBox())!.width).toBeGreaterThan(320);await page.screenshot({path:'docs/validation/screenshots/creation-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.trait-option').first().click();await expect.poll(async()=>(await saved(page)).run!.creation.manualCount).toBe(1);await expect(page.getByRole('button',{name:/Skip reveal/})).toHaveCount(0);
 await page.reload();await expect(page.locator('.trait-picker')).toBeVisible();expect((await saved(page)).run!.creation.manualCount).toBe(1);
});
test('save import validates preview and keeps old state on rejection',async({page})=>{
 await create(page,'Import Prospect');await page.getByRole('button',{name:'Settings'}).click();const saveDownload=page.waitForEvent('download');await page.getByRole('button',{name:/Export game save/}).click();const file=await saveDownload;await file.saveAs('test-results/save.json');await page.getByRole('button',{name:/Import game save/}).click();await page.locator('#save-file').setInputFiles('test-results/save.json');await expect(page.getByText('Importing replaces your current run and binder.')).toBeVisible();
 const backup=page.waitForEvent('download');await page.getByRole('button',{name:/Replace with this save/}).click();await backup;await expect(page.getByRole('dialog')).toHaveCount(0);expect((await saved(page)).run!.name).toBe('Import Prospect');
 await page.getByRole('button',{name:'Settings'}).click();await page.getByRole('button',{name:/Import game save/}).click();await page.locator('.paste-save summary').click();await page.getByLabel('Game save JSON').fill('{"schemaVersion":99}');await page.getByRole('button',{name:/Preview save/}).click();await expect(page.getByRole('alert')).toBeVisible();expect((await saved(page)).run!.name).toBe('Import Prospect');
});
test('another tab cannot overwrite newer game progress through settings or retry',async({page,context})=>{
 await create(page,'Two Tab Prospect');const second=await context.newPage();await second.goto('/#play');await second.getByRole('button',{name:/Play next block/}).click();await phase(second,'block-review');await expect(page.getByText('Your save changed in another tab. Reload this tab before making more choices.')).toBeVisible();
 await page.locator('.speed-toggle').click();await expect.poll(async()=>(await saved(second)).run!.history.length).toBe(4);await second.close();
});
test('unreadable stored records are never overwritten by retry or settings',async({page})=>{
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();await page.evaluate(()=>new Promise<void>((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put({schemaVersion:99,precious:'original'},'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}));await page.reload();await expect(page.getByRole('alert')).toBeVisible();await page.getByRole('button',{name:/Retry save/}).click();expect((await saved(page) as any).schemaVersion).toBe(99);
});
test('unsupported historical positions remain viewable and exportable without customization',async({page})=>{
 const data=emptySave(),entry=completeRun().entry!;entry.positionId='qb-future';delete (entry.draft as any).transfers;data.entries=[entry];
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();await page.evaluate(data=>new Promise<void>((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put(data,'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}),data);
 await page.goto(`/#entry/${entry.id}/draft`);await page.reload();await expect(page.locator('.preview-card')).toBeVisible();await expect(page.getByRole('button',{name:/Save to my binder/})).toHaveCount(0);const download=page.waitForEvent('download');await page.getByRole('button',{name:/Download card PNG/}).click();expect((await download).suggestedFilename()).toMatch(/draft\.png$/);
});

