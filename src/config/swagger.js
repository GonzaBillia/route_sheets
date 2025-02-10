// config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Path from "path";
import path from '../utils/path.js';

// Ejemplo de configuración global en swagger.js
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API del Backend",
      version: "1.0.0",
      description: "Documentación de la API del backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [Path.join(path.src, "docs/**/*.yaml")],
};
  

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
