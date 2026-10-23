import {test,expect,Page} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {emptySave} from '../src/app/persistence/save';
import {createCollege,step} from '../src/app/domain/test-fixtures';
import {SaveEnvelope} from '../src/app/domain/models';

async function load(page:Page,save:SaveEnvelope){
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();
 await page.evaluate(data=>new Promise<void>((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put(data,'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}),save);
 await page.goto('/#play');await page.reload();
}
async function current(page:Page){return page.evaluate(()=>new Promise<SaveEnvelope>((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,get=db.transaction('state').objectStore('state').get('current');get.onsuccess=()=>{resolve(get.result);db.close();};get.onerror=()=>reject(get.error);};}));}

test('automatic sources reveal individually before the recruit rating, and skipping never rerolls',async({page})=>{
 const save=emptySave();save.run=createCollege(82);save.run.phase='reveal';save.run.collegeId='';
 await load(page,save);
 await expect(page.locator('app-trait-reveal')).toBeVisible();
 await expect(page.locator('.attribute-rail')).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Find my college/})).toHaveCount(0);
 await page.getByRole('button',{name:'Reveal next trait',exact:true}).click();
 await expect(page.locator('.automatic-trait.is-revealed')).toHaveCount(1);
 await expect(page.locator('.automatic-trait.is-revealed .automatic-source')).toHaveText(/\w/);
 await page.getByRole('button',{name:'Show all remaining traits',exact:true}).click();
 await expect(page.locator('.automatic-trait.is-revealed')).toHaveCount(5);
 await expect(page.locator('app-recruit-rating')).toBeVisible();
 mkdirSync('docs/validation/screenshots',{recursive:true});
 await expect.poll(()=>page.locator('.automatic-trait').last().evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'docs/validation/screenshots/recruit-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'docs/validation/screenshots/traits-mobile.png',fullPage:true});
 const before=(await current(page)).run!;
 await page.reload();
 await page.getByRole('button',{name:'Show all remaining traits',exact:true}).click();
 expect((await current(page)).run!.rng).toBe(before.rng);
 expect((await current(page)).run!.prospect).toEqual(before.prospect);
 await page.getByRole('button',{name:/Find my college/}).click();
 await expect(page.locator('app-recruit-rating')).toBeVisible();
});

test('quick broadcast uses four committed games with pause, skip, replay and refresh safety',async({page})=>{
 const save=emptySave();save.settings.theme='dark';save.run=createCollege(314);await load(page,save);
 await page.getByRole('button',{name:/Play next block/}).click();
 await expect(page.locator('app-game-broadcast')).toBeVisible();
 const before=(await current(page)).run!;expect(before.lastBlock!.games).toHaveLength(4);
 await page.getByRole('button',{name:'Pause broadcast',exact:true}).click();
 await page.getByRole('button',{name:'Next broadcast moment',exact:true}).click();
 await expect(page.locator('.broadcast-final')).toContainText(String(before.lastBlock!.games[0].teamScore));
 await page.getByRole('button',{name:'Skip broadcast',exact:true}).click();
 await expect(page.locator('.game-list details')).toHaveCount(4);
 await page.getByRole('button',{name:'Replay block broadcast',exact:true}).click();
 await expect(page.locator('app-game-broadcast')).toBeVisible();
 await page.reload();
 await expect(page.locator('app-game-broadcast')).toBeVisible();
 await page.getByRole('button',{name:'Skip broadcast',exact:true}).click();
 expect((await current(page)).run!.history).toEqual(before.history);
 expect((await current(page)).run!.rng).toBe(before.rng);
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Replay block broadcast',exact:true}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect.poll(()=>page.locator('.broadcast').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 await page.screenshot({path:'docs/validation/screenshots/broadcast-mobile.png',fullPage:true});
});

test('reduced motion shows automatic traits and game recaps without mandatory timed playback',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const save=emptySave();save.run=createCollege(82);save.run.phase='reveal';await load(page,save);
 await expect(page.locator('.automatic-trait.is-revealed')).toHaveCount(5);
 await expect(page.getByRole('button',{name:/Find my college/})).toBeVisible();
 await page.getByRole('button',{name:/Find my college/}).click();
 await page.getByRole('button',{name:/Choose MERIDIAN/}).click();
 await page.getByRole('button',{name:/Play next block/}).click();
 await expect(page.locator('.game-list details')).toHaveCount(4);
});

test('autoplay broadcasts all four actual finals and then opens the recap',async({page})=>{
 const save=emptySave();save.run=createCollege(314);await load(page,save);await page.clock.install();
 await page.getByRole('button',{name:/Play next block/}).click();
 await expect(page.locator('app-game-broadcast')).toBeVisible();
 const before=(await current(page)).run!;
 await page.getByRole('button',{name:'Pause broadcast',exact:true}).click();
 await page.clock.runFor(20000);
 await expect(page.locator('.broadcast-moment')).toHaveAttribute('data-moment','0');
 await page.getByRole('button',{name:'Resume broadcast',exact:true}).click();
 for(let i=0;i<4;i++){
  await expect(page.locator('.broadcast-matchup')).toContainText(before.lastBlock!.games[i].opponent);
  await page.clock.runFor(1400);
  await expect(page.locator('.broadcast-final strong')).toHaveText(`${before.lastBlock!.games[i].teamScore} – ${before.lastBlock!.games[i].opponentScore}`);
  await page.clock.runFor(1600);
 }
 await expect(page.locator('app-game-broadcast')).toHaveCount(0);
 await expect(page.locator('.game-list details')).toHaveCount(4);
 expect((await current(page)).run!.history).toEqual(before.history);
});
