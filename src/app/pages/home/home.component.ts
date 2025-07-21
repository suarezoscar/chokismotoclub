import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
import { NewsComponent } from '../../components/news/news.component';
import { EventosComponent } from '../../components/eventos/eventos.component';
import { TiendaComponent } from '../../components/tienda/tienda.component';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, NewsComponent, EventosComponent, TiendaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  scrollProgress = 0;

  constructor(private noticiasService: NoticiasService) {
    console.log('🏠 HomeComponent inicializado');
  }

  ngOnInit() {
    console.log('🚀 HomeComponent cargado - Iniciando proceso de carga de noticias');
    console.log('⏰ Timestamp de inicio:', new Date().toISOString());
    
    // Hacer la llamada inmediatamente al cargar la home
    this.cargarNoticiasEnHome();
  }

  private cargarNoticiasEnHome() {
    console.log('📡 Iniciando carga automática de noticias desde Home...');
    
    this.noticiasService.getNoticias().subscribe({
      next: (noticias) => {
        console.log('🎉 Noticias cargadas exitosamente en Home');
        console.log('📊 Total de noticias recibidas:', noticias.length);
        console.log('✅ Proceso completado exitosamente');
      },
      error: (error) => {
        console.error('💥 Error en Home al cargar noticias:', error);
        console.error('🔧 Verifica que el backend esté corriendo en http://localhost:3000');
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Ajustar los puntos de transición para contenido más largo
    const startPoint = windowHeight * 0.1; // Empezar un poco más tarde
    const endPoint = windowHeight * 1.5;   // Terminar más tarde para permitir más scroll

    if (scrollPosition < startPoint) {
      this.scrollProgress = 0;
    } else if (scrollPosition > endPoint) {
      this.scrollProgress = 1;
    } else {
      // Usar una función de easing para una transición más suave
      const rawProgress = (scrollPosition - startPoint) / (endPoint - startPoint);
      // Aplicar easing cubic-bezier para una transición más natural
      this.scrollProgress = this.easeInOutCubic(rawProgress);
    }
  }

  // Función de easing para transiciones más suaves
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
