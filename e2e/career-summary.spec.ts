import {test,expect,Page} from '@playwright/test';
import {completeRun} from '../src/app/domain/test-fixtures';
import {emptySave,previewSave} from '../src/app/persistence/save';
import {readSave,writeSave} from './storage-helper';
import {COLLEGES} from '../src/app/data/colleges';
function fixture(allProCount=0){
 const save=emptySave(),entry=completeRun(82,3,'v1.4.4').entry!;
 const career=entry.career!;
 career.seasons=career.seasons.map((s,i)=>({...s,allPro:i<allProCount,...(i<allProCount?{stats:{...s.stats,yards:1800,touchdowns:12}}:{})}));
 career.awards=career.seasons.filter(s=>s.allPro).map(s=>({id:entry.id+'-ap-'+s.year,type:'all_pro',label:'All-Pro',stage:'nfl',season:s.year,evidence:{yards:s.stats.yards,touchdowns:s.stats.touchdowns},rulesVersion:entry.draft.rulesVersion}));
 career.totals=career.seasons.reduce((a,s)=>({targets:a.targets+s.stats.targets,receptions:a.receptions+s.stats.receptions,yards:a.yards+s.stats.yards,touchdowns:a.touchdowns+s.stats.touchdowns}),{targets:0,receptions:0,yards:0,touchdowns:0});
 career.induction={inducted:false,criteria:'14,500 receiving yards · 85 receiving TDs · 2 All-Pro seasons · 8 professional seasons'};career.status='simulated_not_inducted';
 save.entries=[entry];expect(previewSave(JSON.stringify(save)).ok).toBe(true);return save;
}
async function load(page:Page,save:ReturnType<typeof fixture>,view='career'){
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();await writeSave(page,save);
 await page.goto('/#'+view+'/'+save.entries[0].id);await page.reload();
}
for(const count of [0,2])test('recap distinguishes '+count+' earned All-Pro seasons from Hall requirements',async({page})=>{
 const save=fixture(count);if(count===0)await page.setViewportSize({width:390,height:844});await load(page,save);
 await expect(page.locator('.career-heading > p')).toContainText(count+' All-Pro seasons');
 await expect(page.locator('.career-heading > p')).not.toContainText('14,500');
 await page.getByText('Hall of Fame requirements',{exact:true}).click();await expect(page.locator('.hall-requirements')).toContainText('2 All-Pro seasons');
 await expect(page.locator('tbody tr').filter({hasText:'All-Pro'})).toHaveCount(count);if(count===0)await page.screenshot({path:test.info().outputPath('career-requirements-mobile.png'),fullPage:true});
 expect((await readSave(page)).entries[0].career).toEqual(save.entries[0].career);
});
test('mobile blueprint rounds earned ceilings consistently without changing stored precision',async({page})=>{
 const save=fixture(),entry=save.entries[0],d=entry.draft;
 d.collegeSystemVersion='v1.4.5';d.years=d.years.map((y,i)=>({...y,schoolId:i<2?'westhaven':'northstar'}));d.schoolId='northstar';
 d.transfers=[{afterYear:2,from:'westhaven',to:'northstar',previousOvr:d.years[1].endOvr,previousGrade:d.years[1].stats.grade}];
 entry.display.schoolName='Northstar University';entry.display.schoolColors=COLLEGES.find(s=>s.id==='northstar')!.colors;
 for(const [id,value] of [['hands',94.46769567334069],['bodyControl',93.70247788627849]] as const){d.prospect.current[id]=value;const a=entry.display.attributes.find(a=>a.id===id)!;a.value=value;a.ceiling=value;}
 expect(previewSave(JSON.stringify(save)).ok).toBe(true);await page.setViewportSize({width:390,height:844});await load(page,save,'entry');
 await page.getByRole('button',{name:'The blueprint',exact:true}).click();
 for(const label of ['Hands','Body control'])await expect(page.locator('.detail-attributes > div').filter({has:page.getByText(label,{exact:true})}).locator('span')).toHaveText('94 / 94');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:test.info().outputPath('rounded-blueprint-mobile.png'),fullPage:true});
 await page.reload();expect((await readSave(page)).entries[0].draft.prospect.current).toEqual(d.prospect.current);
});
