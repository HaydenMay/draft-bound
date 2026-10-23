import {Component,computed,input} from '@angular/core';
import {Prospect} from '../domain/models';
import {recruitRating} from '../domain/recruiting';
import {DraftIcon} from './icon';

@Component({selector:'app-recruit-rating',standalone:true,imports:[DraftIcon],template:`
 <div class="recruit-rating"><div class="recruit-stars" aria-hidden="true">@for(star of stars;track star){<app-icon name="favorite" [filled]="star<=rating().stars" [class.unfilled]="star>rating().stars" />}</div><h2>{{rating().stars}}-star recruit</h2></div>
`})
export class RecruitBadge {
 readonly prospect=input.required<Prospect>();readonly rating=computed(()=>recruitRating(this.prospect()));readonly stars=[1,2,3,4,5];
}
