import {BinderEntry,ProfessionalCareer,ProfessionalSeason} from './models';
import {Random,clamp} from './rng';
import {RULES_VERSION} from './positions';
import {DRAFT_TEAMS} from '../data/teams';
import {addUnlock,unlock} from './eligibility';
function simulateProfessionalLegacy(entry:BinderEntry):ProfessionalCareer{
 if(entry.positionId!=='wr')throw Error('This historical position is read-only.');
 const rng=new Random(entry.nflSeed),d=entry.draft,ovr=d.finalOvr;
 const team=structuredClone(d.outcome.status==='drafted'?d.outcome.team:rng.pick(DRAFT_TEAMS));
 const seasons:ProfessionalSeason[]=[],awards:ProfessionalCareer['awards']=[],unlocks:ProfessionalCareer['unlocks']=[];
 const length=clamp(Math.round(3+(ovr-65)*.23+rng.int(-2,5)),3,15),talent=clamp((ovr-50)/49,.05,1),startAge=20+d.years.length;
 for(let i=0;i<length;i++){
  const aging=i<3?.82+i*.07:i<9?1:1-(i-8)*.065;
  const targets=Math.round((35+talent*135)*aging*(.68+rng.next()*.65));
  const receptions=Math.round(targets*(.46+talent*.24)),yards=Math.round(receptions*(9+talent*7)*(0.82+rng.next()*.36)),touchdowns=Math.round(yards/(140+rng.int(-45,65)));
  const stats={targets,receptions,yards,touchdowns},allPro=yards>=1400&&touchdowns>=10;
  seasons.push({year:i+1,age:startAge+i,team,stats,allPro});
  if(allPro){const award={id:`${entry.id}-ap-${i+1}`,type:'all_pro' as const,label:'All-Pro',stage:'nfl' as const,season:i+1,evidence:{yards,touchdowns},rulesVersion:RULES_VERSION};awards.push(award);addUnlock(unlocks,unlock('award_ceremony',{id:award.id,kind:'award',stage:'nfl',sourceId:award.id,year:i+1,facts:award.evidence,description:`NFL season ${i+1}: All-Pro with ${yards} yards and ${touchdowns} TDs.`}));}
  if(i===0&&yards>=1000&&touchdowns>=6)addUnlock(unlocks,unlock('rookie_breakout',{id:`${entry.id}-rookie`,kind:'seasonStats',stage:'nfl',sourceId:`${entry.id}-nfl-1`,year:1,facts:{yards,touchdowns},description:`Rookie season: ${yards} receiving yards and ${touchdowns} TDs.`}));
 }
 const totals=seasons.reduce((a,s)=>({targets:a.targets+s.stats.targets,receptions:a.receptions+s.stats.receptions,yards:a.yards+s.stats.yards,touchdowns:a.touchdowns+s.stats.touchdowns}),{targets:0,receptions:0,yards:0,touchdowns:0});
 const inducted=totals.yards>=12000&&totals.touchdowns>=80&&awards.length>=3;
 if(inducted)for(const scene of ['canton_bust','gold_jacket'])addUnlock(unlocks,unlock(scene,{id:`${entry.id}-hof`,kind:'induction',stage:'nfl',sourceId:`${entry.id}-career`,facts:{yards:totals.yards,touchdowns:totals.touchdowns,allProSeasons:awards.length},description:`Inducted: ${totals.yards.toLocaleString()} yards, ${totals.touchdowns} TDs, ${awards.length} All-Pro seasons.`}));
 return {positionId:'wr',rulesVersion:RULES_VERSION,status:inducted?'simulated_inducted':'simulated_not_inducted',seasons,totals,awards,induction:{inducted,criteria:'12,000 receiving yards · 80 receiving TDs · 3 All-Pro seasons'},retirementAge:seasons.at(-1)!.age,team,unlocks};
}

export function simulateProfessional(entry:BinderEntry):ProfessionalCareer{
 if(entry.draft.professionalRulesVersion==='v1.4.6')return simulateProfessionalV146(entry);
 return entry.draft.professionalRulesVersion==='v1.4'||entry.draft.professionalRulesVersion==='v1.4.4'?simulateProfessionalV14(entry):simulateProfessionalLegacy(entry);
}
function simulateProfessionalV14(entry:BinderEntry):ProfessionalCareer{
 if(entry.positionId!=='wr')throw Error('This historical position is read-only.');
 const rng=new Random(entry.nflSeed),d=entry.draft,ovr=d.finalOvr;
 const team=structuredClone(d.outcome.status==='drafted'?d.outcome.team:rng.pick(DRAFT_TEAMS));
 const seasons:ProfessionalSeason[]=[],awards:ProfessionalCareer['awards']=[],unlocks:ProfessionalCareer['unlocks']=[];
 const talent=clamp((ovr-50)/49,.05,1),window=clamp(3+Math.round(talent*10)+rng.int(-3,3),3,15),startAge=20+d.years.length;
 const ageBased=d.professionalRulesVersion==='v1.4.4',length=ageBased?Math.max(2,window-(startAge-22)):window;
 const role=.60+rng.next()*.62;
 for(let i=0;i<length;i++){
  const ageIndex=ageBased?i+startAge-22:i;
  const aging=ageIndex<2?.72+ageIndex*.14:ageIndex<8?1:Math.max(.42,1-(ageIndex-7)*.09);
  const targets=Math.round((48+talent*124)*role*aging*(.72+rng.next()*.56));
  const receptions=Math.round(targets*(.52+talent*.14));
  const yards=Math.round(receptions*(10.2+talent*3.7)*(.86+rng.next()*.28));
  const touchdowns=Math.max(0,Math.round(yards/(155+rng.int(-28,38))));
  const allPro=yards>=1750&&touchdowns>=11;
  seasons.push({year:i+1,age:startAge+i,team,stats:{targets,receptions,yards,touchdowns},allPro});
  if(allPro){const award={id:`${entry.id}-ap-${i+1}`,type:'all_pro' as const,label:'All-Pro',stage:'nfl' as const,season:i+1,evidence:{yards,touchdowns},rulesVersion:RULES_VERSION};awards.push(award);addUnlock(unlocks,unlock('award_ceremony',{id:award.id,kind:'award',stage:'nfl',sourceId:award.id,year:i+1,facts:award.evidence,description:`NFL season ${i+1}: All-Pro with ${yards} yards and ${touchdowns} TDs.`}));}
  if(i===0&&yards>=1000&&touchdowns>=6)addUnlock(unlocks,unlock('rookie_breakout',{id:`${entry.id}-rookie`,kind:'seasonStats',stage:'nfl',sourceId:`${entry.id}-nfl-1`,year:1,facts:{yards,touchdowns},description:`Rookie season: ${yards} receiving yards and ${touchdowns} TDs.`}));
 }
 const totals=seasons.reduce((a,s)=>({targets:a.targets+s.stats.targets,receptions:a.receptions+s.stats.receptions,yards:a.yards+s.stats.yards,touchdowns:a.touchdowns+s.stats.touchdowns}),{targets:0,receptions:0,yards:0,touchdowns:0});
 const inducted=seasons.length>=8&&totals.yards>=14500&&totals.touchdowns>=85&&awards.length>=2;
 if(inducted)for(const scene of ['canton_bust','gold_jacket'])addUnlock(unlocks,unlock(scene,{id:`${entry.id}-hof`,kind:'induction',stage:'nfl',sourceId:`${entry.id}-career`,facts:{yards:totals.yards,touchdowns:totals.touchdowns,allProSeasons:awards.length},description:`Inducted: ${totals.yards.toLocaleString()} yards, ${totals.touchdowns} TDs, ${awards.length} All-Pro seasons.`}));
 return {positionId:'wr',rulesVersion:RULES_VERSION,status:inducted?'simulated_inducted':'simulated_not_inducted',seasons,totals,awards,induction:{inducted,criteria:'14,500 receiving yards · 85 receiving TDs · 2 All-Pro seasons · 8 professional seasons'},retirementAge:seasons.at(-1)!.age,team,unlocks};
}

// A season describes opportunity and performance, not changes to draft-day attributes.
function simulateProfessionalV146(entry:BinderEntry):ProfessionalCareer{
 if(entry.positionId!=='wr')throw Error('This historical position is read-only.');
 const rng=new Random(entry.nflSeed),d=entry.draft,ovr=d.finalOvr,a=d.prospect.current;
 const initialTeam=structuredClone(d.outcome.status==='drafted'?d.outcome.team:rng.pick(DRAFT_TEAMS));
 let team=initialTeam,role=.72+rng.next()*.34;
 const seasons:ProfessionalSeason[]=[],awards:ProfessionalCareer['awards']=[],unlocks:ProfessionalCareer['unlocks']=[];
 const talent=clamp((ovr-50)/49,.05,1),startAge=20+d.years.length;
 const window=clamp(3+Math.round(talent*10)+rng.int(-3,3),3,15),length=Math.max(2,window-(startAge-22));
 for(let i=0;i<length;i++){
  if(i>=3&&rng.chance(i===3?.28:.12)){
   team=structuredClone(rng.pick(DRAFT_TEAMS.filter(t=>t.teamId!==team.teamId)));
   role=clamp(role+(rng.next()-.5)*.28,.55,1.18);
  }
  role=clamp(role+(rng.next()-.5)*.12,.55,1.18);
  const ageIndex=i+startAge-22,aging=ageIndex<2?.75+ageIndex*.12:ageIndex<8?1:Math.max(.42,1-(ageIndex-7)*.09);
  // Most seasons are complete; occasional missed games lower counting stats.
  const games=rng.chance(.20)?rng.int(10,16):17;
  const separation=((a['routeRunning']??ovr)+(a['release']??ovr))/2;
  const targets=Math.max(0,Math.round((32+talent*145)*role*aging*(games/17)*(.78+rng.next()*.44)*(1+(separation-ovr)*.004)));
  const catchRate=clamp(.48+talent*.16+((a['hands']??ovr)-ovr)*.002+(rng.next()-.5)*.08,.43,.76);
  const receptions=Math.min(targets,Math.round(targets*catchRate));
  const explosive=((a['speed']??ovr)+(a['yardsAfterCatch']??ovr))/2;
  const yards=Math.max(0,Math.round(receptions*(10.4+talent*3.5+(explosive-ovr)*.06)*(.88+rng.next()*.24)));
  const redZone=((a['bodyControl']??ovr)+(a['vertical']??ovr))/2;
  const touchdowns=Math.min(receptions,Math.max(0,Math.round(receptions*(.055+talent*.045+(redZone-ovr)*.001)*(.55+rng.next()*.9))));
  // Approximate competition with a changing annual bar; no fixed single-stat threshold.
  const score=yards+receptions*3+touchdowns*30;
  const allPro=yards>=1000&&receptions>=65&&score>=2050+rng.int(-100,150);
  seasons.push({year:i+1,age:startAge+i,team,stats:{targets,receptions,yards,touchdowns},allPro});
  if(allPro){const award={id:`${entry.id}-ap-${i+1}`,type:'all_pro' as const,label:'All-Pro',stage:'nfl' as const,season:i+1,evidence:{yards,touchdowns,receptions},rulesVersion:RULES_VERSION};awards.push(award);addUnlock(unlocks,unlock('award_ceremony',{id:award.id,kind:'award',stage:'nfl',sourceId:award.id,year:i+1,facts:award.evidence,description:`NFL season ${i+1}: All-Pro with ${yards} yards and ${touchdowns} TDs.`}));}
  if(i===0&&yards>=1000&&touchdowns>=6)addUnlock(unlocks,unlock('rookie_breakout',{id:`${entry.id}-rookie`,kind:'seasonStats',stage:'nfl',sourceId:`${entry.id}-nfl-1`,year:1,facts:{yards,touchdowns},description:`Rookie season: ${yards} receiving yards and ${touchdowns} TDs.`}));
 }
 const totals=seasons.reduce((t,s)=>({targets:t.targets+s.stats.targets,receptions:t.receptions+s.stats.receptions,yards:t.yards+s.stats.yards,touchdowns:t.touchdowns+s.stats.touchdowns}),{targets:0,receptions:0,yards:0,touchdowns:0});
 const inducted=seasons.length>=8&&totals.yards>=14500&&totals.touchdowns>=85&&awards.length>=2;
 if(inducted)for(const scene of ['canton_bust','gold_jacket'])addUnlock(unlocks,unlock(scene,{id:`${entry.id}-hof`,kind:'induction',stage:'nfl',sourceId:`${entry.id}-career`,facts:{yards:totals.yards,touchdowns:totals.touchdowns,allProSeasons:awards.length},description:`Inducted: ${totals.yards.toLocaleString()} yards, ${totals.touchdowns} TDs, ${awards.length} All-Pro seasons.`}));
 return {positionId:'wr',rulesVersion:RULES_VERSION,status:inducted?'simulated_inducted':'simulated_not_inducted',seasons,totals,awards,induction:{inducted,criteria:'14,500 receiving yards � 85 receiving TDs � 2 All-Pro seasons � 8 professional seasons'},retirementAge:seasons.at(-1)!.age,team:initialTeam,unlocks};
}
