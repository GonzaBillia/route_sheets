// services/qrcode.service.js
import QRCode from "../models/QRCode.js";
import ERROR from "../constants/errors.js";

/**
 * Crea un nuevo código QR.
 * Se requiere: codigo_deposito y tipo_bulto.
 * Se puede enviar opcionalmente el campo qr_base64.
 * @param {Object} data - Datos del código QR.
 * @returns {Promise<Object>} El código QR creado.
 * @throws {Object} Error si faltan campos obligatorios.
 */
export const createQRCode = async (data) => {
  const { codigo_deposito, tipo_bulto } = data;
  if (!codigo_deposito || !tipo_bulto) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Campos obligatorios faltantes" };
  }
  const qrCode = await QRCode.create(data);
  return qrCode;
};

/**
 * Obtiene un código QR por su ID.
 * @param {number} id - ID del código QR.
 * @returns {Promise<Object>} El código QR encontrado.
 * @throws {Object} Error si el ID es inválido o no se encuentra el código.
 */
export const getQRCodeById = async (id) => {
  if (!id || isNaN(id)) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const qrCode = await QRCode.findByPk(id);
  if (!qrCode) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Código QR no encontrado" };
  }
  return qrCode;
};

/**
 * Obtiene todos los códigos QR.
 * @returns {Promise<Array>} Lista de códigos QR.
 */
export const getAllQRCodes = async () => {
  const qrCodes = await QRCode.findAll();
  return qrCodes;
};

/**
 * Actualiza un código QR.
 * Esta función permite actualizar campos como bulto_id o qr_base64.
 * @param {number} id - ID del código QR a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} El código QR actualizado.
 */
export const updateQRCode = async (id, data) => {
  const qrCode = await getQRCodeById(id);
  await qrCode.update(data);
  return qrCode;
};

/**
 * Elimina un código QR.
 * @param {number} id - ID del código QR a eliminar.
 * @returns {Promise<Object>} Objeto con mensaje de confirmación.
 */
export const deleteQRCode = async (id) => {
  const qrCode = await getQRCodeById(id);
  await qrCode.destroy();
  return { message: "Código QR eliminado correctamente" };
};
