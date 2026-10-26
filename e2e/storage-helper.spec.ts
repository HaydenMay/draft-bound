import {test,expect} from '@playwright/test';
import {writeSave} from './storage-helper';
import {emptySave} from '../src/app/persistence/save';
test('fixture storage rejects a synchronous clone error instead of hanging',async({page})=>{
 await page.goto('/');await expect(page.getByRole('button',{name:/Create your prospect/})).toBeVisible();
 await page.evaluate(()=>{IDBObjectStore.prototype.put=function(){throw new DOMException('Synthetic clone failure','DataCloneError');};});
 await expect(Promise.race([writeSave(page,emptySave()),new Promise((_,reject)=>setTimeout(()=>reject(Error('Helper did not reject the clone error')),1000))])).rejects.toThrow('Synthetic clone failure');
});
