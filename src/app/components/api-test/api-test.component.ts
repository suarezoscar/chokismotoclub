import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasService, Noticia } from '../../services/noticias.service';
import { EventosService, Evento } from '../../services/eventos.service';
import { TiendaService, Producto } from '../../services/tienda.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-test-container">
      <h2>🧪 Prueba de APIs</h2>
      
      <div class="test-section">
        <h3>📰 Noticias</h3>
        <button (click)="testNoticias()" [disabled]="loadingNoticias">
          {{ loadingNoticias ? 'Cargando...' : 'Probar /api/noticias' }}
        </button>
        <div *ngIf="noticiasResult" class="result">
          <strong>Resultado:</strong> {{ noticiasResult.length }} noticias encontradas
          <pre>{{ noticiasResult | json }}</pre>
        </div>
        <div *ngIf="noticiasError" class="error">
          <strong>Error:</strong> {{ noticiasError }}
        </div>
      </div>

      <div class="test-section">
        <h3>🎉 Eventos</h3>
        <button (click)="testEventos()" [disabled]="loadingEventos">
          {{ loadingEventos ? 'Cargando...' : 'Probar /api/eventos' }}
        </button>
        <div *ngIf="eventosResult" class="result">
          <strong>Resultado:</strong> {{ eventosResult.length }} eventos encontrados
          <pre>{{ eventosResult | json }}</pre>
        </div>
        <div *ngIf="eventosError" class="error">
          <strong>Error:</strong> {{ eventosError }}
        </div>
      </div>

      <div class="test-section">
        <h3>🛒 Tienda</h3>
        <button (click)="testTienda()" [disabled]="loadingTienda">
          {{ loadingTienda ? 'Cargando...' : 'Probar /api/tienda' }}
        </button>
        <div *ngIf="tiendaResult" class="result">
          <strong>Resultado:</strong> {{ tiendaResult.length }} productos encontrados
          <pre>{{ tiendaResult | json }}</pre>
        </div>
        <div *ngIf="tiendaError" class="error">
          <strong>Error:</strong> {{ tiendaError }}
        </div>
      </div>

      <div class="test-all">
        <button (click)="testAll()" [disabled]="loadingAll">
          {{ loadingAll ? 'Probando todos...' : '🚀 Probar todos los endpoints' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .api-test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .test-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .test-all {
      margin: 30px 0;
      text-align: center;
    }

    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .result {
      margin-top: 10px;
      padding: 10px;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 5px;
    }

    .error {
      margin-top: 10px;
      padding: 10px;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 5px;
    }

    pre {
      max-height: 200px;
      overflow-y: auto;
      background: #f8f9fa;
      padding: 10px;
      border-radius: 3px;
      font-size: 12px;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  // Noticias
  loadingNoticias = false;
  noticiasResult: Noticia[] | null = null;
  noticiasError: string | null = null;

  // Eventos
  loadingEventos = false;
  eventosResult: Evento[] | null = null;
  eventosError: string | null = null;

  // Tienda
  loadingTienda = false;
  tiendaResult: Producto[] | null = null;
  tiendaError: string | null = null;

  // General
  loadingAll = false;

  constructor(
    private noticiasService: NoticiasService,
    private eventosService: EventosService,
    private tiendaService: TiendaService
  ) {}

  ngOnInit() {
    console.log('🧪 ApiTestComponent inicializado');
    console.log('🌐 Base URL:', 'https://chokis-be.onrender.com/api');
  }

  testNoticias() {
    this.loadingNoticias = true;
    this.noticiasResult = null;
    this.noticiasError = null;

    console.log('🧪 Probando endpoint: /api/noticias');
    
    this.noticiasService.getNoticias().subscribe({
      next: (noticias) => {
        console.log('✅ Noticias obtenidas:', noticias);
        this.noticiasResult = noticias;
        this.loadingNoticias = false;
      },
      error: (error) => {
        console.error('❌ Error en noticias:', error);
        this.noticiasError = `${error.status}: ${error.message}`;
        this.loadingNoticias = false;
      }
    });
  }

  testEventos() {
    this.loadingEventos = true;
    this.eventosResult = null;
    this.eventosError = null;

    console.log('🧪 Probando endpoint: /api/eventos');
    
    this.eventosService.getEventos().subscribe({
      next: (eventos) => {
        console.log('✅ Eventos obtenidos:', eventos);
        this.eventosResult = eventos;
        this.loadingEventos = false;
      },
      error: (error) => {
        console.error('❌ Error en eventos:', error);
        this.eventosError = `${error.status}: ${error.message}`;
        this.loadingEventos = false;
      }
    });
  }

  testTienda() {
    this.loadingTienda = true;
    this.tiendaResult = null;
    this.tiendaError = null;

    console.log('🧪 Probando endpoint: /api/tienda');
    
    this.tiendaService.getProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos obtenidos:', productos);
        this.tiendaResult = productos;
        this.loadingTienda = false;
      },
      error: (error) => {
        console.error('❌ Error en tienda:', error);
        this.tiendaError = `${error.status}: ${error.message}`;
        this.loadingTienda = false;
      }
    });
  }

  testAll() {
    this.loadingAll = true;
    console.log('🚀 Probando todos los endpoints...');
    
    // Limpiar resultados anteriores
    this.noticiasResult = null;
    this.noticiasError = null;
    this.eventosResult = null;
    this.eventosError = null;
    this.tiendaResult = null;
    this.tiendaError = null;

    // Probar todos los endpoints
    this.testNoticias();
    this.testEventos();
    this.testTienda();

    // Simular tiempo de espera para mostrar el loading
    setTimeout(() => {
      this.loadingAll = false;
      console.log('✅ Prueba de todos los endpoints completada');
    }, 2000);
  }
}