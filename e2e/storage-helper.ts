import {Page} from '@playwright/test';
import {SaveEnvelope} from '../src/app/domain/models';
export async function writeSave(page:Page,data:SaveEnvelope):Promise<void>{
 await page.evaluate(data=>new Promise<void>((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put(data,'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}),data);
}
export async function readSave(page:Page):Promise<SaveEnvelope>{return page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('draft-bound',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('state','readonly'),get=tx.objectStore('state').get('current');get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);tx.oncomplete=()=>db.close();};}));}
