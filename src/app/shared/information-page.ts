import {Component,computed,effect,input} from '@angular/core';
import {InformationPageId} from '../application/navigation';
import {INFORMATION_CONTENT} from '../data/information-pages';
import {ContactForm} from './contact-form';

@Component({
 selector:'app-information-page',
 standalone:true,
 template:`
  <article class="information-page page-width">
   <h1 tabindex="-1" data-information-heading>{{content().title}}</h1>
   @if(content().updatedDate){<p class="information-updated">Last Updated: {{content().updatedDate}}</p>}
   @if(content().draft){<p class="information-draft">{{content().draftNotice??'Draft · Publication details pending'}}</p>}
   @for(paragraph of content().intro??[];track $index){<p>{{paragraph}}</p>}
   @if(tocSections().length){
    <nav class="information-toc" aria-label="On this page">
     <ol>@for(section of tocSections();track section.id){<li><a [href]="'#'+section.id">{{section.heading}}</a></li>}</ol>
    </nav>
   }
   @for(section of content().sections;track $index){
    <section [id]="sectionId($index)">
     @if(section.heading){<h2>{{section.heading}}</h2>}
     @if(page()==='contact'&&section.heading==='Send Us a Message'){<app-contact-form/>}
     @else{@for(paragraph of section.paragraphs;track $index){<p>{{paragraph}}</p>}}
     @if(section.items){<ul>@for(item of section.items;track $index){<li>{{item}}</li>}</ul>}
     @for(paragraph of section.afterItems??[];track $index){<p>{{paragraph}}</p>}
     @if(section.links){<ul>@for(link of section.links;track link.url){<li><a [href]="link.url">{{link.label}}</a></li>}</ul>}
    </section>
   }
  </article>`,
 styleUrl:'./information-page.css',
 imports:[ContactForm]
})
export class InformationPage {
 readonly page=input.required<InformationPageId>();
 readonly sectionAnchor=input<string|null>(null);
 readonly content=computed(()=>INFORMATION_CONTENT[this.page()]);
 readonly tocSections=computed(()=>{
  const page=this.page();
  if(page!=='terms'&&page!=='privacy')return [];
  return this.content().sections.map((section,index)=>({heading:section.heading,id:`${page}/section-${index+1}`}));
 });

 constructor(){effect(()=>{const anchor=this.sectionAnchor();if(anchor)requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView({block:'start'}));});}

 sectionId(index:number):string|undefined{return this.tocSections()[index]?.id;}
}
