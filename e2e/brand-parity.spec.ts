import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {previewSave} from '../src/app/persistence/save';
import legacyCollection from '../src/app/persistence/fixtures/v1.3.1-collection.json';
import {simulateProfessional} from '../src/app/domain/professional';
import {SHIELD_PATH} from '../src/app/shared/badge-geometry';
import {writeSave,readSave} from './storage-helper';

test('legacy school palettes and both editions retain canonical browser and PNG branding',async({page})=>{
 // Frozen earned outcomes keep this branding test independent of current creation balance.
 const restored=previewSave(JSON.stringify(legacyCollection));expect(restored.ok).toBe(true);
 const save=restored.data!;save.run=null;save.entries=save.entries.filter(entry=>entry.positionId==='wr').map(entry=>{
  entry.career??=simulateProfessional(entry);entry.careerCard??={...entry.draftCard};
  // Compare the same print treatment; foil/frame overlays intentionally change these pixels.
  entry.draftCard={...entry.draftCard,frame:'classic',foil:false};entry.careerCard={...entry.careerCard,frame:'classic',foil:false};return entry;
 });
 save.entries[0].display.schoolColors=['#000080','#ffcc00'];save.entries[1].display.schoolColors=['#006f68','#f0ead5'];delete save.settings.palette;
 await page.goto('/');await expect(page.getByRole('button',{name:'Create your prospect',exact:true})).toBeVisible();await writeSave(page,save);await page.reload();
 const before=await readSave(page),logos:string[]=[];let seals=0;
 for(const entry of save.entries)for(const edition of ['draft','career']){
  await page.goto(`/#card/${entry.id}/${edition}`);await expect(page.locator('.preview-card .card-brand app-brand')).toBeVisible();
  for(const palette of ['forest','navy']){
   await page.evaluate(id=>{document.documentElement.dataset['palette']=id;document.documentElement.dataset['theme']='dark';},palette);
   const logo=await page.locator('.preview-card .card-brand app-brand').evaluate(el=>({primary:getComputedStyle(el).color,accent:getComputedStyle(el.querySelector('[data-role="accent"]')!).stroke}));
   expect(logo).toEqual({primary:'rgb(23, 33, 30)',accent:'rgb(214, 86, 48)'});
   // Export is a pure view operation; bypass Save card via the store's existing export action in the UI.
   const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:/Download card PNG/}).click();const file=await downloadPromise;
   const path=`test-results/brand-${entry.id}-${edition}-${palette}.png`;await file.saveAs(path);
   if(await page.locator('.preview-card app-honor-badge').count()){
    const sealPixel=await page.evaluate(async base64=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1350;const ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0);return [...ctx.getImageData(690,150,1,1).data];},readFileSync(path).toString('base64'));
    expect(sealPixel).toEqual([24,58,45,255]);
    expect(await page.locator('.preview-card app-honor-badge path').evaluate(el=>getComputedStyle(el).fill)).toBe('rgb(24, 58, 45)');
   }
   const crop=await page.evaluate(async base64=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const c=document.createElement('canvas');c.width=88;c.height=54;const ctx=c.getContext('2d')!;ctx.drawImage(image,48,34,88,54,0,0,88,54);return c.toDataURL();},readFileSync(path).toString('base64'));logos.push(crop);
  }
  if(await page.locator('.preview-card app-honor-badge').count()){seals++;await expect(page.locator('.preview-card app-honor-badge path')).toHaveAttribute('d',SHIELD_PATH);}
 }
 expect(new Set(logos).size).toBe(1);expect(seals).toBeGreaterThan(0);
 const after=await readSave(page);expect(after.run).toEqual(before.run);expect(after.entries).toEqual(before.entries);
});
