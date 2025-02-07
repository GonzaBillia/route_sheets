import Joi from "joi";

export const createQRCodeSchema = Joi.object({
  // Código del depósito (ejemplo: "DP"), hasta 4 caracteres.
  codigo_deposito: Joi.string().max(4).required().messages({
    "string.empty": "El código del depósito es obligatorio",
    "any.required": "El código del depósito es obligatorio",
    "string.max": "El código del depósito debe tener máximo 4 caracteres"
  }),
  // Identificador del depósito (clave foránea)
  deposito_id: Joi.number().integer().required().messages({
    "number.base": "El depósito ID debe ser un número",
    "any.required": "El depósito ID es obligatorio"
  }),
  // Código del tipo de bulto (ejemplo: "CA"), hasta 4 caracteres.
  tipo_bulto: Joi.string().max(4).required().messages({
    "string.empty": "El código del tipo de bulto es obligatorio",
    "any.required": "El código del tipo de bulto es obligatorio",
    "string.max": "El código del tipo de bulto debe tener máximo 4 caracteres"
  }),
  // Opcionalmente, se puede enviar el tipo_bulto_id si ya se conoce
  tipo_bulto_id: Joi.number().integer().messages({
    "string.empty": "El ID del tipo de bulto es obligatorio",
    "any.required": "El ID del tipo de bulto es obligatorio",
    "string.max": "El ID del tipo de bulto debe tener máximo 4 caracteres"
  }),
  cantidad: Joi.number().integer().optional(),
  // bulto_id es opcional, ya que se asigna luego
  bulto_id: Joi.number().integer().optional()
});

export const updateQRCodeSchema = Joi.object({
  // Permite actualizar el campo bulto_id o el campo qr_base64
  bulto_id: Joi.number().integer().optional().messages({
    "number.base": "El bulto_id debe ser un número"
  }),
  qr_base64: Joi.string().optional()
});
