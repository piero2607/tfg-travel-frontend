import { Component, Inject, Optional } from '@angular/core';         
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button';
import { PaqueteService, Paquete } from '../../services/paquete';

@Component({
  selector: 'app-formulario-paquete',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './formulario-paquete.html',
  styleUrls: ['./formulario-paquete.css']
})
export class FormularioPaqueteComponent {
  nombre = '';
  destino = '';
  descripcion = '';
  precio: number | null = null;
  duracionDias: number | null = null;
  plazasDisponibles: number | null = null;
  urlImagen = '';

  errorNombre = '';
  errorDestino = '';
  errorDescripcion = '';
  errorPrecio = '';
  errorDuracion = '';
  errorPlazas = '';

  esEdicion = false;
  paqueteId: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<FormularioPaqueteComponent>,
    private paqueteService: PaqueteService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Paquete   
  ) {
    if (data) {
      this.esEdicion = true;
      this.paqueteId = data.id;
      this.nombre = data.nombre;
      this.destino = data.destino;
      this.descripcion = data.descripcion || '';
      this.precio = data.precio;
      this.duracionDias = data.duracionDias;
      this.plazasDisponibles = data.plazasDisponibles;
      this.urlImagen = data.urlImagen || '';
    }
  }

    validarNombre(): void {
    if (!this.nombre.trim()) {
      this.errorNombre = 'El nombre es obligatorio';
    } else if (this.nombre.trim().length < 3) {
      this.errorNombre = 'El nombre debe tener al menos 3 caracteres';
    } else {
      this.errorNombre = '';
    }
  }
  validarDestino(): void {
    if (!this.destino.trim()) {
      this.errorDestino = 'El destino es obligatorio';
    } else if (this.destino.trim().length < 3) {
      this.errorDestino = 'El destino debe tener al menos 3 caracteres';
    } else {
      this.errorDestino = '';
    }
  }

  validarDescripcion(): void {
  if (!this.descripcion.trim()) {
    this.errorDescripcion = 'La descripción es obligatoria';
  } else if (this.descripcion.trim().length < 10) { // mínimo 10 caracteres
    this.errorDescripcion = 'La descripción debe tener al menos 10 caracteres';
  } else {
    this.errorDescripcion = '';
  }
}

  validarPrecio(): void {
    if (this.precio === null) {
      this.errorPrecio = 'El precio es obligatorio';
    } else if (this.precio <= 0) {
      this.errorPrecio = 'El precio debe ser mayor que cero';
    } else {
      this.errorPrecio = '';
    }
  }

  validarDuracion(): void {
    if (this.duracionDias === null) {
      this.errorDuracion = 'La duración es obligatoria';
    } else if (this.duracionDias < 1) {
      this.errorDuracion = 'La duración debe ser al menos 1 día';
    } else {
      this.errorDuracion = '';
    }
  }

  validarPlazas(): void {
    if (this.plazasDisponibles === null) {
      this.errorPlazas = 'Las plazas disponibles son obligatorias';
    } else if (this.plazasDisponibles < 1) {
      this.errorPlazas = 'Debe haber al menos 1 plaza disponible';
    } else {
      this.errorPlazas = '';
    }
  }

  validarTodo(): boolean {
    this.validarNombre();
    this.validarDestino();
    this.validarDescripcion();
    this.validarPrecio();
    this.validarDuracion();
    this.validarPlazas();
    return !this.errorNombre && !this.errorDestino && !this.errorDescripcion && !this.errorPrecio &&
           !this.errorDuracion && !this.errorPlazas;
  }

  guardar(): void {
    if (!this.validarTodo()) return;

    const paqueteData = {
      nombre: this.nombre.trim(),
      destino: this.destino.trim(),
      descripcion: this.descripcion.trim(),
      precio: this.precio!,
      duracionDias: this.duracionDias!,
      plazasDisponibles: this.plazasDisponibles!,
      urlImagen: this.urlImagen.trim()
    };

    if (this.esEdicion && this.paqueteId) {
      this.paqueteService.actualizarPaquete(this.paqueteId, paqueteData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error('Error al actualizar paquete', err);
          this.dialogRef.close(false);
        }
      });
    } else {
      this.paqueteService.crearPaquete(paqueteData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error('Error al crear paquete', err);
          this.dialogRef.close(false);
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}