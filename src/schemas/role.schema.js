// schemas/role.schema.js
import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.empty": "El nombre del rol es obligatorio",
    "any.required": "El nombre del rol es obligatorio",
    "string.max": "El nombre del rol debe tener máximo 50 caracteres"
  })
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.empty": "El nombre del rol es obligatorio",
    "any.required": "El nombre del rol es obligatorio",
    "string.max": "El nombre del rol debe tener máximo 50 caracteres"
  })
});
