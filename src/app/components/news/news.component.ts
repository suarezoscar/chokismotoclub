import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NoticiasService, Noticia } from '../../services/noticias.service';
import { Subscription } from 'rxjs';

// Extender la interfaz Noticia para incluir propiedades de estado de imagen
interface NoticiaConEstado extends Noticia {
  _imageError?: boolean;
  _imageLoaded?: boolean;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit, OnDestroy {
  noticias: NoticiaConEstado[] = [];
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // Solo cargar noticias en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId)) {
      this.cargarNoticias();
    } else {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    // Limpiar suscripción para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarNoticias() {
    this.loading = true;
    this.error = null;

    // Cancelar suscripción anterior si existe
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.noticiasService.getNoticias().subscribe({
      next: (noticias) => {
        this.noticias = Array.isArray(noticias) ? noticias : [];
        this.loading = false;
        this.error = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar noticias:', error);

        let errorMessage = 'Error al cargar las noticias.';
        if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor.';
        } else if (error.status === 404) {
          errorMessage = 'Noticias no encontradas.';
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor.';
        }

        this.error = errorMessage;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // Timeout de seguridad (15 segundos)
    setTimeout(() => {
      if (this.loading) {
        this.error = 'La carga está tomando demasiado tiempo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    }, 15000);
  }

  // Método para optimizar el renderizado de la lista
  trackByNoticia(index: number, noticia: Noticia): string {
    return noticia.id || index.toString();
  }

  // Método para formatear la fecha
  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'Fecha no disponible';

    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }



  // Método para verificar si una noticia tiene imagen válida
  hasValidImage(noticia: Noticia): boolean {
    if (!noticia.imagen) {
      return false;
    }

    // Verificar si la URL es válida
    try {
      new URL(noticia.imagen);
      return true;
    } catch {
      return false;
    }
  }

  // Método para obtener la URL de la imagen de manera segura
  getImageSrc(noticia: Noticia): string {
    if (!noticia.imagen) {
      return '';
    } 

    // Si la imagen ya falló, no intentar cargarla de nuevo
    if ((noticia as any)._imageError) {
      return '';
    }

    return noticia.imagen;
  }

  // Método para manejar errores de imagen
  onImageError(event: Event, noticia: Noticia) {
    (noticia as any)._imageError = true;
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    this.noticias = [...this.noticias];
  }

  // Método para manejar carga exitosa de imagen
  onImageLoad(noticia: Noticia) {
    (noticia as any)._imageLoaded = true;
  }
}
