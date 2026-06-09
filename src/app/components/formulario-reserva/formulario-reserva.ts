import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaqueteService, Paquete } from '../../services/paquete';
import { ReservaService } from '../../services/reserva';

@Component({
  selector: 'app-formulario-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reserva.html',
  styleUrls: ['./formulario-reserva.css']
})
export class FormularioReserva implements OnInit {
  paqueteId: string = '';
  paquete: Paquete | null = null;
  clienteNombre: string = '';
  apellidos: string = '';
  clienteEmail: string = '';
  documento: string = '';
  telefono: string = '';
  numeroPersonas: number = 1;
  mensaje: string = '';
  error: string = ''; 

  errorNombre: string = '';
  errorApellidos: string = '';
  errorEmail: string = '';
  errorDocumento: string = '';
  errorTelefono: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paqueteService: PaqueteService,
    private reservaService: ReservaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const state = history.state as { paquete: Paquete };
    if (state?.paquete && state.paquete.id) {
      this.paquete = state.paquete;
      this.paqueteId = this.paquete.id;
      this.cdr.detectChanges();
      return;
    }
    this.paqueteId = this.route.snapshot.paramMap.get('id') || '';
    if (this.paqueteId) {
      this.cargarPaquete();
    } else {
      this.error = 'ID de paquete no válido';
    }
  }

  cargarPaquete(): void {
    this.paqueteService.obtenerPorId(this.paqueteId).subscribe({
      next: (data) => {
        this.paquete = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar el paquete';
        this.cdr.detectChanges();
      }
    });
  }

  // Validaciones
  validarNombre(): void {
    if (!this.clienteNombre.trim()) {
      this.errorNombre = 'El nombre es obligatorio';
    } else if (this.clienteNombre.trim().length < 2) {
      this.errorNombre = 'El nombre debe tener al menos 2 caracteres';
    } else {
      this.errorNombre = '';
    }
  }

  validarApellidos(): void {
    if (!this.apellidos.trim()) {
      this.errorApellidos = 'Los apellidos son obligatorios';
    } else if (this.apellidos.trim().length < 2) {
      this.errorApellidos = 'Los apellidos deben tener al menos 2 caracteres';
    } else {
      this.errorApellidos = '';
    }
  }

  validarEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.clienteEmail.trim()) {
      this.errorEmail = 'El email es obligatorio';
    } else if (!emailRegex.test(this.clienteEmail)) {
      this.errorEmail = 'Introduce un email válido (ej: nombre@dominio.com)';
    } else {
      this.errorEmail = '';
    }
  }

  validarDocumento(): void {
    if (!this.documento.trim()) {
      this.errorDocumento = 'El documento de identidad es obligatorio';
    } else if (this.documento.trim().length < 5) {
      this.errorDocumento = 'El documento debe tener al menos 5 caracteres';
    } else {
      this.errorDocumento = '';
    }
  }

  validarTelefono(): void {
    const telefonoRegex = /^\d{9,15}$/;
    if (!this.telefono.trim()) {
      this.errorTelefono = 'El teléfono es obligatorio';
    } else if (!telefonoRegex.test(this.telefono)) {
      this.errorTelefono = 'El teléfono debe contener solo números (mínimo 9 dígitos)';
    } else {
      this.errorTelefono = '';
    }
  }

  esFormularioValido(): boolean {
    this.validarNombre();
    this.validarApellidos();
    this.validarEmail();
    this.validarDocumento();
    this.validarTelefono();
    return !this.errorNombre && !this.errorApellidos && !this.errorEmail && 
           !this.errorDocumento && !this.errorTelefono && 
           this.numeroPersonas > 0;
  }

  reservar(): void {
    if (!this.esFormularioValido()) {
      return;
    }

    const reserva = {
      paqueteId: this.paqueteId,
      clienteNombre: this.clienteNombre.trim(),
      apellidos: this.apellidos.trim(),
      clienteEmail: this.clienteEmail.trim(),
      documento: this.documento.trim(),
      telefono: this.telefono.trim(),
      numeroPersonas: this.numeroPersonas
    };
    this.reservaService.crearReserva(reserva).subscribe({
      next: () => {
        this.mensaje = '✅ Reserva creada. Recibirás un email.';
        setTimeout(() => this.router.navigate(['/mis-reservas']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al crear reserva';
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}