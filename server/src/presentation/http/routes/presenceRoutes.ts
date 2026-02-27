import { Router } from "express";
import type { PresenceController } from "../controllers/PresenceController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const createPresenceRoutes = (
  presenceController: PresenceController
): Router => {
  const router = Router();

  // Apply authentication middleware to all presence routes
  router.use(authMiddleware);

  /**
   * @swagger
   * /presences:
   *   get:
   *     summary: List all presences (paginated)
   *     tags: [Presences]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *           maximum: 100
   *         description: Items per page
   *     responses:
   *       200:
   *         description: Paginated list of presences
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedPresencesResponse'
   *       401:
   *         description: Unauthorized - Invalid or missing token
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
  router.get("/", presenceController.list);

  /**
   * @swagger
   * /presences/all:
   *   get:
   *     summary: Get all presences without pagination
   *     tags: [Presences]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Array of all presences
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Presence'
   *       401:
   *         description: Unauthorized - Invalid or missing token
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
  router.get("/all", presenceController.listAll);

  /**
   * @swagger
   * /presences/{id}:
   *   get:
   *     summary: Get a specific presence by ID
   *     tags: [Presences]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Presence ID
   *     responses:
   *       200:
   *         description: Presence details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Presence'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Presence not found
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
  router.get("/:id", presenceController.getById);

  /**
   * @swagger
   * /presences:
   *   post:
   *     summary: Create a new presence
   *     tags: [Presences]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePresenceRequest'
   *     responses:
   *       201:
   *         description: Presence created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Presence'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
  router.post("/", presenceController.create);

  /**
   * @swagger
   * /presences/{id}:
   *   delete:
   *     summary: Delete a presence
   *     tags: [Presences]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Presence ID
   *     responses:
   *       204:
   *         description: Presence deleted successfully
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Presence not found
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
  router.delete("/:id", presenceController.remove);

  return router;
};

