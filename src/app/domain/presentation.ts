import {BinderEntry,CardEdition,CardViewModel} from './models';
import {ART_SCENES} from '../data/art-scenes';
import {sumStats} from './simulation';
export function cardView(entry:BinderEntry,edition:CardEdition):CardViewModel {
 const d=entry.draft,career=edition==='career'?entry.career:null,custom=(career?entry.careerCard:entry.draftCard)??entry.draftCard;
 const art=ART_SCENES.find(a=>a.id===custom.sceneId)??ART_SCENES[0],outcome=d.outcome;
 const draftLabel=outcome.status==='drafted'?`ROUND ${outcome.round} · PICK ${outcome.overallPick}`:'UNDRAFTED · FREE AGENT';
 const stats=entry.positionId==='wr'?sumStats(d.history):null;
 const statLines=career?[{label:'NFL yards',value:career.totals.yards.toLocaleString('en-US')},{label:'TD',value:String(career.totals.touchdowns)},{label:'All-Pro',value:String(career.awards.length)}]:stats?[{label:'College yards',value:stats.yards.toLocaleString('en-US')},{label:'TD',value:String(stats.touchdowns)},{label:'Growth',value:`+${d.finalOvr-d.prospect.initialOvr}`}]:entry.display.attributes.slice(0,3).map(a=>({label:a.label,value:String(Math.round(a.value))}));
 return {name:d.prospect.name,position:entry.positionId.toUpperCase(),ovr:d.finalOvr,title:career?'Career edition':'Draft edition',subtitle:career?`${career.seasons.length} NFL seasons`:'College prospect',school:entry.display.schoolName,team:outcome.status==='drafted'?outcome.team.displayName:'',draftLabel,edition,art:art.art,sceneName:art.name,frame:custom.frame,foil:custom.foil,stamp:custom.showStamp?(career?.induction.inducted?'HALL OF FAME':!career&&outcome.status==='drafted'&&outcome.overallPick<=32?'FIRST ROUND':''):'',statLines,colors:entry.display.schoolColors,year:new Date(entry.completedAt).getFullYear().toString()};
}
