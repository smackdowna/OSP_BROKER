// src/swagger.ts
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";   
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
    },
  },
  apis: ["./docs/*.yaml"], // 👈 scans all YAML files inside docs/
};
    
const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};