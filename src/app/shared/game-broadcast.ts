import {Component,DestroyRef,computed,effect,inject,input,output,signal,untracked} from '@angular/core';
import {BlockReview} from '../domain/models';
import {DraftIcon} from './icon';

@Component({selector:'app-game-broadcast',standalone:true,imports:[DraftIcon],template:`
 @if(game();as match){<section class="broadcast" [class.paused]="paused()" aria-label="Quick block broadcast">
  <div class="broadcast-header"><span class="broadcast-brand">DRAFT BOUND</span><span>GAME {{match.gameNumber}} · {{isFinal()?'FINAL':'HIGHLIGHTS'}}</span></div>
  <div class="broadcast-progress" aria-label="Four-game broadcast progress">@for(item of block().games;track item.id;let i=$index){<span [class.current]="i===gameIndex()" [class.complete]="i<gameIndex()">{{item.gameNumber}}</span>}</div>
  <div class="broadcast-matchup"><h2>{{school()}}</h2><span>vs.</span><h2>{{match.opponent}}</h2></div>
  <div class="broadcast-moment" [attr.data-moment]="moment()">
   @if(isFinal()){
    <div class="broadcast-final" aria-live="polite"><span class="broadcast-result" [class.loss]="!match.won">{{match.won?'WIN':'LOSS'}}</span><strong>{{match.teamScore}} <i>–</i> {{match.opponentScore}}</strong></div>
    <div class="broadcast-stats"><span><strong>{{match.stats.receptions}}</strong> REC</span><span><strong>{{match.stats.yards}}</strong> YDS</span><span><strong>{{match.stats.touchdowns}}</strong> TD</span></div>
   }@else{
    <div class="broadcast-field" aria-hidden="true"><svg viewBox="0 0 320 100"><path class="broadcast-yard-lines" d="M20 8v84M76 8v84M132 8v84M188 8v84M244 8v84M300 8v84M20 25h280M20 75h280"/><path class="broadcast-gain" [attr.d]="gainPath()"/><circle [attr.cx]="gainEnd()" cy="50" r="5"/></svg></div>
    <p class="broadcast-highlight" aria-live="polite">{{match.highlights[0]}}</p>
    @if(longestCatch()>0){<span class="broadcast-longest">LONGEST CATCH <strong>{{longestCatch()}} YD</strong></span>}
   }
  </div>
  <div class="broadcast-controls"><button class="text-button" (click)="togglePause()" [attr.aria-label]="paused()?'Resume broadcast':'Pause broadcast'" [attr.aria-pressed]="paused()"><app-icon [name]="paused()?'play':'pause'" />{{paused()?'Resume':'Pause'}}</button><button class="text-button" aria-label="Next broadcast moment" (click)="next()">Next <app-icon name="next" /></button><button class="text-button" (click)="finish()">Skip broadcast <app-icon name="fast" /></button></div>
 </section>}
`})
export class GameBroadcast {
 readonly block=input.required<BlockReview>();readonly school=input.required<string>();readonly instant=input(false);readonly finished=output<void>();
 readonly moment=signal(0);readonly paused=signal(false);
 readonly gameIndex=computed(()=>Math.min(this.block().games.length-1,Math.floor(this.moment()/2)));
 readonly game=computed(()=>this.block().games[this.gameIndex()]);readonly isFinal=computed(()=>this.moment()%2===1);
 readonly longestCatch=computed(()=>Math.max(0,...this.game().events.filter(e=>e.kind==='catch').map(e=>e.yards)));
 readonly gainEnd=computed(()=>20+Math.min(100,this.longestCatch())*2.8);readonly gainPath=computed(()=>`M20 50H${this.gainEnd()}`);
 private timer:ReturnType<typeof setTimeout>|undefined;private ended=false;
 constructor(){inject(DestroyRef).onDestroy(()=>this.clear());effect(()=>{this.block();const immediate=this.instant()||matchMedia('(prefers-reduced-motion: reduce)').matches;untracked(()=>{this.clear();this.ended=false;this.moment.set(0);this.paused.set(false);if(immediate)queueMicrotask(()=>this.finish());else this.schedule();});});}
 private clear(){if(this.timer)clearTimeout(this.timer);this.timer=undefined;}
 private schedule(){if(!this.paused()&&!this.ended)this.timer=setTimeout(()=>this.next(),this.isFinal()?1600:1400);}
 togglePause():void{this.paused.update(v=>!v);this.clear();this.schedule();}
 next():void{this.clear();if(this.moment()+1>=this.block().games.length*2){this.finish();return;}this.moment.update(v=>v+1);this.schedule();}
 finish():void{this.clear();if(!this.ended){this.ended=true;this.finished.emit();}}
}
