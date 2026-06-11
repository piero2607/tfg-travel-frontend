import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paquete {
  id: string;
  nombre: string;
  destino: string;
  descripcion: string;
  precio: number;
  duracionDias: number;
  plazasDisponibles: number;
  urlImagen: string;
  fechaCreacion: string
}

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {
  private apiUrl = 'http://localhost:8080/api/paquetes';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Paquete[]> {
    return this.http.get<Paquete[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Paquete> {
    return this.http.get<Paquete>(`${this.apiUrl}/${id}`);
  }

  crearPaquete(paquete: any): Observable<Paquete> {
    return this.http.post<Paquete>(this.apiUrl, paquete);
  }

  buscarPorDestino(destino: string): Observable<Paquete[]> {
    return this.http.get<Paquete[]>(`${this.apiUrl}/buscar?destino=${destino}`);
  }

  buscarPorPrecio(precioMaximo: number): Observable<Paquete[]> {
    return this.http.get<Paquete[]>(`${this.apiUrl}/filtrar?precioMaximo=${precioMaximo}`);
  }
}