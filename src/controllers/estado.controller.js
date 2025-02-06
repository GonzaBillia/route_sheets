// controllers/estado.controller.js
import {
    getAllEstados,
    getEstadoById,
    createEstado,
    updateEstado,
    deleteEstado
  } from "../services/estado.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todos los estados
  export const getEstados = asyncHandler(async (req, res) => {
    try {
      const estados = await getAllEstados();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, estados, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener un estado por ID
  export const getEstado = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const estado = await getEstadoById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, estado, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Crear un nuevo estado (solo accesible para superadmin)
  export const createEstadoController = asyncHandler(async (req, res) => {
    try {
      const estado = await createEstado(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, estado, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar un estado (solo accesible para superadmin)
  export const updateEstadoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const estado = await updateEstado(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, estado, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar un estado (solo accesible para superadmin)
  export const deleteEstadoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteEstado(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  