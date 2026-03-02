import { Component, input, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // standalone components need imports for pipes usually if not globally provided, but usually checks imports.
import { NewsEvent } from '../../../core/models/news-event.interface';
import { MerchItem } from '../../../core/models/merch-item.interface';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html-pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, DatePipe, SafeHtmlPipe], // CommonModule includes SlicePipe
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {
  newsItem = input<NewsEvent>();
  merchItem = input<MerchItem>();

  isExpanded = signal(false);
  isImageExpanded = signal(false);

  // Drag to dismiss state
  touchStartY = signal(0);
  currentTouchY = signal(0);
  isDragging = signal(false);

  toggleExpand() {
    this.isExpanded.update(v => !v);
  }

  toggleImageExpand(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isImageExpanded.update(v => !v);

    // Reset drag state when opening
    if (this.isImageExpanded()) {
      this.touchStartY.set(0);
      this.currentTouchY.set(0);
      this.isDragging.set(false);
    }
  }

  // Touch event handlers for mobile drag-to-dismiss
  onTouchStart(event: TouchEvent) {
    this.touchStartY.set(event.touches[0].clientY);
    this.isDragging.set(true);
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging()) return;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - this.touchStartY();

    // Only allow dragging upwards (negative deltaY)
    if (deltaY < 0) {
      this.currentTouchY.set(deltaY);
    } else {
      this.currentTouchY.set(0);
    }
  }

  onTouchEnd() {
    if (!this.isDragging()) return;
    this.isDragging.set(false);

    // If dragged upwards by more than 100px, dismiss the image
    if (this.currentTouchY() < -100) {
      this.toggleImageExpand();
    } else {
      // Snap back to 0
      this.currentTouchY.set(0);
    }
  }
}
