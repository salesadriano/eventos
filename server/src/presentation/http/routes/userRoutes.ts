import { Router } from "express";
import type { UserController } from "../controllers/UserController";

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.get("/", userController.list);
  router.get("/:id", userController.getById);
  router.post("/", userController.create);
  router.put("/:id", userController.update);
  router.delete("/:id", userController.remove);

  return router;
};
