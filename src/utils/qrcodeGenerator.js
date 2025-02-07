import QRCode from 'qrcode';
import sharp from 'sharp';

/**
 * Genera un código QR sin texto y retorna la imagen en Base64.
 *
 * La función genera un QR a partir de los datos (serializados a JSON) con un ancho deseado.
 * Se usa un ancho de 200px, lo que permite que tres códigos puedan caber en el ancho de una página A4.
 *
 * @param {Object} data - Datos a codificar en el QR.
 * @returns {Promise<string>} Imagen en formato Base64 (incluye el prefijo "data:image/png;base64,").
 */
export const generateQRCodeBase64 = async (data) => {
  try {
    // Definir el ancho deseado (200px para permitir 3 QR en una línea en una página A4)
    const desiredQRWidth = 200;
    // Generar el QR en un buffer usando el ancho deseado
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(data), { width: desiredQRWidth });
    
    // Si lo deseas, puedes usar Sharp para asegurar el formato o calidad,
    // pero en este caso simplemente convertiremos el buffer generado a Base64.
    const base64Image = `data:image/png;base64,${qrBuffer.toString('base64')}`;
    return base64Image;
  } catch (error) {
    console.error('Error generating QR without text using Sharp:', error);
    throw error;
  }
};
