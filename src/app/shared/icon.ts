import {Component,computed,input} from '@angular/core';
import {ICON_PATHS,IconName,IconPart,iconTransform} from './icon-paths';

/** Decorative by design: the containing control owns its accessible name. */
@Component({
  selector:'app-icon',standalone:true,
  host:{'aria-hidden':'true'},
  template:`<svg viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    @for(part of parts();track $index){<path [attr.d]="part.d" [attr.transform]="transform(part)" [attr.fill]="part.solid || filled() ? part.accent ? 'var(--icon-accent, currentColor)' : 'currentColor' : 'none'" [attr.stroke]="part.solid ? 'none' : part.accent ? 'var(--icon-accent, currentColor)' : 'currentColor'" fill-rule="evenodd"/>}
  </svg>`,
  styles:`:host{display:inline-flex;align-items:center;justify-content:center;width:1em;height:1em;flex-shrink:0;vertical-align:-.15em;line-height:1;pointer-events:none}svg{display:block;width:100%;height:100%;overflow:visible}`,
})
export class DraftIcon {
  readonly name=input.required<IconName>();
  readonly filled=input(false);
  readonly transform=iconTransform;
  readonly parts=computed<readonly IconPart[]>(()=>ICON_PATHS[this.name()]);
}
