import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NoticiasService } from '../../services/noticias.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-debug-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; border: 2px solid #007bff; margin: 20px; border-radius: 8px;">
      <h3>🔍 Debug API</h3>
      <p><strong>Environment API URL:</strong> {{ apiUrl }}</p>
      <p><strong>Full Noticias URL:</strong> {{ fullUrl }}</p>
      
      <button (click)="testDirectHttp()" style="margin: 10px; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px;">
        Test Direct HTTP
      </button>
      
      <button (click)="testService()" style="margin: 10px; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px;">
        Test Service
      </button>

      <div *ngIf="loading" style="color: #ffc107; margin: 10px 0;">
        ⏳ Cargando...
      </div>

      <div *ngIf="result" style="background: #d4edda; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <strong>✅ Resultado:</strong>
        <pre>{{ result | json }}</pre>
      </div>

      <div *ngIf="error" style="background: #f8d7da; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <strong>❌ Error:</strong>
        <pre>{{ error | json }}</pre>
      </div>
    </div>
  `
})
export class DebugApiComponent implements OnInit {
  apiUrl = environment.apiUrl;
  fullUrl = `${environment.apiUrl}/noticias`;
  loading = false;
  result: any = null;
  error: any = null;

  constructor(
    private http: HttpClient,
    private noticiasService: NoticiasService
  ) {}

  ngOnInit() {
    console.log('🔍 Debug API Component initialized');
    console.log('Environment:', environment);
    console.log('API URL:', this.apiUrl);
    console.log('Full URL:', this.fullUrl);
  }

  testDirectHttp() {
    this.loading = true;
    this.result = null;
    this.error = null;

    console.log('🧪 Testing direct HTTP call to:', this.fullUrl);

    this.http.get(this.fullUrl).subscribe({
      next: (data) => {
        console.log('✅ Direct HTTP success:', data);
        this.result = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Direct HTTP error:', err);
        this.error = {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url,
          error: err.error
        };
        this.loading = false;
      }
    });
  }

  testService() {
    this.loading = true;
    this.result = null;
    this.error = null;

    console.log('🧪 Testing service call');

    this.noticiasService.getNoticias().subscribe({
      next: (data) => {
        console.log('✅ Service success:', data);
        this.result = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Service error:', err);
        this.error = {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url,
          error: err.error
        };
        this.loading = false;
      }
    });
  }
}