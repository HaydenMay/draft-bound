/** Mulberry32 stream. State belongs to the saved run, never to animation. */
export class Random {
 constructor(public state:number) { this.state=state>>>0; }
 next():number { this.state=(this.state+0x6D2B79F5)>>>0; let t=this.state; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }
 int(min:number,max:number):number { const range=max-min+1;if(range<1||range>4294967296)throw Error('Empty random range');const limit=Math.floor(4294967296/range)*range;let sample:number;do{sample=Math.floor(this.next()*4294967296);}while(sample>=limit);return min+sample%range; }
 pick<T>(items:readonly T[]):T { if(!items.length) throw Error('Empty source pool'); return items[this.int(0,items.length-1)]; }
 chance(p:number):boolean{return this.next()<p;}
}
export const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
