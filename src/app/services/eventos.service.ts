import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Evento {
  id?: string;
  titulo: string;
  cuerpo: string; // El backend usa 'cuerpo' no 'descripcion'
  fecha_publicacion?: string;
  fecha_evento_inicio: string;
  fecha_evento_fin?: string;
  lugar?: string; // El backend usa 'lugar' no 'ubicacion'
  imagen?: string;
  precio?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private readonly API_URL = `${environment.apiUrl}/eventos`;

  constructor(private http: HttpClient) { }

  // Obtener todos los eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.API_URL);
  }

  // Obtener evento por ID
  getEvento(id: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.API_URL}/${id}`);
  }

  // Crear nuevo evento
  crearEvento(evento: Omit<Evento, 'id' | 'created_at' | 'updated_at'>): Observable<Evento> {
    return this.http.post<Evento>(this.API_URL, evento);
  }

  // Actualizar evento
  actualizarEvento(id: string, evento: Partial<Evento>): Observable<Evento> {
    return this.http.put<Evento>(`${this.API_URL}/${id}`, evento);
  }

  // Eliminar evento
  eliminarEvento(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`);
  }
}