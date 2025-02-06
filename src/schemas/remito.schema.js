// schemas/remito.schema.js
import Joi from "joi";

export const createRemitoSchema = Joi.object({
  external_id: Joi.string().max(100).required().messages({
    "string.empty": "El campo external_id es obligatorio",
    "any.required": "El campo external_id es obligatorio",
    "string.max": "El campo external_id debe tener máximo 100 caracteres"
  })
});
