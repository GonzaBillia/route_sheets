import sequelize from "../config/database.js";
import { RouteSheet, Bulto, QRCode, Remito, BultoRouteSheet } from "../models/index.models.js";
import ERROR from "../constants/errors.js";
import { errorResponse } from "../utils/handlers/responseHandler.js";

/**
 * Obtiene todas las hojas de ruta.
 */
export const getAllRouteSheets = async (page = 1, limit = 10, user) => {
  const offset = (page - 1) * limit;
  let whereClause = {};

  if (user && user.role) {
    const roleName = user.role.toLowerCase();
    switch (roleName) {
      case "deposito":
        // Filtra por deposito_id para usuarios del depósito
        whereClause = { deposito_id: user.deposito_id };
        break;
      case "sucursal":
        // Filtra por sucursal_id para usuarios de la sucursal
        whereClause = { sucursal_id: user.sucursal_id };
        break;
      case "repartidor":
        // Filtra por el id del usuario en el campo repartidor_id
        whereClause = { repartidor_id: user.id };
        break;
      case "superadmin":
      default:
        // Superadmin u otros: sin restricciones, trae todo
        whereClause = {};
        break;
    }
  }

  const { count, rows } = await RouteSheet.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order: [["created_at", "DESC"]],
  });

  return {
    data: rows,
    meta: {
      total: count,
      page,
      last_page: Math.ceil(count / limit),
    },
  };
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

export const getRouteSheetsByDeposito = async (id) => {
  if (!id) {
    throw { status: 400, message: ERROR.INVALID_ID || "ID inválido" };
  }
  const routeSheet = await RouteSheet.findAll({ where: { deposito_id: id } });
  if (!routeSheet) {
    throw { status: 404, message: ERROR.NOT_FOUND || "Hojas de ruta no encontradas" };
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
const validateReusableQRCode = async (qrRecord, id, sent_at) => {
  if (qrRecord.bulto_id) {
    // Se asume que el bulto tiene un campo route_sheet_id
    const bulto = await Bulto.findByPk(qrRecord.bulto_id);
    if (bulto && bulto.route_sheet_id) {
      // Si se está modificando el mismo route sheet y aún no se envió, se permite
      if (bulto.route_sheet_id === id && sent_at == null) {
        return;
      }

      const associatedRouteSheet = await RouteSheet.findByPk(bulto.route_sheet_id);
      if (!associatedRouteSheet || !associatedRouteSheet.received_at || !bulto.recibido) {
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

        let bulto;
        if (qrRecord.bulto_id) {
          // El bulto ya existe, obtenemos el registro
          bulto = await Bulto.findByPk(qrRecord.bulto_id, { transaction: t });
          if (!bulto) {
            throw { status: 404, message: `Bulto con ID ${qrRecord.bulto_id} no encontrado.` };
          }
          // (Opcional) Actualizamos el campo route_sheet_id en Bulto para reflejar la asignación actual
          await bulto.update({ route_sheet_id: routeSheet.id, recibido: false }, { transaction: t });

          // Marcar como inactiva la asignación previa (si la hubiera)
          await BultoRouteSheet.update(
            { active: false },
            { where: { bulto_id: bulto.id, active: true }, transaction: t }
          );

          // Crear una nueva asignación en la tabla intermedia
          await BultoRouteSheet.create(
            {
              bulto_id: bulto.id,
              route_sheet_id: routeSheet.id,
              assigned_at: new Date(),
              active: true
            },
            { transaction: t }
          );
        } else {
          // Si no existe un bulto asociado, se crea uno nuevo
          bulto = await Bulto.create(
            { codigo: qrCodeStr, route_sheet_id: routeSheet.id },
            { transaction: t }
          );
          // Crear la asignación inicial en la tabla intermedia
          await BultoRouteSheet.create(
            {
              bulto_id: bulto.id,
              route_sheet_id: routeSheet.id,
              assigned_at: new Date(),
              active: true
            },
            { transaction: t }
          );
        }
        createdBultoIds.push(bulto.id);
        await qrRecord.update({ bulto_id: bulto.id }, { transaction: t });
      }


      if (createdBultoIds.length !== scannedQRCodes.length) {
        throw { status: 400, message: "La cantidad de bultos creados no coincide con la cantidad de códigos QR escaneados." };
      }

      return routeSheet;
    } catch (err) {
      console.error("Error en la creación de la hoja de ruta:", err);
      // Verificamos si el error contiene una propiedad "errors" (propia de Sequelize)
      if (err && typeof err === "object" && "errors" in err) {
        // @ts-ignore
        const validationErrors = err.errors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          const firstErrorValue = validationErrors[0].value;
          throw { status: 400, message: `Remito ${firstErrorValue} ya usado en otra hoja de ruta.` }
        }
      }
      // Si no es un error de validación, relanzamos el error original
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
export const updateRouteSheet = async (id, updateData) => {
  // Obtener la hoja de ruta por su id (debes tener implementada esta función)
  const routeSheet = await getRouteSheetById(id);
  if (!routeSheet) {
    throw { status: 404, message: "Hoja de ruta no encontrada" };
  }
  if (routeSheet.sent_at !== null) {
    throw { status: 403, message: "No se puede modificar la hoja de ruta después de enviarla" };
  }

  return await sequelize.transaction(async (t) => {
    try {
      // Actualizar el repartidor si se proporciona
      if (updateData.repartidor_id !== undefined) {
        routeSheet.repartidor_id = updateData.repartidor_id;
      }

      // Actualizar remitos asociados:
      // Se elimina la asociación actual y se crean nuevos
      await Remito.destroy({ where: { routesheet_id: id }, transaction: t });
      if (Array.isArray(updateData.remitos) && updateData.remitos.length > 0) {
        await Promise.all(
          updateData.remitos.map(async (item) => {
            await Remito.create(
              { external_id: item, routesheet_id: id },
              { transaction: t }
            );
          })
        );
      }

      // Actualizar la asociación de códigos QR (bultos)
      if (Array.isArray(updateData.scannedQRCodes) && updateData.scannedQRCodes.length > 0) {
        for (const qrObj of updateData.scannedQRCodes) {
          const qrCodeStr = qrObj.codigo;
          const qrRecord = await QRCode.findByPk(qrCodeStr, { transaction: t });
          if (!qrRecord) {
            throw { status: 404, message: `Código QR ${qrCodeStr} no encontrado.` };
          }

          // Si el QR ya está asociado a un bulto, verificamos si ese bulto pertenece a la misma hoja de ruta.
          if (qrRecord.bulto_id) {
            const existingBulto = await Bulto.findByPk(qrRecord.bulto_id, { transaction: t });
            if (existingBulto && existingBulto.route_sheet_id === id) {
              // Se ignora el QR ya que ya está asociado a la hoja de ruta.
              continue;
            }
          }

          // Valida que el QR pueda reutilizarse (si es necesario)
          await validateReusableQRCode(qrRecord, id, routeSheet.sent_at);

          // Crear un nuevo bulto asociado a la hoja de ruta
          const newBulto = await Bulto.create(
            { codigo: qrCodeStr, route_sheet_id: id },
            { transaction: t }
          );

          // Actualizar el registro QR para asociar el nuevo bulto
          await qrRecord.update({ bulto_id: newBulto.id }, { transaction: t });
        }
      }


      // Guardar los cambios en la hoja de ruta
      await routeSheet.save({ transaction: t });
      return routeSheet;
    } catch (err) {
      console.error("Error en la actualización de la hoja de ruta:", err);
      throw err;
    }
  });
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
export const updateRouteSheetState = async (codigo, newStateData) => {
  const routeSheet = await getRouteSheetByCodigo(codigo);
  if (!routeSheet) {
    throw { status: 404, message: "Hoja de ruta no encontrada" };
  }
  if (!newStateData.estado_id) {
    throw {
      status: 400,
      message: ERROR.MISSING_FIELDS || "El campo estado_id es obligatorio",
    };
  }

  const now = new Date();
  const currentEstado = routeSheet.estado_id; // Por ejemplo: 1 = Creado, 3 = Enviado, 4 = Recibido
  const newEstado = newStateData.estado_id;

  // Si se intenta revertir (pasar a un estado menor que el actual)
  if (newEstado < currentEstado) {
    // Para estado "Enviado" (3)
    if (currentEstado === 3 && routeSheet.sent_at) {
      const sentTime = new Date(routeSheet.sent_at);
      const diffMinutes = (now - sentTime) / 60000; // diferencia en minutos
      if (diffMinutes > 10) {
        throw {
          status: 400,
          message: "No se puede revertir el estado 'Enviado' después de 10 minutos.",
        };
      }
    }
    // Para estado "Recibido" (4)
    if (currentEstado === 4 && routeSheet.received_at) {
      const receivedTime = new Date(routeSheet.received_at);
      const diffMinutes = (now - receivedTime) / 60000;
      if (diffMinutes > 10) {
        throw {
          status: 400,
          message: "No se puede revertir el estado 'Recibido' después de 10 minutos.",
        };
      }
    }
  }

  // Actualizar los timestamps según el nuevo estado:
  // Si se cambia a "Enviado" (3) y aún no se tiene sent_at, se asigna la fecha actual.
  if (newEstado === 3 && !routeSheet.sent_at) {
    newStateData.sent_at = now;
  }
  // Si se cambia a "Recibido" (4) y aún no se tiene received_at, se asigna la fecha actual.
  if ((newEstado === 4 || newEstado === 5) && !routeSheet.received_at) {
    newStateData.received_at = now;
  }

  // Si el nuevo estado es menor a 3, se elimina sent_at.
  if (newEstado < 3) {
    newStateData.sent_at = null;
  }
  // Si el nuevo estado es menor a 4, se elimina received_at.
  if (newEstado < 4) {
    newStateData.received_at = null;
  }

  await routeSheet.update(newStateData);
  return routeSheet;
};

