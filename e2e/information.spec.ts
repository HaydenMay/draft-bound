import {test,expect} from '@playwright/test';
import {emptySave} from '../src/app/persistence/save';
import {createCollege,completeRun} from '../src/app/domain/test-fixtures';
import {writeSave,readSave} from './storage-helper';

const informationPages=[
 {id:'about',link:'About',title:'About Draftbound'},
 {id:'privacy',link:'Privacy',title:'Privacy Policy'},
 {id:'terms',link:'Terms',title:'Terms of Use'},
 {id:'contact',link:'Contact',title:'Contact'}
];

test('Back from information restores a homepage opened without a hash',async({page})=>{
 await page.goto('/');await expect(page.locator('.hero')).toBeVisible();
 await page.getByRole('contentinfo').getByRole('link',{name:'About',exact:true}).click();await expect(page.getByRole('heading',{name:'About Draftbound',exact:true})).toBeVisible();
 await page.goBack();await expect(page).toHaveURL(/\/$/);await expect(page.locator('.hero')).toBeVisible();
});

test('information deep links, refresh and Back preserve the active run and collection',async({page})=>{
 await page.goto('/');await expect(page.getByRole('button',{name:'Create your prospect',exact:true})).toBeVisible();
 const save=emptySave();save.run=createCollege(314);save.entries=[completeRun(82).entry!];await writeSave(page,save);
 await page.goto('/#play');await page.reload();await expect(page.locator('.training-grid')).toBeVisible();
 const before=await readSave(page);
 for(const {id,link,title} of informationPages){
  await page.getByRole('contentinfo').getByRole('link',{name:link,exact:true}).click();
  await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeFocused();
  await expect(page).toHaveURL(new RegExp('#'+id+'$'));
  await page.reload();await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();
 }
 for(const title of ['Terms of Use','Privacy Policy','About Draftbound']){await page.goBack();await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();}
 await page.goBack();await expect(page.locator('.training-grid')).toBeVisible();
 expect(await readSave(page)).toEqual(before);
});

test('information stays readable when storage cannot load; legal copy remains a draft',async({page})=>{
 await page.addInitScript(()=>{IDBFactory.prototype.open=function(){throw Error('Storage unavailable for test');};});
 for(const {id,title} of informationPages){
  await page.goto('/#'+id);await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();
  if(id!=='about')await expect(page.locator('.information-draft')).toContainText('Draft');
  await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await expect(page.locator('main a[href^="mailto:"]')).toHaveCount(0);
});

test('Terms and Privacy provide readable, reloadable section links on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const id of ['terms','privacy']){
  await page.goto('/#'+id);
  await expect(page.getByText('Last Updated: October 24, 2026')).toBeVisible();
  const toc=page.getByRole('navigation',{name:'On this page'});
  const links=toc.getByRole('link');
  await expect(links).not.toHaveCount(0);
  await expect(page.locator('.information-page section p').first()).toHaveCSS('font-size','16px');
  await links.nth(1).click();
  const sectionId=await links.nth(1).getAttribute('href');
  await expect(page).toHaveURL(new RegExp(`#${id}/section-2$`));
  const target=page.locator(`[id="${sectionId!.slice(1)}"]`);
  await expect(target).toBeInViewport();
  await page.reload();
  await expect(target).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
