// services/repartidorSucursal.service.js
import {RepartidorSucursal} from "../models/index.models.js";
import ERROR from "../constants/errors.js";

/**
 * Crea una nueva asociación entre un repartidor (user_id) y una sucursal (sucursal_id).
 * @param {Object} data - Objeto con user_id y sucursal_id.
 * @returns {Promise<Object>} La asociación creada.
 * @throws {Object} Error si faltan campos obligatorios.
 */
export const createRepartidorSucursal = async (data) => {
  const { user_id, sucursal_id } = data;
  if (!user_id || !sucursal_id) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Se requieren user_id y sucursal_id" };
  }

  // Se puede verificar si ya existe la asociación (opcional)
  const existing = await RepartidorSucursal.findOne({ where: { user_id, sucursal_id } });
  if (existing) {
    throw { status: 409, message: "La asociación ya existe" };
  }

  const association = await RepartidorSucursal.create({ user_id, sucursal_id });
  return association;
};

/**
 * Obtiene todas las asociaciones entre repartidores y sucursales.
 * @returns {Promise<Array>} Lista de asociaciones.
 */
export const getAllRepartidorSucursales = async () => {
  const associations = await RepartidorSucursal.findAll();
  return associations;
};

export const getRepartidorSucursalesService = async (user_id) => {
  const associations = await RepartidorSucursal.findAll({where: {user_id: user_id}});
  return associations;
};

/**
 * Obtiene una asociación por user_id y sucursal_id.
 * @param {number} user_id - ID del repartidor.
 * @param {number} sucursal_id - ID de la sucursal.
 * @returns {Promise<Object>} La asociación encontrada.
 * @throws {Object} Error si la asociación no se encuentra.
 */
export const getRepartidorSucursal = async (user_id, sucursal_id) => {
  if (!user_id || !sucursal_id) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Se requieren user_id y sucursal_id" };
  }
  const association = await RepartidorSucursal.findOne({ where: { user_id, sucursal_id } });
  if (!association) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Asociación no encontrada" };
  }
  return association;
};

/**
 * Elimina una asociación por user_id y sucursal_id.
 * @param {number} user_id - ID del repartidor.
 * @param {number} sucursal_id - ID de la sucursal.
 * @returns {Promise<Object>} Objeto con mensaje de confirmación.
 * @throws {Object} Error si la asociación no se encuentra.
 */
export const deleteRepartidorSucursal = async (user_id, sucursal_id) => {
  const association = await getRepartidorSucursal(user_id, sucursal_id);
  await association.destroy();
  return { message: "Asociación eliminada correctamente" };
};
