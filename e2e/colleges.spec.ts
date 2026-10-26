import {test,expect,Page} from '@playwright/test';
import {emptySave} from '../src/app/persistence/save';
import {createCollege,step} from '../src/app/domain/test-fixtures';
import {transition} from '../src/app/domain/engine';
import {SaveEnvelope} from '../src/app/domain/models';
async function load(page:Page,save:SaveEnvelope){
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();
 await page.evaluate(data=>new Promise<void>(resolve=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put(data,'current');tx.oncomplete=()=>{db.close();resolve();};};}),save);
 await page.goto('/#play');await page.reload();
}
test('school offers explain prestige and training targets without mobile overflow',async({page})=>{
 const save=emptySave();save.run=createCollege(82,'v1.4.4');save.run.collegeSystemVersion='v1.4.5';save.run.phase='college-choice';save.run.collegeId='';
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await load(page,save);
 await expect(page.locator('.college-card')).toHaveCount(6);await expect(page.locator('.recruiting-offers')).toContainText('offers');
 await expect(page.locator('.school-target').first()).toContainText('trainable');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'docs/validation/screenshots/v145-offers-mobile.png',fullPage:true});
 await page.locator('.college-card button').first().click();await expect(page.locator('.training-grid')).toBeVisible();
 await expect(page.locator('.rail-footnote')).toContainText('trainable');
});
test('declaration goes straight to a weighted draft report and survives reload',async({page})=>{
 const save=emptySave();let run=createCollege(82,'v1.4.4');run.collegeSystemVersion='v1.4.5';
 for(let y=1;y<=2;y++){for(let b=0;b<3;b++){run=step(run,{type:'train',plan:{mode:'balanced'}});run=step(run,{type:'continue'});}if(y===1){run=step(run,{type:'continue'});run=step(run,{type:'transfer',collegeId:run.collegeId});}}
 save.run=run;await page.emulateMedia({reducedMotion:'reduce'});await load(page,save);
 await page.getByRole('button',{name:/Declare for the draft/}).click();
 await expect(page.locator('app-draft-report')).toContainText('70%');await expect(page.locator('app-draft-report')).toContainText('Development areas');
 await expect(page.getByRole('button',{name:/Take the scouting/})).toHaveCount(0);
 await page.reload();await expect(page.locator('app-draft-report')).toContainText('20%');await page.screenshot({path:'docs/validation/screenshots/v145-draft-report.png',fullPage:true});
 await page.getByRole('button',{name:/See your NFL career/}).click();await page.getByRole('button',{name:/View college journey/}).click();await expect(page.locator('app-draft-report')).toBeVisible();
});
