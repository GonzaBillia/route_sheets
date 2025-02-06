// schemas/tiposBulto.schema.js
import Joi from "joi";

export const createTipoBultoSchema = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "any.required": "El nombre es obligatorio",
    "string.max": "El nombre debe tener máximo 100 caracteres"
  }),
  codigo: Joi.string().max(4).required().messages({
    "string.empty": "El código es obligatorio",
    "any.required": "El código es obligatorio",
    "string.max": "El código debe tener máximo 4 caracteres"
  })
});

export const updateTipoBultoSchema = Joi.object({
  nombre: Joi.string().max(100).optional().messages({
    "string.max": "El nombre debe tener máximo 100 caracteres"
  }),
  codigo: Joi.string().max(4).optional().messages({
    "string.max": "El código debe tener máximo 4 caracteres"
  })
});
