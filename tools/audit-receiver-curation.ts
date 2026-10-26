import {mkdirSync, writeFileSync} from 'node:fs';
import {RECEIVER_CATALOG_VERSION, LEGACY_RECEIVER_CATALOG_VERSION, RECEIVER_TEAMS, RECEIVER_PROFILES, eligibleReceiversForTeam, receiverProfilesForVersion} from '../src/app/data/receiver-catalog';
import {createRun} from '../src/app/domain/engine';
import {step} from '../src/app/domain/test-fixtures';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {CEILINGS} from '../src/app/domain/development';
import type {Grade} from '../src/app/domain/models';

const round=(n:number)=>Math.round(n*10000)/10000;
const teamCounts=new Map(RECEIVER_TEAMS.map(t=>[t.id,0]));
const membershipCounts=new Map<string,number>(RECEIVER_TEAMS.flatMap(t=>eligibleReceiversForTeam(t.id).map(p=>[`${t.id}/${p.id}`,0] as const)));
let draws=0,manual=0,automatic=0;
for(let seed=500001;seed<=520000;seed++){
  let run=createRun('Synthetic Curation Audit',11,seed,'2026-10-25T00:00:00.000Z',seed%2?'quick':'full');delete run.collegeSystemVersion;
  run=step(run,{type:'choose-gift',index:0});run=step(run,{type:'accept-size'});
  while(run.phase==='potential'){
    const roll=run.creation.currentRoll!;
    if(!membershipCounts.has(`${roll.teamId}/${roll.receiverId}`))throw new Error('A roll escaped the curated pool.');
    run=step(run,{type:'choose-trait',sourcePlayerId:roll.receiverId,attributeId:WR_DEFINITION.attributes.find(a=>!run.creation.traits[a.id])!.id});
  }
  for(const trait of Object.values(run.prospect!.traits).filter(t=>t.origin!=='gift')){
    const key=`${trait.sourceTeamId}/${trait.sourcePlayerId}`;
    if(!membershipCounts.has(key))throw new Error('An assignment escaped the curated pool.');
    membershipCounts.set(key,membershipCounts.get(key)!+1);teamCounts.set(trait.sourceTeamId!,teamCounts.get(trait.sourceTeamId!)!+1);
    draws++;if(trait.origin==='manual')manual++;else automatic++;
  }
}
const gradeSpread=(version:string)=>{
  const grades:Record<string,number>={};let total=0,sum=0;
  for(const team of RECEIVER_TEAMS){const pool=eligibleReceiversForTeam(team.id,version);
    for(const p of pool)for(const grade of Object.values(p.grades)){
      const weight=1/32/pool.length/9;grades[grade]=round((grades[grade]??0)+weight*100);sum+=CEILINGS[grade as Grade]*weight;total++;
    }
  }
  return {gradedMembershipAttributes:total,weightedMeanCeiling:round(sum),weightedGradePercent:grades};
};
const teams=RECEIVER_TEAMS.map(team=>{
  const kept=eligibleReceiversForTeam(team.id),keptIds=new Set(kept.map(p=>p.id));
  return {team:team.displayName,id:team.id,draws:teamCounts.get(team.id),expectedTeamSharePercent:3.125,observedTeamSharePercent:round(teamCounts.get(team.id)!/draws*100),
    kept:kept.map(p=>({id:p.id,name:p.name,grades:p.grades,confidence:p.provenance.confidence,reviewStatus:p.provenance.reviewStatus,draws:membershipCounts.get(`${team.id}/${p.id}`),expectedDraws:draws/32/kept.length})),
    deferred:eligibleReceiversForTeam(team.id,LEGACY_RECEIVER_CATALOG_VERSION).filter(p=>!keptIds.has(p.id)).map(p=>({id:p.id,name:p.name,reason:'Outside the ten-player recognizable-name selection; retained in the archived catalog, grades not changed.'}))};
});
const report={catalogVersion:RECEIVER_CATALOG_VERSION,archivedVersion:LEGACY_RECEIVER_CATALOG_VERSION,
  policy:'Explicit team lists, no new affiliations/grades. Uniform team-first then uniform receiver; no rarity weights.',
  seedPolicy:'20,000 engine-built prospects, seeds 500001..520000 inclusive, alternating Quick/Full, gift index zero, first open attribute, no rerolls. Controlled experiment, not telemetry.',
  archivedProfiles:RECEIVER_PROFILES.length,curatedProfiles:receiverProfilesForVersion().length,eligibleMemberships:membershipCounts.size,
  runs:20000,draws,manual,automatic,unseenMemberships:[...membershipCounts].filter(([,n])=>n===0).map(([key])=>key),
  originalGradeSpread:gradeSpread(LEGACY_RECEIVER_CATALOG_VERSION),curatedGradeSpread:gradeSpread(RECEIVER_CATALOG_VERSION),teams};
mkdirSync('docs/validation',{recursive:true});
writeFileSync('docs/validation/RECEIVER_CURATION.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('docs/validation/RECEIVER_CURATION.md',`# Receiver curation and spotlight fit\n\nCatalog: ${report.catalogVersion}. ${report.curatedProfiles} unique profiles across ${report.eligibleMemberships} memberships, ten per team. All ${report.archivedProfiles} original profiles and their grades remain archived.\n\nThe owner requested recognizable names without turning every result into a star. Lists favor established names, historical starters, specialists and memorable disappointments, with examples including Titus Young, John Ross, Stephen Hill, Kevin White, Jalen Reagor, J'Mon Moore and A.J. Jenkins. This is a product curation decision, not a new factual verification of the provisional 2026 roster or scouting grades. All affiliations come from the existing snapshot. Deferred names can be reviewed again; no profile was deleted.\n\n## Sampling\n\n${report.seedPolicy}\n\n${draws.toLocaleString('en-US')} assignments: ${manual.toLocaleString('en-US')} manual and ${automatic.toLocaleString('en-US')} automatic. Unseen eligible memberships: ${report.unseenMemberships.length}. Each team has expected 3.125% share; each of its receivers has expected 0.3125% unconditional share per draw. Players retained under several teams can appear more often overall.\n\n## Grade review\n\nNo individual grades were modified or silently approved. Existing provenance remains attached to each profile. Team-weighted mean potential ceiling across all nine attributes: ${report.originalGradeSpread.weightedMeanCeiling} before; ${report.curatedGradeSpread.weightedMeanCeiling} after. This measures offered profiles, not optimal player choices or developed OVR. Recognizability and balanced grades remain distinct concerns; any ceiling inflation or weak grade confidence belongs in the later grading/balance review.\n\n## Keep / review matrix\n\nThe JSON contains each kept player's nine grades, review confidence, observed draw count and each deferred name. Deferred means review later, not removal from old saves.\n\n| Team | Keep for new runs | Review later / archived | Observed team share |\n|---|---|---|---|\n${teams.map(t=>`| ${t.team} | ${t.kept.map(p=>p.name).join(', ')} | ${t.deferred.map(p=>p.name).join(', ')} | ${t.observedTeamSharePercent}% |`).join('\n')}\n\n## Compatibility and presentation\n\nNew runs pin their receiver catalog, including gifts, rerolls, manual picks and Quick autofill. Runs without that field keep the original ordered pools; their draft snapshot content version remains original. Archived boards retain all old candidates and may scroll manually. Fresh boards show two columns on phones and five on wider screens without automatic winner scrolling. Short/zoomed windows can still scroll manually rather than lose content.\n`);
console.log(JSON.stringify({runs:report.runs,draws,manual,automatic,profiles:report.curatedProfiles,memberships:membershipCounts.size,unseen:report.unseenMemberships.length,gradeMeans:[report.originalGradeSpread.weightedMeanCeiling,report.curatedGradeSpread.weightedMeanCeiling]}));
