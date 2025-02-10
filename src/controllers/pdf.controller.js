// controllers/pdf.controller.js
import { generateQRPdfService } from '../services/pdf.service.js';
import { successResponse, errorResponse } from '../utils/handlers/responseHandler.js';

export const generateQRPdf = async (req, res) => {
  try {
    const { qrCodes } = req.body;
    
    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
      // Se utiliza el handler de error para respuestas no exitosas
      return errorResponse(res, 'No se proporcionaron códigos QR.', 400);
    }

    // Llamada al servicio que genera el PDF
    const pdfBuffer = await generateQRPdfService(qrCodes);

    // Se configuran los headers para la descarga del PDF
    res.setHeader('Content-Disposition', 'attachment; filename="qr_codes.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    // En este caso se envía el PDF generado directamente, ya que la respuesta exitosa es un archivo y no un JSON.
    return res.send(pdfBuffer);
    
    // Si en otros endpoints se requiere una respuesta JSON exitosa, se podría utilizar successResponse, por ejemplo:
    // return successResponse(res, 'PDF generado exitosamente.', { pdf: pdfBuffer });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return errorResponse(res, error.message, 500, error);
  }
};
