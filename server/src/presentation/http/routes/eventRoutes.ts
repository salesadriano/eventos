import { Router } from "express";
import type { EventController } from "../controllers/EventController";

export const createEventRoutes = (eventController: EventController): Router => {
  const router = Router();

  router.get("/", eventController.list);
  router.get("/:id", eventController.getById);
  router.post("/", eventController.create);
  router.put("/:id", eventController.update);
  router.delete("/:id", eventController.remove);

  return router;
};
