// schemas/sucursal.schema.js
import Joi from "joi";

export const createSucursalSchema = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "any.required": "El nombre es obligatorio",
    "string.max": "El nombre debe tener máximo 100 caracteres"
  }),
  direccion: Joi.string().max(255).required().messages({
    "string.empty": "La dirección es obligatoria",
    "any.required": "La dirección es obligatoria",
    "string.max": "La dirección debe tener máximo 255 caracteres"
  }),
  telefono: Joi.string().max(20).allow("", null).optional().messages({
    "string.max": "El teléfono debe tener máximo 20 caracteres"
  })
});

export const updateSucursalSchema = Joi.object({
  nombre: Joi.string().max(100).optional().messages({
    "string.max": "El nombre debe tener máximo 100 caracteres"
  }),
  direccion: Joi.string().max(255).optional().messages({
    "string.max": "La dirección debe tener máximo 255 caracteres"
  }),
  telefono: Joi.string().max(20).allow("", null).optional().messages({
    "string.max": "El teléfono debe tener máximo 20 caracteres"
  })
});
