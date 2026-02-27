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

  const developmentDefaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

  const allowOrigin =
    environment.cors.allowOrigin && environment.cors.allowOrigin.length > 0
      ? environment.cors.allowOrigin
      : process.env.NODE_ENV === "production"
        ? undefined
        : developmentDefaultOrigins;

  const corsOptions: CorsOptions | undefined = allowOrigin
    ? { origin: allowOrigin, credentials: true }
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
