// controllers/role.controller.js
import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
  } from "../services/role.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Obtener todos los roles
  export const getRoles = asyncHandler(async (req, res) => {
    try {
      const roles = await getAllRoles();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, roles, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener un rol por ID
  export const getRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const role = await getRoleById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, role, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Crear un nuevo rol (solo para superadmin)
  export const createRoleController = asyncHandler(async (req, res) => {
    try {
      const role = await createRole(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, role, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar un rol (solo para superadmin)
  export const updateRoleController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const role = await updateRole(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, role, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar un rol (solo para superadmin)
  export const deleteRoleController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteRole(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  