import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import path from "./utils/path.js";
import SUCCESS from "./constants/success.js";
import ERROR from "./constants/errors.js";
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { errorResponse, successResponse } from "./utils/handlers/responseHandler.js";

// Cargar variables de entorno
dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const F_URL = `http://${process.env.F_HOST}:${process.env.F_PORT}`

const app = express();

// Middlewares
app.use(cors({
    credentials: true,
    origin: F_URL
}));
app.use(cookieParser());
app.use(express.json()); // Para manejar JSON en requests
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.public));

//ROUTERS
//app.use("/api/auth", authRoutes)

// Integración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//database
//sequelize.sync({ alter: true }).then(() => console.log("Base de datos sincronizada"));

// Ruta de prueba
app.get("/", (req, res) => successResponse(res, SUCCESS.SERVER_RUNNING))

// Control de rutas inexistentes
app.use("*", (req, res) => errorResponse(res, `<h1>Error 404</h1><h3>${ERROR.NOT_FOUND_URL}</h3>`, 500));

// Control de errores internos
app.use((error, req, res) => errorResponse(res, `<h1>Error 500</h1><h3>${ERROR.INTERNAL_SERVER}</h3>`, 500, error));


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
