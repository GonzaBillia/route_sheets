// controllers/sucursal.controller.js
import { 
    getAllSucursales, 
    getSucursalById, 
    createSucursal, 
    updateSucursal, 
    deleteSucursal, 
    getSucursalesByRepartidorId
  } from "../services/sucursal.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todas las sucursales
  export const getSucursales = asyncHandler(async (req, res) => {
    try {
      const sucursales = await getAllSucursales();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, sucursales, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });

  /**
 * Controlador para obtener las sucursales asociadas a un repartidor.
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 */
export const getSucursalesByRepartidorIdController = async (req, res) => {
  const { repartidorId } = req.params;

  try {
    const sucursales = await getSucursalesByRepartidorId(repartidorId);
    return successResponse(res, "Sucursales obtenidas correctamente", sucursales, 200);
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    return errorResponse(res, "Error al obtener sucursales", 500, error);
  }
};
  
  // Obtener una sucursal por ID
  export const getSucursal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const sucursal = await getSucursalById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, sucursal, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Crear una nueva sucursal (solo accesible para superadmin)
  export const createSucursalController = asyncHandler(async (req, res) => {
    try {
      const sucursal = await createSucursal(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, sucursal, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar una sucursal existente (solo accesible para superadmin)
  export const updateSucursalController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const sucursal = await updateSucursal(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, sucursal, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar una sucursal (solo accesible para superadmin)
  export const deleteSucursalController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteSucursal(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  