import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ART_SCENES} from '../src/app/data/art-scenes';

/** Run with --strict once user-supplied replacements have been integrated. Checks duplicate image bytes even when filenames differ; distinct compositions still need visual review. */
const byHash=new Map<string,string[]>(),missing:string[]=[];
for(const scene of ART_SCENES){
 const path=new URL('../public/'+scene.art,import.meta.url);
 if(!existsSync(path)){missing.push(scene.id);continue;}
 const hash=createHash('sha256').update(readFileSync(path)).digest('hex');
 byHash.set(hash,[...(byHash.get(hash)??[]),scene.id]);
}
const duplicates=[...byHash.values()].filter(scenes=>scenes.length>1);
console.log(JSON.stringify({scenes:ART_SCENES.length,uniqueImages:byHash.size,missing,sharedArtwork:duplicates,pendingUserArt:duplicates.length>0},null,2));
if(process.argv.includes('--strict')&&(missing.length||duplicates.length))process.exitCode=1;
