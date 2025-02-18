// schemas/routesheet.schema.js
import Joi from "joi";

// Esquema para crear una hoja de ruta (para depósito)
export const createRouteSheetSchema = Joi.object({
  scannedQRCodes: Joi.array(),
  estado_id: Joi.number().optional(),
  // Los siguientes campos son opcionales
  repartidor_id: Joi.number().integer(),
  sucursal_id: Joi.number().integer(),
  remitos: Joi.array().optional()
});

// Esquema para actualizar (full update) hoja de ruta (para depósito)
// Se permiten cambios en los campos modificables, pero no se permitirán cambios si la hoja ya fue enviada.
export const updateRouteSheetSchema = Joi.object({
  // Permite actualizar cualquier campo (según lógica de negocio) salvo los timestamps que se actualizan automáticamente
  codigo: Joi.string().max(20).messages({
    "string.max": "El código debe tener máximo 20 caracteres"
  }),
  estado_id: Joi.number().integer().optional(),
  deposito_id: Joi.number().integer().optional(),
  created_by: Joi.number().integer().optional(),
  repartidor_id: Joi.number().integer().optional(),
  sucursal_id: Joi.number().integer().optional(),
  remitos: Joi.array().optional(),
  scannedQRCodes: Joi.array()
});

// Esquema para actualizar solo el estado (para repartidor o sucursal)
export const updateRouteSheetStateSchema = Joi.object({
  codigo: Joi.string().max(20).optional().messages({
    "string.max": "El código debe tener máximo 20 caracteres"
  }),
  estado_id: Joi.number().integer().required().messages({
    "number.base": "El estado_id debe ser un número",
    "any.required": "El estado_id es obligatorio"
  })
});
