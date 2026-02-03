import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // standalone components need imports for pipes usually if not globally provided, but usually checks imports.
import { NewsEvent } from '../../../core/models/news-event.interface';
import { MerchItem } from '../../../core/models/merch-item.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, DatePipe], // CommonModule includes SlicePipe
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {
  newsItem = input<NewsEvent>();
  merchItem = input<MerchItem>();
}
