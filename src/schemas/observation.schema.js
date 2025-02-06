// schemas/observation.schema.js
import Joi from "joi";

export const createObservationSchema = Joi.object({
  route_sheet_id: Joi.number().integer().required().messages({
    "number.base": "El ID de la hoja de ruta debe ser un número",
    "any.required": "El ID de la hoja de ruta es obligatorio"
  }),
  sucursal_id: Joi.number().integer().required().messages({
    "number.base": "El ID de la sucursal debe ser un número",
    "any.required": "El ID de la sucursal es obligatorio"
  }),
  texto: Joi.string().required().messages({
    "string.empty": "El texto de la observación es obligatorio",
    "any.required": "El texto de la observación es obligatorio"
  })
});

export const updateObservationSchema = Joi.object({
  texto: Joi.string().required().messages({
    "string.empty": "El texto de la observación es obligatorio",
    "any.required": "El texto de la observación es obligatorio"
  })
});
