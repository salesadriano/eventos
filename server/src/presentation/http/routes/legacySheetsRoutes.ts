import { Router } from "express";
import type { LegacySheetsController } from "../controllers/LegacySheetsController";

export const createLegacySheetsRoutes = (
  controller: LegacySheetsController
): Router => {
  const router = Router();

  router.get("/values", controller.readValues);
  router.post("/append", controller.appendValues);
  router.put("/values", controller.updateValues);
  router.post("/clear", controller.clearValues);

  return router;
};
