// routes/sucursal.routes.js
import express from "express";
import {
  getSucursales,
  getSucursal,
  createSucursalController,
  updateSucursalController,
  deleteSucursalController
} from "../controllers/sucursal.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSucursalSchema, updateSucursalSchema } from "../schemas/sucursal.schema.js";

const router = express.Router();

// Obtener todas las sucursales (requiere autenticación)
router.get("/", authMiddleware, getSucursales);

// Obtener una sucursal por ID (requiere autenticación)
router.get("/:id", authMiddleware, getSucursal);

// Crear una nueva sucursal (solo para superadmin, validación de datos)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(createSucursalSchema),
  createSucursalController
);

// Actualizar una sucursal (solo para superadmin, validación de datos)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(updateSucursalSchema),
  updateSucursalController
);

// Eliminar una sucursal (solo para superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteSucursalController
);

export default router;
