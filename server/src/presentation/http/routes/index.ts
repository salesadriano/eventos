import type { Application } from "express";
import { Router } from "express";
import type { EventController } from "../controllers/EventController";
import type { LegacySheetsController } from "../controllers/LegacySheetsController";
import type { UserController } from "../controllers/UserController";
import { createEventRoutes } from "./eventRoutes";
import { createLegacySheetsRoutes } from "./legacySheetsRoutes";
import { createUserRoutes } from "./userRoutes";

interface Controllers {
  eventController: EventController;
  userController: UserController;
  legacySheetsController: LegacySheetsController;
}

export const registerRoutes = (
  app: Application,
  controllers: Controllers
): void => {
  const apiRouter = Router();

  apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  apiRouter.use("/events", createEventRoutes(controllers.eventController));
  apiRouter.use("/users", createUserRoutes(controllers.userController));
  apiRouter.use(
    "/sheets",
    createLegacySheetsRoutes(controllers.legacySheetsController)
  );

  app.use("/api", apiRouter);
};
