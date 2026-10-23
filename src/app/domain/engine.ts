import {BinderEntry,DraftOutcome,DraftSnapshot,GameCommand,Intervention,RunState,TrainingPlan,Transition,TraitAssignment,WrAttributeId} from './models';
import {WR_DEFINITION,RULES_VERSION} from './positions';
import {CEILINGS,calculateOvr,develop,values} from './development';
import {Random} from './rng';
import {SOURCE_PLAYERS} from '../data/source-players';
import {COLLEGES} from '../data/colleges';
import {DRAFT_BOARD,DRAFT_TEAMS} from '../data/teams';
import {sumStats,WR_RULES} from './simulation';
import {addUnlock,gameUnlocks,seasonUnlocks,unlock} from './eligibility';
const ids=WR_DEFINITION.attributes.map(a=>a.id);
const source=(id:string)=>{const p=SOURCE_PLAYERS.find(p=>p.id===id);if(!p)throw Error('Unknown player source');return p;};
function offers(rng:Random):string[]{return Array.from({length:3},()=>rng.pick(SOURCE_PLAYERS).id);}
export function createRun(name:string,jerseyNumber:number,seed:number,createdAt=new Date().toISOString()):RunState {
 const rng=new Random(seed),remaining=[...ids];
 const giftOffers=Array.from({length:3},()=>{const attributeId=remaining.splice(rng.int(0,remaining.length-1),1)[0];return {attributeId,sourcePlayerId:rng.pick(SOURCE_PLAYERS.filter(p=>p.grades[attributeId as WrAttributeId]==='S')).id,grade:'S' as const};});
 const sizeOfferId=rng.pick(SOURCE_PLAYERS).id,nflSeed=rng.int(0,0xffffffff),id=`db-${seed.toString(36)}-${Date.parse(createdAt).toString(36)}`;
 return {id,positionId:'wr',rulesVersion:RULES_VERSION,createdAt,seed,rng:rng.state,nflSeed,name:name.trim().slice(0,32)||'Jordan Hayes',jerseyNumber:Math.max(0,Math.min(99,Math.round(jerseyNumber)||0)),phase:'gift',rerolls:3,creation:{traits:{},giftOffers,sizeOfferId,playerOffers:[],manualCount:0,physical:null},prospect:null,collegeId:'',year:1,gameNumber:0,history:[],years:[],transfers:[],interventions:[],usedInterventions:[],pendingIntervention:null,lastBlock:null,yearStartOvr:0,awards:[],unlocks:[],draft:null,processedCommands:[]};
}
function requirePhase(run:RunState,...phases:RunState['phase'][]):void{if(!phases.includes(run.phase))throw Error('That choice is unavailable at this stage.');}
function assign(run:RunState,attributeId:string,sourceId:string,origin:TraitAssignment['origin']):void{
 const p=source(sourceId),grade=origin==='gift'?'S':p.grades[attributeId as WrAttributeId];
 run.creation.traits[attributeId]={attributeId,sourcePlayerId:sourceId,grade,ceiling:CEILINGS[grade],origin};
}
export function detectIntervention(run:RunState):Intervention|null{
 if(!run.lastBlock||run.gameNumber>=12)return null;const games=run.lastBlock.games,s=sumStats(games);
 const triggers:[Intervention['type'],string,string,boolean][]=[
  ['wr.jugs','hands','Jugs machine',s.drops>=5||games.some(g=>g.stats.drops>=3)],
  ['wr.press','release','Beat the press',s.pressReps>=8&&s.pressLosses/s.pressReps>=.6],
  ['wr.contested','bodyControl','Through contact',s.contestedTargets>=5&&(s.contestedTargets-s.contestedCatches)/s.contestedTargets>=.7],
 ];
 for(const [type,attributeId,label,trigger]of triggers){
  if(!trigger||run.usedInterventions.includes(type)||!run.prospect||run.prospect.current[attributeId]>=run.prospect.traits[attributeId].ceiling)continue;
  const cause=type==='wr.jugs'?`${s.drops} drops in this block.`:type==='wr.press'?`${s.pressLosses} press losses in ${s.pressReps} reps.`:`${s.contestedTargets-s.contestedCatches} unfinished contested targets out of ${s.contestedTargets}.`;
  return {id:`${run.id}-${run.year}-${type}`,type,attributeId,label,cause,year:run.year,sourceBlock:run.gameNumber/4};
 }return null;
}
function finishSeason(run:RunState):void{
 if(run.years.some(y=>y.year===run.year))return;
 const stats=sumStats(run.history.filter(g=>g.year===run.year)),summary={year:run.year,schoolId:run.collegeId,startOvr:run.yearStartOvr,endOvr:calculateOvr(run.prospect!.current).raw,stats};run.years.push(summary);
 const award=stats.yards>=1200&&stats.touchdowns>=10&&stats.grade>=85?{id:`${run.id}-aa-${run.year}`,type:'all_american' as const,label:'All-American',stage:'college' as const,season:run.year,evidence:{yards:stats.yards,touchdowns:stats.touchdowns,grade:stats.grade},rulesVersion:RULES_VERSION}:undefined;
 if(award)run.awards.push(award);for(const item of seasonUnlocks(summary,award))addUnlock(run.unlocks,item);
 const transfer=run.transfers.find(t=>t.afterYear===run.year-1);
 if(transfer&&summary.endOvr-transfer.previousOvr>=5&&stats.grade-transfer.previousGrade>=5)addUnlock(run.unlocks,unlock('transfer_breakout',{id:`${run.id}-transfer-${run.year}`,kind:'transferComparison',stage:'college',sourceId:`season-${run.year}`,year:run.year,facts:{ovrBefore:transfer.previousOvr,ovrAfter:summary.endOvr,gradeBefore:transfer.previousGrade,gradeAfter:stats.grade},description:`After transferring: +${(summary.endOvr-transfer.previousOvr).toFixed(1)} OVR and +${(stats.grade-transfer.previousGrade).toFixed(1)} season grade.`}));
}
export function draftOutcome(evaluation:number,rng:Random):DraftOutcome{
 const bands=[[95,1,5],[90,6,16],[85,17,32],[80,33,64],[75,65,100],[70,101,160],[65,161,224],[60,225,256]];
 const band=bands.find(b=>evaluation>=b[0]);if(!band)return {status:'undrafted'};
 const pick=rng.int(band[1],band[2]),slot=DRAFT_BOARD.find(s=>s.overallPick===pick)!;
 const team=DRAFT_TEAMS.find(t=>t.teamId===slot.teamId)!;return {status:'drafted',overallPick:pick,round:slot.round,pickInRound:slot.pickInRound,team:structuredClone(team)};
}
export function buildDraft(run:RunState,rng:Random):BinderEntry{
 const p=run.prospect!,a=p.current;
 const checks=[['press','Press release','Escape contact at the line.',['release','acceleration']],['man','Man coverage','Separate through precise routes.',['routeRunning','speed']],['zone','Zone coverage','Find the window and finish.',['awareness','routeRunning','hands']],['contested','Contested catch','Win the ball through contact.',['hands','vertical','bodyControl']],['open','Open field','Create yards after the catch.',['yardsAfterCatch','speed','acceleration']]] as const;
 const gauntlet=checks.map(([id,name,description,attributes])=>({id,name,label:name,description,attributes:[...attributes],score:attributes.reduce((s,k)=>s+a[k],0)/attributes.length}));
 const ovr=calculateOvr(a),collegeGrade=sumStats(run.history).grade,evaluation=.7*ovr.raw+.2*collegeGrade+.1*(gauntlet.reduce((s,g)=>s+g.score,0)/5),outcome=draftOutcome(evaluation,rng);
 addUnlock(run.unlocks,unlock('prospect_journey',{id:run.id,kind:'draftOutcome',stage:'draft',sourceId:run.id,facts:{finalOvr:ovr.display},description:'Completed the college-to-draft journey.'}));
 if(outcome.status==='drafted')addUnlock(run.unlocks,unlock('draft_night',{id:`${run.id}-pick`,kind:'draftOutcome',stage:'draft',sourceId:run.id,facts:{pick:outcome.overallPick,round:outcome.round,team:outcome.team.displayName},description:`Round ${outcome.round}, pick ${outcome.overallPick}: ${outcome.team.displayName}.`}));
 const draft:DraftSnapshot=structuredClone({positionId:'wr',rulesVersion:RULES_VERSION,balanceVersion:'1.2.0',contentVersion:'1.0.0',prospect:p,schoolId:run.collegeId,history:run.history,years:run.years,transfers:run.transfers,interventions:run.interventions,awards:run.awards,unlocks:run.unlocks,gauntlet,collegeGrade,evaluation,finalOvr:ovr.display,outcome});
 run.draft=draft;const school=COLLEGES.find(s=>s.id===run.collegeId)!;
 return {id:run.id,positionId:'wr',createdAt:run.createdAt,completedAt:new Date().toISOString(),favorite:false,draft,career:null,nflSeed:run.nflSeed,draftCard:{sceneId:outcome.status==='drafted'?'draft_night':'prospect_journey',frame:'classic',foil:false,showStamp:true},careerCard:null,display:{positionLabel:WR_DEFINITION.displayName,attributes:WR_DEFINITION.attributes.map(attr=>({id:attr.id,label:attr.label,value:a[attr.id],ceiling:p.traits[attr.id].ceiling})),schoolName:school.name,schoolColors:school.colors}};
}
export function transition(original:RunState,command:GameCommand):Transition {
 if(original.processedCommands.includes(command.id))return {run:original};
 if(original.rulesVersion!==RULES_VERSION)throw Error('This archived run uses an older rules version. Export it before starting a new prospect.');
 const run=structuredClone(original),rng=new Random(run.rng);let entry:BinderEntry|undefined;
 switch(command.type){
  case 'choose-gift':{requirePhase(run,'gift');const gift=run.creation.giftOffers[command.index];if(!gift)throw Error('Choose one natural gift.');assign(run,gift.attributeId,gift.sourcePlayerId,'gift');run.phase='size';break;}
  case 'reroll':requirePhase(run,'size','potential');if(run.rerolls<=0)throw Error('No rerolls remain.');run.rerolls--;if(run.phase==='size')run.creation.sizeOfferId=rng.pick(SOURCE_PLAYERS).id;else run.creation.playerOffers=offers(rng);break;
  case 'accept-size':{requirePhase(run,'size');const p=source(run.creation.sizeOfferId);run.creation.physical={heightCm:p.heightCm,weightKg:p.weightKg,build:p.build,grade:'A',sourcePlayerId:p.id};run.creation.playerOffers=offers(rng);run.phase='potential';break;}
  case 'choose-trait':{
   requirePhase(run,'potential');if(!run.creation.playerOffers.includes(command.sourcePlayerId)||!ids.includes(command.attributeId)||run.creation.traits[command.attributeId])throw Error('Choose an available attribute from this offer.');
   assign(run,command.attributeId,command.sourcePlayerId,'manual');run.creation.manualCount++;
   if(run.creation.manualCount<3){run.creation.playerOffers=offers(rng);break;}
   while(Object.keys(run.creation.traits).length<ids.length){const p=rng.pick(SOURCE_PLAYERS),attributeId=rng.pick(ids.filter(id=>!run.creation.traits[id]));assign(run,attributeId,p.id,'autofill');}
   const current=values(id=>run.creation.traits[id].origin==='gift'?94:Math.min(run.creation.traits[id].ceiling,rng.int(50,65)));
   run.prospect={id:run.id,name:run.name,jerseyNumber:run.jerseyNumber,positionId:'wr',createdAt:run.createdAt,physical:run.creation.physical!,current,initial:{...current},traits:structuredClone(run.creation.traits),initialOvr:calculateOvr(current).display};run.phase='reveal';break;
  }
  case 'continue':{
   requirePhase(run,'reveal','block-review','season-review','draft-night');
   if(run.phase==='reveal')run.phase='college-choice';
   else if(run.phase==='block-review'){if(run.gameNumber===12){finishSeason(run);run.phase='season-review';}else run.phase='training';}
   else if(run.phase==='season-review'){if(run.year===2)throw Error('Choose declare or return.');run.phase=run.year===3?'gauntlet':'transfer';}
   else run.phase='complete';break;
  }
  case 'choose-college':requirePhase(run,'college-choice');if(!COLLEGES.some(c=>c.id===command.collegeId))throw Error('Unknown program.');run.collegeId=command.collegeId;run.yearStartOvr=calculateOvr(run.prospect!.current).raw;run.phase='training';break;
  case 'train':{
   requirePhase(run,'training');if(!['balanced','focused','intensive'].includes(command.plan.mode)||(command.plan.mode!=='balanced'&&!ids.includes(command.plan.attributeId)))throw Error('Unknown training plan.');
   const p=run.prospect!,school=COLLEGES.find(c=>c.id===run.collegeId)!,start={...p.current},startOvr=calculateOvr(start).raw,games=[];
   const pending=run.pendingIntervention;let fulfilled:Intervention|null=null;
   if(pending){const matches=command.plan.mode==='intensive'&&command.plan.attributeId===pending.attributeId;fulfilled={...pending,fulfillment:matches?'already_compliant':'substituted',selectedPlan:command.plan};run.interventions.push(fulfilled);run.pendingIntervention=null;}
   for(let n=0;n<4;n++){
    const plan:TrainingPlan=n===0&&fulfilled?{mode:'intensive',attributeId:fulfilled.attributeId}:command.plan;
    const game=WR_RULES.simulateGame({prospect:p,college:school,year:run.year,gameNumber:++run.gameNumber,seed:rng.int(0,0xffffffff)});
    const s=game.stats,reps={speed:s.routes,acceleration:s.routes,hands:s.targets,routeRunning:s.routes,release:s.pressReps,vertical:s.contestedTargets,bodyControl:s.contestedTargets,yardsAfterCatch:s.receptions,awareness:s.routes};
    const growth=develop(p.current,values(id=>p.traits[id].ceiling),plan,run.year,school,s.routes,reps);
    p.current=growth.current;const record={...game,gains:growth.gains,generalGains:growth.general,practiceGains:growth.practice};games.push(record);run.history.push(record);for(const item of gameUnlocks(record))addUnlock(run.unlocks,item);
   }
   run.lastBlock={year:run.year,block:run.gameNumber/4,games,gains:values(id=>p.current[id]-start[id]),startOvr,endOvr:calculateOvr(p.current).raw,intervention:null,fulfilled,training:command.plan};
   const intervention=detectIntervention(run);run.lastBlock.intervention=intervention;run.pendingIntervention=intervention;if(intervention)run.usedInterventions.push(intervention.type);run.phase='block-review';break;
  }
  case 'declare':requirePhase(run,'season-review');if(run.year!==2)throw Error('Early declaration is a sophomore choice.');run.phase='gauntlet';break;
  case 'return':requirePhase(run,'season-review');if(run.year!==2)throw Error('Only sophomores choose this return.');run.phase='transfer';break;
  case 'transfer':{
   requirePhase(run,'transfer');if(!COLLEGES.some(c=>c.id===command.collegeId))throw Error('Unknown program.');
   if(command.collegeId!==run.collegeId){const last=run.years.at(-1)!;run.transfers.push({afterYear:run.year,from:run.collegeId,to:command.collegeId,previousOvr:last.endOvr,previousGrade:last.stats.grade});}
   run.collegeId=command.collegeId;run.year++;run.gameNumber=0;run.usedInterventions=[];run.pendingIntervention=null;run.lastBlock=null;run.yearStartOvr=calculateOvr(run.prospect!.current).raw;run.phase='training';break;
  }
  case 'scout':requirePhase(run,'gauntlet');entry=buildDraft(run,rng);run.phase='draft-night';break;
 }
 run.rng=rng.state;run.processedCommands.push(command.id);return {run,entry};
}
