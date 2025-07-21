import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Noticia {
  id?: string;
  titulo: string;
  cuerpo: string;
  fecha_publicacion?: string;
  imagen?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private readonly API_URL = `${environment.apiUrl}/noticias`;

  constructor(private http: HttpClient) { }

  // Obtener todas las noticias
  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.API_URL);
  }

  // Obtener noticia por ID
  getNoticia(id: string): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.API_URL}/${id}`);
  }

  // Crear nueva noticia
  crearNoticia(noticia: Omit<Noticia, 'id' | 'fecha_publicacion' | 'created_at' | 'updated_at'>): Observable<Noticia> {
    return this.http.post<Noticia>(this.API_URL, noticia);
  }

  // Actualizar noticia
  actualizarNoticia(id: string, noticia: Partial<Noticia>): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.API_URL}/${id}`, noticia);
  }

  // Eliminar noticia
  eliminarNoticia(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`);
  }
}
