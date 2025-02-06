// services/sucursal.service.js
import Sucursal from "../models/Sucursal.js";
import ERROR from "../constants/errors.js";

/**
 * Obtiene todas las sucursales.
 * @returns {Promise<Array>} Lista de sucursales.
 */
export const getAllSucursales = async () => {
  const sucursales = await Sucursal.findAll();
  return sucursales;
};

/**
 * Obtiene una sucursal por su ID.
 * @param {number} id - ID de la sucursal.
 * @returns {Promise<Object>} Sucursal encontrada.
 * @throws {Object} Error si el ID es inválido o la sucursal no existe.
 */
export const getSucursalById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const sucursal = await Sucursal.findByPk(id);
  if (!sucursal) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Sucursal no encontrada" };
  }
  return sucursal;
};

/**
 * Crea una nueva sucursal.
 * @param {Object} data - Datos de la sucursal (nombre, direccion, telefono).
 * @returns {Promise<Object>} Sucursal creada.
 * @throws {Object} Error si faltan campos obligatorios.
 */
export const createSucursal = async (data) => {
  if (!data.nombre || !data.direccion) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Campos obligatorios faltantes" };
  }
  const sucursal = await Sucursal.create(data);
  return sucursal;
};

/**
 * Actualiza una sucursal existente.
 * @param {number} id - ID de la sucursal a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} Sucursal actualizada.
 * @throws {Object} Error si no se encuentran la sucursal o campos a actualizar.
 */
export const updateSucursal = async (id, data) => {
  const sucursal = await getSucursalById(id);
  if (!data.nombre && !data.direccion && !data.telefono) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }
  await sucursal.update(data);
  return sucursal;
};

/**
 * Elimina una sucursal.
 * @param {number} id - ID de la sucursal a eliminar.
 * @returns {Promise<Object>} Mensaje de confirmación.
 * @throws {Object} Error si la sucursal no existe.
 */
export const deleteSucursal = async (id) => {
  const sucursal = await getSucursalById(id);
  await sucursal.destroy();
  return { message: "Sucursal eliminada correctamente" };
};
