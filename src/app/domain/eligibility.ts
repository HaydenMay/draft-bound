import {AwardRecord,BinderEntry,CosmeticProfile,EvidenceSnapshot,GameRecord,SceneUnlock,YearSummary} from './models';
import {RULES_VERSION} from './positions';
export function unlock(sceneId:string,evidence:Omit<EvidenceSnapshot,'rulesVersion'>):SceneUnlock{return {id:`${sceneId}:${evidence.id}`,sceneId,evidence:{...evidence,rulesVersion:RULES_VERSION}};}
export function addUnlock(list:SceneUnlock[],item:SceneUnlock):void {if(!list.some(u=>u.sceneId===item.sceneId))list.push(item);}
export function gameUnlocks(game:GameRecord):SceneUnlock[]{
 const output:SceneUnlock[]=[];
 for(const e of game.events){
  const base={id:e.id,kind:'gameEvent' as const,stage:'college' as const,sourceId:e.id,year:game.year,gameNumber:game.gameNumber,opponent:game.opponent,facts:{yards:e.yards,touchdown:e.touchdown,contested:e.contested,catchDifficulty:e.catchDifficulty,startDistance:e.startDistance}};
  if(e.kind==='catch'&&e.touchdown&&e.yards>=50)output.push(unlock('breakaway_star',{...base,description:`Year ${game.year}, game ${game.gameNumber}: ${e.yards}-yard TD vs ${game.opponent}.`}));
  if(e.kind==='catch'&&e.contested&&e.catchDifficulty>=.85)output.push(unlock('spectacular_catch',{...base,description:`Year ${game.year}, game ${game.gameNumber}: contested catch, difficulty ${Math.round(e.catchDifficulty*100)}, vs ${game.opponent}.`}));
 }
 const base={id:game.id,kind:'gameStats' as const,stage:'college' as const,sourceId:game.id,year:game.year,gameNumber:game.gameNumber,opponent:game.opponent};
 if(game.stats.touchdowns>=3&&game.stats.redZoneTouchdowns>=2)output.push(unlock('red_zone_monster',{...base,facts:{touchdowns:game.stats.touchdowns,redZoneTouchdowns:game.stats.redZoneTouchdowns},description:`${game.stats.touchdowns} TDs, including ${game.stats.redZoneTouchdowns} inside the 20, vs ${game.opponent}.`}));
 if(game.stats.yards>=150)output.push(unlock('breakout_star',{...base,facts:{yards:game.stats.yards},description:`${game.stats.yards} receiving yards vs ${game.opponent}.`}));
 return output;
}
export function seasonUnlocks(summary:YearSummary,award?:AwardRecord):SceneUnlock[]{
 const out:SceneUnlock[]=[];const s=summary.stats;
 if(s.receptions>=40&&s.drops===0)out.push(unlock('reliable_hands',{id:`season-${summary.year}`,kind:'seasonStats',stage:'college',sourceId:`season-${summary.year}`,year:summary.year,facts:{receptions:s.receptions,drops:s.drops},description:`Year ${summary.year}: ${s.receptions} catches without a drop.`}));
 if(award)out.push(unlock('award_ceremony',{id:award.id,kind:'award',stage:'college',sourceId:award.id,year:summary.year,facts:award.evidence,description:`Year ${summary.year}: earned ${award.label}.`}));
 return out;
}
export type CollectionAchievementId='Gym rat'|'First round'|'Elite prospect'|'New beginnings'|'Generational'|'Legendary career';
export interface AchievementDefinition {id:CollectionAchievementId;name:string;requirement:string;reward:string;frame:CosmeticProfile['frames'][number];}
/** Persisted names are IDs for the five existing achievements; new IDs are additive. */
export const ACHIEVEMENT_REGISTRY:readonly AchievementDefinition[]=Object.freeze([
 {id:'Gym rat',name:'Gym rat',requirement:'Improve any attribute by 30 or more points from its starting value.',reward:'Practice field card frame',frame:'training'},
 {id:'First round',name:'First round',requirement:'Be selected within the first 32 picks of draft night.',reward:'Silver card frame',frame:'silver'},
 {id:'Elite prospect',name:'Elite prospect',requirement:'Finish college with a 95 or higher overall rating.',reward:'Gold card frame',frame:'gold'},
 {id:'New beginnings',name:'New beginnings',requirement:'Transfer schools, then improve your overall rating the next season.',reward:'New chapter card frame',frame:'transfer'},
 {id:'Generational',name:'Generational',requirement:'Finish college with a 99 overall rating.',reward:'Legend card frame',frame:'legend'},
 {id:'Legendary career',name:'Legendary career',requirement:'Earn Hall of Fame induction in a completed simulated professional career.',reward:'Legend card frame',frame:'legend'},
]);
export function cosmeticProfile(entries:BinderEntry[],prior:CosmeticProfile={achievements:[],frames:['classic']}):CosmeticProfile{
 const achievements=new Set(prior.achievements),frames=new Set(prior.frames);frames.add('classic');
 for(const e of entries){if(e.positionId!=='wr')continue;const d=e.draft;
  if(Object.keys(d.prospect.current).some(id=>d.prospect.current[id]-d.prospect.initial[id]>=30))achievements.add('Gym rat');
  if(d.outcome.status==='drafted'&&d.outcome.overallPick<=32)achievements.add('First round');
  if(d.finalOvr>=95)achievements.add('Elite prospect');
  if(d.transfers.length&&d.years.some((y,i)=>i>0&&y.endOvr>d.years[i-1].endOvr))achievements.add('New beginnings');
  if(d.finalOvr===99)achievements.add('Generational');
  if(e.career?.induction.inducted)achievements.add('Legendary career');
 }
 for(const definition of ACHIEVEMENT_REGISTRY)if(achievements.has(definition.id))frames.add(definition.frame);
 return {achievements:[...achievements],frames:[...frames]};
}
export function achievementProgress(id:CollectionAchievementId,entries:BinderEntry[]):number|null{
 if(id==='Gym rat')return Math.min(30,Math.max(0,...entries.filter(e=>e.positionId==='wr').flatMap(e=>Object.keys(e.draft.prospect.current).map(a=>e.draft.prospect.current[a]-e.draft.prospect.initial[a]))));
 if(id==='First round'){const picks=entries.filter(e=>e.positionId==='wr'&&e.draft.outcome.status==='drafted').map(e=>(e.draft.outcome as Extract<BinderEntry['draft']['outcome'],{status:'drafted'}>).overallPick);return picks.length?Math.min(...picks):null;}
 if(id==='Elite prospect'||id==='Generational')return Math.max(0,...entries.filter(e=>e.positionId==='wr').map(e=>e.draft.finalOvr));
 return null;
}
