import {Component,DestroyRef,effect,inject,input,output,signal} from '@angular/core';
import {DraftIcon} from './icon';

export interface RevealedTrait {attributeId:string;attribute:string;source:string;grade:string;ceiling:number}
@Component({
 selector:'app-trait-reveal',standalone:true,imports:[DraftIcon],
 template:`<section class="automatic-reveal" aria-label="Automatic potential reveals">
  <p class="mechanic-note">These grades show ceilings, not instant skill gains. Quick mode auto-fills these remaining traits.</p>
  <div class="section-bar"><span>THE REMAINING POTENTIALS</span><span>{{shown()}} / {{traits().length}}</span></div>
  <div class="automatic-traits" role="list">@for(trait of traits();track trait.attributeId;let i=$index){
   <article class="automatic-trait" role="listitem" [class.is-revealed]="i<shown()">
    <span class="automatic-number">0{{i+1}}</span><h2>{{trait.attribute}}</h2>
    @if(i<shown()){
     <strong class="automatic-source">{{trait.source}}</strong>
     <span class="automatic-grade">{{trait.grade}}<small>{{trait.ceiling}} CEILING</small></span>
     <app-icon name="check" class="automatic-check" />
    }@else{<span class="roll-bars" aria-hidden="true"><i></i><i></i><i></i></span>}
   </article>
  }</div>
  <span class="sr-only" aria-live="polite">{{announcement()}}</span>
  @if(shown()<traits().length){<div class="stage-actions"><button class="button primary" (click)="next()">Reveal next trait <app-icon name="next" /></button><button class="text-button" (click)="showAll()">Show all remaining traits <app-icon name="fast" /></button></div>}
 </section>`,
})
export class TraitReveal {
 readonly traits=input.required<RevealedTrait[]>();readonly instant=input(false);readonly finished=output<void>();
 readonly shown=signal(0);readonly announcement=signal('');
 private timer:ReturnType<typeof setTimeout>|undefined;
 constructor(){
  inject(DestroyRef).onDestroy(()=>this.clear());
  effect(()=>{const traits=this.traits(),instant=this.instant()||matchMedia('(prefers-reduced-motion: reduce)').matches;this.clear();this.shown.set(0);this.announcement.set('');if(instant)queueMicrotask(()=>this.showAll());else if(traits.length)this.schedule();});
 }
 private clear(){if(this.timer)clearTimeout(this.timer);this.timer=undefined;}
 private schedule(){this.timer=setTimeout(()=>this.next(),900);}
 next():void {
  this.clear();const count=Math.min(this.traits().length,this.shown()+1);this.shown.set(count);
  const trait=this.traits()[count-1];if(trait)this.announcement.set(`${trait.attribute}: ${trait.source}, ${trait.grade} potential, ceiling ${trait.ceiling}.`);
  if(count===this.traits().length)this.finished.emit();else this.schedule();
 }
 showAll():void {this.clear();this.shown.set(this.traits().length);this.announcement.set('All remaining potentials revealed.');this.finished.emit();}
}
