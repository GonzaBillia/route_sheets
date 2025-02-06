// schemas/repartidorSucursal.schema.js
import Joi from "joi";

export const createRepartidorSucursalSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    "number.base": "El user_id debe ser un número",
    "any.required": "El user_id es obligatorio"
  }),
  sucursal_id: Joi.number().integer().required().messages({
    "number.base": "El sucursal_id debe ser un número",
    "any.required": "El sucursal_id es obligatorio"
  })
});
