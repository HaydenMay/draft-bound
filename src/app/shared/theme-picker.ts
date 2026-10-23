import {Component,input,output} from '@angular/core';
import {PaletteId} from '../domain/models';
import {PALETTES} from '../data/palettes';
import {DraftIcon} from './icon';

@Component({selector:'app-theme-picker',standalone:true,imports:[DraftIcon],template:`
 <fieldset class="palette-picker"><legend>Color theme</legend><div class="palette-options">
 @for(palette of palettes;track palette.id){
  <label class="palette-option" [attr.data-palette]="palette.id" [class.selected]="selected()===palette.id">
   <input type="radio" name="color-theme" [value]="palette.id" [checked]="selected()===palette.id" [disabled]="disabled()" (change)="picked.emit(palette.id)">
   <span class="palette-name">{{palette.name}} @if(selected()===palette.id){<app-icon name="check"/>}</span>
   <span class="palette-preview" aria-hidden="true"><i></i><b></b><em></em></span>
  </label>
 }
 </div></fieldset>`,
})
export class ThemePicker {
 readonly palettes=PALETTES;
 readonly selected=input<PaletteId>('forest');readonly disabled=input(false);readonly picked=output<PaletteId>();
}
