import {test,expect} from '@playwright/test';
import {emptySave} from '../src/app/persistence/save';
import {createCollege,completeRun} from '../src/app/domain/test-fixtures';
import {writeSave,readSave} from './storage-helper';

test('Back from information restores a homepage opened without a hash',async({page})=>{
 await page.goto('/');await expect(page.locator('.hero')).toBeVisible();
 await page.getByRole('contentinfo').getByRole('link',{name:'About',exact:true}).click();await expect(page.getByRole('heading',{name:'About',exact:true})).toBeVisible();
 await page.goBack();await expect(page).toHaveURL(/\/$/);await expect(page.locator('.hero')).toBeVisible();
});

test('information deep links, refresh and Back preserve the active run and collection',async({page})=>{
 await page.goto('/');await expect(page.getByRole('button',{name:'Create your prospect',exact:true})).toBeVisible();
 const save=emptySave();save.run=createCollege(314);save.entries=[completeRun(82).entry!];await writeSave(page,save);
 await page.goto('/#play');await page.reload();await expect(page.locator('.training-grid')).toBeVisible();
 const before=await readSave(page);
 for(const title of ['About','Privacy','Terms','Contact']){
  await page.getByRole('contentinfo').getByRole('link',{name:title,exact:true}).click();
  await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeFocused();
  await expect(page).toHaveURL(new RegExp('#'+title.toLowerCase()+'$'));
  await page.reload();await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();
 }
 for(const title of ['Terms','Privacy','About']){await page.goBack();await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();}
 await page.goBack();await expect(page.locator('.training-grid')).toBeVisible();
 expect(await readSave(page)).toEqual(before);
});

test('information stays readable when storage cannot load; legal copy remains a draft',async({page})=>{
 await page.addInitScript(()=>{IDBFactory.prototype.open=function(){throw Error('Storage unavailable for test');};});
 for(const id of ['about','privacy','terms','contact']){
  await page.goto('/#'+id);await expect(page.getByRole('heading',{name:new RegExp('^'+id+'$','i'),level:1})).toBeVisible();
  if(id!=='about')await expect(page.locator('.information-draft')).toContainText('Draft');
  await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await expect(page.locator('main a[href^="mailto:"]')).toHaveCount(0);
});
