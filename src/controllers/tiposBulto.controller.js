// controllers/tiposBulto.controller.js
import {
    getAllTiposBulto,
    getTiposBultoById,
    createTiposBulto,
    updateTiposBulto,
    deleteTiposBulto
  } from "../services/tiposBulto.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todos los tipos de bulto
  export const getTiposBultoController = asyncHandler(async (req, res) => {
    try {
      const tipos = await getAllTiposBulto();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, tipos, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener un tipo de bulto por ID
  export const getTipoBultoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const tipo = await getTiposBultoById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, tipo, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Crear un nuevo tipo de bulto (solo para superadmin)
  export const createTipoBultoController = asyncHandler(async (req, res) => {
    try {
      const tipo = await createTiposBulto(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, tipo, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar un tipo de bulto (solo para superadmin)
  export const updateTipoBultoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const tipo = await updateTiposBulto(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, tipo, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar un tipo de bulto (solo para superadmin)
  export const deleteTipoBultoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteTiposBulto(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  