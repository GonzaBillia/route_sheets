// services/pdf.service.js
import PDFDocument from 'pdfkit';
import { WritableStreamBuffer } from 'stream-buffers';

export const generateQRPdfService = async (qrCodes) => {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
        return reject(new Error('No se proporcionaron códigos QR.'));
      }

      // Crear un documento PDF sin página inicial automática
      const doc = new PDFDocument({ autoFirstPage: false });

      // Crear un stream para acumular el contenido del PDF
      const writableBuffer = new WritableStreamBuffer();

      // Conectar el PDF al stream
      doc.pipe(writableBuffer);

      // Parámetros para una página A4
      const pageWidth = 595;  // puntos
      const pageHeight = 842; // puntos
      const margin = 0;       // sin márgenes
      const qrWidth = 200;    // ancho del QR
      const qrHeight = 200;   // alto del QR
      const textHeight = 30;  // espacio para el texto
      const totalHeight = qrHeight + textHeight;
      const columns = 3;      // tres QR por fila
      let currentX = 0;
      let currentY = 0;
      let col = 0;

      // Agregar la primera página
      doc.addPage({ size: 'A4', margins: { top: margin, bottom: margin, left: margin, right: margin } });

      // Iterar por cada código QR para agregar la imagen y su texto
      for (const qr of qrCodes) {
        // Se asume que qr.qr_base64 es la imagen en formato base64 o una ruta válida
        doc.image(qr.qr_base64, currentX, currentY, { width: qrWidth, height: qrHeight });
        // Renderizar el texto debajo del QR
        doc.font('Helvetica-Bold')
           .fontSize(24)
           .text(qr.codigo, currentX, currentY + qrHeight, { width: qrWidth, align: 'center' });

        col++;
        if (col >= columns) {
          col = 0;
          currentX = 0;
          currentY += totalHeight;
          // Si el contenido sobrepasa la altura de la página, se agrega una nueva
          if (currentY + totalHeight > pageHeight) {
            doc.addPage({ size: 'A4', margins: { top: margin, bottom: margin, left: margin, right: margin } });
            currentX = 0;
            currentY = 0;
          }
        } else {
          currentX += qrWidth;
        }
      }

      // Finalizar la escritura del documento
      doc.end();

      // Al terminar de escribir, se resuelve la promesa con el Buffer del PDF
      writableBuffer.on('finish', () => {
        const pdfBuffer = writableBuffer.getBuffer();
        resolve(pdfBuffer);
      });
    } catch (error) {
      reject(error);
    }
  });
};
