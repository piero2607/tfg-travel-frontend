import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async generarPDF(elementoId: string, nombreArchivo: string): Promise<void> {
    const elemento = document.getElementById(elementoId);
    if (!elemento) {
      console.error(`Elemento con id "${elementoId}" no encontrado.`);
      return;
    }

    try {
      const canvas = await html2canvas(elemento);
      const imgData = canvas.toDataURL('image/png');

      const doc = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let yPosition = 0;

      // Añadir primera página
      doc.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
      yPosition = -pageHeight;

      while (imgHeight + yPosition > 0) {
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
        yPosition -= pageHeight;
      }

      doc.save(`${nombreArchivo}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }
}