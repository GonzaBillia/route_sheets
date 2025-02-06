// controllers/routesheet.controller.js
import {
    getAllRouteSheets,
    getRouteSheetById,
    createRouteSheet,
    updateRouteSheet,
    deleteRouteSheet,
    updateRouteSheetState
  } from "../services/routeSheet.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todas las hojas de ruta
  export const getRouteSheets = asyncHandler(async (req, res) => {
    try {
      const routeSheets = await getAllRouteSheets();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, routeSheets, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
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
  
  // Crear una nueva hoja de ruta (Accesible para depósito)
  export const createRouteSheetController = asyncHandler(async (req, res) => {
    try {
      const routeSheet = await createRouteSheet(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, routeSheet, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualización completa de hoja de ruta (solo para depósito, antes de enviar)
  export const updateRouteSheetController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const routeSheet = await updateRouteSheet(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, routeSheet, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
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
    const { id } = req.params;
    try {
      const routeSheet = await updateRouteSheetState(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, routeSheet, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  