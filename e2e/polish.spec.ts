import {test,expect} from '@playwright/test';

test('ornamental marks are removed and the settings gear is centered',async({page})=>{
 await page.goto('/');await expect(page.locator('.hero-card .collectible')).toBeVisible();
 await expect(page.locator('app-icon[name="mark"]')).toHaveCount(0);
 const box=await page.locator('.settings-button svg path').first().evaluate(el=>{const b=(el as SVGGraphicsElement).getBBox();return {x:b.x+b.width/2,y:b.y+b.height/2};});
 expect(box.x).toBeCloseTo(12,1);expect(box.y).toBeCloseTo(12,1);
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:844});
  const alignment=await page.locator('.settings-button').evaluate(button=>{const rect=button.getBoundingClientRect(),path=button.querySelector('svg path') as SVGGraphicsElement,bounds=path.getBBox(),point=new DOMPoint(bounds.x+bounds.width/2,bounds.y+bounds.height/2).matrixTransform(path.getScreenCTM()!);return{x:point.x-(rect.left+rect.width/2),y:point.y-(rect.top+rect.height/2)};});
  expect(Math.abs(alignment.x)).toBeLessThan(.25);expect(Math.abs(alignment.y)).toBeLessThan(.25);
 }
 const logo=await page.locator('.hero-card .card-brand app-brand').evaluate(el=>({primary:getComputedStyle(el).color,accent:getComputedStyle(el.querySelector('[data-role="accent"]')!).stroke}));
 const tokens=await page.evaluate(()=>{const el=document.createElement('i');document.body.append(el);el.style.color='var(--print-brand-primary)';const primary=getComputedStyle(el).color;el.style.color='var(--print-brand-accent)';const accent=getComputedStyle(el).color;el.remove();return{primary,accent};});
 expect(logo).toEqual(tokens);
});

test('position tiles follow the reference, remain equal, and cannot start unavailable gameplay',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Create your prospect',exact:true}).click();
 const tiles=page.locator('app-position-picker button');await expect(tiles).toHaveCount(4);
 await expect(page.getByRole('button',{name:'WR Wide receiver',exact:true})).toHaveAttribute('aria-pressed','true');
 for(const name of ['QB Quarterback Coming soon','RB Running back Coming soon','TE Tight end Coming soon'])await expect(page.getByRole('button',{name,exact:true})).toBeDisabled();
 expect(await page.locator('.position-tile:disabled').first().evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 for(const width of [1440,768,390]){await page.setViewportSize({width,height:1000});const sizes=await tiles.evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return[b.width,b.height];}));expect(Math.max(...sizes.map(s=>s[0]))-Math.min(...sizes.map(s=>s[0]))).toBeLessThan(1);expect(Math.max(...sizes.map(s=>s[1]))-Math.min(...sizes.map(s=>s[1]))).toBeLessThan(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await expect(page.getByRole('radio',{name:'Quick',exact:true})).toBeChecked();await page.getByRole('radio',{name:'Full',exact:true}).check();
 await page.getByRole('button',{name:'Create prospect',exact:true}).click();await expect(page.locator('.gift-card')).toHaveCount(3);
});

test('gallery previews without persisting until Apply and retains keyboard comparison',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Settings',exact:true}).click();
 const root=page.locator('html');await expect(page.getByRole('radio',{name:'Forest & Coral',exact:true})).toBeChecked();
 await expect(page.getByRole('radio')).toHaveCount(16);
 await page.getByRole('radio',{name:'Midnight copper',exact:true}).focus();await page.keyboard.press('Space');
 await expect(page.locator('.theme-preview')).toHaveAttribute('data-palette','copper');await expect(root).toHaveAttribute('data-palette','forest');
 await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('button',{name:'Settings',exact:true}).click();
 await expect(page.getByRole('radio',{name:'Forest & Coral',exact:true})).toBeChecked();
 await page.getByRole('radio',{name:'Midnight copper',exact:true}).check();await page.keyboard.press('ArrowRight');await expect(page.getByRole('radio',{name:'Navy Gold',exact:true})).toBeChecked();
 await page.getByRole('button',{name:'Apply theme',exact:true}).click();await expect(root).toHaveAttribute('data-palette','navy');
 await page.getByRole('button',{name:'Close dialog'}).click();await page.reload();await expect(root).toHaveAttribute('data-palette','navy');
});

test('System preview follows appearance and a failed Apply retains the candidate for retry',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('/');await page.getByRole('button',{name:'Settings',exact:true}).click();
 await page.getByRole('radio',{name:'Navy Gold',exact:true}).check();await expect(page.locator('.theme-preview')).toHaveAttribute('data-theme','dark');
 await page.emulateMedia({colorScheme:'light'});await expect(page.locator('.theme-preview')).toHaveAttribute('data-theme','light');
 await page.evaluate(()=>{IDBObjectStore.prototype.put=function(){throw Error('Quota failure for test');};});
 const apply=page.getByRole('button',{name:'Apply theme',exact:true});await apply.focus();await page.keyboard.press('Enter');
 await expect(page.locator('.palette-save-error')).toContainText('could not be saved');
 await expect(page.locator('html')).toHaveAttribute('data-palette','forest');await expect(page.getByRole('radio',{name:'Navy Gold',exact:true})).toBeChecked();
 await expect(page.getByRole('button',{name:'Apply theme',exact:true})).toBeEnabled();
 await expect(apply).toBeFocused();
});

test('failed appearance changes display the committed preference and survive reload accurately',async({page})=>{
 await page.emulateMedia({colorScheme:'light'});await page.goto('/');await page.getByRole('button',{name:'Settings',exact:true}).click();
 await expect(page.getByLabel('Appearance',{exact:true})).toHaveValue('system');
 await page.evaluate(()=>{IDBObjectStore.prototype.put=function(){throw Error('Quota failure for test');};});
 await page.getByLabel('Appearance',{exact:true}).selectOption('dark');await expect(page.locator('.save-warning')).toBeVisible();
 await expect(page.getByLabel('Appearance',{exact:true})).toHaveValue('system');await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect(page.locator('.appearance-save-error')).toContainText('could not be saved');
 await page.getByRole('button',{name:'Close dialog'}).click();await page.reload();await page.getByRole('button',{name:'Settings',exact:true}).click();
 await expect(page.getByLabel('Appearance',{exact:true})).toHaveValue('system');await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});
