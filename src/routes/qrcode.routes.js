// routes/qrcode.routes.js
import express from "express";
import {
  createQRCodeController,
  getQRCodeController,
  getAllQRCodesController,
  updateQRCodeController,
  deleteQRCodeController
} from "../controllers/qrcode.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createQRCodeSchema, updateQRCodeSchema } from "../schemas/qrcode.schema.js";

const router = express.Router();

// Obtener todos los códigos QR (requiere autenticación)
router.get("/", authMiddleware, getAllQRCodesController);

// Obtener un código QR por ID (requiere autenticación)
router.get("/:codigo", authMiddleware, getQRCodeController);

// Crear un código QR (acceso para operador de depósito o superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["deposito", "superadmin"]),
  validate(createQRCodeSchema),
  createQRCodeController
);

// Actualizar un código QR (para asociar a un bulto o actualizar qr_base64; acceso para depósito o superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["deposito", "superadmin"]),
  validate(updateQRCodeSchema),
  updateQRCodeController
);

// Eliminar un código QR (solo para superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteQRCodeController
);

export default router;
