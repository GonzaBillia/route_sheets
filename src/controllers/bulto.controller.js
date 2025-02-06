// controllers/bulto.controller.js
import { 
    getBultoByCode,
    createBulto, 
    getBultoById, 
    getAllBultos, 
    updateBulto, 
    deleteBulto 
  } from "../services/bulto.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Crear un nuevo bulto
  export const createBultoController = asyncHandler(async (req, res) => {
    try {
      const bulto = await createBulto(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, bulto, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });

  // Obtener un bulto por código (externalId)
export const getBultoByCodeController = asyncHandler(async (req, res) => {
    const { code } = req.params;
    try {
      const bulto = await getBultoByCode(code);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, bulto, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener todos los bultos
  export const getBultos = asyncHandler(async (req, res) => {
    try {
      const bultos = await getAllBultos();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, bultos, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener un bulto por ID
  export const getBulto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const bulto = await getBultoById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, bulto, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar un bulto (si se requiere)
  export const updateBultoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const bulto = await updateBulto(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, bulto, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar un bulto (si se requiere)
  export const deleteBultoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteBulto(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  