// controllers/repartidorSucursal.controller.js
import {
    createRepartidorSucursal,
    getAllRepartidorSucursales,
    getRepartidorSucursal,
    deleteRepartidorSucursal,
    getRepartidorSucursalesService
  } from "../services/repartidorSucursal.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Crear una nueva asociación
  export const createRepartidorSucursalController = asyncHandler(async (req, res) => {
    try {
      const association = await createRepartidorSucursal(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, association, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener todas las asociaciones
  export const getRepartidorSucursales = asyncHandler(async (req, res) => {
    try {
      const associations = await getAllRepartidorSucursales();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, associations, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener una asociación específica por user_id y sucursal_id
  export const getRepartidorSucursalController = asyncHandler(async (req, res) => {
    const { user_id, sucursal_id } = req.params;
    try {
      const association = await getRepartidorSucursal(user_id, sucursal_id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, association, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });

  export const getRepartidorSucursalesController = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    try {
      const association = await getRepartidorSucursalesService(user_id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, association, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar una asociación
  export const deleteRepartidorSucursalController = asyncHandler(async (req, res) => {
    const { user_id, sucursal_id } = req.params;
    try {
      const result = await deleteRepartidorSucursal(user_id, sucursal_id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  