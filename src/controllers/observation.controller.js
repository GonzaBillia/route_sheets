// controllers/observation.controller.js
import {
    createObservation,
    getObservationById,
    getObservationsByRouteSheet,
    updateObservation,
    deleteObservation
  } from "../services/observation.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Crear una nueva observación
  export const createObservationController = asyncHandler(async (req, res) => {
    try {
      const observation = await createObservation(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, observation, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener una observación por ID
  export const getObservationController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const observation = await getObservationById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, observation, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener todas las observaciones para una hoja de ruta
  export const getObservationsByRouteSheetController = asyncHandler(async (req, res) => {
    const { route_sheet_id } = req.params;
    try {
      const observations = await getObservationsByRouteSheet(route_sheet_id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, observations, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar una observación
  export const updateObservationController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const observation = await updateObservation(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, observation, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar una observación
  export const deleteObservationController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteObservation(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  