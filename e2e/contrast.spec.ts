import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {PALETTES} from '../src/app/data/palettes';

test('all 32 rendered palette appearances meet text, control and state contrast',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Settings',exact:true}).click();
 await expect(page.getByLabel('Appearance',{exact:true})).toBeVisible();
 await page.getByRole('radio',{name:'Midnight copper',exact:true}).check();
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
 const results=[];
 for(const palette of PALETTES)for(const appearance of ['light','dark']){
  const checks=await page.evaluate(async({id,appearance})=>{
   const root=document.documentElement;root.dataset['palette']=id;root.dataset['theme']=appearance;
   const preview=document.querySelector<HTMLElement>('.theme-preview')!;preview.dataset['palette']=id;preview.dataset['theme']=appearance;
   const probe=document.createElement('div');document.body.append(probe);
   const value=(role:string)=>{probe.style.color=`var(${role})`;return getComputedStyle(probe).color;};
   const luminance=(value:string)=>value.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   const ratio=(a:string,b:string)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   const pairs:{name:string;ratio:number;minimum:number}[]=[];
   const check=(name:string,a:string,b:string,minimum=4.5)=>pairs.push({name,ratio:ratio(a,b),minimum});
   for(const bg of ['--paper','--surface','--surface-raised','--surface-selected']){for(const text of ['--ink','--muted'])check(text+'/'+bg,value(text),value(bg));check('focus/'+bg,value('--focus'),value(bg),3);check('control/'+bg,value('--control-border'),value(bg),3);}
   check('link',value('--link'),value('--paper'));check('action',value('--on-accent'),value('--orange'));check('action hover',value('--on-accent'),value('--orange-hover'));
   check('selected border',value('--selection-border'),value('--surface-selected'),3);
   for(const state of ['honor','error','success'])check(state,value(`--${state}-text`),value(`--${state}-surface`));
   const select=getComputedStyle(document.querySelector('.appearance-setting select')!);check('actual appearance border',select.borderTopColor,select.backgroundColor,3);check('actual appearance text',select.color,select.backgroundColor);
   const source=select.backgroundImage.match(/url\(["']?([^"')]+)/)?.[1];
   if(source){const svg=new DOMParser().parseFromString(await(await fetch(source)).text(),'image/svg+xml');probe.style.color=svg.querySelector('path')!.getAttribute('stroke')!;check('actual select chevron',getComputedStyle(probe).color,select.backgroundColor,3);}else pairs.push({name:'actual select chevron missing',ratio:0,minimum:3});
   const skip=getComputedStyle(document.querySelector('.skip-link')!);check('actual skip link',skip.color,skip.backgroundColor);
   const button=getComputedStyle(document.querySelector('.palette-apply .button')!);check('actual apply text',button.color,button.backgroundColor);
   const action=getComputedStyle(document.querySelector('.preview-action')!);check('actual preview action',action.color,action.backgroundColor);
   const input=getComputedStyle(document.querySelector('.preview-input')!);check('actual preview input',input.color,input.backgroundColor);check('actual preview input border',input.borderTopColor,input.backgroundColor,3);
   probe.remove();return pairs;
  },{id:palette.id,appearance});
  results.push({palette:palette.id,appearance,checks});
 }
 writeFileSync('docs/validation/v1.3.1-contrast.json',JSON.stringify(results,null,2)+'\n');
 const failures=results.flatMap(r=>r.checks.filter(c=>c.ratio<c.minimum).map(c=>`${r.palette}/${r.appearance} ${c.name}: ${c.ratio.toFixed(2)} < ${c.minimum}`));
 expect(failures).toEqual([]);
});
