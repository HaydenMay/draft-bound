import type {PositionRules,WrGameStats,WrGameEvent} from './models';
import {Random,clamp} from './rng';
import {RULES_VERSION} from './positions';

/** A catch's displayed difficulty is the same difficulty used to resolve it. */
export function completionChance(hands:number,control:number,vertical:number,difficulty:number,contested:boolean,defense:number,reach:number):number{
 return contested?clamp(.25+(hands+control+vertical)/600-difficulty*.25-defense*.001+reach,.08,.86):clamp(.43+hands*.005-difficulty*.32-defense*.0015,.18,.95);
}
export const canAttemptFieldGoal=(down:number,distance:number)=>down<=4&&distance>0&&distance<=38;

export const simulateCollegeGame:PositionRules['simulateGame']=({prospect,college,year,gameNumber,seed})=>{
 const rng=new Random(seed),a=prospect.current,id=`${prospect.id}-y${year}-g${gameNumber}`;
 const stats:WrGameStats={routes:0,targets:0,receptions:0,yards:0,touchdowns:0,drops:0,pressReps:0,pressLosses:0,contestedTargets:0,contestedCatches:0,redZoneTouchdowns:0,grade:0};
 const events:WrGameEvent[]=[],possessions=rng.int(10,14),defense=rng.int(55,90);
 const separation=(a['routeRunning']*.5+a['speed']*.2+a['acceleration']*.15+a['awareness']*.15)/100;
 const passBudget=rng.int(28,42),playBudget=rng.int(62,78);
 let teamScore=0,opponentScore=0,passAttempts=0,plays=0;
 for(let drive=0;drive<possessions;drive++){
  let distance=rng.int(60,85),down=1,toFirst=10,scored=false;
  for(let play=0;play<14&&down<=4&&plays<playBudget;play++){
   if(down===4&&canAttemptFieldGoal(down,distance)){
    if(rng.chance(.80))teamScore+=3;
    scored=true;break; // The kick ends this possession, including a missed attempt.
   }
   plays++;const startDistance=distance,pass=passAttempts<passBudget&&rng.chance(.57),onRoute=pass&&rng.chance(clamp(.80*college.opportunity,.45,.98));
   if(pass)passAttempts++;
   let gain=0;
   if(onRoute){
    stats.routes++;const press=rng.chance(.38),lost=press&&rng.chance(clamp(.80-a['release']*.0065,.08,.60));
    if(press)stats.pressReps++;if(lost)stats.pressLosses++;
    const targeted=rng.chance(clamp((.12+separation*.30)*(lost?.25:1),.03,.44));
    if(targeted){
     stats.targets++;const contested=rng.chance(clamp(.38-separation*.18+defense*.001,.18,.42)),deep=rng.chance(.13+a['speed']*.001);
     const air=Math.min(distance,rng.int(deep?16:2,deep?36:14));
     const difficulty=clamp(.12+air/100+defense/350+(contested?.20:0)+rng.next()*.10,.1,1);
     const reach=clamp((prospect.physical.heightCm-185)/300,-.035,.035);
     const caught=rng.chance(completionChance(a['hands'],a['bodyControl'],a['vertical'],difficulty,contested,defense,reach));
     const drop=!caught&&rng.chance(clamp(.42-a['hands']*.002,.10,.35));
     if(contested)stats.contestedTargets++;
     if(caught){
      stats.receptions++;if(contested)stats.contestedCatches++;
      const yac=Math.round(rng.int(0,9)*(.5+a['yardsAfterCatch']/100));
      const breakaway=rng.chance(.008+a['speed']*a['yardsAfterCatch']/300000)?rng.int(18,45):0;
      gain=Math.min(distance,air+yac+breakaway);stats.yards+=gain;
      if(gain===distance){stats.touchdowns++;if(distance<=20)stats.redZoneTouchdowns++;}
     }else if(drop)stats.drops++;
     events.push({id:`${id}-e${events.length}`,kind:caught?'catch':drop?'drop':'coverage',yards:gain,touchdown:caught&&gain===distance,contested,catchDifficulty:difficulty,startDistance});
    }else gain=rng.chance(.61)?rng.int(2,18):0; // Another receiver or a checkdown.
   }else if(pass)gain=rng.chance(.61)?rng.int(2,18):0;
   else gain=rng.int(-2,10);
   gain=Math.min(distance,gain);distance-=gain;
   if(distance<=0){teamScore+=7;scored=true;break;}
   if(gain>=toFirst){down=1;toFirst=Math.min(10,distance);}else {down++;toFirst-=gain;}
  }
  if(!scored&&canAttemptFieldGoal(down,distance)&&rng.chance(.80))teamScore+=3;
  const opposing=rng.next();if(opposing<.25+(defense-55)/350)opponentScore+=7;else if(opposing<.49)opponentScore+=3;
 }
 if(teamScore===opponentScore){if(rng.chance(.5))teamScore+=3;else opponentScore+=3;}
 const rate=stats.targets?stats.receptions/stats.targets:0,ypr=stats.routes?stats.yards/stats.routes:0;
 const pressLoss=stats.pressReps?stats.pressLosses/stats.pressReps:0,contestedRate=stats.contestedTargets?stats.contestedCatches/stats.contestedTargets:0;
 const rawGrade=52+rate*18+Math.min(ypr,6)*4+Math.min(stats.receptions,12)*.8+stats.touchdowns*2.5-stats.drops*4-pressLoss*8+contestedRate*3;
 // Keep headroom between excellent and exceptional games instead of flattening both at100.
 stats.grade=clamp(rawGrade>90?90+(rawGrade-90)*.5:rawGrade,20,100);
 const highlights=events.filter(e=>e.touchdown||(e.kind==='catch'&&e.yards>=40)||(e.kind==='catch'&&e.contested&&e.catchDifficulty>=.85)).map(e=>e.touchdown?`${e.yards}-yard receiving touchdown${e.contested?' through contact':''}.`:e.yards>=40?`${e.yards}-yard reception, stopped short of the goal line.`:`Contested completion on a ${Math.round(e.catchDifficulty*100)}-difficulty throw.`);
 if(!highlights.length)highlights.push(`${stats.receptions} catches on ${stats.targets} targets; ${stats.routes} routes run.`);
 const opponents=['Pine Valley','Lake City','Canyon State','East Harbor','Prairie Tech','Ironwood','Mountain Union','South Coast','North Plains','Mesa Central','Oak Ridge','Riverbend'];
 return {id,positionId:'wr',rulesVersion:RULES_VERSION,year,gameNumber,opponent:opponents[(gameNumber-1+year*3)%12],opponentColors:['#263d45','#d8cfb7'],won:teamScore>opponentScore,teamScore,opponentScore,stats,events,highlights};
};
