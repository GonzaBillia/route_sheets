// routes/tiposBulto.routes.js
import express from "express";
import {
  getTiposBultoController,
  getTipoBultoController,
  createTipoBultoController,
  updateTipoBultoController,
  deleteTipoBultoController
} from "../controllers/tiposBulto.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTipoBultoSchema, updateTipoBultoSchema } from "../schemas/tiposBulto.schema.js";

const router = express.Router();

// Obtener todos los tipos de bulto (requiere autenticación)
router.get("/", authMiddleware, getTiposBultoController);

// Obtener un tipo de bulto por ID (requiere autenticación)
router.get("/:id", authMiddleware, getTipoBultoController);

// Crear un nuevo tipo de bulto (solo accesible para superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(createTipoBultoSchema),
  createTipoBultoController
);

// Actualizar un tipo de bulto (solo accesible para superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(updateTipoBultoSchema),
  updateTipoBultoController
);

// Eliminar un tipo de bulto (solo accesible para superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteTipoBultoController
);

export default router;
