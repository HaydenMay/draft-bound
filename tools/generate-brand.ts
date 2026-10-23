import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const files={header:'header-lockup.svg',wordmark:'horizontal-wordmark.svg',mark:'db-mark.svg'};
const svg=(file:string)=>{
 let text=readFileSync(new URL('public/assets/brand/'+file,root),'utf8').trim();
 if(/<(script|foreignObject|image|text)\b|\son\w+=|\shref=/i.test(text))throw Error('Unexpected brand SVG content: '+file);
 text=text.replace(/ role="img"| aria-label="[^"]*"/g,'').replace('<svg ','<svg aria-hidden="true" focusable="false" ');
 return text.replace(/id="[^"]+"/g,'[attr.id]="maskId"').replace(/mask="url\(#[^)]+\)"/g,'[attr.mask]="\'url(#\'+maskId+\')\'"');
};
writeFileSync(new URL('src/app/shared/brand.ts',root),`// Generated from the approved SVG assets by npm run brands.
import {Component,input} from '@angular/core';
let serial=0;
@Component({selector:'app-brand',standalone:true,host:{'aria-hidden':'true'},template:\`
 @if(kind()==='header'){${svg(files.header)}}@else if(kind()==='wordmark'){${svg(files.wordmark)}}@else{${svg(files.mark)}}
\`,styles:\`:host{display:inline-flex;align-items:center;justify-content:center;width:150px;max-width:100%;color:inherit;--brand-accent:var(--orange)}svg{display:block;width:100%;height:auto}\`})
export class Brand {readonly kind=input<'mark'|'header'|'wordmark'>('mark');readonly maskId='draftbound-brand-'+(++serial);}
`);
const palette=readFileSync(new URL('src/colors.css',root),'utf8');
const token=(source:string,name:string)=>{const value=source.match(new RegExp('--'+name+':\\s*(#[a-f0-9]{6});','i'))?.[1];if(!value)throw Error('Missing favicon color '+name);return value};
const dark=palette.match(/:root\[data-theme='dark'\]\s*\{([^}]+)\}/)?.[1];if(!dark)throw Error('Missing dark colors');
const source=readFileSync(new URL('public/assets/brand/favicon-mark.svg',root),'utf8');
const style=`<style>svg{color:${token(palette,'ink')};--brand-accent:${token(palette,'orange')}}@media(prefers-color-scheme:dark){svg{color:${token(dark,'ink')};--brand-accent:${token(dark,'orange')}}}</style>`;
writeFileSync(new URL('public/favicon.svg',root),source.replace(/(<svg[^>]*>)/,'$1'+style));
