// routes/routesheet.routes.js
import express from "express";
import {
  getRouteSheets,
  getRouteSheet,
  createRouteSheetController,
  updateRouteSheetController,
  deleteRouteSheetController,
  updateRouteSheetStateController
} from "../controllers/routeSheet.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createRouteSheetSchema,
  updateRouteSheetSchema,
  updateRouteSheetStateSchema
} from "../schemas/routeSheet.schema.js";

const router = express.Router();

// Obtener todas las hojas de ruta (requiere autenticación)
router.get("/", authMiddleware, getRouteSheets);

// Obtener una hoja de ruta por ID (requiere autenticación)
router.get("/:id", authMiddleware, getRouteSheet);

// Crear una hoja de ruta (solo para depósito y superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["deposito", "superadmin"]),
  validate(createRouteSheetSchema),
  createRouteSheetController
);

// Actualización completa de hoja de ruta (solo para depósito y superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["deposito", "superadmin"]),
  validate(updateRouteSheetSchema),
  updateRouteSheetController
);

// Eliminar una hoja de ruta (solo para depósito y superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["deposito", "superadmin"]),
  deleteRouteSheetController
);

// Actualizar solo el estado de la hoja de ruta (para repartidor, sucursal y superadmin)
router.put(
  "/:id/state",
  authMiddleware,
  accessMiddleware(["repartidor", "sucursal", "superadmin"]),
  validate(updateRouteSheetStateSchema),
  updateRouteSheetStateController
);

export default router;
