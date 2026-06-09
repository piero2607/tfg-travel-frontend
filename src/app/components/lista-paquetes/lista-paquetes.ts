import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';  
import { PaqueteService, Paquete } from '../../services/paquete';

@Component({
  selector: 'app-lista-paquetes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-paquetes.html',
  styleUrls: ['./lista-paquetes.css']
})
export class ListaPaquetes implements OnInit {
  paquetes = signal<Paquete[]>([]);
  searchTerm = signal('');

  paquetesFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.paquetes();
    return this.paquetes().filter(p =>
      p.destino.toLowerCase().includes(term) ||
      p.nombre.toLowerCase().includes(term)
    );
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
      next: (data) => this.paquetes.set(data),
      error: (err) => console.error('Error al cargar paquetes:', err)
    });
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  reservarConDatos(paquete: Paquete): void {
    console.log('reservarConDatos llamado con paquete:', paquete);
    this.router.navigate(['/reservar', paquete.id], { state: { paquete } });
  }
}