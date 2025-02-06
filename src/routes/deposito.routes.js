// routes/deposito.routes.js
import express from "express";
import {
  getDepositos,
  getDeposito,
  createDepositoController,
  updateDepositoController,
  deleteDepositoController
} from "../controllers/deposito.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.middleware.js";
import { createDepositoSchema, updateDepositoSchema } from "../schemas/deposito.schema.js";


const router = express.Router();

// Obtener todos los depósitos (requiere autenticación)
router.get("/", authMiddleware, getDepositos);

// Obtener un depósito por ID (requiere autenticación)
router.get("/:id", authMiddleware, getDeposito);

// Crear un nuevo depósito (solo accesible para superadmin)
router.post("/", authMiddleware, accessMiddleware(["superadmin"]), validate(createDepositoSchema), createDepositoController);

// Actualizar un depósito (solo accesible para superadmin)
router.put("/:id", authMiddleware, accessMiddleware(["superadmin"]), validate(updateDepositoSchema), updateDepositoController);

// Eliminar un depósito (solo accesible para superadmin)
router.delete("/:id", authMiddleware, accessMiddleware(["superadmin"]), deleteDepositoController);

export default router;
