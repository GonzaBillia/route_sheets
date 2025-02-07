import QRCode from 'qrcode';
import sharp from 'sharp';

/**
 * Genera un código QR con texto debajo y retorna la imagen en Base64.
 *
 * La función genera un QR a partir de los datos (serializados a JSON) con un ancho de 300px.
 * Luego, crea un overlay SVG con el texto (por ejemplo, "DP-CA-000001") y lo concatena debajo del QR.
 * Finalmente, la imagen compuesta se convierte a Base64.
 *
 * @param {Object} data - Datos a codificar en el QR.
 * @param {string} text - Texto que se imprimirá debajo del QR.
 * @returns {Promise<string>} Imagen en formato Base64 (incluye el prefijo "data:image/png;base64,").
 */
export const generateQRCodeWithTextBase64 = async (data, text) => {
  try {
    // Generar el QR en un Buffer (ancho 300px)
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(data), { width: 300 });
    
    // Usar sharp para obtener las dimensiones del QR generado.
    const qrImage = sharp(qrBuffer);
    const metadata = await qrImage.metadata();
    const qrWidth = metadata.width;    // Por ejemplo, 300
    const qrHeight = metadata.height;  // Depende del contenido, normalmente alrededor de 300
    
    const extraHeight = 40; // Altura para el texto
    
    // Crear un overlay SVG con el texto centrado.
    const svgText = `
      <svg width="${qrWidth}" height="${extraHeight}">
        <rect width="100%" height="100%" fill="white" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              fill="black" font-family="Arial" font-size="32" font-weight="bold" dy="0.25em">
            ${text}
        </text>
      </svg>
        `;
    
    // Crear la imagen final con fondo blanco, del alto total (QR + texto)
    const finalBuffer = await sharp({
      create: {
        width: qrWidth,
        height: qrHeight + extraHeight,
        channels: 3,
        background: 'white'
      }
    })
    .composite([
      // Poner el QR en la parte superior
      { input: qrBuffer, top: 0, left: 0 },
      // Poner el overlay SVG con el texto debajo del QR
      { input: Buffer.from(svgText), top: qrHeight, left: 0 }
    ])
    .png()
    .toBuffer();
    
    // Convertir el buffer final a Base64 y añadir el prefijo MIME
    const base64Image = `data:image/png;base64,${finalBuffer.toString('base64')}`;
    return base64Image;
  } catch (error) {
    console.error('Error generating QR with text using Sharp:', error);
    throw error;
  }
};
