// schemas/bulto.schema.js
import Joi from "joi";

export const createBultoSchema = Joi.object({
  tipo: Joi.string().max(50).required().messages({
    "string.empty": "El tipo es obligatorio",
    "any.required": "El tipo es obligatorio",
    "string.max": "El tipo debe tener máximo 50 caracteres"
  }),
  codigo: Joi.string().max(100).required().messages({
    "string.empty": "El código es obligatorio",
    "any.required": "El código es obligatorio",
    "string.max": "El código debe tener máximo 100 caracteres"
  }),
  route_sheet_id: Joi.number().integer().required().messages({
    "number.base": "El ID de la hoja de ruta debe ser un número",
    "any.required": "El ID de la hoja de ruta es obligatorio"
  })
});

export const updateBultoSchema = Joi.object({
  tipo: Joi.string().max(50).optional().messages({
    "string.max": "El tipo debe tener máximo 50 caracteres"
  }),
  codigo: Joi.string().max(100).optional().messages({
    "string.max": "El código debe tener máximo 100 caracteres"
  }),
  route_sheet_id: Joi.number().integer().optional().messages({
    "number.base": "El ID de la hoja de ruta debe ser un número"
  })
});
