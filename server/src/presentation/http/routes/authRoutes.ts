import { Router } from "express";
import type { AuthController } from "../controllers/AuthController";

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post("/login", authController.login);

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshTokenRequest'
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RefreshTokenResponse'
   *       401:
   *         description: Invalid refresh token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post("/refresh", authController.refreshToken);

  /**
   * @swagger
   * /auth/validate:
   *   get:
   *     summary: Validate access token
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Token validation result
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidateTokenResponse'
   */
  router.get("/validate", authController.validateToken);

  return router;
};

