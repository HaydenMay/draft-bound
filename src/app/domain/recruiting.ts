import {Prospect} from './models';
import {calculateOvr,values} from './development';

export interface RecruitRating {stars:1|2|3|4|5;score:number;startingOvr:number;potentialOvr:number}
/** A read-only assessment of the original build; training cannot change recruitment history. */
export function recruitRating(prospect:Prospect):RecruitRating {
 const startingOvr=calculateOvr(prospect.initial).raw;
 const potentialOvr=calculateOvr(values(id=>prospect.traits[id].ceiling)).raw;
 const score=Math.round((potentialOvr*.75+startingOvr*.25)*100)/100;
 const stars:RecruitRating['stars']=score>=86?5:score>=82?4:score>=78?3:score>=74?2:1;
 return {stars,score,startingOvr,potentialOvr};
}
