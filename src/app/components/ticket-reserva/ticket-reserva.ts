import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfService } from '../../services/pdf';

@Component({
  selector: 'app-ticket-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-reserva.html',
  styleUrls: ['./ticket-reserva.css']
})
export class TicketReservaComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public reserva: any,
    private pdfService: PdfService
  ) {}

  descargarTicket() {
    this.pdfService.generarPDF(
      'contenidoTicket',
      `Ticket_Reserva_${this.reserva.id}`
    );
  }
}