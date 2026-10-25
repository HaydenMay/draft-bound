import {createRun,transition} from './engine';
import {GameCommandPayload,RunState} from './models';
import {WR_DEFINITION} from './positions';
import {COLLEGES} from '../data/colleges';
export const step=(run:RunState,p:GameCommandPayload)=>transition(run,{...p,id:`test-${run.processedCommands.length}`}).run;
export function createCollege(seed=82){
 let run=createRun('Jordan Hayes',11,seed,'2026-01-01T00:00:00.000Z');
 run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
 for(let i=0;i<3;i++){const attr=WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id;run=step(run,{type:'choose-trait',sourcePlayerId:run.creation.currentRoll?.receiverId??run.creation.playerOffers[0],attributeId:attr});}
 run=step(run,{type:'continue'});return step(run,{type:'choose-college',collegeId:COLLEGES[0].id});
}
export function completeRun(seed=82,years=3){
 let run=createCollege(seed);
 for(let year=1;year<=years;year++){
  for(let block=0;block<3;block++){run=step(run,{type:'train',plan:{mode:'balanced'}});run=step(run,{type:'continue'});}
  if(year===years){run=step(run,year===2?{type:'declare'}:{type:'continue'});break;}
  run=step(run,year===2?{type:'return'}:{type:'continue'});run=step(run,{type:'transfer',collegeId:COLLEGES[year%3].id});
 }
 const result=transition(run,{type:'scout',id:'scout-final'});return result;
}

