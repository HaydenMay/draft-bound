import {Component,computed,input} from '@angular/core';
import {InformationPageId} from '../application/navigation';
import {INFORMATION_CONTENT} from '../data/information-pages';
import {ContactForm} from './contact-form';
@Component({selector:'app-information-page',standalone:true,template:`
 <article class="information-page page-width"><h1 tabindex="-1" data-information-heading>{{content().title}}</h1>
 @if(content().draft){<p class="information-draft">Draft · Awaiting owner review before publication</p>}
 @for(section of content().sections;track section.heading){<section><h2>{{section.heading}}</h2>@if(page()==='contact'&&section.heading==='Send Us a Message'){<app-contact-form/>}@else{@for(paragraph of section.paragraphs;track $index){<p>{{paragraph}}</p>}}@if(section.links){<ul>@for(link of section.links;track link.url){<li><a [href]="link.url">{{link.label}}</a></li>}</ul>}</section>}
 </article>`,styleUrl:'./information-page.css',imports:[ContactForm]})
export class InformationPage {readonly page=input.required<InformationPageId>();readonly content=computed(()=>INFORMATION_CONTENT[this.page()]);}
