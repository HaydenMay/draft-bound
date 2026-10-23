import {GameRecord,PositionRules,WrGameStats} from './models';
import {WR_DEFINITION,RULES_VERSION} from './positions';
import {SOURCE_PLAYERS} from '../data/source-players';
import {Random,clamp} from './rng';
const OPPONENTS=['Pine Valley','Lake City','Canyon State','East Harbor','Prairie Tech','Ironwood','Mountain Union','South Coast','North Plains','Mesa Central','Oak Ridge','Riverbend'];
export function emptyStats():WrGameStats{return {routes:0,targets:0,receptions:0,yards:0,touchdowns:0,drops:0,pressReps:0,pressLosses:0,contestedTargets:0,contestedCatches:0,redZoneTouchdowns:0,grade:0};}
export function sumStats(games:readonly {stats:WrGameStats}[]):WrGameStats {
 const result=emptyStats();for(const game of games)for(const key of Object.keys(result) as (keyof WrGameStats)[])result[key]+=game.stats[key];
 result.grade=games.length?result.grade/games.length:0;return result;
}
export const WR_RULES:PositionRules={definition:WR_DEFINITION,sourcePlayers:SOURCE_PLAYERS,simulateGame({prospect,college,year,gameNumber,seed}){
 const rng=new Random(seed),a=prospect.current,id=`${prospect.id}-y${year}-g${gameNumber}`;
 const stats=emptyStats(),events:GameRecord['events']=[];
 stats.routes=Math.round(rng.int(24,38)*college.opportunity);
 for(let rep=0;rep<stats.routes;rep++){
  const press=rng.chance(.42),lost=press&&rng.chance(clamp(.96-a['release']*.008,.10,.65));
  if(press)stats.pressReps++;if(lost)stats.pressLosses++;
  const separation=(a['routeRunning']*.5+a['speed']*.2+a['acceleration']*.15+a['awareness']*.15)/100;
  if(lost||!rng.chance(.13+separation*.31))continue;
  stats.targets++;const contested=rng.chance(.25),difficulty=contested?.7+rng.next()*.3:.1+rng.next()*.6;
  if(contested)stats.contestedTargets++;
 const reach=clamp((prospect.physical.heightCm-185)/300,-.035,.035);
 const catchChance=contested?clamp(.10+(a['hands']+a['bodyControl']+a['vertical'])/440+reach,.22,.85):clamp(.2+a['hands']*.007,.4,.94);
  const caught=rng.chance(catchChance),drop=!caught&&rng.chance(.42);
  let yards=0,touchdown=false,startDistance=rng.chance(.20)?rng.int(5,20):rng.int(21,90);
  if(caught){
   stats.receptions++;if(contested)stats.contestedCatches++;
   const deep=rng.chance(.10+a['speed']*.001);
   yards=Math.round(rng.int(3,deep?37:16)*(0.65+a['yardsAfterCatch']/160));
   if(deep&&rng.chance((a['speed']+a['yardsAfterCatch'])/600)){yards=rng.int(50,85);startDistance=yards;}
   yards=Math.min(startDistance,yards);touchdown=yards>=startDistance;
   if(touchdown){stats.touchdowns++;if(startDistance<=20)stats.redZoneTouchdowns++;}
   stats.yards+=yards;
  }else if(drop)stats.drops++;
  events.push({id:`${id}-e${events.length}`,kind:caught?'catch':drop?'drop':'coverage',yards,touchdown,contested,catchDifficulty:difficulty,startDistance});
 }
 stats.grade=clamp(47+stats.receptions*2.2+stats.yards*.11+stats.touchdowns*3.5-stats.drops*4-stats.pressLosses*.3,20,100);
 const teamScore=Math.max(stats.touchdowns*7,rng.int(10,31)+stats.touchdowns*7),opponentScore=rng.int(10,42);
 const highlights=events.filter(e=>e.touchdown||(e.kind==='catch'&&e.contested&&e.catchDifficulty>=.85)).map(e=>e.touchdown?`${e.yards}-yard receiving touchdown${e.contested?' through contact':''}.`:`Contested completion on a ${Math.round(e.catchDifficulty*100)}-difficulty throw.`);
 if(!highlights.length)highlights.push(`${stats.receptions} catches on ${stats.targets} targets; ${stats.routes} routes run.`);
 return {id,positionId:'wr',rulesVersion:RULES_VERSION,year,gameNumber,opponent:OPPONENTS[(gameNumber-1+year*3)%12],opponentColors:['#263d45','#d8cfb7'],won:teamScore>opponentScore,teamScore,opponentScore,stats,events,highlights};
}};
