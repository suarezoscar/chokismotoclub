import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="skeleton-card">
      <div class="image shimmer"></div>
      <div class="content">
        <div class="title shimmer"></div>
        <div class="text shimmer"></div>
        <div class="text short shimmer"></div>
      </div>
    </div>
  `,
    styles: [`
    .skeleton-card {
      background: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
      height: 100%;
    }
    .image {
      height: 200px;
      width: 100%;
    }
    .content {
      padding: 1rem;
    }
    .title {
      height: 24px;
      width: 70%;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    .text {
      height: 16px;
      width: 100%;
      margin-bottom: 0.5rem;
      border-radius: 4px;
    }
    .short {
      width: 60%;
    }
    .shimmer {
      background: #2a2a2a;
      background-image: linear-gradient(to right, #2a2a2a 0%, #3a3a3a 20%, #2a2a2a 40%, #2a2a2a 100%);
      background-repeat: no-repeat;
      background-size: 800px 100%;
      animation: shimmer 1.5s infinite linear forwards;
    }
    @keyframes shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
  `]
})
export class SkeletonComponent { }
