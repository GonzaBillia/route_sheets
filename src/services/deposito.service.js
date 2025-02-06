// services/deposito.service.js
import Deposito from "../models/Deposito.js";
import ERROR from "../constants/errors.js";

/**
 * Obtiene todos los depósitos.
 * @returns {Promise<Array>} Lista de depósitos.
 */
export const getAllDepositos = async () => {
  const depositos = await Deposito.findAll();
  return depositos;
};

/**
 * Obtiene un depósito por su ID.
 * @param {number} id - El ID del depósito.
 * @returns {Promise<Object>} El depósito encontrado.
 * @throws {Object} Error si el ID es inválido o el depósito no existe.
 */
export const getDepositoById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }

  const deposito = await Deposito.findByPk(id);
  if (!deposito) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Depósito no encontrado" };
  }
  return deposito;
};

/**
 * Crea un nuevo depósito.
 * @param {Object} data - Los datos del depósito.
 * @param {string} data.nombre - El nombre del depósito (obligatorio).
 * @param {string} [data.ubicacion] - La ubicación del depósito (opcional).
 * @returns {Promise<Object>} El depósito creado.
 * @throws {Object} Error si falta el campo obligatorio.
 */
export const createDeposito = async (data) => {
  if (!data.nombre) {
    throw { status: 400, message: ERROR.FIELD_REQUIRED || "El campo 'nombre' es obligatorio" };
  }

  // Puedes agregar validaciones adicionales, por ejemplo, longitud o formato.
  const deposito = await Deposito.create(data);
  return deposito;
};

/**
 * Actualiza un depósito existente.
 * @param {number} id - El ID del depósito a actualizar.
 * @param {Object} data - Los nuevos datos para actualizar.
 * @returns {Promise<Object>} El depósito actualizado.
 * @throws {Object} Error si el depósito no existe o no se proporcionan campos para actualizar.
 */
export const updateDeposito = async (id, data) => {
  // Obtener el depósito; si no existe, getDepositoById lanzará un error.
  const deposito = await getDepositoById(id);

  // Validar que se haya proporcionado al menos un campo a actualizar.
  if (!data.nombre && !data.ubicacion) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }

  await deposito.update(data);
  return deposito;
};

/**
 * Elimina un depósito.
 * @param {number} id - El ID del depósito a eliminar.
 * @returns {Promise<Object>} Objeto con mensaje de confirmación.
 * @throws {Object} Error si el depósito no existe.
 */
export const deleteDeposito = async (id) => {
  const deposito = await getDepositoById(id);
  await deposito.destroy();
  return { message: "Depósito eliminado correctamente" };
};
