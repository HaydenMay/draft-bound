import {test,expect} from '@playwright/test';
import {createCollege,step} from '../src/app/domain/test-fixtures';
import {emptySave} from '../src/app/persistence/save';
import {readSave,writeSave} from './storage-helper';
import {finishBroadcast} from './broadcast-helper';

test('mobile coaching preserves the chosen plan, runs four games and reloads the new save',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const save=emptySave(),run=createCollege(904);save.run=run;save.settings.fastForward=true;
 run.pendingIntervention={id:'coach-v143',type:'wr.jugs',label:'Jugs',attributeId:'hands',cause:'Drops exceeded the target.',year:1,sourceBlock:1};
 const expected=step(run,{type:'train',plan:{mode:'focused',attributeId:'speed'}});
 await page.goto('/');await writeSave(page,save);await page.reload();
 await page.getByRole('button',{name:'Resume your prospect',exact:true}).click();
 await expect(page.locator('.coach-note .coach-footnote')).toBeVisible();
 await expect(page.getByRole('button',{name:/Use coach/})).toHaveCount(0);
 await page.getByRole('button',{name:/Focused/}).click();await page.locator('#training-target').selectOption('speed');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:/Play next block/}).click();
 await expect.poll(async()=>(await readSave(page)).run?.phase).toBe('block-review');await finishBroadcast(page);
 const saved=(await readSave(page)).run!;expect(saved.balanceVersion).toBe('v1.4.3');expect(saved.history).toEqual(expected.history);expect(saved.prospect).toEqual(expected.prospect);
 await page.locator('.stage-actions .button.primary').click();await expect(page.locator('.training-option.selected')).toContainText('Focused');await expect(page.locator('#training-target')).toHaveValue('speed');
 await page.reload(); // The #play deep link restores training directly.
 await expect(page.locator('.training-grid')).toBeVisible();expect((await readSave(page)).run?.prospect).toEqual(expected.prospect);
});
