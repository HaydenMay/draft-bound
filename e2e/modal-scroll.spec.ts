import {test,expect} from '@playwright/test';

test('opening a modal locks the home page while allowing the modal to scroll',async({page})=>{
 await page.setViewportSize({width:390,height:650});
 await page.goto('/');
 await page.evaluate(()=>window.scrollTo(0,400));
 const homeScroll=await page.evaluate(()=>window.scrollY);
 expect(homeScroll).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Create your prospect',exact:true}).evaluate(element=>(element as HTMLButtonElement).click());
 const modal=page.locator('.modal');
 await expect(modal).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
 const canScrollModal=await modal.evaluate(element=>element.scrollHeight>element.clientHeight);
 expect(canScrollModal).toBe(true);

 await page.mouse.move(8,420);
 await page.mouse.wheel(0,600);
 await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
 await expect.poll(()=>page.locator('.modal-backdrop').evaluate(element=>element.scrollTop)).toBe(0);

 await modal.evaluate(element=>element.scrollTop=0);
 await page.mouse.move(200,540);
 await page.mouse.wheel(0,500);
 await expect.poll(()=>modal.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
 await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
 await page.getByRole('button',{name:'Close dialog'}).click();
 await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(homeScroll);
});
