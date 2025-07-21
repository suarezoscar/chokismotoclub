import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TiendaService, Producto } from '../../services/tienda.service';
import { Subscription } from 'rxjs';

interface ProductoConEstado extends Producto {
  _imageError?: boolean;
  _imageLoaded?: boolean;
}

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss'
})
export class TiendaComponent implements OnInit, OnDestroy {
  productos: ProductoConEstado[] = [];
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private tiendaService: TiendaService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProductos();
    } else {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarProductos() {
    this.loading = true;
    this.error = null;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.tiendaService.getProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos recibidos:', productos);
        console.log('📊 Cantidad de productos:', productos?.length);
        this.productos = Array.isArray(productos) ? productos : [];
        this.loading = false;
        this.error = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);

        let errorMessage = 'Error al cargar los productos.';
        if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor.';
        } else if (error.status === 404) {
          errorMessage = 'Productos no encontrados.';
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

  trackByProducto(index: number, producto: Producto): string {
    return producto.id || index.toString();
  }



  hasValidImage(producto: Producto): boolean {
    if (!producto.imagen) {
      return false;
    }

    try {
      new URL(producto.imagen);
      return true;
    } catch {
      return false;
    }
  }

  getImageSrc(producto: Producto): string {
    if (!producto.imagen) {
      return '';
    }

    if ((producto as any)._imageError) {
      return '';
    }

    return producto.imagen;
  }

  onImageError(event: Event, producto: Producto) {
    (producto as any)._imageError = true;
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    this.productos = [...this.productos];
  }

  onImageLoad(producto: Producto) {
    (producto as any)._imageLoaded = true;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  }

  solicitarInfo(producto: Producto) {
    const mensaje = `Hola! Me interesa obtener más información sobre: ${producto.nombre}`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const instagramUrl = `https://ig.me/m/chokismotoclub`;

    // Abrir en nueva ventana/pestaña
    window.open(instagramUrl, '_blank');
  }

  tienePrecio(producto: Producto): boolean {
    return producto.precio !== null && producto.precio !== undefined && producto.precio > 0;
  }
}