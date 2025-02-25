import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import pth from "path"
import path from "./utils/path.js";
import SUCCESS from "./constants/success.js";
import ERROR from "./constants/errors.js";
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { errorResponse, successResponse } from "./utils/handlers/responseHandler.js";

import authRoutes from "./routes/auth.routes.js"
import bultoRoutes from "./routes/bulto.routes.js"
import depoRoutes from "./routes/deposito.routes.js"
import sucuRoutes from "./routes/sucursal.routes.js"
import remitoRoutes from "./routes/remito.routes.js"
import repSucRoutes from "./routes/repartidorSucursal.routes.js"
import obsRoutes from "./routes/observation.routes.js"
import roleRoutes from "./routes/role.routes.js"
import estadoRoutes from "./routes/estado.routes.js"
import routeSheetRoutes from "./routes/routeSheet.routes.js"
import QRCodeRoutes from "./routes/qrcode.routes.js"
import TiposBultoRoutes from "./routes/tiposBulto.routes.js"
import pdfRoutes from "./routes/downloader.routes.js"

// Define el archivo de entorno según el valor de NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Carga las variables de entorno del archivo correspondiente
const envPath = pth.join(path.root, envFile);
dotenv.config({ path: envPath });

const app = express();

// Middlewares
app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));

app.use(cookieParser());
app.use(express.json()); // Para manejar JSON en requests
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.public));

//ROUTERS
app.use("/api/auth", authRoutes)
app.use("/api/bulto", bultoRoutes)
app.use("/api/depo", depoRoutes)
app.use("/api/sucu", sucuRoutes)
app.use("/api/remito", remitoRoutes)
app.use("/api/rep-sucu", repSucRoutes)
app.use("/api/obs", obsRoutes)
app.use("/api/role", roleRoutes)
app.use("/api/estado", estadoRoutes)
app.use("/api/route-sheet", routeSheetRoutes)
app.use("/api/qrcode", QRCodeRoutes)
app.use("/api/tipos-bulto", TiposBultoRoutes)
app.use("/api/pdf", pdfRoutes)

// Integración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Ruta de prueba
app.get("/", (req, res) => successResponse(res, SUCCESS.SERVER_RUNNING))

// Control de rutas inexistentes
app.use("*", (req, res) => errorResponse(res, `<h1>Error 404</h1><h3>${ERROR.NOT_FOUND_URL}</h3>`, 500));

// Control de errores internos
app.use((error, req, res) => errorResponse(res, `<h1>Error 500</h1><h3>${ERROR.INTERNAL_SERVER}</h3>`, 500, error));


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en ${process.env.BACKEND_URL}`);
});
