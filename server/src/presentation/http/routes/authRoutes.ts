import { Router } from "express";
import type { AuthController } from "../controllers/AuthController";

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  /**
   * @swagger
   * /auth/providers:
   *   get:
   *     summary: List enabled OAuth providers
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Available providers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/OAuthProvider'
   */
  router.get("/providers", authController.listOAuthProviders);

  /**
   * @swagger
   * /auth/oauth/{provider}/start:
   *   post:
   *     summary: Start OAuth Authorization Code + PKCE flow
   *     tags: [Auth]
   *     parameters:
   *       - in: path
   *         name: provider
   *         required: true
   *         schema:
   *           type: string
   *         example: google
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StartOAuthRequest'
   *     responses:
   *       200:
   *         description: OAuth flow initialized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StartOAuthResponse'
   */
  router.post("/oauth/:provider/start", authController.startOAuthAuthorization);

  /**
   * @swagger
   * /auth/oauth/{provider}/callback:
   *   post:
   *     summary: Complete OAuth callback with state and PKCE validation
   *     tags: [Auth]
   *     parameters:
   *       - in: path
   *         name: provider
   *         required: true
   *         schema:
   *           type: string
   *         example: google
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OAuthCallbackRequest'
   *     responses:
   *       200:
   *         description: OAuth callback processed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OAuthCallbackResponse'
   */
  router.post("/oauth/:provider/callback", authController.oauthCallback);

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
