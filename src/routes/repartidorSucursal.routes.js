// routes/repartidorSucursal.routes.js
import express from "express";
import {
  createRepartidorSucursalController,
  getRepartidorSucursales,
  getRepartidorSucursalController,
  deleteRepartidorSucursalController,
  getRepartidorSucursalesController
} from "../controllers/repartidorSucursal.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createRepartidorSucursalSchema } from "../schemas/repartidorSucursal.schema.js";

const router = express.Router();

// Listar todas las asociaciones (requiere autenticación, acceso restringido si se desea)
router.get("/", authMiddleware, accessMiddleware(["superadmin", "deposito"]), getRepartidorSucursales);

// Obtener una asociación específica (por user_id y sucursal_id) (requiere autenticación)
router.get("/:user_id/:sucursal_id", authMiddleware, accessMiddleware(["superadmin", "deposito"]), getRepartidorSucursalController);

router.get("/:user_id", authMiddleware, accessMiddleware(["superadmin", "deposito"]), getRepartidorSucursalesController);


// Crear una nueva asociación (solo para superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(createRepartidorSucursalSchema),
  createRepartidorSucursalController
);

// Eliminar una asociación (solo para superadmin)
router.delete(
  "/:user_id/:sucursal_id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteRepartidorSucursalController
);

export default router;
