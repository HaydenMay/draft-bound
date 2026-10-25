import { AfterViewInit, Component, DestroyRef, ElementRef, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { SpotlightBoards, SpotlightTile, createSpotlightDelays, createSpotlightSequence } from './spotlight-sequence';
import { DraftIcon } from './icon';

type SpotlightStage = 'team' | 'receiver';

const TEAM_DURATION_MS = 1200;
const RECEIVER_DURATION_MS = 1000;
const WINNER_HOLD_MS = 300;
const TEAM_HOPS = 6;
const RECEIVER_HOPS = 4;

@Component({
  selector: 'app-spotlight-reveal',
  standalone: true,
  imports: [DraftIcon],
  template: `
    <div class="spotlight-overlay" role="dialog" aria-modal="true" aria-labelledby="spotlight-title" (keydown)="onKeydown($event)">
      <section class="spotlight-panel">
        <header class="spotlight-heading">
          <div>
            <span class="spotlight-eyebrow">{{ stage() === 'team' ? 'TEAM SPOTLIGHT' : 'RECEIVER SPOTLIGHT' }}</span>
            <h2 id="spotlight-title">{{ stage() === 'team' ? 'Find your team' : 'Find your receiver' }}</h2>
            @if (stage() === 'receiver') { <p>{{ teamTile()?.label }}</p> }
          </div>
          <span class="spotlight-count">{{ stage() === 'team' ? boards().teamTiles.length : boards().receiverTiles.length }}</span>
        </header>

        @if (stage() === 'team') {
          <div class="spotlight-board team-board" role="list" aria-label="NFL teams" data-testid="spotlight-team-board">
            @for (tile of boards().teamTiles; track tile.id) { <article class="spotlight-tile team-tile" role="listitem" [class.is-lit]="highlightedId() === tile.id" [attr.aria-current]="highlightedId() === tile.id ? 'true' : null" [attr.data-spotlight-id]="tile.id"><strong>{{ tile.detail }}</strong><span>{{ tile.label }}</span></article> }
          </div>
        } @else {
          <div class="spotlight-board receiver-board" role="list" [attr.aria-label]="teamTile()?.label + ' eligible receivers'" data-testid="spotlight-receiver-board">
            @for (tile of boards().receiverTiles; track tile.id) { <article class="spotlight-tile receiver-tile" role="listitem" [class.is-lit]="highlightedId() === tile.id" [attr.aria-current]="highlightedId() === tile.id ? 'true' : null" [attr.data-spotlight-id]="tile.id"><strong>{{ tile.label }}</strong></article> }
          </div>
        }

        <p class="spotlight-announcement" aria-live="polite" aria-atomic="true">{{ announcement() }}</p>
        <button #skipButton class="spotlight-skip" type="button" (click)="skip()">Skip reveal <app-icon name="next" /></button>
      </section>
    </div>
  `,
  styleUrl: './spotlight-reveal.css',
})
export class SpotlightReveal implements AfterViewInit {
  @ViewChild('skipButton') private skipButton?: ElementRef<HTMLButtonElement>;
  readonly boards = input.required<SpotlightBoards>();
  readonly teamId = input.required<string>();
  readonly receiverId = input.required<string>();
  readonly instant = input(false);
  readonly finished = output<void>();
  readonly stage = signal<SpotlightStage>('team');
  readonly highlightedId = signal('');
  readonly announcement = signal('');

  private timer: ReturnType<typeof setTimeout> | undefined;
  private completed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimer());
    effect(() => {
      const boards = this.boards();
      const teamId = this.teamId();
      const receiverId = this.receiverId();
      const instant = this.instant();
      this.start(boards, teamId, receiverId, instant);
    });
  }

  ngAfterViewInit(): void {
    this.skipButton?.nativeElement.focus({ preventScroll: true });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.skip();
    if (event.key === 'Tab') {
      event.preventDefault();
      this.skipButton?.nativeElement.focus({ preventScroll: true });
    }
  }

  teamTile(): SpotlightTile | undefined {
    return this.boards().teamTiles.find(tile => tile.id === this.teamId());
  }

  skip(): void {
    this.announcement.set(`${this.teamTile()?.label ?? 'Team'} selected. ${this.receiverTile()?.label ?? 'Receiver'} selected.`);
    this.finish();
  }

  private receiverTile(): SpotlightTile | undefined {
    return this.boards().receiverTiles.find(tile => tile.id === this.receiverId());
  }

  private start(boards: SpotlightBoards, teamId: string, receiverId: string, instant: boolean): void {
    this.clearTimer();
    this.completed = false;
    this.stage.set('team');
    this.highlightedId.set('');
    this.announcement.set('');

    if (instant || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.stage.set('receiver');
      this.highlightedId.set(receiverId);
      this.announcement.set(`${boards.teamTiles.find(tile => tile.id === teamId)?.label ?? 'Team'} selected. ${boards.receiverTiles.find(tile => tile.id === receiverId)?.label ?? 'Receiver'} selected.`);
      queueMicrotask(() => this.finish());
      return;
    }

    this.playStage('team', boards.teamTiles, teamId, TEAM_HOPS, TEAM_DURATION_MS, () => {
      this.announcement.set(`${this.teamTile()?.label ?? 'Team'} selected.`);
      this.stage.set('receiver');
      if (boards.receiverSpotlight) {
        this.playStage('receiver', boards.receiverTiles, receiverId, RECEIVER_HOPS, RECEIVER_DURATION_MS, () => {
          this.announcement.set(`${this.receiverTile()?.label ?? 'Receiver'} selected.`);
          this.timer = setTimeout(() => this.finish(), WINNER_HOLD_MS);
        });
      } else {
        this.highlightedId.set(receiverId);
        this.announcement.set(`${this.receiverTile()?.label ?? 'Receiver'} selected.`);
        this.timer = setTimeout(() => this.finish(), WINNER_HOLD_MS);
      }
    });
  }

  private playStage(stage: SpotlightStage, tiles: readonly SpotlightTile[], winnerId: string, hops: number, durationMs: number, done: () => void): void {
    this.stage.set(stage);
    const path = createSpotlightSequence(tiles.map(tile => tile.id), winnerId, hops);
    const delays = createSpotlightDelays(durationMs, path.length);
    let index = 0;
    const step = (): void => {
      if (this.completed) return;
      if (index >= path.length) {
        done();
        return;
      }
      this.highlightedId.set(path[index]);
      this.timer = setTimeout(step, delays[index]);
      index++;
    };
    step();
  }

  private finish(): void {
    if (this.completed) return;
    this.completed = true;
    this.clearTimer();
    this.finished.emit();
  }

  private clearTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
