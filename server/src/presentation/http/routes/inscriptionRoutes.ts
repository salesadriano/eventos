import { Router } from "express";
import type { InscriptionController } from "../controllers/InscriptionController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const createInscriptionRoutes = (
  inscriptionController: InscriptionController
): Router => {
  const router = Router();

  // Apply authentication middleware to all inscription routes
  router.use(authMiddleware);

  /**
   * @swagger
   * /inscriptions:
   *   get:
   *     summary: List all inscriptions (paginated)
   *     tags: [Inscriptions]
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
   *         description: Paginated list of inscriptions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedInscriptionsResponse'
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
  router.get("/", inscriptionController.list);

  /**
   * @swagger
   * /inscriptions/all:
   *   get:
   *     summary: Get all inscriptions without pagination
   *     tags: [Inscriptions]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Array of all inscriptions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Inscription'
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
  router.get("/all", inscriptionController.listAll);

  /**
   * @swagger
   * /inscriptions/{id}:
   *   get:
   *     summary: Get a specific inscription by ID
   *     tags: [Inscriptions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Inscription ID
   *     responses:
   *       200:
   *         description: Inscription details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Inscription'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Inscription not found
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
  router.get("/:id", inscriptionController.getById);

  /**
   * @swagger
   * /inscriptions:
   *   post:
   *     summary: Create a new inscription
   *     tags: [Inscriptions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateInscriptionRequest'
   *     responses:
   *       201:
   *         description: Inscription created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Inscription'
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
  router.post("/", inscriptionController.create);

  /**
   * @swagger
   * /inscriptions/{id}:
   *   put:
   *     summary: Update an entire inscription (full replacement)
   *     tags: [Inscriptions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Inscription ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateInscriptionRequest'
   *     responses:
   *       200:
   *         description: Inscription updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Inscription'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Inscription not found
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
  router.put("/:id", inscriptionController.update);

  /**
   * @swagger
   * /inscriptions/{id}:
   *   patch:
   *     summary: Partially update an inscription
   *     tags: [Inscriptions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Inscription ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateInscriptionRequest'
   *     responses:
   *       200:
   *         description: Inscription updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Inscription'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Inscription not found
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
  router.patch("/:id", inscriptionController.update);

  /**
   * @swagger
   * /inscriptions/{id}:
   *   delete:
   *     summary: Delete an inscription
   *     tags: [Inscriptions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Inscription ID
   *     responses:
   *       204:
   *         description: Inscription deleted successfully
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Inscription not found
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
  router.delete("/:id", inscriptionController.remove);

  return router;
};

