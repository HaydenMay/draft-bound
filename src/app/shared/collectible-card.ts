import { Component, input, signal } from '@angular/core';
import { DraftIcon } from './icon';
import { CardViewModel } from '../domain/models';

@Component({
  selector: 'app-collectible-card',
  standalone: true,
  imports: [DraftIcon],
  templateUrl: './collectible-card.html',
  styleUrl: './collectible-card.css',
})
export class CollectibleCard {
  readonly card = input.required<CardViewModel>();
  readonly failedImage = signal('');
  imageFailed(): void { this.failedImage.set(this.card().art); }
}
