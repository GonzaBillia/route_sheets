// schemas/registerUser.schema.js
import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().max(100).required().messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "any.required": "El nombre de usuario es obligatorio",
    "string.max": "El nombre de usuario debe tener máximo 100 caracteres"
  }),
  email: Joi.string().email().max(100).required().messages({
    "string.email": "El email debe tener un formato válido",
    "any.required": "El email es obligatorio",
    "string.max": "El email debe tener máximo 100 caracteres"
  }),
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es obligatoria",
    "string.max": "La contraseña debe tener máximo 255 caracteres"
  }),
  // Aquí se espera el nombre del rol en lugar de un role_id.
  role: Joi.string().valid("superadmin", "deposito", "repartidor", "sucursal").required().messages({
    "any.only": "El rol debe ser 'superadmin', 'deposito', 'repartidor' o 'sucursal'",
    "any.required": "El rol es obligatorio"
  }),
  // Para usuarios de rol "deposito" se requiere el identificador del depósito.
  deposito_id: Joi.when("role", {
    is: "deposito",
    then: Joi.number().integer().required().messages({
      "any.required": "El identificador del depósito es obligatorio para usuarios de tipo 'deposito'"
    }),
    otherwise: Joi.valid(null)
  }),
  // Para usuarios de rol "sucursal" se requiere el identificador de la sucursal.
  sucursal_id: Joi.when("role", {
    is: "sucursal",
    then: Joi.number().integer().required().messages({
      "any.required": "El identificador de la sucursal es obligatorio para usuarios de tipo 'sucursal'"
    }),
    otherwise: Joi.valid(null)
  })
});


export const updateUserSchema = Joi.object({
  username: Joi.string().max(100).optional().messages({
    "string.max": "El nombre de usuario debe tener máximo 100 caracteres"
  }),
  email: Joi.string().email().max(100).optional().messages({
    "string.email": "El email debe tener un formato válido",
    "string.max": "El email debe tener máximo 100 caracteres"
  }),
  role_id: Joi.number().optional().messages({
    "any.only": "El rol debe ser 'superadmin', 'deposito', 'repartidor' o 'sucursal'"
  }),
  deposito_id: Joi.number().integer().optional().allow("", null).messages({
    "number.base": "El identificador del depósito debe ser un número entero"
  }),
  sucursal_id: Joi.number().integer().optional().allow("", null).messages({
    "number.base": "El identificador de la sucursal debe ser un número entero"
  })
});

