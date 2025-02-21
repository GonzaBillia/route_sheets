// routes/bulto.routes.js
import express from "express";
import {
  createBultoController,
  getBultoByCodeController,
  getBultos,
  getBulto,
  updateBultoController,
  deleteBultoController,
  updateBatchBultoController
} from "../controllers/bulto.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createBultoSchema, updateBatchBultoSchema, updateBultoSchema } from "../schemas/bulto.schema.js";

const router = express.Router();

// Obtener todos los bultos (requiere autenticación)
router.get("/", authMiddleware, getBultos);

// Obtener un bulto por ID (requiere autenticación)
router.get("/:id", authMiddleware, getBulto);

// Ejemplo de URL: GET /bultos/code/ABC123
router.get("/code/:code", authMiddleware, getBultoByCodeController);


// Crear un bulto (solo accesible para superadmin)
router.post(
  "/",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(createBultoSchema),
  createBultoController
);

router.put(
  "/recibido",
  authMiddleware,
  accessMiddleware(["sucursal"]),
  validate(updateBatchBultoSchema),
  updateBatchBultoController
);
// Actualizar un bulto (solo accesible para superadmin)
router.put(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  validate(updateBultoSchema),
  updateBultoController
);


// Eliminar un bulto (solo accesible para superadmin)
router.delete(
  "/:id",
  authMiddleware,
  accessMiddleware(["superadmin"]),
  deleteBultoController
);

export default router;
