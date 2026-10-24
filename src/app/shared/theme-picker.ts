import {Component,DestroyRef,computed,effect,inject,input,output,signal} from '@angular/core';
import {PaletteId,PALETTES} from '../data/palettes';
import {ThemePreference} from '../domain/models';
import {resolveTheme} from '../application/theme';
import {DraftIcon} from './icon';
import {Brand} from './brand';
@Component({selector:'app-theme-picker',standalone:true,imports:[DraftIcon,Brand],template:`
 <fieldset class="palette-picker"><legend>Color theme</legend>
  <div class="theme-preview" [attr.data-palette]="candidate()" [attr.data-theme]="appearance()" aria-label="Theme preview">
   <div class="theme-preview-top"><strong>{{name()}}</strong><app-brand/></div>
   <div class="theme-preview-card" aria-hidden="true"><b>New prospect</b><span class="preview-input">Jordan Hayes</span><span class="preview-action">Create prospect <app-icon name="next"/></span></div>
  </div>
  <div class="palette-options">
  @for(palette of palettes;track palette.id){
   <label class="palette-option" [class.selected]="candidate()===palette.id">
    <input type="radio" name="color-theme" [value]="palette.id" [checked]="candidate()===palette.id" [disabled]="disabled()&&candidate()!==palette.id" (change)="candidate.set(palette.id)">
    <span class="palette-swatches" aria-hidden="true"><i [style.background]="swatch(palette.id,'paper')"></i><i [style.background]="swatch(palette.id,'surface')"></i><i [style.background]="swatch(palette.id,'accent')"></i><i [style.background]="swatch(palette.id,'ink')"></i></span>
    <span class="palette-name">{{palette.name}} @if(candidate()===palette.id){<app-icon name="check"/>}</span>
   </label>
  }</div>
  @if(attempted()&&failed()&&candidate()!==selected()){<p class="palette-save-error" role="alert">Theme could not be saved. Retry Apply or export a backup.</p>}
  <div class="palette-apply"><button type="button" class="button primary" (click)="apply()" [attr.aria-disabled]="disabled()||candidate()===selected()">Apply theme <app-icon name="check"/></button></div>
 </fieldset>`})
export class ThemePicker {
 readonly palettes=PALETTES;readonly selected=input<PaletteId>('forest');readonly disabled=input(false);readonly preference=input<ThemePreference>('system');readonly picked=output<PaletteId>();
 readonly candidate=signal<PaletteId>('forest');private readonly media=matchMedia('(prefers-color-scheme: dark)');private readonly systemDark=signal(this.media.matches);
 readonly failed=input(false);readonly attempted=signal(false);
 readonly appearance=computed(()=>resolveTheme(this.preference(),this.systemDark()));readonly name=computed(()=>PALETTES.find(p=>p.id===this.candidate())!.name);
 constructor(){effect(()=>this.candidate.set(this.selected()));const change=()=>this.systemDark.set(this.media.matches);this.media.addEventListener('change',change);inject(DestroyRef).onDestroy(()=>this.media.removeEventListener('change',change));}
 swatch(id:PaletteId,role:string):string{return `var(--palette-${id}-${this.appearance()}-${role})`;}
 apply():void{if(!this.disabled()&&this.candidate()!==this.selected()){this.attempted.set(true);this.picked.emit(this.candidate());}}
}
