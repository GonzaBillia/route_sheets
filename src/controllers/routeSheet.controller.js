// controllers/routesheet.controller.js
import {
    getAllRouteSheets,
    getRouteSheetById,
    createRouteSheet,
    updateRouteSheet,
    deleteRouteSheet,
    updateRouteSheetState,
    getRouteSheetByCodigo
  } from "../services/routeSheet.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todas las hojas de ruta
  export const getRouteSheets = asyncHandler(async (req, res) => {
    try {
      // Extraer parámetros de paginación de la query (ej. ?page=2&limit=10)
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const user = req.user
      // Llamar al servicio paginado
      const routeSheetsPaginated = await getAllRouteSheets(page, limit, user);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, routeSheetsPaginated, 200);
    } catch (error) {
      return errorResponse(
        res,
        error.message || ERROR.OPERATION_FAILED,
        error.status || 500
      );
    }
  });
  
  
  // Obtener una hoja de ruta por ID
  export const getRouteSheet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const routeSheet = await getRouteSheetById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, routeSheet, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });

  export const getRouteSheetByCodigoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const routeSheet = await getRouteSheetByCodigo(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, routeSheet, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Crear una nueva hoja de ruta (Accesible para depósito)
  export const createRouteSheetController = asyncHandler(async (req, res) => {
    try {
      // Extraer los datos de la hoja de ruta y el arreglo de códigos QR del body.
      // Se espera que el body tenga la siguiente estructura:
      // {
      //   scannedQRCodes: ["QR_CODE_1", "QR_CODE_2", ...],
      //   ...otros campos para la hoja de ruta (sucursal_id, remito_id, repartidor_id, etc.)
      // }
      const { scannedQRCodes, ...routeSheetData } = req.body;
      
      // Validar que se haya enviado al menos un código QR
      if (!Array.isArray(scannedQRCodes) || scannedQRCodes.length === 0) {
        return errorResponse(res, ERROR.MISSING_FIELDS || "Debe escanear al menos un código QR", 400);
      }
      
      // Obtener la información del usuario en sesión (por ejemplo, creado por y depósito)
      const sessionUser = req.user;
      if (!sessionUser || !sessionUser.id || !sessionUser.deposito_id) {
        return errorResponse(res, ERROR.UNAUTHORIZED || "Usuario no autenticado correctamente", 401);
      }
      
      // Asignar desde la sesión el id del operador y el depósito a la hoja de ruta
      routeSheetData.created_by = sessionUser.id;
      routeSheetData.deposito_id = sessionUser.deposito_id;
      
      // Aquí se puede agregar lógica adicional para ajustar o validar datos específicos de la hoja de ruta
      
      // Llamar al servicio que crea la hoja de ruta completa, procesando los códigos QR y generando los bultos
      const routeSheet = await createRouteSheet(routeSheetData, scannedQRCodes, sessionUser);
      
      // Retornar la hoja de ruta creada en la respuesta (con detalles, si es necesario)
      return successResponse(res, SUCCESS.DATA_CREATED, routeSheet, 201);
    } catch (error) {
      console.error("Error en createRouteSheetController:", error);
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualización completa de hoja de ruta (solo para depósito, antes de enviar)
  export const updateRouteSheetController = asyncHandler(async (req, res) => {
    const { codigo } = req.params;
    try {
      // Buscar la hoja de ruta por su código
      const routeSheetFound = await getRouteSheetByCodigo(codigo);
      if (!routeSheetFound) {
        return errorResponse(res, "Hoja de ruta no encontrada", 404);
      }
      // Actualizar la hoja de ruta utilizando su id
      const updatedRouteSheet = await updateRouteSheet(routeSheetFound.id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, updatedRouteSheet, 200);
    } catch (error) {
      return errorResponse(
        res,
        error.message || ERROR.OPERATION_FAILED,
        error.status || 500
      );
    }
  });
  
  
  // Eliminar una hoja de ruta (solo para depósito, antes de enviar)
  export const deleteRouteSheetController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteRouteSheet(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar solo el estado de la hoja de ruta (para repartidor y sucursal)
  export const updateRouteSheetStateController = asyncHandler(async (req, res) => {
    const { codigo } = req.params;
    try {
      const routeSheet = await updateRouteSheetState(codigo, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, routeSheet, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  