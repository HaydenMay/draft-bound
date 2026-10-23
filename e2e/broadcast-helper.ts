import {Page,expect} from '@playwright/test';

/** Full-journey checks skip presentation; presentation.spec.ts tests the complete playback controls. */
export async function finishBroadcast(page:Page):Promise<void>{
 const skip=page.getByRole('button',{name:'Skip broadcast',exact:true});
 await expect(skip.or(page.locator('.review-head'))).toBeVisible();
 if(await skip.isVisible())await skip.click();
}
