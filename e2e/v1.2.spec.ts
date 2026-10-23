import {test,expect} from '@playwright/test';
import {finishBroadcast} from './broadcast-helper';

test('new prospect offers generated editable names, future positions, and complete Full creation after reload',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Create your prospect',exact:true}).click();
 const name=page.getByLabel('Prospect name',{exact:true});await expect(name).not.toHaveValue('');
 const original=await name.inputValue();await page.getByRole('button',{name:'Randomize prospect name',exact:true}).click();await expect(name).not.toHaveValue(original);
 await name.fill('Full Journey');
 await expect(page.getByRole('radio',{name:'Wide receiver',exact:true})).toBeChecked();
 await expect(page.getByRole('radio',{name:/Quarterback.*Coming soon/})).toBeDisabled();
 await page.getByRole('radio',{name:'Full',exact:true}).check();
 await page.getByRole('button',{name:'Create prospect',exact:true}).click();
 await page.locator('.gift-card').first().click();await page.getByRole('button',{name:/This is my build/}).click();
 for(let i=0;i<8;i++){
  await expect(page.locator('.section-bar').filter({hasText:'TRAIT SELECTION'})).toContainText(`${i+1} / 8`);
  await page.locator('.trait-option').first().click();
  if(i===2){await expect(page.locator('.section-bar').filter({hasText:'TRAIT SELECTION'})).toContainText('4 / 8');await expect(page.locator('.trait-option').first()).toBeEnabled();await page.reload();}
 }
 await expect(page.locator('app-trait-reveal')).toHaveCount(0);
 await expect(page.locator('app-recruit-rating')).toBeVisible();
 await page.getByRole('button',{name:/Find my college/}).click();
 await expect(page.locator('.college-card')).toHaveCount(3);
 await page.setViewportSize({width:900,height:900});
 const meters=await page.locator('.program-meters>div').evaluateAll(rows=>rows.map(row=>{
  const label=row.querySelector('span')!.getBoundingClientRect(),bar=row.querySelector('.meter')!.getBoundingClientRect(),value=row.querySelector('strong')!.getBoundingClientRect(),card=row.closest('.college-card')!.getBoundingClientRect();
  return label.right<=bar.left&&bar.right<=value.left&&value.right<=card.right-5;
 }));expect(meters.every(Boolean)).toBe(true);
 await page.getByRole('button',{name:/Choose MERIDIAN/}).click();
 for(let year=1;year<=2;year++){
  for(let block=0;block<3;block++){
   await page.getByRole('button',{name:/Play next block/}).click();await finishBroadcast(page);
   await expect(page.locator('.game-list details')).toHaveCount(4);await page.locator('.stage-actions .button.primary').click();
  }
  if(year===1){await page.getByRole('button',{name:/Plan my next season/}).click();await page.getByRole('button',{name:/Choose CINDER RIDGE/}).click();}
 }
 await page.getByRole('button',{name:/Declare for the draft/}).click();await page.getByRole('button',{name:/Take the scouting gauntlet/}).click();
 await page.getByRole('button',{name:/Create draft card/}).click();await page.reload();
 await expect(page.locator('.preview-card')).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:/Download card PNG/}).click();expect((await download).suggestedFilename()).toContain('draft.png');
});

test('all five palettes keep readable controls in both appearances, including accent icons',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Save and game settings'}).click();
 for(const palette of ['Original forest','Midnight copper','Navy & gold','Charcoal & orange','Deep teal & cream']){
  await page.getByRole('radio',{name:palette,exact:true}).check();
  for(const appearance of ['light','dark']){
   await page.getByLabel('Appearance',{exact:true}).selectOption(appearance);
   const ratios=await page.evaluate(()=>{
    const css=getComputedStyle(document.documentElement),rgb=(name:string)=>{
     const probe=document.createElement('span');probe.style.color=css.getPropertyValue(name);document.body.append(probe);const color=getComputedStyle(probe).color;probe.remove();return color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
    },l=(name:string)=>{const c=rgb(name);return c[0]*.2126+c[1]*.7152+c[2]*.0722;},contrast=(a:string,b:string)=>{const x=l(a),y=l(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    return [contrast('--ink','--paper'),contrast('--muted','--surface'),contrast('--on-accent','--orange'),contrast('--ink','--surface-selected')];
   });for(const ratio of ratios)expect(ratio,`${palette} ${appearance}`).toBeGreaterThanOrEqual(4.5);
  }
 }
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('button',{name:'Create your prospect',exact:true}).click();
 expect(await page.locator('.modal .button.primary app-icon path').first().evaluate(e=>getComputedStyle(e).stroke)).toBe(await page.locator('.modal .button.primary').evaluate(e=>getComputedStyle(e).color));
});

test('palette and appearance persist independently without recoloring the printed card',async({page})=>{
 await page.goto('/');const printed=await page.locator('.hero-card .collectible').evaluate(e=>getComputedStyle(e).backgroundColor);
 await page.getByRole('button',{name:'Save and game settings'}).click();
 await page.getByLabel('Appearance',{exact:true}).selectOption('dark');
 await page.getByRole('radio',{name:'Navy & gold',exact:true}).check();
 await expect(page.locator('html')).toHaveAttribute('data-palette','navy');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByRole('button',{name:'Close dialog'}).click();await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-palette','navy');
 expect(await page.locator('.hero-card .collectible').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(printed);
 await page.getByRole('button',{name:'Save and game settings'}).click();
 await expect(page.getByRole('radio',{name:'Navy & gold',exact:true})).toBeChecked();
 await page.getByLabel('Appearance',{exact:true}).selectOption('light');
 await expect(page.locator('html')).toHaveAttribute('data-palette','navy');
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('help titles align and approved branding uses unique clearance masks',async({page})=>{
 await page.goto('/');await expect(page.locator('.wordmark app-brand svg')).toBeVisible();
 const ids=await page.locator('app-brand mask').evaluateAll(es=>es.map(e=>e.id));expect(new Set(ids).size).toBe(ids.length);expect(ids.length).toBeGreaterThan(1);
 await page.getByRole('button',{name:'How to play',exact:true}).click();
 const lefts=await page.locator('.help-steps h3').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().left));expect(Math.max(...lefts)-Math.min(...lefts)).toBeLessThan(1);
});
