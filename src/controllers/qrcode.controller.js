// controllers/qrcode.controller.js
import {
    createQRCode,
    getQRCodeById,
    getAllQRCodes,
    updateQRCode,
    deleteQRCode
  } from "../services/qrcode.service.js";
  import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
  import { asyncHandler } from "../utils/handlers/asyncHandler.js";
  import SUCCESS from "../constants/success.js";
  import ERROR from "../constants/errors.js";
  
  // Crear un nuevo código QR
  export const createQRCodeController = asyncHandler(async (req, res) => {
    try {
      const qrCode = await createQRCode(req.body);
      return successResponse(res, SUCCESS.DATA_CREATED, qrCode, 201);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener un código QR por ID
  export const getQRCodeController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const qrCode = await getQRCodeById(id);
      return successResponse(res, SUCCESS.DATA_RETRIEVED, qrCode, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Obtener todos los códigos QR
  export const getAllQRCodesController = asyncHandler(async (req, res) => {
    try {
      const qrCodes = await getAllQRCodes();
      return successResponse(res, SUCCESS.DATA_RETRIEVED, qrCodes, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Actualizar un código QR (por ejemplo, para asociarlo a un bulto o actualizar el qr_base64)
  export const updateQRCodeController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const qrCode = await updateQRCode(id, req.body);
      return successResponse(res, SUCCESS.DATA_UPDATED, qrCode, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  
  // Eliminar un código QR
  export const deleteQRCodeController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteQRCode(id);
      return successResponse(res, SUCCESS.DATA_DELETED, result, 200);
    } catch (error) {
      return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
    }
  });
  