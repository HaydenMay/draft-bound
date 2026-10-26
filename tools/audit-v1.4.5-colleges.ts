import {writeFileSync} from 'node:fs';
import {createRun,transition} from '../src/app/domain/engine';
import {collegeOffers,trainingCeilings} from '../src/app/domain/college-system';
import {calculateOvr,CEILINGS} from '../src/app/domain/development';
import {receiverProfile} from '../src/app/data/receiver-catalog';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {emptySave,previewSave} from '../src/app/persistence/save';
import {GameCommandPayload,RunState} from '../src/app/domain/models';
const n=100,groups:any[]=[];
const step=(r:RunState,c:GameCommandPayload)=>transition(r,{...c,id:'audit-'+r.processedCommands.length});
const mean=(a:number[])=>Math.round(a.reduce((s,v)=>s+v,0)/a.length*1000)/1000;
for(const mode of ['quick','full'] as const)for(const modern of [false,true]){
 const outcomes:number[]=[],selected:Record<string,number>={},fiveStarOffers=[0,0,0];let beyondNatural=0,schoolExpanded=0,totalAttrs=0,invalidSaves=0;
 for(let i=0;i<n;i++){
  let r=createRun('Synthetic college audit',11,2200001+i,'2026-10-26T00:00:00Z',mode);
  if(!modern)delete r.collegeSystemVersion;
  r=step(r,{type:'choose-gift',index:0}).run;r=step(r,{type:'accept-size'}).run;
  while(r.phase==='potential'){
   const p=receiverProfile(r.creation.currentRoll!.receiverId)!;
   const attr=WR_DEFINITION.attributes.filter(a=>!r.creation.traits[a.id]).sort((a,b)=>CEILINGS[p.grades[b.id as keyof typeof p.grades]]*b.weight-CEILINGS[p.grades[a.id as keyof typeof p.grades]]*a.weight)[0];
   r=step(r,{type:'choose-trait',sourcePlayerId:p.id,attributeId:attr.id}).run;
  }
  r=step(r,{type:'continue'}).run;
  for(let year=1;year<=3;year++){
   const offers=collegeOffers(r);if(offers.some(s=>s.prestige===5))fiveStarOffers[year-1]++;
   const school=modern?offers[0]:offers.find(s=>s.id==='opportunity')!;selected[school.id]=(selected[school.id]??0)+1;
   r=step(r,{type:year===1?'choose-college':'transfer',collegeId:school.id}).run;
   for(let block=0;block<3;block++){
    r=step(r,{type:'train',plan:{mode:'balanced'}}).run;
    if(!previewSave(JSON.stringify({...emptySave(),run:r})).ok)invalidSaves++;
    r=step(r,{type:'continue'}).run;
   }
   if(year<3)r=step(r,year===2?{type:'return'}:{type:'continue'}).run;
  }
  const result=step(r,{type:'continue'});r=result.run;
  const final=modern?result:step(r,{type:'scout'});r=final.run;
  if(!previewSave(JSON.stringify({...emptySave(),run:r,entries:[final.entry!]})).ok)invalidSaves++;
  outcomes.push(calculateOvr(r.prospect!.current).raw);
  const caps=trainingCeilings(r);for(const id of Object.keys(r.prospect!.current)){totalAttrs++;if(r.prospect!.current[id]>r.prospect!.traits[id].ceiling+.001)beyondNatural++;if(caps[id]>r.prospect!.traits[id].ceiling+.001)schoolExpanded++;}
 }
 if(invalidSaves)throw Error('Invalid generated saves: '+invalidSaves);
 groups.push({mode,rules:modern?'v1.4.5':'v1.4.4',n,policy:modern?'balanced; highest prestige offered; alphabetic tie':'balanced; stay Openwater',ovr:{mean:mean(outcomes),min:Math.min(...outcomes),max:Math.max(...outcomes),display90plusPct:mean(outcomes.map(o=>Math.round(o)>=90?100:0)),display99Pct:mean(outcomes.map(o=>Math.round(o)===99?100:0))},fiveStarOfferPctByYear:fiveStarOffers.map(x=>x/n*100),selected,beyondNaturalPct:beyondNatural/totalAttrs*100,schoolExpandedPct:schoolExpanded/totalAttrs*100,invalidSaves});
}
const report={seeds:'2200001–2200100',distinctBuilds:200,scenarioCareers:400,games:14400,notes:'Paired builds. Highest source grade weighted by OVR; no rerolls. School policies differ, so this measures these journeys rather than isolating a coefficient. Save validation checked every block and final report. No claim about all strategies or physical Safari.',groups};
writeFileSync('docs/validation/v1.4.5-college-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
