// services/estado.service.js
import Estado from "../models/Estado.js";
import ERROR from "../constants/errors.js";

/**
 * Obtiene todos los estados.
 * @returns {Promise<Array>} Lista de estados.
 */
export const getAllEstados = async () => {
  const estados = await Estado.findAll();
  return estados;
};

/**
 * Obtiene un estado por su ID.
 * @param {number} id - ID del estado.
 * @returns {Promise<Object>} Estado encontrado.
 * @throws {Object} Error si el ID es inválido o el estado no existe.
 */
export const getEstadoById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const estado = await Estado.findByPk(id);
  if (!estado) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Estado no encontrado" };
  }
  return estado;
};

/**
 * Crea un nuevo estado.
 * @param {Object} data - Datos del estado (nombre).
 * @returns {Promise<Object>} Estado creado.
 * @throws {Object} Error si falta el campo o el estado ya existe.
 */
export const createEstado = async (data) => {
  if (!data.nombre) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "El campo 'nombre' es obligatorio" };
  }
  
  // Verificar si ya existe un estado con ese nombre (la restricción de BD también lo valida)
  const existingEstado = await Estado.findOne({ where: { nombre: data.nombre } });
  if (existingEstado) {
    throw { status: 409, message: ERROR.DUPLICATE_ENTRY || "El estado ya existe" };
  }

  const estado = await Estado.create(data);
  return estado;
};

/**
 * Actualiza un estado existente.
 * @param {number} id - ID del estado a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} Estado actualizado.
 * @throws {Object} Error si el estado no existe o no se proporciona ningún dato.
 */
export const updateEstado = async (id, data) => {
  const estado = await getEstadoById(id);
  if (!data.nombre) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }
  await estado.update(data);
  return estado;
};

/**
 * Elimina un estado.
 * @param {number} id - ID del estado a eliminar.
 * @returns {Promise<Object>} Objeto con mensaje de confirmación.
 * @throws {Object} Error si el estado no existe.
 */
export const deleteEstado = async (id) => {
  const estado = await getEstadoById(id);
  await estado.destroy();
  return { message: "Estado eliminado correctamente" };
};
