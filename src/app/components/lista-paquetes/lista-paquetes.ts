import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaqueteService, Paquete } from '../../services/paquete';

@Component({
  selector: 'app-lista-paquetes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-paquetes.html',
  styleUrls: ['./lista-paquetes.css']
})
export class ListaPaquetes implements OnInit {
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPaquetes();
  }

  cargarPaquetes(): void {
    this.paqueteService.obtenerTodos().subscribe({
      next: (data) => {
        // Ordenar por fecha de creación (más nuevos primero)
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

  reservarConDatos(paquete: Paquete): void {
    this.router.navigate(['/reservar', paquete.id], { state: { paquete } });
  }
}