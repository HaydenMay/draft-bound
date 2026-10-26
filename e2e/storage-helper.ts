import {Page} from '@playwright/test';
import {SaveEnvelope} from '../src/app/domain/models';
/** JSON transport avoids the large protocol object graph for thousand-card fixtures. */
export async function writeSave(page:Page,data:SaveEnvelope):Promise<void>{
 await page.evaluate(json=>new Promise<void>((resolve,reject)=>{
  const request=indexedDB.open('draft-bound',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('state');
  request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Fixture database is blocked'));
  request.onsuccess=()=>{
   const db=request.result;
   try{
    const tx=db.transaction('state','readwrite');
    tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>{db.close();reject(tx.error??Error('Fixture write aborted'));};
    tx.onerror=()=>{db.close();reject(tx.error);};
    tx.objectStore('state').put(JSON.parse(json),'current');
   }catch(error){db.close();reject(error);}
  };
 }),JSON.stringify(data));
}
export async function readSave(page:Page):Promise<SaveEnvelope>{
 const json=await page.evaluate(()=>new Promise<string>((resolve,reject)=>{
  const request=indexedDB.open('draft-bound',1);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Fixture database is blocked'));
  request.onsuccess=()=>{
   const db=request.result;
   try{const tx=db.transaction('state','readonly'),get=tx.objectStore('state').get('current');get.onsuccess=()=>resolve(JSON.stringify(get.result));get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();tx.onabort=()=>{db.close();reject(tx.error);};}
   catch(error){db.close();reject(error);}
  };
 }));return JSON.parse(json);
}
