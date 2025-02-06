// schemas/estado.schema.js
import Joi from "joi";

export const createEstadoSchema = Joi.object({
  nombre: Joi.string().max(50).required().messages({
    "string.empty": "El nombre del estado es obligatorio",
    "any.required": "El nombre del estado es obligatorio",
    "string.max": "El nombre del estado debe tener máximo 50 caracteres"
  })
});

export const updateEstadoSchema = Joi.object({
  nombre: Joi.string().max(50).required().messages({
    "string.empty": "El nombre del estado es obligatorio",
    "any.required": "El nombre del estado es obligatorio",
    "string.max": "El nombre del estado debe tener máximo 50 caracteres"
  })
});
