import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { ReservaService, Reserva } from '../../services/reserva';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { TicketReservaComponent } from '../ticket-reserva/ticket-reserva'; 


@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],  
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

  mensaje = signal('');
  error = signal('');

  private reservaService = inject(ReservaService);
  private dialog = inject(MatDialog);   

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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Cancelar reserva',
        message: '¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.',
        confirmText: 'Sí, cancelar',
        cancelText: 'No, volver'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.reservaService.cancelarReserva(id).subscribe({
          next: () => this.cargarReservas(),
          error: () => this.error.set('Error al cancelar la reserva')
        });
      }
    });
  }

  confirmarReserva(id: string): void {
  this.dialog.open(ConfirmDialogComponent, {
    width: '380px',
    data: {
      title: 'Confirmar reserva',
      message: '¿Confirmas esta reserva? A partir de este momento quedará confirmada y no podrás cancelarla.',
      confirmText: 'Sí, confirmar',
      cancelText: 'No, volver'
    }
  }).afterClosed().subscribe(confirmed => {
    if (confirmed) {
      this.reservaService.confirmarReserva(id).subscribe({
        next: () => this.cargarReservas(),
        error: () => this.error.set('Error al confirmar la reserva')
      });
    }
  });
}
  verTicket(reserva: Reserva): void {
    this.dialog.open(TicketReservaComponent, {
      width: '550px',
      data: reserva
    });
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'CONFIRMADA': return 'estado-confirmada';
      case 'CANCELADA': return 'estado-cancelada';
      default: return 'estado-pendiente';
    }
  }
}