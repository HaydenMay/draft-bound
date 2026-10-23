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
export function cosmeticProfile(entries:BinderEntry[],prior:CosmeticProfile={achievements:[],frames:['classic']}):CosmeticProfile{
 const achievements=new Set(prior.achievements),frames=new Set(prior.frames);frames.add('classic');
 for(const e of entries){if(e.positionId!=='wr')continue;const d=e.draft;
  if(Object.keys(d.prospect.current).some(id=>d.prospect.current[id]-d.prospect.initial[id]>=30)){achievements.add('Gym rat');frames.add('training');}
  if(d.outcome.status==='drafted'&&d.outcome.overallPick<=32){achievements.add('First round');frames.add('silver');}
  if(d.finalOvr>=95){achievements.add('Elite prospect');frames.add('gold');}
  if(d.transfers.length&&d.years.some((y,i)=>i>0&&y.endOvr>d.years[i-1].endOvr)){achievements.add('New beginnings');frames.add('transfer');}
  if(d.finalOvr===99){achievements.add('Generational');frames.add('legend');}
 }return {achievements:[...achievements],frames:[...frames]};
}
