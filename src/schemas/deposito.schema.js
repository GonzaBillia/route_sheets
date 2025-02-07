// schemas/deposito.schema.js
import Joi from 'joi';

export const createDepositoSchema = Joi.object({
  codigo: Joi.string().max(4).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'any.required': 'El nombre es obligatorio',
    'string.max': 'El nombre debe tener máximo 4 caracteres'
  }),
  nombre: Joi.string().max(100).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'any.required': 'El nombre es obligatorio',
    'string.max': 'El nombre debe tener máximo 100 caracteres'
  }),
  ubicacion: Joi.string().max(255).allow('', null).optional().messages({
    'string.max': 'La ubicación debe tener máximo 255 caracteres'
  })
});

export const updateDepositoSchema = Joi.object({
  nombre: Joi.string().max(100).optional().messages({
    'string.max': 'El nombre debe tener máximo 100 caracteres'
  }),
  ubicacion: Joi.string().max(255).allow('', null).optional().messages({
    'string.max': 'La ubicación debe tener máximo 255 caracteres'
  })
});
