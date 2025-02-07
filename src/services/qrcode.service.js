// services/qrcode.service.js
import { Op } from "sequelize";
import QRCode from "../models/QRCode.js";
import {generateQRCodeWithTextBase64} from "../utils/qrcodeGenerator.js";
import ERROR from "../constants/errors.js";

/**
 * Genera códigos QR en lote para una misma combinación de depósito y tipo de bulto.
 *
 * Se espera que se provea un objeto con las siguientes propiedades:
 * - depositCode: Código del depósito (string, hasta 4 caracteres), por ejemplo "DP"
 * - depositId: ID del depósito (número)
 * - tipoBultoCode: Código del tipo de bulto (string, hasta 4 caracteres), por ejemplo "CA"
 * - tipoBultoId: ID del tipo de bulto (número)
 * - quantity: Cantidad de códigos QR a generar (número)
 *
 * La función:
 *  1. Consulta todos los códigos QR existentes con el prefijo formado por:
 *     `${depositCode}-${tipoBultoCode}-`
 *  2. Determina el serial máximo usado en esa combinación.
 *  3. Para cada nuevo código, incrementa el serial y lo formatea a 6 dígitos.
 *  4. Genera el código único (por ejemplo, "DP-CA-000001").
 *  5. Llama a la utilidad para generar la imagen QR en Base64, usando ese código como texto.
 *  6. Prepara un registro para cada código y luego realiza una inserción masiva.
 *
 * @param {Object} params - Parámetros para la generación en lote.
 * @param {string} params.depositCode - Código del depósito (4 caracteres).
 * @param {number} params.depositId - ID del depósito.
 * @param {string} params.tipoBultoCode - Código del tipo de bulto (4 caracteres).
 * @param {number} params.tipoBultoId - ID del tipo de bulto.
 * @param {number} params.quantity - Cantidad de códigos a generar.
 * @returns {Promise<Array<Object>>} Array con los registros creados.
 * @throws {Object} Error si faltan datos o si el lote es inválido.
 */
export const generateBatchQRCodes = async ({ depositCode, depositId, tipoBultoCode, tipoBultoId, quantity }) => {
  if (!depositCode || !tipoBultoCode || !depositId || !tipoBultoId || !quantity || quantity <= 0) {
    throw { status: 400, message: ERROR.MISSING_FIELDS || "Faltan datos obligatorios para generar el lote de códigos QR" };
  }

  // Formar el prefijo de la combinación, con guiones
  const prefix = `${depositCode}-${tipoBultoCode}-`; // Ej: "DP-CA-"

  // Consultar la base de datos para obtener todos los códigos QR existentes con ese prefijo
  const existingCodes = await QRCode.findAll({
    where: {
      codigo: { [Op.like]: `${prefix}%` }
    },
    attributes: ['codigo']
  });

  // Determinar el máximo serial usado para esta combinación
  let maxSerial = 0;
  existingCodes.forEach(record => {
    // Se asume que el código tiene el formato "DP-CA-000001"
    const code = record.codigo;
    const serialPart = code.substring(prefix.length); // Extrae "000001"
    const num = parseInt(serialPart, 10);
    if (num > maxSerial) {
      maxSerial = num;
    }
  });

  // Generar registros para insertar
  const recordsToCreate = [];

  // Para cada nuevo código, generar el serial y el código único
  for (let i = 1; i <= quantity; i++) {
    const newSerial = maxSerial + i; // Incrementa el serial
    const serialFormatted = String(newSerial).padStart(6, "0");
    const uniqueCode = `${prefix}${serialFormatted}`; // Ej: "DP-CA-000005"

    // Generar la imagen QR en Base64, usando el código único como texto a imprimir
    const text = uniqueCode;
    const qr_base64 = await generateQRCodeWithTextBase64({ depositCode, tipoBultoCode, depositId, tipoBultoId, serial: newSerial }, text);

    // Preparar el registro con los campos necesarios:
    // - codigo: el código único armado (clave primaria)
    // - serial: el número serial (entero)
    // - qr_base64: la imagen generada en Base64
    // - deposito_id: el ID del depósito
    // - bulto_id: se deja en null hasta asignarlo posteriormente
    // - tipo_bulto_id: el ID del tipo de bulto
    recordsToCreate.push({
      codigo: uniqueCode,
      serial: newSerial,
      qr_base64,
      deposito_id: depositId,
      bulto_id: null,
      tipo_bulto_id: tipoBultoId
    });
  }

  // Inserción masiva en la base de datos
  const createdRecords = await QRCode.bulkCreate(recordsToCreate);
  return createdRecords;
};


/**
 * Obtiene un código QR por su ID.
 * @param {number} id - ID del código QR.
 * @returns {Promise<Object>} El código QR encontrado.
 * @throws {Object} Error si el ID es inválido o no se encuentra el código.
 */
export const getQRCodeById = async (id) => {
  if (!id) {
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
