// controllers/remito.controller.js
import { createRemito, getRemitoById, getAllRemitos, getNumRemitos } from "../services/remito.service.js";
import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
import { asyncHandler } from "../utils/handlers/asyncHandler.js";
import SUCCESS from "../constants/success.js";
import ERROR from "../constants/errors.js";

// Crear un nuevo remito
export const createRemitoController = asyncHandler(async (req, res) => {
  try {
    const remito = await createRemito(req.body);
    return successResponse(res, SUCCESS.DATA_CREATED, remito, 201);
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});

// Obtener un remito por ID
export const getRemito = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const remito = await getRemitoById(id);
    return successResponse(res, SUCCESS.DATA_RETRIEVED, remito, 200);
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});

// Obtener todos los remitos
export const getRemitos = asyncHandler(async (req, res) => {
  try {
    const remitos = await getAllRemitos();
    return successResponse(res, SUCCESS.DATA_RETRIEVED, remitos, 200);
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});


/**
 * Controlador para obtener los remitos del día actual.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export const getRemitosController = async (req, res) => {
  try {
    const remitos = await getNumRemitos();
    return successResponse(res, "Remitos obtenidos correctamente", remitos, 200);
  } catch (error) {
    console.error("Error al obtener remitos:", error);
    return errorResponse(res, "Error al obtener remitos", 500, error);
  }
};