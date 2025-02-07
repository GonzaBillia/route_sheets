// controllers/pdf.controller.js
import PDFDocument from 'pdfkit';

export const generateQRPdf = async (req, res) => {
  try {
    const { qrCodes } = req.body;
    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron códigos QR.' });
    }

    const doc = new PDFDocument({ autoFirstPage: false });
    res.setHeader('Content-Disposition', 'attachment; filename="qr_codes.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Parámetros para una página A4
    const pageWidth = 595; // puntos
    const pageHeight = 842; // puntos
    const margin = 0; // sin márgenes
    // Queremos 3 QR por fila, cada uno de 200 puntos de ancho (para un total aproximado de 600, que cabe en 595 con ajustes mínimos)
    const qrWidth = 200;
    // Manteniendo la relación original (supongamos que la imagen original es cuadrada), para que el QR se vea nítido
    const qrHeight = 200;
    // Espacio para el texto (que se renderizará vectorialmente)
    const textHeight = 30; 
    const totalHeight = qrHeight + textHeight;
    
    const columns = 3;
    let currentX = 0;
    let currentY = 0;
    let col = 0;

    doc.addPage({ size: 'A4', margins: { top: margin, bottom: margin, left: margin, right: margin } });
    
    for (const qr of qrCodes) {
      // Se asume que qr.qr_base64 es la imagen sin el overlay de texto
      doc.image(qr.qr_base64, currentX, currentY, { width: qrWidth, height: qrHeight });
      
      // Agregar el texto debajo del QR, usando PDFKit (texto vectorial, de alta calidad)
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
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
