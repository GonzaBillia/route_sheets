// controllers/deposito.controller.js
import { 
    getAllDepositos, 
    getDepositoById, 
    createDeposito, 
    updateDeposito, 
    deleteDeposito 
  } from "../services/deposito.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todos los depósitos
  export const getDepositos = asyncHandler(async (req, res) => {
    try {
      const depositos = await getAllDepositos();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, depositos, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener un depósito por ID
  export const getDeposito = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deposito = await getDepositoById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, deposito, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Crear un nuevo depósito
  export const createDepositoController = asyncHandler(async (req, res) => {
    try {
      const deposito = await createDeposito(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, deposito, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar un depósito existente
  export const updateDepositoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deposito = await updateDeposito(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, deposito, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar un depósito
  export const deleteDepositoController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteDeposito(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  