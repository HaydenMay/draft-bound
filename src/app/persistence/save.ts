import {PALETTES} from '../data/palettes';
import {COACHING_TYPES} from '../domain/coaching';
import {SaveEnvelope} from '../domain/models';
import {RULES_VERSION,WR_DEFINITION} from '../domain/positions';
import {SOURCE_PLAYERS} from '../data/source-players';
import {COLLEGES} from '../data/colleges';
export function emptySave():SaveEnvelope{return {schemaVersion:1,rulesVersion:RULES_VERSION,run:null,entries:[],profile:{achievements:[],frames:['classic']},settings:{fastForward:false,theme:'system',palette:'forest'}};}
export const MAX_BINDER_ENTRIES=1000;
export const MAX_SAVE_BYTES=256*1024*1024;
const isObject=(x:any)=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const finite=(n:any,min=0,max=1e9)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const text=(s:any)=>typeof s==='string'&&s.length<=5000;
const array=(a:any,max=10000)=>Array.isArray(a)&&a.length<=max;
const frames=['classic','silver','gold','training','transfer','legend'];
const phases=['gift','size','potential','reveal','college-choice','training','block-review','season-review','transfer','gauntlet','draft-night','complete'];
const validIntervention=(i:any):boolean=>isObject(i)&&text(i.id)&&COACHING_TYPES.includes(i.type)&&WR_DEFINITION.attributes.some(a=>a.id===i.attributeId)&&text(i.label)&&text(i.cause)&&finite(i.year,1,3)&&finite(i.sourceBlock,1,2);
const validYear=(y:any):boolean=>isObject(y)&&finite(y.year,1,3)&&text(y.schoolId)&&finite(y.startOvr,0,99)&&finite(y.endOvr,y.startOvr,99)&&validStats(y.stats);
const validTransfer=(t:any):boolean=>isObject(t)&&finite(t.afterYear,1,2)&&text(t.from)&&text(t.to)&&finite(t.previousOvr,0,99)&&finite(t.previousGrade,0,100);
const validAward=(a:any):boolean=>isObject(a)&&text(a.id)&&text(a.label)&&['all_american','all_pro'].includes(a.type)&&finite(a.season,1,15)&&isObject(a.evidence);
function validStats(s:any):boolean{return isObject(s)&&['routes','targets','receptions','yards','touchdowns','drops','pressReps','pressLosses','contestedTargets','contestedCatches','redZoneTouchdowns','grade'].every(k=>finite(s[k]))&&s.receptions<=s.targets&&s.drops<=s.targets-s.receptions&&s.contestedCatches<=s.contestedTargets;}
function validProspect(p:any):boolean{return isObject(p)&&text(p.id)&&text(p.name)&&finite(p.initialOvr,0,99)&&finite(p.jerseyNumber,0,99)&&isObject(p.current)&&isObject(p.initial)&&isObject(p.traits)&&isObject(p.physical)&&finite(p.physical.heightCm,130,240)&&finite(p.physical.weightKg,45,180)&&WR_DEFINITION.attributes.every(a=>{const t=p.traits[a.id];return isObject(t)&&t.attributeId===a.id&&text(t.sourcePlayerId)&&finite(t.ceiling,60,99)&&finite(p.initial[a.id],0,t.ceiling)&&finite(p.current[a.id],p.initial[a.id],t.ceiling);});}
function validUnlocks(list:any):boolean{return array(list,100)&&list.every((u:any)=>isObject(u)&&text(u.id)&&text(u.sceneId)&&isObject(u.evidence)&&text(u.evidence.description)&&text(u.evidence.sourceId)&&isObject(u.evidence.facts));}
function validCard(c:any):boolean{return isObject(c)&&text(c.sceneId)&&frames.includes(c.frame)&&typeof c.foil==='boolean'&&typeof c.showStamp==='boolean';}
function validOutcome(o:any):boolean{return isObject(o)&&(o.status==='undrafted'||(o.status==='drafted'&&finite(o.overallPick,1,256)&&finite(o.round,1,7)&&finite(o.pickInRound,1,40)&&isObject(o.team)&&text(o.team.displayName)&&text(o.team.teamId)&&/^#[a-f\d]{6}$/i.test(o.team.primaryColor)&&/^#[a-f\d]{6}$/i.test(o.team.secondaryColor)));}
function validGame(g:any):boolean{return isObject(g)&&text(g.id)&&finite(g.year,1,3)&&finite(g.gameNumber,1,12)&&text(g.opponent)&&typeof g.won==='boolean'&&finite(g.teamScore)&&finite(g.opponentScore)&&validStats(g.stats)&&array(g.events,100)&&g.events.every((e:any)=>isObject(e)&&text(e.id)&&['catch','drop','coverage'].includes(e.kind)&&finite(e.yards,0,100)&&typeof e.touchdown==='boolean'&&typeof e.contested==='boolean'&&finite(e.catchDifficulty,0,1)&&finite(e.startDistance,0,100))&&array(g.highlights,100)&&g.highlights.every(text)&&isObject(g.gains);}
function validHistory(h:any):boolean{return array(h,36)&&h.every(validGame);}
function validDraft(d:any):boolean{return isObject(d)&&validProspect(d.prospect)&&validHistory(d.history)&&array(d.years,3)&&d.years.every(validYear)&&array(d.transfers,2)&&d.transfers.every(validTransfer)&&array(d.interventions,9)&&d.interventions.every(validIntervention)&&array(d.awards,3)&&d.awards.every(validAward)&&validUnlocks(d.unlocks)&&array(d.gauntlet,5)&&d.gauntlet.length===5&&d.gauntlet.every((g:any)=>finite(g.score,0,99)&&text(g.name))&&finite(d.collegeGrade,0,100)&&finite(d.evaluation,0,100)&&finite(d.finalOvr,0,99)&&validOutcome(d.outcome);}
function validEntry(e:any):boolean{
 if(!isObject(e)||!text(e.id)||!text(e.positionId)||!text(e.completedAt)||typeof e.favorite!=='boolean'||!isObject(e.display)||!text(e.display.positionLabel)||!text(e.display.schoolName)||!array(e.display.schoolColors,2)||!e.display.schoolColors.every((c:any)=>/^#[a-f\d]{6}$/i.test(c))||!array(e.display.attributes,30)||!e.display.attributes.every((a:any)=>isObject(a)&&text(a.id)&&text(a.label)&&finite(a.value,0,99)&&finite(a.ceiling,a.value,99))||!validCard(e.draftCard))return false;
 // Preserve unknown historical positions as displayable records without executing their rules.
 if(e.positionId!=='wr')return isObject(e.draft)&&isObject(e.draft.prospect)&&text(e.draft.prospect.name)&&finite(e.draft.finalOvr,0,99)&&validOutcome(e.draft.outcome)&&validUnlocks(e.draft.unlocks)&&isObject(e.draft.prospect.current)&&isObject(e.draft.prospect.initial)&&finite(e.draft.prospect.initialOvr,0,99)&&e.career===null;
 if(!validDraft(e.draft)||!finite(e.nflSeed,0,0xffffffff))return false;
 if(e.career===null)return e.careerCard===null;
 const c=e.career;return isObject(c)&&['simulated_not_inducted','simulated_inducted'].includes(c.status)&&array(c.seasons,15)&&c.seasons.length>=3&&c.seasons.every((s:any)=>isObject(s)&&finite(s.year,1,15)&&finite(s.age,18,50)&&isObject(s.team)&&text(s.team.displayName)&&isObject(s.stats)&&['targets','receptions','yards','touchdowns'].every(k=>finite(s.stats[k]))&&s.stats.receptions<=s.stats.targets)&&isObject(c.totals)&&['targets','receptions','yards','touchdowns'].every(k=>finite(c.totals[k]))&&array(c.awards,15)&&c.awards.every(validAward)&&isObject(c.induction)&&typeof c.induction.inducted==='boolean'&&text(c.induction.criteria)&&validUnlocks(c.unlocks)&&validCard(e.careerCard);
}
function validRun(r:any):boolean{
 if(!isObject(r)||r.positionId!=='wr'||r.rulesVersion!==RULES_VERSION||!text(r.id)||!text(r.name)||!phases.includes(r.phase)||!finite(r.seed,0,0xffffffff)||!finite(r.rng,0,0xffffffff)||!finite(r.nflSeed,0,0xffffffff)||!finite(r.rerolls,0,3)||!finite(r.year,1,3)||!finite(r.gameNumber,0,12)||!validHistory(r.history)||!array(r.years,3)||!array(r.transfers,2)||!array(r.interventions,9)||!array(r.usedInterventions,COACHING_TYPES.length)||!array(r.processedCommands,200)||!validUnlocks(r.unlocks)||!array(r.awards,3)||!isObject(r.creation))return false;
 if(r.creationMode!==undefined&&!['quick','full'].includes(r.creationMode)||r.balanceVersion!==undefined&&!['legacy','v1.2'].includes(r.balanceVersion))return false;
 const manualLimit=r.creationMode==='full'?8:3;
 const c=r.creation;if(!isObject(c.traits)||!array(c.giftOffers,3)||c.giftOffers.length!==3||!array(c.playerOffers,3)||!finite(c.manualCount,0,manualLimit)||!SOURCE_PLAYERS.some(p=>p.id===c.sizeOfferId))return false;
 const ids=WR_DEFINITION.attributes.map(a=>a.id);if(!Object.entries(c.traits).every(([id,t]:[string,any])=>ids.includes(id)&&isObject(t)&&text(t.sourcePlayerId)&&finite(t.ceiling,60,99)))return false;
 if(!c.giftOffers.every((g:any)=>isObject(g)&&ids.includes(g.attributeId)&&SOURCE_PLAYERS.some(p=>p.id===g.sourcePlayerId))||!c.playerOffers.every((id:any)=>SOURCE_PLAYERS.some(p=>p.id===id)))return false;
 if(!['gift','size','potential'].includes(r.phase)&&!validProspect(r.prospect))return false;
 if(!r.years.every(validYear)||!r.transfers.every(validTransfer)||!r.interventions.every(validIntervention)||!r.awards.every(validAward)||!r.processedCommands.every(text)||!r.usedInterventions.every(text)||!(r.pendingIntervention===null||validIntervention(r.pendingIntervention)))return false;
 if(r.lastBlock!==null&&(!isObject(r.lastBlock)||!array(r.lastBlock.games,4)||r.lastBlock.games.length!==4||!r.lastBlock.games.every(validGame)||!isObject(r.lastBlock.gains)||!finite(r.lastBlock.startOvr,0,99)||!finite(r.lastBlock.endOvr,0,99)))return false;
 if(r.phase==='block-review'&&r.lastBlock===null)return false;
 if(r.phase==='training'&&![0,4,8].includes(r.gameNumber))return false;
 if(r.phase==='block-review'&&![4,8,12].includes(r.gameNumber))return false;
 if(['season-review','transfer','gauntlet','draft-night','complete'].includes(r.phase)&&r.gameNumber!==12)return false;
 if(['gift','size','potential','reveal','college-choice'].includes(r.phase)&&(r.year!==1||r.gameNumber!==0||r.history.length!==0))return false;
 if(r.history.length!==(r.year-1)*12+r.gameNumber)return false;
 const traits=Object.values(c.traits) as any[],gifts=traits.filter(t=>t.origin==='gift').length,manual=traits.filter(t=>t.origin==='manual').length;
 if(r.phase==='gift'&&(traits.length!==0||c.manualCount!==0))return false;
 if(r.phase==='size'&&(traits.length!==1||gifts!==1||c.physical!==null))return false;
 if(r.phase==='potential'&&(gifts!==1||manual!==c.manualCount||traits.length!==1+c.manualCount||c.manualCount>=manualLimit||c.playerOffers.length!==3||!isObject(c.physical)))return false;
 if(!['gift','size','potential'].includes(r.phase)&&(traits.length!==9||gifts!==1||manual!==manualLimit||c.manualCount!==manualLimit))return false;
 if(['draft-night','complete'].includes(r.phase)&&!validDraft(r.draft))return false;
 if(['training','block-review','season-review','transfer','gauntlet','draft-night','complete'].includes(r.phase)&&!COLLEGES.some(c=>c.id===r.collegeId))return false;
 return r.draft===null||validDraft(r.draft);
}
export function previewSave(input:string):{ok:boolean;errors:string[];data?:SaveEnvelope}{
 try{
  if(input.length>MAX_SAVE_BYTES)throw Error('Choose a save file smaller than 256 MB.');
  const data=JSON.parse(input,(key,value)=>{if(['__proto__','constructor','prototype'].includes(key))throw Error('Unsafe property in save.');return value;});
  if(!isObject(data)||data.schemaVersion!==1)throw Error('This is not a supported Draft Bound save version.');
  if(!text(data.rulesVersion)||!array(data.entries))throw Error('The binder contains incomplete or invalid records.');
  if(data.entries.length>MAX_BINDER_ENTRIES)throw Error(`The binder cannot contain more than ${MAX_BINDER_ENTRIES.toLocaleString('en-US')} cards.`);
  if(!data.entries.every(validEntry)||new Set(data.entries.map((e:any)=>e.id)).size!==data.entries.length)throw Error('The binder contains incomplete or invalid records.');
  if(data.run!==null&&!validRun(data.run))throw Error('The active prospect is incomplete or uses incompatible rules.');
  if(!isObject(data.profile)||!array(data.profile.achievements,100)||!data.profile.achievements.every(text)||!array(data.profile.frames,6)||!data.profile.frames.every((f:any)=>frames.includes(f))||!isObject(data.settings)||typeof data.settings.fastForward!=='boolean'||(data.settings.theme!==undefined&&!['system','light','dark'].includes(data.settings.theme))||(data.settings.palette!==undefined&&typeof data.settings.palette!=='string'))throw Error('Save settings or collection unlocks are invalid.');
  if(typeof data.settings.palette==='string'&&!PALETTES.some(p=>p.id===data.settings.palette))data.settings.palette='forest';
  return {ok:true,errors:[],data};
 }catch(error){return {ok:false,errors:[error instanceof Error?error.message:'Could not read that save.']};}
}
export class GameRepository{
 private db:Promise<IDBDatabase>|null=null;
 private expectedRevision:string|undefined;
 constructor(private readonly name='draft-bound'){}
 private open():Promise<IDBDatabase>{return this.db??=new Promise((resolve,reject)=>{const request=indexedDB.open(this.name,1);request.onupgradeneeded=()=>request.result.createObjectStore('state');request.onsuccess=()=>resolve(request.result);request.onerror=()=>{this.db=null;reject(request.error);};request.onblocked=()=>reject(Error('Another tab is updating this save. Close it and retry.'));});}
 async read():Promise<SaveEnvelope|null>{const db=await this.open();return new Promise((resolve,reject)=>{const tx=db.transaction('state'),store=tx.objectStore('state'),current=store.get('current'),revision=store.get('revision');tx.oncomplete=()=>{this.expectedRevision=revision.result;resolve(current.result??null);};tx.onerror=()=>reject(tx.error);});}
 async write(data:SaveEnvelope):Promise<void>{const db=await this.open(),expected=this.expectedRevision;return new Promise((resolve,reject)=>{
  const tx=db.transaction('state','readwrite'),store=tx.objectStore('state'),revision=store.get('revision'),next=crypto.randomUUID();let conflict=false;
  revision.onsuccess=()=>{if(revision.result!==expected){conflict=true;tx.abort();return;}store.put(structuredClone(data),'current');store.put(next,'revision');};
  tx.oncomplete=()=>{this.expectedRevision=next;resolve();};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(conflict?new SaveConflictError():tx.error??Error('Save transaction was interrupted.'));
 });}
}
export class SaveConflictError extends Error{constructor(){super('Another tab changed this save. Export your progress, then reload.');this.name='SaveConflictError';}}

