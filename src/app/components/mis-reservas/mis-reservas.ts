import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService, Reserva } from '../../services/reserva';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-reservas.html',
  styleUrls: ['./mis-reservas.css']
})
export class MisReservas implements OnInit {
  todasLasReservas = signal<Reserva[]>([]);
  email = signal('');

  reservasFiltradas = computed(() => {
    const emailActual = this.email().toLowerCase().trim();
    if (!emailActual) return [];
    return this.todasLasReservas().filter(r =>
      r.clienteEmail.toLowerCase().includes(emailActual)
    );
  });

  // Mensajes
  mensaje = signal('');
  error = signal('');

  private reservaService = inject(ReservaService);

  ngOnInit(): void {
    const emailGuardado = localStorage.getItem('email');
    if (emailGuardado) {
      this.email.set(emailGuardado);
      this.cargarReservas();
    }
  }

  cargarReservas(): void {
    const emailActual = this.email().trim();
    if (!emailActual) {
      this.todasLasReservas.set([]);
      this.mensaje.set('Ingresa un email para ver tus reservas.');
      return;
    }

    localStorage.setItem('email', emailActual);
    this.reservaService.obtenerReservasPorEmail(emailActual).subscribe({
      next: (data) => {
        this.todasLasReservas.set(data);
        this.error.set('');
        this.mensaje.set(data.length === 0 ? 'No tienes reservas.' : '');
      },
      error: () => {
        this.error.set('Error al cargar reservas');
        this.todasLasReservas.set([]);
      }
    });
  }

  cancelarReserva(id: string): void {
    if (confirm('¿Cancelar reserva?')) {
      this.reservaService.cancelarReserva(id).subscribe({
        next: () => this.cargarReservas(),
        error: () => this.error.set('Error al cancelar')
      });
    }
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'CONFIRMADA': return 'estado-confirmada';
      case 'CANCELADA': return 'estado-cancelada';
      default: return 'estado-pendiente';
    }
  }
}