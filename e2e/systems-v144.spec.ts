import {test,expect} from '@playwright/test';
import {completeRun} from '../src/app/domain/test-fixtures';
import {emptySave,previewSave} from '../src/app/persistence/save';
import {readSave,writeSave} from './storage-helper';

test('one card saves a canonical design through old deep links; legacy cards retain their editions',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const save=emptySave(),modern=completeRun(82,2,'v1.4.4').entry!,legacy=completeRun(83,2).entry!;save.entries=[modern,legacy];
 const career=structuredClone(modern.career);expect(previewSave(JSON.stringify(save)).errors).toEqual([]);
 await page.goto('/');await writeSave(page,save);await page.goto(`/#card/${modern.id}/draft`);await page.reload();
 await expect(page.locator('.preview-card [data-card-edition]')).toHaveAttribute('data-card-edition','career');
 await expect(page.getByRole('group',{name:'Card edition'})).toHaveCount(0);
 await page.getByLabel(/Earned achievement stamp/).uncheck();await page.getByRole('button',{name:'Save to my binder'}).click();
 const restored=(await readSave(page)).entries[0];expect(restored.career).toEqual(career);expect(restored.careerCard!.showStamp).toBe(false);expect(restored.draftCard).toEqual(restored.careerCard);
 await page.goto(`/#card/${modern.id}/career`);await page.reload();await expect(page.getByLabel(/Earned achievement stamp/)).not.toBeChecked();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto(`/#card/${legacy.id}/draft`);await page.reload();await expect(page.getByRole('group',{name:'Card edition'})).toBeVisible();await expect(page.getByRole('button',{name:'Draft edition',exact:true})).toBeVisible();
 expect((await readSave(page)).entries[1]).toEqual(legacy);
});
