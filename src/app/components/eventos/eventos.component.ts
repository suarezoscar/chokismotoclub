import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EventosService, Evento } from '../../services/eventos.service';
import { Subscription } from 'rxjs';

interface EventoConEstado extends Evento {
  _imageError?: boolean;
  _imageLoaded?: boolean;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit, OnDestroy {
  eventos: EventoConEstado[] = [];
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private eventosService: EventosService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarEventos();
    } else {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarEventos() {
    this.loading = true;
    this.error = null;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.eventosService.getEventos().subscribe({
      next: (eventos) => {
        console.log('✅ Eventos recibidos:', eventos);
        console.log('📊 Cantidad de eventos:', eventos?.length);
        this.eventos = Array.isArray(eventos) ? eventos : [];
        this.loading = false;
        this.error = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        
        let errorMessage = 'Error al cargar los eventos.';
        if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor.';
        } else if (error.status === 404) {
          errorMessage = 'Eventos no encontrados.';
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor.';
        }

        this.error = errorMessage;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    setTimeout(() => {
      if (this.loading) {
        this.error = 'La carga está tomando demasiado tiempo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    }, 15000);
  }

  trackByEvento(index: number, evento: Evento): string {
    return evento.id || index.toString();
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'Fecha no disponible';
    
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }



  hasValidImage(evento: Evento): boolean {
    if (!evento.imagen) {
      return false;
    }
    
    try {
      new URL(evento.imagen);
      return true;
    } catch {
      return false;
    }
  }

  getImageSrc(evento: Evento): string {
    if (!evento.imagen) {
      return '';
    }
    
    if ((evento as any)._imageError) {
      return '';
    }
    
    return evento.imagen;
  }

  onImageError(event: Event, evento: Evento) {
    (evento as any)._imageError = true;
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    this.eventos = [...this.eventos];
  }

  onImageLoad(evento: Evento) {
    (evento as any)._imageLoaded = true;
  }
}
