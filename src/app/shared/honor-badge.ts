import {Component,input} from '@angular/core';
import {SHIELD_PATH,stampLines} from './badge-geometry';

@Component({selector:'app-honor-badge',standalone:true,
 template:`<svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="path"/></svg><span>@for(line of lines(label());track $index){<b>{{line}}</b>}</span>`,
 styles:`:host{position:relative;display:grid;place-items:center;width:100%;height:100%;color:var(--print-stamp-ink)}svg{position:absolute;inset:0;width:100%;height:100%;fill:var(--print-stamp-ground);stroke:var(--print-stamp-border);stroke-width:.4}span{position:relative;display:flex;flex-direction:column;align-items:center;max-width:70%;font:700 clamp(5px,2.3cqw,10px)/1.15 'DM Sans',sans-serif;text-align:center;margin-top:-3px}b{font:inherit}`})
export class HonorBadge {readonly label=input.required<string>();readonly path=SHIELD_PATH;readonly lines=stampLines;}
