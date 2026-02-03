import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UiService } from '../../core/services/ui';
import { Card } from '../../shared/components/card/card';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton';
import { Meta, Title } from '@angular/platform-browser';
import { DataService } from '../../core/services/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [Card, SkeletonComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Home implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private dataService = inject(DataService);

  // Real Data from Firestore (undefined = loading)
  newsItems = toSignal(this.dataService.getNews());
  merchItems = toSignal(this.dataService.getMerch());

  ngOnInit() {
    this.titleService.setTitle('Chokis Motoclub | O Carballiño');
    this.metaService.updateTag({ name: 'description', content: 'Web oficial del Chokis Motoclub de O Carballiño. Noticias, rutas, eventos y merchandising oficial.' });
    this.metaService.updateTag({ name: 'keywords', content: 'motos, club motero, o carballiño, ourense, rutas moto, chokis' });
    this.metaService.updateTag({ property: 'og:title', content: 'Chokis Motoclub | O Carballiño' });
    this.metaService.updateTag({ property: 'og:description', content: 'Únete a nuestras rutas y eventos. Pasión por las dos ruedas en Galicia.' });
    this.metaService.updateTag({ property: 'og:image', content: 'assets/logo.jpg' });

    this.setupScrollSpy();
  }

  private uiService = inject(UiService);
  private platformId = inject(PLATFORM_ID);

  private setupScrollSpy() {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.uiService.setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px', // Trigger when element hits middle of screen
      threshold: 0
    });

    setTimeout(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach(sec => observer.observe(sec));
    }, 100);
  }
}
