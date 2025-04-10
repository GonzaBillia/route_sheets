// routes/remito.routes.js
import express from "express";
import { createRemitoController, getRemito, getRemitos, getRemitosByRouteSheetIdController, getRemitosController, getRemitosControllerByDate } from "../controllers/remito.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { accessMiddleware } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createRemitoSchema } from "../schemas/remito.schema.js";

const router = express.Router();

// Listar todos los remitos (acceso restringido, por ejemplo, solo para superadmin)
router.get("/", authMiddleware, accessMiddleware(["superadmin"]), getRemitos);

router.get("/quantio",authMiddleware, accessMiddleware(["deposito"]), getRemitosController);

router.get("/quantio/date/:date",authMiddleware, accessMiddleware(["deposito"]), getRemitosControllerByDate);

// Obtener un remito por ID (requiere autenticación)
router.get("/:id", authMiddleware, getRemito);

// Obtener los remitos por routesheet_id
router.get("/routesheet/:routesheetId", authMiddleware, getRemitosByRouteSheetIdController);


// Crear un remito (por ejemplo, al completar una hoja de ruta)
// Dependiendo de la lógica de negocio, esta ruta podría estar disponible para roles internos o incluso para superadmin.
// Aquí se requiere autenticación y se valida el body.
router.post("/", authMiddleware, validate(createRemitoSchema), createRemitoController);

export default router;
