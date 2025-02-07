// services/bulto.service.js
import {Bulto} from "../models/index.models.js";
import ERROR from "../constants/errors.js";

/**
 * Crea un nuevo bulto.
 * @param {Object} data - Datos del bulto (tipo, codigo, route_sheet_id).
 * @returns {Promise<Object>} El bulto creado.
 * @throws {Object} Error si falta algún campo obligatorio.
 */
export const createBulto = async (data) => {
  if (!data.tipo || !data.codigo || !data.route_sheet_id) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Campos obligatorios faltantes" };
  }

  // Se elimina la validación de duplicidad en el código,
  // ya que el código del bulto puede reutilizarse.
  const bulto = await Bulto.create(data);
  return bulto;
};

/**
 * Obtiene un bulto por su código (externalId).
 * @param {string} code - El código del bulto.
 * @returns {Promise<Object>} El bulto encontrado.
 * @throws {Object} Error si el código no es proporcionado o no se encuentra el bulto.
 */
export const getBultoByCode = async (code) => {
    if (!code) {
      throw { status: 400, message: ERROR.MISSING_FIELDS || "El código es obligatorio" };
    }
    const bulto = await Bulto.findOne({ where: { codigo: code } });
    if (!bulto) {
      throw { status: 404, message: ERROR.NOT_FOUND || "Bulto no encontrado" };
    }
    return bulto;
  };

/**
 * Obtiene un bulto por su ID.
 * @param {number} id - ID del bulto.
 * @returns {Promise<Object>} El bulto encontrado.
 * @throws {Object} Error si el ID es inválido o no se encuentra el bulto.
 */
export const getBultoById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const bulto = await Bulto.findByPk(id);
  if (!bulto) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Bulto no encontrado" };
  }
  return bulto;
};

/**
 * Obtiene todos los bultos.
 * @returns {Promise<Array>} Lista de bultos.
 */
export const getAllBultos = async () => {
  const bultos = await Bulto.findAll();
  return bultos;
};

/**
 * Actualiza un bulto existente.
 * @param {number} id - ID del bulto a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} El bulto actualizado.
 * @throws {Object} Error si no se encuentra el bulto o no se proporcionan datos.
 */
export const updateBulto = async (id, data) => {
  const bulto = await getBultoById(id);
  if (!data.tipo && !data.codigo && !data.route_sheet_id) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }
  await bulto.update(data);
  return bulto;
};

/**
 * Elimina un bulto.
 * @param {number} id - ID del bulto a eliminar.
 * @returns {Promise<Object>} Mensaje de confirmación.
 * @throws {Object} Error si el bulto no existe.
 */
export const deleteBulto = async (id) => {
  const bulto = await getBultoById(id);
  await bulto.destroy();
  return { message: "Bulto eliminado correctamente" };
};
