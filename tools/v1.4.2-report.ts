import {createRun,transition} from '../src/app/domain/engine';
import {calculateOvr,CEILINGS,values} from '../src/app/domain/development';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {RECEIVER_TEAMS,eligibleReceiversForTeam,receiverProfile} from '../src/app/data/receiver-catalog';

const RUNS=Number(process.env['V142_RUNS']??100_000);
if(!Number.isSafeInteger(RUNS)||RUNS<1)throw new Error('V142_RUNS must be a positive safe integer.');
const teamCounts=new Map(RECEIVER_TEAMS.map(team=>[team.id,0]));
const receiverCounts=new Map<string,number>();
const manualGrades=new Map<string,number>();
const allGrades=new Map<string,number>();
const weakAttributes=new Map<string,number>();
const initialOvr:number[]=[],potentialOvr:number[]=[];
let picks=0,weakPicks=0;
const weakGrade=new Set(['C+','C','C-','D+','D','D-','F']);
let runId=0;
for(let seed=1;seed<=RUNS;seed++){
 let run=createRun('V1.4.2 balance sample',11,seed,'2026-01-01T00:00:00.000Z','full');
 const bestGift=run.creation.giftOffers.map((gift,index)=>({index,weight:WR_DEFINITION.attributes.find(attribute=>attribute.id===gift.attributeId)!.weight})).sort((a,b)=>b.weight-a.weight)[0].index;
 run=transition(run,{type:'choose-gift',index:bestGift,id:`${runId++}`}).run;
 run=transition(run,{type:'accept-size',id:`${runId++}`}).run;
 while(run.phase==='potential'){
  const roll=run.creation.currentRoll!;
  const profile=receiverProfile(roll.receiverId)!;
  teamCounts.set(roll.teamId,teamCounts.get(roll.teamId)!+1);
  const key=`${roll.teamId}/${roll.receiverId}`;
  receiverCounts.set(key,(receiverCounts.get(key)??0)+1);
  const choices=WR_DEFINITION.attributes.filter(attribute=>!run.creation.traits[attribute.id]).map(attribute=>({
   attribute,grade:profile.grades[attribute.id as keyof typeof profile.grades],
   contribution:CEILINGS[profile.grades[attribute.id as keyof typeof profile.grades]]*attribute.weight,
  })).sort((a,b)=>b.contribution-a.contribution);
  const selected=choices[0];
  picks++;
  manualGrades.set(selected.grade,(manualGrades.get(selected.grade)??0)+1);
  if(weakGrade.has(selected.grade)){weakPicks++;weakAttributes.set(selected.attribute.id,(weakAttributes.get(selected.attribute.id)??0)+1);}
  run=transition(run,{type:'choose-trait',sourcePlayerId:profile.id,attributeId:selected.attribute.id,id:`${runId++}`}).run;
 }
 const prospect=run.prospect!;
 initialOvr.push(prospect.initialOvr);
 potentialOvr.push(calculateOvr(values(id=>prospect.traits[id].ceiling)).display);
 for(const trait of Object.values(prospect.traits))allGrades.set(trait.grade,(allGrades.get(trait.grade)??0)+1);
 if(seed%10_000===0)console.error(`Simulated ${seed.toLocaleString()} / ${RUNS.toLocaleString()} Full builds`);
}
function summary(nums:number[]){const sorted=[...nums].sort((a,b)=>a-b);const mean=nums.reduce((sum,value)=>sum+value,0)/nums.length;const percentile=(p:number)=>sorted[Math.floor((sorted.length-1)*p)];return {mean:round(mean),p10:round(percentile(.1)),p25:round(percentile(.25)),median:round(percentile(.5)),p75:round(percentile(.75)),p90:round(percentile(.9)),min:round(sorted[0]),max:round(sorted.at(-1)!)};}
function round(value:number){return Math.round(value*100)/100;}
const totalRolls=[...teamCounts.values()].reduce((sum,count)=>sum+count,0);
const teamRolls=RECEIVER_TEAMS.map(team=>({team:team.displayName,count:teamCounts.get(team.id)!,share:round(teamCounts.get(team.id)!/totalRolls*100),eligible:eligibleReceiversForTeam(team.id).length}));
const conditionalReceiverCounts=RECEIVER_TEAMS.flatMap(team=>eligibleReceiversForTeam(team.id).map(profile=>receiverCounts.get(`${team.id}/${profile.id}`)??0));
const receiverUniformity={eligibleMemberships:conditionalReceiverCounts.length,minObserved:Math.min(...conditionalReceiverCounts),maxObserved:Math.max(...conditionalReceiverCounts),expectedMin:round(totalRolls/RECEIVER_TEAMS.length/Math.max(...RECEIVER_TEAMS.map(team=>eligibleReceiversForTeam(team.id).length))),expectedMax:round(totalRolls/RECEIVER_TEAMS.length/Math.min(...RECEIVER_TEAMS.map(team=>eligibleReceiversForTeam(team.id).length)))};
const manualCounts=Object.fromEntries([...manualGrades].sort((a,b)=>b[1]-a[1]));
const manualGradeShare=Object.fromEntries(Object.entries(manualCounts).map(([grade,count])=>[grade,round(count/picks*100)]));
const overallGradeCounts=Object.fromEntries([...allGrades].sort((a,b)=>b[1]-a[1]));
const gradeTotal=RUNS*9;
console.log(JSON.stringify({runs:RUNS,mode:'Full',policy:'Choose the open attribute with the greatest positional-weighted ceiling contribution from each rolled receiver; choose the highest-weight Natural Gift available.',rolls:picks,initialOvr:summary(initialOvr),potentialOvr:summary(potentialOvr),overallGradeCounts,overallGradeSharePercent:Object.fromEntries(Object.entries(overallGradeCounts).map(([grade,count])=>[grade,round(count/gradeTotal*100)])),manualGradeCounts:manualCounts,manualGradeSharePercent:manualGradeShare,weakPick:{grades:[...weakGrade],count:weakPicks,sharePercent:round(weakPicks/picks*100),byAttribute:Object.fromEntries(weakAttributes)},teamSelection:{totalRolls,teams:teamRolls},conditionalReceiverDraws:receiverUniformity},null,2));
