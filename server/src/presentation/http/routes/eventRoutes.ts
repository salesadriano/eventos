import { Router } from "express";
import type { EventController } from "../controllers/EventController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const createEventRoutes = (eventController: EventController): Router => {
  const router = Router();

  // Apply authentication middleware to all event routes
  router.use(authMiddleware);

  /**
   * @swagger
   * /events:
   *   get:
   *     summary: List all events (paginated)
   *     tags: [Events]
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
   *         description: Paginated list of events
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedEventsResponse'
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
  router.get("/", eventController.list);

  /**
   * @swagger
   * /events/all:
   *   get:
   *     summary: Get all events without pagination
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Array of all events
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Event'
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
  router.get("/all", eventController.listAll);

  /**
   * @swagger
   * /events/{id}:
   *   get:
   *     summary: Get a specific event by ID
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Event details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Event not found
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
  router.get("/:id", eventController.getById);

  /**
   * @swagger
   * /events:
   *   post:
   *     summary: Create a new event
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEventRequest'
   *     responses:
   *       201:
   *         description: Event created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
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
  router.post("/", eventController.create);

  /**
   * @swagger
   * /events/{id}:
   *   put:
   *     summary: Update an entire event (full replacement)
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateEventRequest'
   *     responses:
   *       200:
   *         description: Event updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Event not found
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
  router.put("/:id", eventController.update);

  /**
   * @swagger
   * /events/{id}:
   *   patch:
   *     summary: Partially update an event
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateEventRequest'
   *     responses:
   *       200:
   *         description: Event updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Event not found
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
  router.patch("/:id", eventController.update);

  /**
   * @swagger
   * /events/{id}:
   *   delete:
   *     summary: Delete an event
   *     tags: [Events]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       204:
   *         description: Event deleted successfully
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Event not found
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
  router.delete("/:id", eventController.remove);

  return router;
};
