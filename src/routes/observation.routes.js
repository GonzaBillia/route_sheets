// routes/observation.routes.js
import express from "express";
import {
  createObservationController,
  getObservationController,
  getObservationsByRouteSheetController,
  updateObservationController,
  deleteObservationController
} from "../controllers/observation.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createObservationSchema, updateObservationSchema } from "../schemas/observation.schema.js";

const router = express.Router();

// Crear una nueva observación (por lo general, acceso para usuarios de sucursal)
// Puedes ajustar el rol permitido según la lógica de negocio
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["sucursal", "superadmin"]),
  validate(createObservationSchema),
  createObservationController
);

// Obtener una observación por ID (requiere autenticación)
router.get("/:id", authMiddleware, getObservationController);

// Obtener todas las observaciones para una hoja de ruta (por ejemplo, mediante query param o parámetro de ruta)
router.get("/route/:route_sheet_id", authMiddleware, getObservationsByRouteSheetController);

// Actualizar una observación (acceso para sucursal que la creó o superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["sucursal", "superadmin"]),
  validate(updateObservationSchema),
  updateObservationController
);

// Eliminar una observación (por ejemplo, solo superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin", "sucursal"]),
  deleteObservationController
);

export default router;
