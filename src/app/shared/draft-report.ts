import {Component,computed,input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {DraftSnapshot} from '../domain/models';
import {calculateOvr} from '../domain/development';
@Component({selector:'app-draft-report',standalone:true,imports:[DecimalPipe],template:`
 <section class="draft-report" aria-label="Draft evaluation breakdown">
  <h2>Your scouting report</h2>
  <p>Draft evaluation: <strong>{{draft().evaluation|number:'1.1-1'}} / 100</strong>. This combines ability and college performance; it is not an extra game or your overall rating.</p>
  <div class="evaluation-parts">@for(part of parts();track part.label){<div><strong>{{part.label}}</strong><span>{{part.score|number:'1.1-1'}} × {{part.weight}}% = {{part.score*part.weight/100|number:'1.2-2'}}</span></div>}</div>
  <p class="rounding-note">Contributions use unrounded values. Displayed numbers may differ slightly when added.</p>
  <div class="report-comparison"><div><h3>Relative strengths</h3>@for(check of ranked().slice(0,2);track $index){<p>{{check.name}} · {{check.score|number:'1.1-1'}}</p>}</div><div><h3>Development areas</h3>@for(check of ranked().slice(-2).reverse();track $index){<p>{{check.name}} · {{check.score|number:'1.1-1'}}</p>}</div></div>
  <details><summary>Scouting profile details</summary>@for(check of draft().gauntlet;track $index){<p><strong>{{check.name}} · {{check.score|number:'1.1-1'}}</strong><br>{{check.description}}</p>}</details>
 </section>
`,styles:[`
 :host{display:block}.draft-report{margin:1.5rem 0;padding:1.25rem;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-card)}h2{margin-top:0}p{line-height:1.65}.evaluation-parts{display:grid;gap:.75rem}.evaluation-parts>div{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}.evaluation-parts span{font-variant-numeric:tabular-nums}.report-comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.rounding-note{font-size:.8rem;color:var(--muted)}summary{cursor:pointer;padding:.5rem 0}details p{border-top:1px solid var(--line);padding-top:.75rem}@media(max-width:480px){.report-comparison{grid-template-columns:1fr}}
`]})
export class DraftReport {
 readonly draft=input.required<DraftSnapshot>();
 readonly ranked=computed(()=>[...this.draft().gauntlet].sort((a,b)=>b.score-a.score||(a.id??a.name).localeCompare(b.id??b.name)));
 readonly parts=computed(()=>[{label:'College ability (raw OVR)',score:calculateOvr(this.draft().prospect.current).raw,weight:70},{label:'College performance',score:this.draft().collegeGrade,weight:20},{label:'Scouting profile (trait averages)',score:this.draft().gauntlet.reduce((s,g)=>s+g.score,0)/5,weight:10}]);
}
