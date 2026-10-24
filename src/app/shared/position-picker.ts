import {Component} from '@angular/core';
import {POSITION_PREVIEWS} from '../data/positions-preview';
import {DraftIcon} from './icon';
@Component({selector:'app-position-picker',standalone:true,imports:[DraftIcon],template:`
 <fieldset class="position-picker"><legend>Position</legend><div class="position-grid">
 @for(position of positions;track position.id){
  <button type="button" class="position-tile" [class.available]="position.available" [disabled]="!position.available" [attr.aria-pressed]="position.available?'true':null" [attr.aria-label]="position.abbreviation+' '+position.name+(position.available?'':' Coming soon')">
   <span class="position-abbreviation">{{position.abbreviation}} @if(!position.available){<app-icon name="lock"/>}</span>
   <span class="position-name">{{position.name}}</span>@if(!position.available){<small>Coming soon</small>}
  </button>
 }</div></fieldset>`})
export class PositionPicker {readonly positions=POSITION_PREVIEWS;}
