import {TraitReveal} from './shared/trait-reveal';
import {RecruitBadge} from './shared/recruit-rating';
import {GameBroadcast} from './shared/game-broadcast';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameStore } from './application/game-store';
import { ART_SCENES } from './data/art-scenes';
import { COLLEGES } from './data/colleges';
import { SOURCE_PLAYERS } from './data/source-players';
import { WR_DEFINITION } from './domain/positions';
import { BinderEntry, CardCustomization, CardEdition, CardViewModel, GameCommandPayload, RunPhase, SaveEnvelope, SourcePlayerDefinition, TrainingPlan } from './domain/models';
import { CollectibleCard } from './shared/collectible-card';
import { DraftIcon } from './shared/icon';

@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule, CollectibleCard, DraftIcon, TraitReveal, RecruitBadge, GameBroadcast], templateUrl: './app.html', styleUrl: './app.css' })
export class App {
  private previousFocus: HTMLElement | null = null;
  readonly game = inject(GameStore);
  readonly attributes = WR_DEFINITION.attributes;
  readonly colleges = COLLEGES;
  readonly sources = SOURCE_PLAYERS;
  readonly scenes = ART_SCENES;
  readonly modal = signal<'new' | 'discard' | 'import' | 'settings' | 'help' | null>(null);
  readonly autoRevealComplete=signal(false);
  readonly broadcastOpen=signal(true);
  readonly broadcastReplay=signal(false);
  readonly traitReveal=viewChild(TraitReveal);
  readonly automaticTraits=computed(()=>Object.values(this.game.run()?.creation.traits??{}).filter(t=>t.origin==='autofill').map(t=>({attributeId:t.attributeId,attribute:this.attributeName(t.attributeId),source:this.sourceName(t.sourcePlayerId),grade:t.grade,ceiling:t.ceiling})));
  private revealRun='';
  readonly prospectName = signal('');
  readonly jerseyNumber = signal(11);
  readonly formError = signal('');
  readonly selectedSource = signal('');
  readonly trainingMode = signal<'balanced' | 'focused' | 'intensive'>('balanced');
  readonly trainingTarget = signal('speed');
  readonly search = signal('');
  readonly filter = signal('all');
  readonly sort = signal('newest');
  readonly schoolFilter = signal('all');
  readonly importText = signal('');
  readonly importData = signal<SaveEnvelope | null>(null);
  readonly importErrors = signal<string[]>([]);
  readonly editingFor = signal('');
  readonly cardPatch = signal<Partial<CardCustomization>>({});
  readonly activeTab = signal<'journey' | 'college' | 'career'>('journey');
  readonly howSteps = [
    { no: '01', title: 'Build your prospect', text: 'Borrow greatness. Combine traits from real football legends.' },
    { no: '02', title: 'Earn your moment', text: 'Choose your college. Train your way. Let the field decide.' },
    { no: '03', title: 'Meet your future', text: 'Face the scouts, hear your name, and play out a career.' },
    { no: '04', title: 'Keep your legacy', text: 'Turn every unique journey into a card worth collecting.' },
  ];
  readonly frameOptions: { id: CardCustomization['frame']; label: string; detail: string }[] = [
    { id: 'classic', label: 'Classic', detail: 'The original paper edition' },
    { id: 'silver', label: 'Silver', detail: 'Earned through your journey' },
    { id: 'gold', label: 'Gold', detail: 'A standout collection finish' },
    { id: 'training', label: 'Practice field', detail: 'Earned through development' },
    { id: 'transfer', label: 'New chapter', detail: 'Earned through a transfer' },
    { id: 'legend', label: 'Legend', detail: 'The highest collection finish' },
  ];
  readonly heroCard: CardViewModel = {
    name: 'Your prospect', position: 'WR', ovr: 72, title: 'Sample card', subtitle: '', school: 'College · Draft · Career', team: '', draftLabel: 'Your draft edition', edition: 'draft', art: 'art/journey.png', sceneName: 'Prospect Journey', frame: 'classic', foil: false, stamp: '', statLines: [{ label: 'Build', value: '01' }, { label: 'Develop', value: '02' }, { label: 'Collect', value: '03' }], colors: ['#254b35', '#e9b654'], year: 'VOL. 01',
  };
  readonly filteredEntries = computed(() => {
    const query = this.search().trim().toLocaleLowerCase();
    let entries = this.game.entries().filter(e => {
      const text = `${e.draft.prospect.name} ${e.display.schoolName} ${e.draft.outcome.status === 'drafted' ? e.draft.outcome.team.displayName : 'undrafted'}`.toLocaleLowerCase();
      if (query && !text.includes(query)) return false;
      if (this.schoolFilter() !== 'all' && e.draft.schoolId !== this.schoolFilter()) return false;
      switch (this.filter()) {
        case 'favorites': return e.favorite;
        case 'hall': return !!e.career?.induction.inducted;
        case 'first-round': return e.draft.outcome.status === 'drafted' && e.draft.outcome.round === 1;
        case 'career': return !!e.career;
        case 'all-pro': return !!e.career?.awards.some(a => a.type === 'all_pro');
        default: return true;
      }
    });
    return entries.sort((a, b) => {
      switch (this.sort()) {
        case 'ovr': return b.draft.finalOvr - a.draft.finalOvr;
        case 'growth': return this.growth(b) - this.growth(a);
        case 'pick': return this.pick(a) - this.pick(b);
        case 'yards': return (b.career?.totals.yards ?? -1) - (a.career?.totals.yards ?? -1);
        default: return b.completedAt.localeCompare(a.completedAt);
      }
    });
  });
  readonly offeredSources = computed(() => {
    const ids = this.game.run()?.creation.playerOffers ?? [];
    return ids.map(id => this.source(id)).filter(s => !!s);
  });
  readonly activeSource = computed<SourcePlayerDefinition | null>(() => this.offeredSources().find(s => s.id === this.selectedSource()) ?? this.offeredSources()[0] ?? null);
  readonly availableTraits = computed(() => {
    const run = this.game.run();
    const source = this.activeSource();
    if (!run || !source) return [];
    return this.attributes.filter(a => !run.creation.traits[a.id]).map(a => ({ ...a, grade: source.grades[a.id as keyof typeof source.grades] }));
  });
  readonly currentCustomization = computed<CardCustomization>(() => {
    const e = this.game.currentEntry();
    const edition = this.game.selectedEdition();
    const saved = (edition === 'career' ? e?.careerCard : e?.draftCard) ?? e?.draftCard ?? { sceneId: this.scenes[0]?.id ?? 'journey', frame: 'classic', foil: false, showStamp: true };
    return { ...saved, ...(this.editingFor() === `${e?.id}:${edition}` ? this.cardPatch() : {}) };
  });
  readonly sceneOptions = computed(() => {
    const entry = this.game.currentEntry();
    if (!entry) return [];
    const unlocks = [...entry.draft.unlocks, ...(this.game.selectedEdition() === 'career' ? entry.career?.unlocks ?? [] : [])];
    return this.scenes.filter((scene, i) => i === 0 || unlocks.some(u => u.sceneId === scene.id)).map(scene => ({ scene, evidence: unlocks.find(u => u.sceneId === scene.id)?.evidence.description ?? 'Every prospect earns a place in the collection. Always available.' }));
  });
  readonly builderCard = computed<CardViewModel | null>(() => {
    const entry = this.game.currentEntry();
    if (!entry) return null;
    const edition = this.game.selectedEdition();
    const customization = this.currentCustomization();
    const preview = { ...entry, [edition === 'career' ? 'careerCard' : 'draftCard']: customization };
    return this.game.cardView(preview, edition);
  });
  readonly stageTitles: Record<RunPhase, { title: string }> = {
    gift: { title: 'Choose your opening gift.' },
    size: { title: 'Choose your build.' },
    potential: { title: 'Choose a source. Borrow a trait.' },
    reveal: { title: 'Your prospect.' },
    'college-choice': { title: 'Choose your college.' },
    training: { title: 'Set your training.' },
    'block-review': { title: 'Block recap.' },
    'season-review': { title: 'Season recap.' },
    transfer: { title: 'Choose your next college.' },
    gauntlet: { title: 'Scouting gauntlet.' },
    'draft-night': { title: 'Draft night.' },
    complete: { title: 'Your collectible.' },
  };

  constructor() {
    effect(()=>{const run=this.game.run(),key=run?.phase==='reveal'?run.id:'';if(key!==this.revealRun){this.revealRun=key;this.autoRevealComplete.set(false);}});
    effect(() => {
      const open = this.modal();
      if (open) {
        if (!document.querySelector('.modal')?.contains(document.activeElement)) this.previousFocus = document.activeElement as HTMLElement;
        setTimeout(() => {
          const selector = open === 'new' ? '#prospect-name' : '.modal button:not([disabled])';
          document.querySelector<HTMLElement>(selector)?.focus();
        });
      } else if (this.previousFocus?.isConnected) {
        const previous = this.previousFocus;
        setTimeout(() => previous.focus());
        this.previousFocus = null;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onModalKey(event: KeyboardEvent): void {
    if (!this.modal()) return;
    if (event.key === 'Escape') { event.preventDefault(); this.modal.set(null); return; }
    if (event.key !== 'Tab') return;
    const items = Array.from(document.querySelectorAll<HTMLElement>('.modal button:not([disabled]), .modal input:not([disabled]), .modal select:not([disabled]), .modal textarea:not([disabled]), .modal summary')).filter(el => el.getClientRects().length > 0);
    const first = items[0], last = items[items.length - 1];
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement as HTMLElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement as HTMLElement))) { event.preventDefault(); first.focus(); }
  }

  source(id: string) { return this.sources.find(s => s.id === id); }
  sourceName(id: string): string { return this.source(id)?.name ?? 'Unknown source'; }
  attributeName(id: string): string { return this.attributes.find(a => a.id === id)?.label ?? id; }
  collegeName(id: string): string { return this.colleges.find(c => c.id === id)?.name ?? id; }
  college(id: string) { return this.colleges.find(c => c.id === id); }
  yearName(year: number): string { return ['Freshman', 'Sophomore', 'Junior'][year - 1] ?? `Year ${year}`; }
  height(cm: number): string { const inches = Math.round(cm / 2.54); return `${Math.floor(inches / 12)}′ ${inches % 12}″`; }
  weight(kg: number): number { return Math.round(kg * 2.20462); }
  rounded(value: number | undefined): number { return Math.round(value ?? 0); }
  number(value: number | undefined): string { return Math.round(value ?? 0).toLocaleString('en-US'); }
  signed(value: number): string { return `${value >= 0 ? '+' : ''}${Math.round(value * 10) / 10}`; }
  growth(entry: BinderEntry): number { return entry.draft.finalOvr - entry.draft.prospect.initialOvr; }
  pick(entry: BinderEntry): number { return entry.draft.outcome.status === 'drafted' ? entry.draft.outcome.overallPick : 10000; }
  gains(values: Record<string, number>): { id: string; label: string; value: number }[] { return Object.entries(values).filter(([, v]) => v > 0).map(([id, value]) => ({ id, label: this.attributeName(id), value })); }
  traitCount(): number { return Object.keys(this.game.run()?.creation.traits ?? {}).length; }
  currentOvr(): number { const p = this.game.run()?.prospect; if (!p) return 0; return Math.round(this.attributes.reduce((sum, a) => sum + (p.current[a.id] ?? 0) * a.weight, 0) / this.attributes.reduce((sum, a) => sum + a.weight, 0)); }
  chapter(phase: RunPhase): number { return ['gift', 'size', 'potential', 'reveal'].includes(phase) ? 1 : ['college-choice', 'training', 'block-review', 'season-review', 'transfer'].includes(phase) ? 2 : phase === 'complete' ? 4 : 3; }
  activeCard(entry: BinderEntry): CardViewModel { return this.game.cardView(entry, entry.career && entry.careerCard ? 'career' : 'draft'); }
  navigate(view: 'home'|'play'|'binder'|'entry'|'career'|'card', id?: string, edition?: CardEdition): void { this.game.navigate(view, id, edition); this.scrollTop(); }
  scrollTop(): void { window.scrollTo({ top: 0, behavior: 'instant' }); }
  openNew(): void { this.formError.set(''); this.modal.set(this.game.run() && this.game.run()?.phase !== 'complete' ? 'discard' : 'new'); }
  async discardRun(): Promise<void> { await this.game.resetActive(); if (!this.game.error()) this.modal.set('new'); }
  async startRun(): Promise<void> {
    const name = this.prospectName().trim();
    if (name.length < 2 || name.length > 28) { this.formError.set('Give your prospect a name between 2 and 28 characters.'); return; }
    if (!Number.isInteger(this.jerseyNumber()) || this.jerseyNumber() < 0 || this.jerseyNumber() > 99) { this.formError.set('Choose a jersey number from 0 to 99.'); return; }
    await this.game.newRun(name, this.jerseyNumber());
    if (!this.game.error()) { this.modal.set(null); this.selectedSource.set(''); this.trainingMode.set('balanced'); this.scrollTop(); }
  }
  completeTraits():void {const moveFocus=!!document.activeElement?.closest('app-trait-reveal');this.autoRevealComplete.set(true);if(moveFocus)requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>('[data-continue-college]')?.focus({preventScroll:true}));}
  completeBroadcast():void {const moveFocus=!!document.activeElement?.closest('app-game-broadcast');this.broadcastOpen.set(false);if(moveFocus)requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>('[data-block-continue]')?.focus({preventScroll:true}));}
  skipPresentation():void {this.game.skipReveal();this.traitReveal()?.showAll();}
  replayBroadcast():void {this.broadcastReplay.set(true);this.broadcastOpen.set(true);}
  command(payload: GameCommandPayload): void { if(payload.type==='train'){this.broadcastReplay.set(false);this.broadcastOpen.set(true);}  void this.game.dispatch(payload).then(() => { this.selectedSource.set(''); this.scrollTop(); }); }
  train(): void {
    const mode = this.trainingMode();
    const plan: TrainingPlan = mode === 'balanced' ? { mode } : { mode, attributeId: this.trainingTarget() };
    this.command({ type: 'train', plan });
  }
  followCoach(attributeId: string): void { this.trainingMode.set('intensive'); this.trainingTarget.set(attributeId); }
  openEntry(entry: BinderEntry): void { this.activeTab.set('journey'); this.navigate('entry', entry.id); }
  openCard(id: string, edition: CardEdition): void { this.editingFor.set(`${id}:${edition}`); this.cardPatch.set({}); this.navigate('card', id, edition); }
  patchCard(patch: Partial<CardCustomization>): void { const entry = this.game.currentEntry(); this.editingFor.set(`${entry?.id}:${this.game.selectedEdition()}`); this.cardPatch.update(p => ({ ...p, ...patch })); }
  async saveCard(done = false): Promise<void> { const entry = this.game.currentEntry(); if (!entry) return; await this.game.saveCard(entry.id, this.game.selectedEdition(), this.currentCustomization()); if (!this.game.error()) { this.cardPatch.set({}); if (done) this.navigate('binder'); } }
  async exportCard(): Promise<void> { await this.saveCard(); const entry = this.game.currentEntry(); if (entry && !this.game.error()) await this.game.exportCard(entry.id, this.game.selectedEdition()); }
  frameOwned(frame: CardCustomization['frame']): boolean { return frame === 'classic' || this.game.profile().frames.includes(frame); }
  async readImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 256*1024*1024) { this.importErrors.set(['That file is too large. Choose a Draft Bound save smaller than 256 MB.']); return; }
    try { this.importText.set(await file.text()); this.previewImport(); } catch { this.importErrors.set(['That file could not be read. Please choose it again.']); }
  }
  previewImport(): void { const result = this.game.previewImport(this.importText()); this.importErrors.set(result.errors); this.importData.set(result.ok ? result.data ?? null : null); }
  async confirmImport(): Promise<void> { const data = this.importData(); if (!data) return; await this.game.importSave(data); if (!this.game.error()) { this.modal.set(null); this.importData.set(null); this.importText.set(''); this.navigate('binder'); } }
  openImport(): void { this.importText.set(''); this.importData.set(null); this.importErrors.set([]); this.modal.set('import'); }
  clearFilters(): void { this.search.set(''); this.filter.set('all'); this.schoolFilter.set('all'); }
}

