import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/lista-paquetes/lista-paquetes').then(m => m.ListaPaquetes) },
  { path: 'mis-reservas', loadComponent: () => import('./components/mis-reservas/mis-reservas').then(m => m.MisReservas) },
  { path: 'reservar/:id', loadComponent: () => import('./components/formulario-reserva/formulario-reserva').then(m => m.FormularioReserva) },
   { path: 'admin/paquetes', loadComponent: () => import('./admin/admin-paquetes/admin-paquetes').then(m => m.AdminPaquetesComponent) },
  { path: '**', redirectTo: '' }
];