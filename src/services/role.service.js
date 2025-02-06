// services/role.service.js
import Role from "../models/Role.js";
import ERROR from "../constants/errors.js";

/**
 * Obtiene todos los roles.
 * @returns {Promise<Array>} Lista de roles.
 */
export const getAllRoles = async () => {
  const roles = await Role.findAll();
  return roles;
};

/**
 * Obtiene un rol por su ID.
 * @param {number} id - ID del rol.
 * @returns {Promise<Object>} Rol encontrado.
 * @throws {Object} Error si el ID es inválido o el rol no existe.
 */
export const getRoleById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const role = await Role.findByPk(id);
  if (!role) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Rol no encontrado" };
  }
  return role;
};

/**
 * Crea un nuevo rol.
 * @param {Object} data - Datos del rol.
 * @param {string} data.name - Nombre del rol (obligatorio).
 * @returns {Promise<Object>} Rol creado.
 * @throws {Object} Error si falta el campo o el rol ya existe.
 */
export const createRole = async (data) => {
  if (!data.name) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "El campo name es obligatorio" };
  }
  
  // Verificar si ya existe un rol con ese nombre (opcional, la restricción de base de datos también lo valida)
  const existingRole = await Role.findOne({ where: { name: data.name } });
  if (existingRole) {
    throw { status: 409, message: ERROR.DUPLICATE_ENTRY || "El rol ya existe" };
  }

  const role = await Role.create(data);
  return role;
};

/**
 * Actualiza un rol existente.
 * @param {number} id - ID del rol a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} Rol actualizado.
 * @throws {Object} Error si el rol no existe o no se proporcionan datos.
 */
export const updateRole = async (id, data) => {
  const role = await getRoleById(id);
  if (!data.name) {
    throw { status: 400, message: ERROR.INVALID_REQUEST || "No se proporcionaron campos para actualizar" };
  }
  await role.update(data);
  return role;
};

/**
 * Elimina un rol.
 * @param {number} id - ID del rol a eliminar.
 * @returns {Promise<Object>} Objeto con mensaje de confirmación.
 * @throws {Object} Error si el rol no existe.
 */
export const deleteRole = async (id) => {
  const role = await getRoleById(id);
  await role.destroy();
  return { message: "Rol eliminado correctamente" };
};
