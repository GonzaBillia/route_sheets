// routes/auth.routes.js
import express from "express";
import { register, login, logout, getInfo, getUsers, getRepartidoresController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { registerUserSchema } from "../schemas/user.schema.js";

const router = express.Router();

// Registro: Solo accesible para superadmin
router.post("/register", authMiddleware, accessMiddleware(["superadmin"]), validate(registerUserSchema), register);

// Login: Ruta pública
router.post("/login", login);

// Logout: Requiere autenticación
router.post("/logout", authMiddleware, logout);

// Obtener información del usuario (perfil): Requiere autenticación
router.get("/me", authMiddleware, getInfo);

router.get("/", authMiddleware, accessMiddleware(["superadmin"]), getUsers);

router.get("/repartidores", authMiddleware, accessMiddleware(["deposito", "sucursal"]), getRepartidoresController)

export default router;
