// services/tiposBulto.service.js
import {TiposBulto} from "../models/index.models.js";
import ERROR from "../constants/errors.js";

/**
 * Obtiene todos los tipos de bulto.
 */
export const getAllTiposBulto = async () => {
  const tipos = await TiposBulto.findAll();
  return tipos;
};

/**
 * Obtiene un tipo de bulto por ID.
 * @param {number} id
 */
export const getTiposBultoById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const tipo = await TiposBulto.findByPk(id);
  if (!tipo) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Tipo de bulto no encontrado" };
  }
  return tipo;
};

/**
 * Crea un nuevo tipo de bulto.
 * @param {Object} data - Debe incluir: nombre, codigo.
 */
export const createTiposBulto = async (data) => {
  if (!data.nombre || !data.codigo) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Campos obligatorios faltantes" };
  }
  // Verificar que no exista otro tipo con el mismo código
  const existing = await TiposBulto.findOne({ where: { codigo: data.codigo } });
  if (existing) {
    throw { status: 409, message: ERROR.DUPLICATE_ENTRY || "El código del tipo de bulto ya existe" };
  }
  const tipo = await TiposBulto.create(data);
  return tipo;
};

/**
 * Actualiza un tipo de bulto existente.
 * @param {number} id 
 * @param {Object} data 
 */
export const updateTiposBulto = async (id, data) => {
  const tipo = await getTiposBultoById(id);
  if (!data.nombre && !data.codigo) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }
  await tipo.update(data);
  return tipo;
};

/**
 * Elimina un tipo de bulto.
 * @param {number} id 
 */
export const deleteTiposBulto = async (id) => {
  const tipo = await getTiposBultoById(id);
  await tipo.destroy();
  return { message: "Tipo de bulto eliminado correctamente" };
};
