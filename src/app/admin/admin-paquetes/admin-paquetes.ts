import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PaqueteService, Paquete } from '../../services/paquete';
import { FormularioPaqueteComponent } from '../../components/formulario-paquete/formulario-paquete';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-paquetes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './admin-paquetes.html',
  styleUrls: ['./admin-paquetes.css']
})
export class AdminPaquetesComponent implements OnInit {
  paquetes = signal<Paquete[]>([]);
  searchTerm = signal('');
  visibleCount = signal(6);

  paquetesFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    let todos = this.paquetes();
    if (term) {
      return todos.filter(p =>
        p.destino.toLowerCase().includes(term) ||
        p.nombre.toLowerCase().includes(term)
      );
    } else {
      return todos;
    }
  });

  paquetesMostrados = computed(() => {
    const filtrados = this.paquetesFiltrados();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      return filtrados;
    } else {
      return filtrados.slice(0, this.visibleCount());
    }
  });

  hayMas = computed(() => {
    if (this.searchTerm().trim()) return false;
    return this.visibleCount() < this.paquetesFiltrados().length;
  });

  constructor(
    private paqueteService: PaqueteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPaquetes();
  }

  cargarPaquetes(): void {
    this.paqueteService.obtenerTodos().subscribe({
      next: (data) => {
        const paquetesOrdenados = [...data].sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        this.paquetes.set(paquetesOrdenados);
        this.resetPagination();
      },
      error: (err) => console.error('Error al cargar paquetes:', err)
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.resetPagination();
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.resetPagination();
  }

  loadMore(): void {
    this.visibleCount.update(v => v + 6);
  }

  resetPagination(): void {
    this.visibleCount.set(6);
  }

  abrirFormulario(): void {
    this.dialog.open(FormularioPaqueteComponent, {
      width: '500px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.cargarPaquetes();
        this.resetPagination();
      }
    });
  }

  editarPaquete(paquete: Paquete): void {
    this.dialog.open(FormularioPaqueteComponent, {
      width: '500px',
      data: paquete   
    }).afterClosed().subscribe(result => {
      if (result) {
        this.cargarPaquetes();
        this.resetPagination();
      }
    });
  }

  eliminarPaquete(id: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Eliminar paquete',
        message: '¿Estás seguro de que quieres eliminar este paquete? Esta acción no se puede deshacer.',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.paqueteService.eliminarPaquete(id).subscribe({
          next: () => {
            this.cargarPaquetes();
            this.resetPagination();
          },
          error: (err) => console.error('Error al eliminar', err)
        });
      }
    });
  }
}