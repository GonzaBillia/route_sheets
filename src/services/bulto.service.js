// services/bulto.service.js
import {Bulto, BultoRouteSheet, RouteSheet} from "../models/index.models.js";
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
    const bulto = await Bulto.findOne({ where: { codigo: code },
      include: [
        {
          model: RouteSheet,
          as: 'historyRouteSheets',
          required: false,
          through: { attributes: ['route_sheet_id','assigned_at', 'active', 'received', 'delivered_at'] }
        }
      ]
     });
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
  const bulto = await Bulto.findByPk(id, {
    include: [
      {
        model: RouteSheet,
        as: 'historyRouteSheets',
        required: false,
        through: { attributes: ['route_sheet_id','assigned_at', 'active', 'received', 'delivered_at'] }
      }
    ]
  });
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
        through: { attributes: ['route_sheet_id','assigned_at', 'active', 'received', 'delivered_at'] }
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

  return await sequelize.transaction(async (t) => {
    for (const { codigo, recibido } of payload) {
      // Buscar el bulto por su código
      const bultoActual = await Bulto.findOne({ where: { codigo }, transaction: t });
      if (!bultoActual) {
        throw new Error(`No se encontró un bulto con código: ${codigo}`);
      }

      // Buscar la fila correspondiente en BultoRouteSheet usando el id del bulto y su route_sheet_id
      const routeSheetEntry = await BultoRouteSheet.findOne({
        where: {
          bulto_id: bultoActual.id,
          route_sheet_id: bultoActual.route_sheet_id
        },
        transaction: t
      });

      if (!routeSheetEntry) {
        throw new Error(`No se encontró la entrada en BultoRouteSheet para el bulto con código: ${codigo}`);
      }

      // Si el estado actual es igual al deseado, se salta la actualización
      if (routeSheetEntry.received === recibido) {
        continue;
      }

      // Definir los campos a actualizar
      const updateData = { received: recibido };
      // Si el cambio es de false a true, actualizar delivered_at con el timestamp actual
      if (!routeSheetEntry.received && recibido) {
        updateData.delivered_at = new Date();
      }

      // Actualizar la fila de BultoRouteSheet
      const [affectedRows] = await BultoRouteSheet.update(updateData, {
        where: {
          bulto_id: bultoActual.id,
          route_sheet_id: bultoActual.route_sheet_id
        },
        transaction: t
      });

      if (affectedRows === 0) {
        throw new Error(`No se pudo actualizar la entrada en BultoRouteSheet para el bulto con código: ${codigo}`);
      }
    }

    // Al finalizar, se retorna la lista de entradas actualizadas en BultoRouteSheet
    const updatedEntries = await BultoRouteSheet.findAll({
      where: {
        // Se filtran usando los códigos del payload
        bulto_id: (await Bulto.findAll({
          where: { codigo: payload.map((p) => p.codigo) },
          attributes: ['id'],
          transaction: t
        })).map(b => b.id)
      },
      transaction: t
    });
    return updatedEntries;
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
