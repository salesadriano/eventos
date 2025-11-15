import { Router } from "express";
import type { EmailController } from "../controllers/EmailController";

export const createEmailRoutes = (
  emailController: EmailController
): Router => {
  const router = Router();

  /**
   * @swagger
   * /emails:
   *   post:
   *     summary: Create and send an email
   *     tags: [Emails]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SendEmailRequest'
   *     responses:
   *       201:
   *         description: Email sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EmailResponse'
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post("/", emailController.send);

  return router;
};

