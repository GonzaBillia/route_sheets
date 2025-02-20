import PDFDocument from 'pdfkit';
import { WritableStreamBuffer } from 'stream-buffers';
import { QRCode } from '../models/index.models.js';
import { Op } from 'sequelize';

export const generateQRPdfService = async (qrCodes) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
        return reject(new Error('No se proporcionaron códigos QR.'));
      }

      // Realizar una búsqueda para obtener los registros que contengan el qr_base64
      // y el codigo para cada uno de los códigos enviados.
      const qrDetails = await QRCode.findAll({
        where: {
          codigo: {
            [Op.in]: qrCodes,
          },
        },
        attributes: ['codigo', 'qr_base64'],
      });

      if (!qrDetails || qrDetails.length === 0) {
        return reject(new Error('No se encontraron detalles para los códigos proporcionados.'));
      }

      // Crear un documento PDF sin página inicial automática
      const doc = new PDFDocument({ autoFirstPage: false });
      const writableBuffer = new WritableStreamBuffer();
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

      // Iterar por cada detalle QR para agregar la imagen y su texto
      for (const qr of qrDetails) {
        doc.image(qr.qr_base64, currentX, currentY, { width: qrWidth, height: qrHeight });
        doc.font('Helvetica-Bold')
           .fontSize(24)
           .text(qr.codigo, currentX, currentY + qrHeight, { width: qrWidth, align: 'center' });

        col++;
        if (col >= columns) {
          col = 0;
          currentX = 0;
          currentY += totalHeight;
          if (currentY + totalHeight > pageHeight) {
            doc.addPage({ size: 'A4', margins: { top: margin, bottom: margin, left: margin, right: margin } });
            currentX = 0;
            currentY = 0;
          }
        } else {
          currentX += qrWidth;
        }
      }

      doc.end();

      writableBuffer.on('finish', () => {
        const pdfBuffer = writableBuffer.getContents();
        resolve(pdfBuffer);
      });
    } catch (error) {
      reject(error);
    }
  });
};
