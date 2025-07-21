import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="section-nav">
      <div class="nav-container">
        <a href="#noticias" class="nav-link">
          <span class="nav-icon">📰</span>
          <span class="nav-text">Noticias</span>
        </a>
        <a href="#eventos" class="nav-link">
          <span class="nav-icon">🎉</span>
          <span class="nav-text">Eventos</span>
        </a>
        <a href="#tienda" class="nav-link">
          <span class="nav-icon">🛒</span>
          <span class="nav-text">Tienda</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .section-nav {
      position: sticky;
      top: 80px;
      z-index: 100;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 0;
      margin-bottom: 2rem;

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 2rem;
        padding: 0 2rem;

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          color: #ccc;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;

          &:hover {
            background: rgba(248, 161, 0, 0.2);
            border-color: rgba(248, 161, 0, 0.5);
            color: #f8a100;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(248, 161, 0, 0.3);
          }

          .nav-icon {
            font-size: 1.2rem;
          }

          .nav-text {
            @media (max-width: 480px) {
              display: none;
            }
          }
        }
      }

      @media (max-width: 768px) {
        top: 60px;
        padding: 0.75rem 0;

        .nav-container {
          gap: 1rem;
          padding: 0 1rem;

          .nav-link {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
        }
      }

      @media (max-width: 480px) {
        .nav-container {
          gap: 0.5rem;

          .nav-link {
            padding: 0.5rem;
            border-radius: 50%;
            min-width: 40px;
            min-height: 40px;
            justify-content: center;
          }
        }
      }
    }
  `]
})
export class SectionNavComponent {}