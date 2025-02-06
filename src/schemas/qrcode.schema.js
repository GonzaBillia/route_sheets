// schemas/qrcode.schema.js
import Joi from "joi";

// Esquema para crear un código QR
export const createQRCodeSchema = Joi.object({
  codigo_deposito: Joi.string().max(100).required().messages({
    "string.empty": "El código de depósito es obligatorio",
    "any.required": "El código de depósito es obligatorio",
    "string.max": "El código de depósito debe tener máximo 100 caracteres"
  }),
  tipo_bulto: Joi.string().max(50).required().messages({
    "string.empty": "El tipo de bulto es obligatorio",
    "any.required": "El tipo de bulto es obligatorio",
    "string.max": "El tipo de bulto debe tener máximo 50 caracteres"
  }),
  // qr_base64 es opcional, se puede enviar si ya se generó la imagen en Base64
  qr_base64: Joi.string().optional(),
  // bulto_id es opcional; se asociará más adelante
  bulto_id: Joi.number().integer().optional()
});

// Esquema para actualizar un código QR (por ejemplo, para asociar a un bulto o actualizar el campo qr_base64)
export const updateQRCodeSchema = Joi.object({
  // Permitir actualizar bulto_id o qr_base64
  bulto_id: Joi.number().integer().optional().messages({
    "number.base": "El bulto_id debe ser un número"
  }),
  qr_base64: Joi.string().optional()
});
