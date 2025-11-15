import cors, { type CorsOptions } from "cors";
import express, { type Express } from "express";
import { environment } from "./config/environment";
import type { ApplicationContainer } from "./container";
import { errorHandler } from "./presentation/http/middlewares/errorHandler";
import { registerRoutes } from "./presentation/http/routes";

export const createApp = ({ controllers }: ApplicationContainer): Express => {
  const app = express();

  const corsOptions: CorsOptions | undefined = environment.cors.allowOrigin
    ? { origin: environment.cors.allowOrigin }
    : undefined;

  if (corsOptions) {
    app.use(cors(corsOptions));
  } else {
    app.use(cors());
  }

  app.use(express.json());

  registerRoutes(app, controllers);

  app.use(errorHandler);

  return app;
};
