import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria?: string;
  imagen?: string;
  stock?: number;
  disponible?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private readonly API_URL = `${environment.apiUrl}/tienda`;

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  // Obtener producto por ID
  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  // Crear nuevo producto
  crearProducto(producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>): Observable<Producto> {
    return this.http.post<Producto>(this.API_URL, producto);
  }

  // Actualizar producto
  actualizarProducto(id: string, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  // Eliminar producto
  eliminarProducto(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`);
  }

  // Filtrar productos por categoría
  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?categoria=${categoria}`);
  }

  // Buscar productos
  buscarProductos(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?search=${termino}`);
  }
}