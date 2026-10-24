import {GameView as View,isInformationPage,parseLocation} from './navigation';
import {Injectable,computed,signal} from '@angular/core';
import {BinderEntry,CardCustomization,CardEdition,GameCommandPayload,SaveEnvelope,PaletteId,CreationMode,ThemePreference} from '../domain/models';
import {createRun,transition} from '../domain/engine';
import {cosmeticProfile} from '../domain/eligibility';
import {RULES_VERSION} from '../domain/positions';
import {simulateProfessional} from '../domain/professional';
import {cardView} from '../domain/presentation';
import {emptySave,GameRepository,previewSave,SaveConflictError,MAX_BINDER_ENTRIES} from '../persistence/save';
import {downloadBlob,renderCard} from './card-export';
import {assertValidContent} from '../data/content-validation';
import {applyPalette,cachedPalette,readPalette,applyTheme,cachedThemePreference,readThemePreference} from './theme';

@Injectable({providedIn:'root'})
export class GameStore{
 private readonly repository=new GameRepository();
 readonly ready=signal(false);readonly run=signal<SaveEnvelope['run']>(null);readonly entries=signal<BinderEntry[]>([]);readonly profile=signal(emptySave().profile);
 readonly view=signal<View>('home');readonly selectedEntryId=signal<string|null>(null);readonly selectedEdition=signal<CardEdition>('draft');
 readonly informationSection=signal<string|null>(null);
 readonly busy=signal(false);readonly revealing=signal(false);readonly fastForward=signal(false);readonly unsaved=signal(false);readonly error=signal('');readonly notice=signal('');
 readonly palette=signal<PaletteId>(cachedPalette());
 readonly themePreference=signal<ThemePreference>(cachedThemePreference());
 private readonly deviceTheme=matchMedia('(prefers-color-scheme: dark)');
 readonly currentEntry=computed(()=>this.entries().find(e=>e.id===this.selectedEntryId())??null);
 readonly binderAtLimit=computed(()=>this.entries().length>=MAX_BINDER_ENTRIES);
 private revealTimer:ReturnType<typeof setTimeout>|undefined;
 private readonly owner=typeof crypto!=='undefined'?crypto.randomUUID():'tab';private revision=0;
 private readonly channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('draft-bound-saves'):null;
 constructor(){
  applyPalette(this.palette());
  applyTheme(this.themePreference(),this.deviceTheme.matches);
  this.deviceTheme.addEventListener('change',()=>applyTheme(this.themePreference(),this.deviceTheme.matches));
  this.channel?.addEventListener('message',event=>{if(event.data?.owner!==this.owner){this.notice.set('Your save changed in another tab. Reload this tab before making more choices.');this.foreignChange=true;}});
  void this.load();window.addEventListener('hashchange',()=>this.readLocation());window.addEventListener('popstate',()=>this.readLocation());
 }
 private foreignChange=false;
 private loadBlocked=false;
 private unreadableSave:unknown=null;
 private persistenceQueue:Promise<void>=Promise.resolve();
 private envelope():SaveEnvelope{return {schemaVersion:1,rulesVersion:RULES_VERSION,run:this.run(),entries:this.entries(),profile:this.profile(),settings:{fastForward:this.fastForward(),theme:this.themePreference(),palette:this.palette()}};}
 private apply(data:SaveEnvelope):void{this.run.set(data.run);this.entries.set(data.entries);this.profile.set(cosmeticProfile(data.entries,data.profile));this.fastForward.set(data.settings.fastForward);this.palette.set(readPalette(data.settings.palette));applyPalette(this.palette());this.themePreference.set(readThemePreference(data.settings.theme));applyTheme(this.themePreference(),this.deviceTheme.matches);}
 private async load():Promise<void>{try{assertValidContent();const stored=await this.repository.read();if(stored){this.unreadableSave=stored;const result=previewSave(JSON.stringify(stored));if(!result.ok){this.loadBlocked=true;throw Error(result.errors.join(' ')+' The original save is protected. Export it or import a valid backup.');}this.apply(result.data!);this.unreadableSave=null;}}catch(e){this.loadBlocked=true;this.unsaved.set(true);this.error.set(e instanceof Error?e.message:'Saved progress could not be loaded.');}finally{this.ready.set(true);this.readLocation();}}
 private readLocation():void{const route=parseLocation(location.hash);if(!route)return;const {view:raw,id,edition}=route;
  if(raw==='play'&&!this.run()){this.view.set('home');return;}if(['entry','career','card'].includes(raw)&&!this.entries().some(e=>e.id===id)){this.view.set('binder');return;}
  const informational=isInformationPage(raw);this.informationSection.set(informational&&id&&/^section-\d+$/.test(id)?`${raw}/${id}`:null);
  const entry=this.entries().find(e=>e.id===id);this.selectedEntryId.set(informational?null:id??null);this.selectedEdition.set(edition);this.view.set(entry&&entry.positionId!=='wr'&&['entry','career'].includes(raw)?'card':raw);
 }

 private async persist(envelope:SaveEnvelope=this.envelope()):Promise<boolean>{let saved=false;const snapshot=structuredClone(envelope);this.persistenceQueue=this.persistenceQueue.then(async()=>{
  if(this.foreignChange||this.loadBlocked){this.unsaved.set(true);this.error.set(this.loadBlocked?'The unreadable original save is protected. Export it or import a valid backup.':'Another tab changed this save. Export your progress, then reload.');return;}
  try{await this.repository.write(snapshot);saved=true;this.unsaved.set(false);this.channel?.postMessage({owner:this.owner,revision:++this.revision});}catch(e){this.unsaved.set(true);if(e instanceof SaveConflictError){this.foreignChange=true;this.error.set(e.message);}else this.notice.set('Progress is kept in this tab. Retry saving or export a backup.');}
 });await this.persistenceQueue;return saved;}
 async retrySave():Promise<void>{await this.persist();}
 private async action(fn:()=>void|Promise<void>,allowRecovery=false):Promise<void>{if(this.busy())return;if(this.loadBlocked&&!allowRecovery){this.error.set('The unreadable original save is protected. Export it or import a valid backup.');return;}if(this.foreignChange){this.error.set('Another tab changed this save. Export a backup if needed, then reload.');return;}this.busy.set(true);this.error.set('');try{await fn();}catch(e){this.error.set(e instanceof Error?e.message:'That action could not finish.');}finally{this.busy.set(false);}}
 private reveal():void{this.skipReveal();if(this.fastForward()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;this.revealing.set(true);this.revealTimer=setTimeout(()=>this.revealing.set(false),850);}
 skipReveal():void{if(this.revealTimer)clearTimeout(this.revealTimer);this.revealing.set(false);}
 clearError():void{this.error.set('');}
 async newRun(name:string,jerseyNumber:number,mode:CreationMode='quick'):Promise<void>{await this.action(async()=>{if(this.entries().length>=MAX_BINDER_ENTRIES)throw Error(`Your binder has reached its ${MAX_BINDER_ENTRIES.toLocaleString('en-US')}-card limit. Export a backup before making room.`);if(this.run()&&this.run()!.phase!=='complete')throw Error('Finish or discard your active prospect first.');const seed=crypto.getRandomValues(new Uint32Array(1))[0];this.run.set(createRun(name,jerseyNumber,seed,new Date().toISOString(),mode));await this.persist();this.navigate('play');this.reveal();});}
 async dispatch(payload:GameCommandPayload):Promise<void>{await this.action(async()=>{const current=this.run();if(!current)throw Error('Start a prospect first.');const result=transition(current,{...payload,id:crypto.randomUUID()});if(result.entry&&this.entries().length>=MAX_BINDER_ENTRIES)throw Error(`Your binder has reached its ${MAX_BINDER_ENTRIES.toLocaleString('en-US')}-card limit. Your prospect is still saved; no card was added. Export a backup before making room.`);this.run.set(result.run);if(result.entry){this.entries.update(entries=>[result.entry!,...entries.filter(e=>e.id!==result.entry!.id)]);this.profile.set(cosmeticProfile(this.entries(),this.profile()));}await this.persist();if(['choose-gift','accept-size','choose-trait','reroll','scout'].includes(payload.type))this.reveal();});}
 navigate(view:View,entryId?:string,edition:CardEdition='draft'):void{
  this.skipReveal();this.notice.set(this.unsaved()?'Progress is kept in this tab. Export a backup.':'');
  if(view==='binder'&&this.run()?.phase==='draft-night'){this.run.update(r=>r?{...r,phase:'complete'}:null);void this.persist();}
  const entry=this.entries().find(e=>e.id===entryId);if(entry&&entry.positionId!=='wr'&&['entry','career'].includes(view)){view='card';this.notice.set('Archived position: view and export only.');}
  this.view.set(view);this.selectedEntryId.set(entryId??null);this.selectedEdition.set(edition);const hash=`#${view}${entryId?'/'+entryId:''}${entryId?'/'+edition:''}`;if(location.hash!==hash)history.pushState(null,'',hash);
 }
 toggleFastForward():void{this.fastForward.update(v=>!v);this.skipReveal();void this.persist();}
 async setPalette(palette:PaletteId):Promise<void>{await this.action(async()=>{if(readPalette(palette)!==palette)throw Error('Unknown color theme.');const snapshot=this.envelope();snapshot.settings.palette=palette;if(await this.persist(snapshot)){this.palette.set(palette);applyPalette(palette);}});}
 async setTheme(preference:ThemePreference):Promise<void>{await this.action(async()=>{if(!['system','light','dark'].includes(preference))throw Error('Unknown theme.');const snapshot=this.envelope();snapshot.settings.theme=preference;if(await this.persist(snapshot)){this.themePreference.set(preference);applyTheme(preference,this.deviceTheme.matches);}});}
 async simulateCareer(entryId:string):Promise<void>{await this.action(async()=>{const entry=this.entries().find(e=>e.id===entryId);if(!entry)throw Error('That prospect was not found.');if(entry.positionId!=='wr'||entry.draft.rulesVersion!==RULES_VERSION)throw Error('This historical prospect is read-only.');if(!entry.career){const career=simulateProfessional(entry);this.entries.update(es=>es.map(e=>e.id===entryId?{...e,career,careerCard:{sceneId:career.induction.inducted?'canton_bust':'prospect_journey',frame:e.draftCard.frame,foil:e.draftCard.foil,showStamp:true}}:e));}if(this.run()?.id===entryId&&this.run()?.phase==='draft-night')this.run.update(r=>r?{...r,phase:'complete'}:r);await this.persist();this.navigate('career',entryId,'career');});}
 async saveCard(entryId:string,edition:CardEdition,patch:Partial<CardCustomization>):Promise<void>{await this.action(async()=>{const entry=this.entries().find(e=>e.id===entryId);if(!entry)throw Error('That prospect was not found.');if(entry.positionId!=='wr')throw Error('This historical card is read-only.');if(edition==='career'&&!entry.career)throw Error('Simulate the career first.');const current=edition==='career'?entry.careerCard!:entry.draftCard,next={...current,...patch};const scenes=[...entry.draft.unlocks,...(edition==='career'?entry.career?.unlocks??[]:[])];if(next.sceneId!=='prospect_journey'&&!scenes.some(u=>u.sceneId===next.sceneId))throw Error('That artwork has not been earned for this edition.');if(!this.profile().frames.includes(next.frame)||next.foil&&!this.profile().frames.includes('legend'))throw Error('That card finish has not been earned.');this.entries.update(es=>es.map(e=>e.id===entryId?{...e,[edition==='career'?'careerCard':'draftCard']:next}:e));await this.persist();this.notice.set('Card saved.');});}
 async toggleFavorite(id:string):Promise<void>{await this.action(async()=>{this.entries.update(es=>es.map(e=>e.id===id?{...e,favorite:!e.favorite}:e));await this.persist();});}
 cardView=cardView;
 async exportCard(id:string,edition:CardEdition):Promise<void>{await this.action(async()=>{const entry=this.entries().find(e=>e.id===id);if(!entry)throw Error('That prospect was not found.');const blob=await renderCard(cardView(entry,edition));downloadBlob(blob,`${entry.draft.prospect.name.replace(/[^a-z0-9-]/gi,'-')}-${edition}.png`);});}
 exportSave():void{downloadBlob(new Blob([JSON.stringify(this.unreadableSave??this.envelope())],{type:'application/json'}),`draft-bound-save-${new Date().toISOString().slice(0,10)}.json`);}
 previewImport=previewSave;
 async importSave(data:SaveEnvelope):Promise<void>{await this.action(async()=>{const result=previewSave(JSON.stringify(data));if(!result.ok)throw Error(result.errors.join(' '));const next=result.data!;next.profile=cosmeticProfile(next.entries,next.profile);this.exportSave();await this.persistenceQueue;await this.repository.write(next);this.apply(next);this.loadBlocked=false;this.unreadableSave=null;this.unsaved.set(false);this.channel?.postMessage({owner:this.owner});this.notice.set('Save imported. Your previous collection was downloaded as a backup.');},true);}
 async resetActive():Promise<void>{await this.action(async()=>{this.run.set(null);await this.persist();});}
}

