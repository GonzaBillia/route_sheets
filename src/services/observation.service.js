// services/observation.service.js
import Observation from "../models/Observation.js";
import ERROR from "../constants/errors.js";

/**
 * Crea una nueva observación.
 * @param {Object} data - Datos de la observación (route_sheet_id, sucursal_id, texto).
 * @returns {Promise<Object>} La observación creada.
 * @throws {Object} Error si falta algún campo obligatorio.
 */
export const createObservation = async (data) => {
  const { route_sheet_id, sucursal_id, texto } = data;
  if (!route_sheet_id || !sucursal_id || !texto) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Campos obligatorios faltantes" };
  }

  const observation = await Observation.create(data);
  return observation;
};

/**
 * Obtiene una observación por su ID.
 * @param {number} id - ID de la observación.
 * @returns {Promise<Object>} La observación encontrada.
 * @throws {Object} Error si el ID es inválido o la observación no existe.
 */
export const getObservationById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const observation = await Observation.findByPk(id);
  if (!observation) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Observación no encontrada" };
  }
  return observation;
};

/**
 * Obtiene todas las observaciones de una hoja de ruta.
 * @param {number} route_sheet_id - ID de la hoja de ruta.
 * @returns {Promise<Array>} Lista de observaciones.
 */
export const getObservationsByRouteSheet = async (route_sheet_id) => {
  if (!route_sheet_id || isNaN(route_sheet_id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID de hoja de ruta inválido" };
  }
  const observations = await Observation.findAll({ where: { route_sheet_id } });
  return observations;
};

/**
 * Actualiza una observación existente.
 * @param {number} id - ID de la observación a actualizar.
 * @param {Object} data - Datos a actualizar (por ejemplo, texto).
 * @returns {Promise<Object>} La observación actualizada.
 * @throws {Object} Error si no se proporciona ningún dato o la observación no existe.
 */
export const updateObservation = async (id, data) => {
  const observation = await getObservationById(id);
  if (!data.texto) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }
  await observation.update(data);
  return observation;
};

/**
 * Elimina una observación.
 * @param {number} id - ID de la observación a eliminar.
 * @returns {Promise<Object>} Objeto con mensaje de confirmación.
 * @throws {Object} Error si la observación no existe.
 */
export const deleteObservation = async (id) => {
  const observation = await getObservationById(id);
  await observation.destroy();
  return { message: "Observación eliminada correctamente" };
};
