import type { Application } from "express";
import { Router } from "express";
import type { AuthController } from "../controllers/AuthController";
import type { EmailController } from "../controllers/EmailController";
import type { EventController } from "../controllers/EventController";
import type { InscriptionController } from "../controllers/InscriptionController";
import type { LegacySheetsController } from "../controllers/LegacySheetsController";
import type { PresenceController } from "../controllers/PresenceController";
import type { UserController } from "../controllers/UserController";
import { createAuthRoutes } from "./authRoutes";
import { createEmailRoutes } from "./emailRoutes";
import { createEventRoutes } from "./eventRoutes";
import { createInscriptionRoutes } from "./inscriptionRoutes";
import { createLegacySheetsRoutes } from "./legacySheetsRoutes";
import { createPresenceRoutes } from "./presenceRoutes";
import { createUserRoutes } from "./userRoutes";

interface Controllers {
  authController: AuthController;
  eventController: EventController;
  userController: UserController;
  inscriptionController: InscriptionController;
  presenceController: PresenceController;
  legacySheetsController: LegacySheetsController;
  emailController: EmailController;
}

export const registerRoutes = (
  app: Application,
  controllers: Controllers
): void => {
  const apiRouter = Router();

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: API is running
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthResponse'
   */
  apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Authentication routes: /api/auth
  apiRouter.use("/auth", createAuthRoutes(controllers.authController));

  // RESTful resource routes
  // Events: /api/events
  apiRouter.use("/events", createEventRoutes(controllers.eventController));

  // Users: /api/users
  apiRouter.use("/users", createUserRoutes(controllers.userController));

  // Inscriptions: /api/inscriptions
  apiRouter.use(
    "/inscriptions",
    createInscriptionRoutes(controllers.inscriptionController)
  );

  // Presences: /api/presences
  apiRouter.use(
    "/presences",
    createPresenceRoutes(controllers.presenceController)
  );

  // Emails: /api/emails (RESTful - POST to create/send email)
  apiRouter.use("/emails", createEmailRoutes(controllers.emailController));

  // Legacy Sheets API (kept for backward compatibility)
  // Note: Consider migrating to RESTful /api/sheets/:range endpoints
  apiRouter.use(
    "/sheets",
    createLegacySheetsRoutes(controllers.legacySheetsController)
  );

  app.use("/api", apiRouter);
};
