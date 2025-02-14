import sequelize from "../config/database.js";
import { RouteSheet, Bulto, QRCode, Remito } from "../models/index.models.js";
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
  if (!id) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const routeSheet = await RouteSheet.findByPk(id);
  if (!routeSheet) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Hoja de ruta no encontrada" };
  }
  return routeSheet;
};

/**
 * Obtiene una hoja de ruta por su ID.
 * @param {string} codigo 
 */
export const getRouteSheetByCodigo = async (id) => {
  if (!id) {
    throw { status: 400, message: ERROR.INVALID_ID || "codigo inválido" };
  }
  const routeSheet = await RouteSheet.findOne({ where: { codigo: id } });
  if (!routeSheet) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Hoja de ruta no encontrada" };
  }
  return routeSheet;
};

/**
 * Función auxiliar para validar el reuso de un código QR.
 * Si el QR ya tiene un bulto asignado, se verifica que la hoja de ruta asociada a ese bulto:
 *   - Haya sido recibida (received_at no sea null)
 *   - Haya pasado al menos 12 horas desde la recepción.
 *
 * @param {Object} qrRecord - Registro de QRCode.
 * @returns {Promise<void>}
 * @throws {Object} Error si la validación falla.
 */
const validateReusableQRCode = async (qrRecord) => {
  if (qrRecord.bulto_id) {
    // Se asume que el bulto tiene un campo route_sheet_id
    const bulto = await Bulto.findByPk(qrRecord.bulto_id);
    if (bulto && bulto.route_sheet_id) {
      const associatedRouteSheet = await RouteSheet.findByPk(bulto.route_sheet_id);
      if (!associatedRouteSheet || !associatedRouteSheet.received_at) {
        throw { status: 400, message: `El código QR ${qrRecord.codigo} ya está asignado a un bulto sin confirmar recepción.` };
      }
      const hoursDiff = (new Date() - new Date(associatedRouteSheet.received_at)) / (1000 * 3600);
      if (hoursDiff < 12) {
        throw { status: 400, message: `El código QR ${qrRecord.codigo} fue asignado hace menos de 12 horas. Revise si es un duplicado.` };
      }
    }
  }
};

/**
 * Crea la hoja de ruta completa, asociando los códigos QR escaneados a bultos y
 * vinculando cada bulto a la hoja de ruta.
 * 
 * @param {Object} routeSheetData - Datos de la hoja de ruta (incluye: sucursal_id, remito_id, repartidor_id, etc.).
 * @param {Array<string>} scannedQRCodes - Arreglo de códigos QR únicos escaneados.
 * @param {Object} sessionUser - Datos del usuario de la sesión (req.user), que contiene: id (operador), deposito_id, etc.
 * @returns {Promise<Object>} La hoja de ruta creada.
 * @throws {Object} Error con detalles si falla alguna validación o paso.
 */
export const createRouteSheet = async (routeSheetData, scannedQRCodes, sessionUser) => {
  // Validar duplicados en el arreglo de QR
  const uniqueQRCodes = new Set(scannedQRCodes);
  if (uniqueQRCodes.size !== scannedQRCodes.length) {
    throw { status: 400, message: "Se han escaneado códigos QR duplicados." };
  }

  return await sequelize.transaction(async (t) => {
    try {
      // Extraer datos del operador y depósito desde la sesión
      const { id: created_by, deposito_id } = sessionUser;
      routeSheetData.created_by = created_by;
      routeSheetData.deposito_id = deposito_id;
      routeSheetData.created_at = new Date();
      routeSheetData.estado_id = 1

      // Procesar remitos: se espera un array en routeSheetData.remitos
      let remitoExternalIds = [];
      if (Array.isArray(routeSheetData.remitos) && routeSheetData.remitos.length > 0) {
        remitoExternalIds = routeSheetData.remitos;
      }

      // Generar el código de la hoja de ruta utilizando, por ejemplo, los external_ids de los remitos
      const depositStr = String(deposito_id).padStart(2, '0');
      const sucursalStr = String(routeSheetData.sucursal_id).padStart(2, '0');
      const repartidorStr = routeSheetData.repartidor_id ? String(routeSheetData.repartidor_id).padStart(2, '0') : '00';

      // Función para generar el sufijo único
      const generateSuffixFromSum = (externalIds) => {
        // Sumar los external ids (asegurándose de que sean números)
        const sum = externalIds.reduce((acc, obj) => acc + Number(obj.Numero), 0);


        // Obtener la fecha actual en formato YYMMDD
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}${month}${day}`;

        // Concatenar suma y fecha
        const combined = Number(`${sum}${dateStr}`);

        // Asegurarse de que sea máximo de 8 dígitos usando módulo
        const suffix = combined % 100000000;
        return String(suffix).padStart(8, '0');
      };

      // Ejemplo de uso:
      const suffix = generateSuffixFromSum(remitoExternalIds);
      const routeSheetCode = `${depositStr}${sucursalStr}${repartidorStr}-${suffix}`;
      console.log(routeSheetCode);
      routeSheetData.codigo = routeSheetCode;

      // Crear la hoja de ruta
      const routeSheet = await RouteSheet.create(routeSheetData, { transaction: t });

      // Si se enviaron remitos, crearlos asignándole el routesheet_id recién creado
      let createdRemitos = [];
      if (remitoExternalIds.length > 0) {
        createdRemitos = await Promise.all(
          remitoExternalIds.map(async (item) => {
            return await Remito.create(
              { external_id: item.Numero, routesheet_id: routeSheet.id },
              { transaction: t }
            );
          })
        );
      }
      

      // Procesar cada código QR escaneado para crear bultos
      const createdBultoIds = [];
      for (const qrObj of scannedQRCodes) {
        // Acceder al campo 'codigo' del objeto
        const qrCodeStr = qrObj.codigo;
        const qrRecord = await QRCode.findByPk(qrCodeStr, { transaction: t });
        if (!qrRecord) {
          throw { status: 404, message: `Código QR ${qrCodeStr} no encontrado.` };
        }
        await validateReusableQRCode(qrRecord);
        const newBulto = await Bulto.create(
          {
            codigo: qrCodeStr,
            route_sheet_id: routeSheet.id
          },
          { transaction: t }
        );
        createdBultoIds.push(newBulto.id);
        await qrRecord.update({ bulto_id: newBulto.id }, { transaction: t });
      }
      

      if (createdBultoIds.length !== scannedQRCodes.length) {
        throw { status: 400, message: "La cantidad de bultos creados no coincide con la cantidad de códigos QR escaneados." };
      }

      return routeSheet;
    } catch (err) {
      console.error("Error en la creación de la hoja de ruta:", err);
      throw err;
    }
  });
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
