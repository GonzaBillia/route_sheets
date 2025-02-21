// services/bulto.service.js
import {Bulto, RouteSheet} from "../models/index.models.js";
import ERROR from "../constants/errors.js";
import sequelize from "../config/database.js";

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
  const bultos = await Bulto.findAll({
    include: [
      {
        model: RouteSheet,
        as: 'historyRouteSheets',
        required: false,
        through: { attributes: ['route_sheet_id','assigned_at', 'active'] }
      }
    ]
  });
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

export const updateBatchBulto = async (payload) => {
  if (!Array.isArray(payload)) {
    throw new Error('El payload debe ser un arreglo');
  }

  payload.forEach((entry, index) => {
    if (typeof entry.codigo !== 'string' || entry.codigo.trim() === '') {
      throw new Error(`El elemento ${index} tiene un código inválido`);
    }
    if (typeof entry.recibido !== 'boolean') {
      throw new Error(`El elemento ${index} debe tener el campo "recibido" de tipo boolean`);
    }
  });

  // Ejecuta la transacción para garantizar atomicidad
  return await sequelize.transaction(async (t) => {
    // Itera sobre cada entrada del payload y realiza el update
    for (const { codigo, recibido } of payload) {
      // Busca el bulto actual en la transacción
      const bultoActual = await Bulto.findOne({ where: { codigo }, transaction: t });
      if (!bultoActual) {
        throw new Error(`No se encontró un bulto con código: ${codigo}`);
      }
      // Si el estado actual es igual al deseado, se salta la actualización
      if (bultoActual.recibido === recibido) {
        continue;
      }
      // Si el estado es distinto, se procede con la actualización
      const [affectedRows] = await Bulto.update(
        { recibido },
        { where: { codigo }, transaction: t }
      );
      if (affectedRows === 0) {
        throw new Error(`No se pudo actualizar el bulto con código: ${codigo}`);
      }
    }
    
    // Una vez completadas todas las actualizaciones, se retorna la lista de bultos actualizados
    const updatedBultos = await Bulto.findAll({
      where: { codigo: payload.map((p) => p.codigo) },
      transaction: t,
    });
    return updatedBultos;
  });
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
