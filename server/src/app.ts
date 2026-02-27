import cors, { type CorsOptions } from "cors";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { environment } from "./config/environment";
import { swaggerSpec } from "./config/swagger";
import type { ApplicationContainer } from "./container";
import { errorHandler } from "./presentation/http/middlewares/errorHandler";
import { registerRoutes } from "./presentation/http/routes";

export const createApp = ({ controllers }: ApplicationContainer): Express => {
  const app = express();

  const corsOptions: CorsOptions | undefined = environment.cors.allowOrigin
    ? { origin: environment.cors.allowOrigin, credentials: true }
    : undefined;

  if (corsOptions) {
    app.use(cors(corsOptions));
  }
  // If no origin is configured, CORS middleware is not applied,
  // blocking cross-origin requests by default (same-origin policy).

  app.use(express.json());

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  registerRoutes(app, controllers);

  app.use(errorHandler);

  return app;
};
