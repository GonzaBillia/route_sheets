// services/routesheet.service.js
import RouteSheet from "../models/RouteSheet.js";
import ERROR from "../constants/errors.js";

/**
 * Obtiene todas las hojas de ruta.
 */
export const getAllRouteSheets = async () => {
  const routeSheets = await RouteSheet.findAll();
  return routeSheets;
};

/**
 * Obtiene una hoja de ruta por su ID.
 * @param {number} id 
 */
export const getRouteSheetById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const routeSheet = await RouteSheet.findByPk(id);
  if (!routeSheet) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Hoja de ruta no encontrada" };
  }
  return routeSheet;
};

/**
 * Crea una nueva hoja de ruta.
 * Los campos obligatorios son: codigo, estado_id, deposito_id, created_by.
 * Se establecen sent_at y received_at en null.
 * @param {Object} data 
 */
export const createRouteSheet = async (data) => {
  const { codigo, estado_id, deposito_id, created_by } = data;
  if (!codigo || !estado_id || !deposito_id || !created_by) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Campos obligatorios faltantes" };
  }
  data.sent_at = null;
  data.received_at = null;
  const routeSheet = await RouteSheet.create(data);
  return routeSheet;
};

/**
 * Actualiza una hoja de ruta de forma completa (modificación por depósito).
 * Solo se permite la modificación completa si la hoja aún no fue enviada 
 * (se verifica que sent_at sea null).
 * @param {number} id 
 * @param {Object} data 
 */
export const updateRouteSheet = async (id, data) => {
  const routeSheet = await getRouteSheetById(id);
  if (routeSheet.sent_at !== null) {
    throw { status: 403, message: "No se puede modificar la hoja de ruta después de enviarla" };
  }
  await routeSheet.update(data);
  return routeSheet;
};

/**
 * Elimina una hoja de ruta (solo si aún no fue enviada).
 * @param {number} id 
 */
export const deleteRouteSheet = async (id) => {
  const routeSheet = await getRouteSheetById(id);
  if (routeSheet.sent_at !== null) {
    throw { status: 403, message: "No se puede eliminar la hoja de ruta después de enviarla" };
  }
  await routeSheet.destroy();
  return { message: "Hoja de ruta eliminada correctamente" };
};

/**
 * Actualiza únicamente el estado de la hoja de ruta.
 * Además, según el nuevo estado, actualiza los timestamps:
 * - Si estado_id pasa a "sent" (por ejemplo, valor 2), se establece sent_at.
 * - Si estado_id pasa a "received" (por ejemplo, valor 3), se establece received_at.
 * (Los valores 2 y 3 son ejemplos; se deben ajustar según la lógica de tu aplicación.)
 * @param {number} id 
 * @param {Object} newStateData 
 */
export const updateRouteSheetState = async (id, newStateData) => {
  const routeSheet = await getRouteSheetById(id);
  if (!newStateData.estado_id) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "El campo estado_id es obligatorio" };
  }
  // Ejemplo de lógica para actualizar timestamps según el nuevo estado.
  // Supongamos: 1 = "creado", 3 = "sent", 4 = "received".
  if (newStateData.estado_id === 3 && !routeSheet.sent_at) {
    newStateData.sent_at = new Date();
  }
  if (newStateData.estado_id === 4 && !routeSheet.received_at) {
    newStateData.received_at = new Date();
  }
  await routeSheet.update(newStateData);
  return routeSheet;
};
