// routes/estado.routes.js
import express from "express";
import {
  getEstados,
  getEstado,
  createEstadoController,
  updateEstadoController,
  deleteEstadoController
} from "../controllers/estado.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createEstadoSchema, updateEstadoSchema } from "../schemas/estado.schema.js";

const router = express.Router();

// Obtener todos los estados (requiere autenticación)
router.get("/", authMiddleware, getEstados);

// Obtener un estado por ID (requiere autenticación)
router.get("/:id", authMiddleware, getEstado);

// Crear un nuevo estado (solo accesible para superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(createEstadoSchema),
  createEstadoController
);

// Actualizar un estado (solo accesible para superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(updateEstadoSchema),
  updateEstadoController
);

// Eliminar un estado (solo accesible para superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteEstadoController
);

export default router;
