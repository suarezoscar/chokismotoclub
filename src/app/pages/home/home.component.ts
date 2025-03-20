import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
import { NewsComponent } from '../../components/news/news.component';
import { EventosComponent } from '../../components/eventos/eventos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, NewsComponent, EventosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  scrollProgress = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Get scroll position and page height
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress (0 to 1)
    // Start transition after 20% of viewport height
    // Complete transition by 80% of viewport height
    const startPoint = windowHeight * 0.2;
    const endPoint = windowHeight;

    if (scrollPosition < startPoint) {
      this.scrollProgress = 0;
    } else if (scrollPosition > endPoint) {
      this.scrollProgress = 1;
    } else {
      this.scrollProgress = (scrollPosition - startPoint) / (endPoint - startPoint);
    }
  }
}
