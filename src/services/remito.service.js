// services/remito.service.js
import {Remito} from "../models/index.models.js";
import ERROR from "../constants/errors.js";
import mysqlPool from "../config/quantio.pool.js";

/**
 * Crea un nuevo remito.
 * @param {Object} data - Datos del remito (external_id).
 * @returns {Promise<Object>} Remito creado.
 * @throws {Object} Error si el campo external_id falta o el remito ya existe.
 */
export const createRemito = async (data) => {
  if (!data.external_id) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "El campo external_id es obligatorio" };
  }
  
  // Verificar si ya existe un remito con el mismo external_id
  const existingRemito = await Remito.findOne({ where: { external_id: data.external_id } });
  if (existingRemito) {
    throw { status: 409, message: "El remito ya existe" };
  }
  
  const remito = await Remito.create(data);
  return remito;
};

/**
 * Obtiene un remito por su ID.
 * @param {number} id - El ID del remito.
 * @returns {Promise<Object>} Remito encontrado.
 * @throws {Object} Error si el ID es inválido o no se encuentra el remito.
 */
export const getRemitoById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const remito = await Remito.findByPk(id);
  if (!remito) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Remito no encontrado" };
  }
  return remito;
};

/**
 * Obtiene todos los remitos.
 * @returns {Promise<Array>} Lista de remitos.
 */
export const getAllRemitos = async () => {
  const remitos = await Remito.findAll();
  return remitos;
};

export const getNumRemitos = async () => {
  try {
    // Ejecuta la consulta y desestructura el resultado
    const [remitos] = await mysqlPool.query(`
      SELECT factcabecera.CliApeNom, factcabecera.Numero 
      FROM factcabecera
      WHERE factcabecera.Emision = CURDATE()
        AND factcabecera.Tipo = 'RM'
    `);
    
    return remitos;
  } catch (error) {
    console.error("Error al obtener remitos:", error);
    throw error;
  }
};