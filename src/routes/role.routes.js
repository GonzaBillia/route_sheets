// routes/role.routes.js
import express from "express";
import {
  getRoles,
  getRole,
  createRoleController,
  updateRoleController,
  deleteRoleController
} from "../controllers/role.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.middleware.js";
import { createRoleSchema, updateRoleSchema } from "../schemas/role.schema.js";

const router = express.Router();

// Obtener todos los roles (requiere autenticación)
router.get("/", authMiddleware, getRoles);

// Obtener un rol por ID (requiere autenticación)
router.get("/:id", authMiddleware, getRole);

// Crear un rol (solo accesible para superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(createRoleSchema),
  createRoleController
);

// Actualizar un rol (solo accesible para superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(updateRoleSchema),
  updateRoleController
);

// Eliminar un rol (solo accesible para superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteRoleController
);

export default router;
