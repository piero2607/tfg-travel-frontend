import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  id: string;
  paqueteId: string;
  clienteNombre: string;
  apellidos: string;        
  clienteEmail: string;
  documento: string;        
  telefono: string;          
  numeroPersonas: number;
  precioTotal: number;
  estado: string;
  fechaReserva: string;
}

export interface ReservaRequest {
  paqueteId: string;
  clienteNombre: string;
  apellidos: string;
  clienteEmail: string;
  documento: string;
  telefono: string;
  numeroPersonas: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) { }

  crearReserva(reserva: ReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  obtenerReservasPorEmail(email: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/usuario?email=${email}`);
  }

  obtenerTodas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  confirmarReserva(id: string): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/confirmar`, {});
  }

  cancelarReserva(id: string): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}