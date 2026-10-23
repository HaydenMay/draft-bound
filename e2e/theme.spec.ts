import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {emptySave} from '../src/app/persistence/save';
import {createCollege,completeRun} from '../src/app/domain/test-fixtures';

test('appearance follows the system, persists an override, and preserves collectible colors',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.locator('.hero-card img')).toHaveJSProperty('complete',true);
 const cardColor=await page.locator('.hero-card .collectible').evaluate(el=>getComputedStyle(el).backgroundColor);
 await page.getByRole('button',{name:'Save and game settings'}).click();
 await expect(page.getByLabel('Appearance',{exact:true})).toHaveValue('system');
 await page.getByLabel('Appearance',{exact:true}).selectOption('light');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('draft-bound-theme'))).toBe('light');
 await expect(page.getByLabel('Appearance',{exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByRole('button',{name:'Save and game settings'}).click();
 await expect(page.getByLabel('Appearance',{exact:true})).toHaveValue('light');
 await page.getByLabel('Appearance',{exact:true}).selectOption('system');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.emulateMedia({colorScheme:'light'});
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByLabel('Appearance',{exact:true}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.getByLabel('Appearance',{exact:true})).toBeEnabled();
 mkdirSync('docs/validation/screenshots',{recursive:true});
 await page.screenshot({path:'docs/validation/screenshots/settings-dark.png',fullPage:true});
 await page.getByRole('button',{name:'Close dialog'}).click();
 expect(await page.locator('.hero-card .collectible').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(cardColor);
 const contrast=await page.locator('.hero-copy h1').evaluate(el=>{
  const rgb=(value:string)=>value.match(/[\d.]+/g)!.slice(0,3).map(Number);
  const luminance=(channels:number[])=>channels.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const text=luminance(rgb(getComputedStyle(el).color)),bg=luminance(rgb(getComputedStyle(document.documentElement).backgroundColor));
  return (Math.max(text,bg)+.05)/(Math.min(text,bg)+.05);
 });expect(contrast).toBeGreaterThan(7);
 await page.screenshot({path:'docs/validation/screenshots/home-dark.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'docs/validation/screenshots/home-dark-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('dark gameplay and binder use the same saved theme without changing card editions',async({page})=>{
 const save=emptySave();save.settings.theme='dark';save.run=createCollege(314);save.entries=[completeRun(82).entry!];
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();
 await page.evaluate(data=>new Promise<void>((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put(data,'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}),save);
 await page.goto('/#play');await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.getByRole('button',{name:/Play next block/})).toBeEnabled();
 mkdirSync('docs/validation/screenshots',{recursive:true});await page.screenshot({path:'docs/validation/screenshots/training-dark.png',fullPage:true});
 await page.getByRole('button',{name:/Play next block/}).click();await expect(page.locator('.game-list details')).toHaveCount(4);await expect(page.locator('.stage-actions .button.primary')).toBeEnabled();
 await page.getByRole('button',{name:/My binder 1/}).click();await page.getByRole('button',{name:/View Jordan Hayes/}).click();await page.getByRole('button',{name:/Customize card/}).click();await expect(page.locator('.preview-card img')).toHaveJSProperty('complete',true);await page.screenshot({path:'docs/validation/screenshots/card-dark.png',fullPage:true});
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');expect(await page.locator('.preview-card .collectible').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(230, 224, 203)');
 const contrast=await page.locator('.frame-choice.selected').evaluate(el=>{const rgb=(s:string)=>s.match(/[\d.]+/g)!.slice(0,3).map(Number);const lum=(s:string)=>rgb(s).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);const style=getComputedStyle(el),a=lum(style.color),b=lum(style.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});expect(contrast).toBeGreaterThan(4.5);
});
