import { Component, inject, OnInit, OnDestroy, effect, PLATFORM_ID, ElementRef } from '@angular/core';
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
export class Home implements OnInit, OnDestroy {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private dataService = inject(DataService);
  private uiService = inject(UiService);
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  // Real Data from Firestore (undefined = loading)
  newsItems = toSignal(this.dataService.getNews());
  merchItems = toSignal(this.dataService.getMerch());

  private animObserver: IntersectionObserver | null = null;
  private scrollListener: (() => void) | null = null;

  constructor() {
    effect(() => {
      // Re-run observer setup when data signals change
      const news = this.newsItems();
      const merch = this.merchItems();

      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.setupAnimObserver(), 50); // slight delay to allow DOM to render
      }
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Chokis Motoclub | O Carballiño');
    this.metaService.updateTag({ name: 'description', content: 'Web oficial del Chokis Motoclub de O Carballiño. Noticias, rutas, eventos y merchandising oficial.' });
    this.metaService.updateTag({ name: 'keywords', content: 'motos, club motero, o carballiño, ourense, rutas moto, chokis' });
    this.metaService.updateTag({ property: 'og:title', content: 'Chokis Motoclub | O Carballiño' });
    this.metaService.updateTag({ property: 'og:description', content: 'Únete a nuestras rutas y eventos. Pasión por las dos ruedas en Galicia.' });
    this.metaService.updateTag({ property: 'og:image', content: 'assets/logo.jpg' });

    if (isPlatformBrowser(this.platformId)) {
      this.setupSectionSpy();
    }
  }

  private setupAnimObserver() {
    if (this.animObserver) {
      this.animObserver.disconnect();
    }

    this.animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, {
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    });

    const animatedElements = this.el.nativeElement.querySelectorAll('.reveal-on-scroll');
    animatedElements.forEach((el: Element) => this.animObserver!.observe(el));
  }

  private setupSectionSpy() {
    const sectionIds = ['hero', 'news', 'merch'];

    this.scrollListener = () => {
      const scrollMid = window.scrollY + window.innerHeight * 0.4;
      let active = 'hero';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMid) {
          active = id;
        }
      }
      this.uiService.setActiveSection(active);
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    this.scrollListener(); // set initial state
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.animObserver) {
      this.animObserver.disconnect();
    }
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
