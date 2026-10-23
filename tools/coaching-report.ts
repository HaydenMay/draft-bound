import {mkdirSync,writeFileSync} from 'node:fs';
import {createCollege,step} from '../src/app/domain/test-fixtures';
import {COACHING_TYPES} from '../src/app/domain/coaching';
import {recruitRating} from '../src/app/domain/recruiting';
import {COLLEGES} from '../src/app/data/colleges';
import {WR_DEFINITION} from '../src/app/domain/positions';
import {TrainingPlan} from '../src/app/domain/models';

const counts=Object.fromEntries(COACHING_TYPES.map(type=>[type,0]));
const stars=Object.fromEntries([1,2,3,4,5].map(star=>[star,0]));
let eliteHandsJugs=0,cappedCoaching=0,repeatInYear=0;
for(let index=0;index<1000;index++){
 let run=createCollege((0x1ab4+index*2654435761)>>>0);run.collegeId=COLLEGES[index%COLLEGES.length].id;
 stars[recruitRating(run.prospect!).stars]++;
 for(let year=1;year<=3;year++){
  const seen=new Set<string>();
  for(let block=0;block<3;block++){
   const p=run.prospect!,weakest=WR_DEFINITION.attributes.filter(a=>p.current[a.id]<p.traits[a.id].ceiling).sort((a,b)=>p.current[a.id]-p.current[b.id])[0];
   const plan:TrainingPlan=index%2&&weakest?{mode:'intensive',attributeId:weakest.id}:{mode:'balanced'};
   run=step(run,{type:'train',plan});
   const coach=run.pendingIntervention;
   if(coach){counts[coach.type]++;if(seen.has(coach.type))repeatInYear++;seen.add(coach.type);if(coach.type==='wr.jugs'&&run.prospect!.current['hands']>=90)eliteHandsJugs++;if(run.prospect!.current[coach.attributeId]>=run.prospect!.traits[coach.attributeId].ceiling)cappedCoaching++;}
   run=step(run,{type:'continue'});
  }
  if(year===3)break;
  run=step(run,year===2?{type:'return'}:{type:'continue'});run=step(run,{type:'transfer',collegeId:COLLEGES[index%COLLEGES.length].id});
 }
}
const report={prospects:1000,policies:'500 balanced / 500 weakest-intensive; evenly rotated schools; three seasons',counts,stars,eliteHandsJugs,cappedCoaching,repeatInYear};
mkdirSync('docs/validation',{recursive:true});writeFileSync('docs/validation/coaching-report.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('docs/validation/COACHING_REPORT.md',`# Coaching and recruit-rating audit\n\n1,000 seeded three-season prospects, split evenly between balanced and weakest-intensive training with schools rotated. Scripted outcomes, not player telemetry. No school coefficients or uniform source sampling changed.\n\n| Coaching opportunity | Count |\n|---|---:|\n${Object.entries(counts).map(([type,count])=>`| ${type} | ${count} |`).join('\n')}\n\n- Corrective JUGS at hands 90+: ${eliteHandsJugs}\n- Capped-skill interventions: ${cappedCoaching}\n- Same type repeated within one year: ${repeatInYear}\n\nRecruit stars (75% weighted potential + 25% initial ability; score bands 74 / 78 / 82 / 86): ${Object.entries(stars).map(([star,count])=>`${star}-star: ${count}`).join(', ')}. Stars do not affect gameplay.\n`);
console.log(JSON.stringify(report));
if(eliteHandsJugs||cappedCoaching||repeatInYear)process.exitCode=1;
