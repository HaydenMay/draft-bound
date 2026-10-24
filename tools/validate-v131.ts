/** Local production-prefix smoke and repeatable screenshot evidence. No application data is uploaded. */
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium,expect} from '@playwright/test';
import {emptySave} from '../src/app/persistence/save';
import {completeRun} from '../src/app/domain/test-fixtures';
import {simulateProfessional} from '../src/app/domain/professional';
import {PALETTES} from '../src/app/data/palettes';
import {writeSave,readSave} from '../e2e/storage-helper';

async function main(){
const root=resolve('dist/draft-bound/browser'),prefix='/draft-bound/',origin='http://127.0.0.1:4301';
if(!existsSync(resolve(root,'index.html')))throw Error('Run npm run build:pages first.');
const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json'};
const server=createServer((req,res)=>{try{const url=new URL(req.url!,origin);if(!url.pathname.startsWith(prefix)){res.writeHead(404).end();return;}const path=resolve(root,decodeURIComponent(url.pathname.slice(prefix.length))||'index.html');if(!path.startsWith(root+sep)&&path!==resolve(root,'index.html')){res.writeHead(403).end();return;}res.setHeader('Content-Type',mime[extname(path)]??'application/octet-stream');res.end(readFileSync(path));}catch{res.writeHead(404).end();}});
await new Promise<void>(r=>server.listen(4301,'127.0.0.1',r));
const browser=await chromium.launch();const context=await browser.newContext({reducedMotion:'reduce',acceptDownloads:true});
const page=await context.newPage(),external=new Set<string>(),failed:string[]=[],manifest:unknown[]=[];
page.on('request',r=>{if(r.url().startsWith('http')&&new URL(r.url()).origin!==origin)external.add(new URL(r.url()).origin);});page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});page.on('pageerror',e=>failed.push(e.message));
const folder='docs/validation/screenshots/v1.3.1';mkdirSync(folder,{recursive:true});
try{
 const save=emptySave(),entry=completeRun(314).entry!;entry.career=simulateProfessional(entry);entry.careerCard={...entry.draftCard,sceneId:entry.career.induction.inducted?'canton_bust':'prospect_journey'};save.entries=[entry];
 for(const scenario of [{name:'desktop',width:1440,height:1000,palette:'forest',theme:'light'},{name:'mobile',width:390,height:844,palette:'navy',theme:'dark'}] as const){
  await page.setViewportSize({width:scenario.width,height:scenario.height});await page.goto(origin+prefix);await expect(page.getByRole('button',{name:'Create your prospect',exact:true})).toBeVisible();
  // Keep the creator available while taking its reference screenshot.
  save.run=null;save.entries=[];save.settings.palette=scenario.palette;save.settings.theme=scenario.theme;await writeSave(page,save);await page.reload();
  const capture=async(screen:string)=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${folder}/${scenario.name}-${screen}.png`,animations:'disabled',fullPage:await page.locator('.modal').count()===0});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`Overflow: ${scenario.name}/${screen}`);manifest.push({...scenario,screen,file:`${scenario.name}-${screen}.png`});};
  await capture('home');await page.getByRole('button',{name:'Create your prospect',exact:true}).click();await expect(page.locator('app-position-picker')).toBeVisible();await capture('creator');await page.getByRole('button',{name:'Close dialog'}).click();
  await page.getByRole('button',{name:'Settings',exact:true}).click();await expect(page.getByLabel('Appearance',{exact:true})).toBeVisible();await capture('settings');await page.locator('.palette-options').evaluate(el=>el.scrollTo(0,el.scrollHeight));await page.getByRole('button',{name:'Apply theme',exact:true}).scrollIntoViewIfNeeded();await capture('gallery');await page.getByRole('button',{name:'Close dialog'}).click();
  save.entries=[entry];await writeSave(page,save);await page.goto(origin+prefix+'#binder');await page.reload();await expect(page.locator('.binder-tile')).toHaveCount(1);await capture('binder');
  const before=await readSave(page);
  for(const edition of ['draft','career']){await page.goto(`${origin}${prefix}#card/${entry.id}/${edition}`);await expect(page.locator('.preview-card .collectible')).toBeVisible();await capture(edition+'-card');}
  const downloading=page.waitForEvent('download');await page.getByRole('button',{name:/Download card PNG/}).click();const download=await downloading;await download.saveAs(`docs/validation/v1.3.1-${scenario.name}-career.png`);
  for(const id of ['about','privacy','terms','contact']){await page.goto(origin+prefix+'#'+id);await page.reload();await expect(page.locator('[data-information-heading]')).toBeFocused();await capture(id);}
  const after=await readSave(page);expect(after.entries).toEqual(before.entries);expect(after.run).toEqual(before.run);
 }
 for(const [palette,theme] of [['burgundy-bronze','dark'],['cobalt-crown','light']]){await page.goto(origin+prefix);await page.getByRole('button',{name:'Settings',exact:true}).click();await expect(page.locator('.theme-preview')).toBeVisible();await page.getByRole('radio',{name:PALETTES.find(p=>p.id===palette)!.name,exact:true}).check();await page.getByRole('button',{name:'Apply theme',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-palette',palette);await page.getByLabel('Appearance',{exact:true}).selectOption(theme);await expect(page.locator('html')).toHaveAttribute('data-theme',theme);await expect(page.locator('.theme-preview')).toHaveAttribute('data-theme',theme);await page.screenshot({path:`${folder}/gallery-${palette}-${theme}.png`,animations:'disabled',fullPage:false});await page.getByRole('button',{name:'Close dialog'}).click();}
 const cookies=await context.cookies();expect(external.size).toBe(0);expect(failed).toEqual([]);expect(cookies).toEqual([]);
 writeFileSync('docs/validation/v1.3.1-production.json',JSON.stringify({base:origin+prefix,externalOrigins:[...external],failed,cookies,manifest},null,2)+'\n');
 console.log(`Production-prefix smoke passed; ${manifest.length+2} screenshots, two PNG exports, no failed requests/page errors, external origins or cookies.`);
}finally{await browser.close();await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}

}
main().catch(e=>{console.error(e);process.exitCode=1;});
