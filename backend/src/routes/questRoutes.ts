import { Router } from 'express';
import { createQuest, getQuests, deleteQuest, getQuestWithPhotos, updateQuest } from '../controllers/questController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Quests
 *   description: Quest management endpoints
 */

/**
 * @swagger
 * /quests:
 *   post:
 *     summary: Create a new quest
 *     tags: [Quests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quest created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, createQuest);

/**
 * @swagger
 * /quests:
 *   get:
 *     summary: Get all quests
 *     tags: [Quests]
 *     responses:
 *       200:
 *         description: Quests retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, getQuests);

/**
 * @swagger
 * /quests/{id}:
 *   put:
 *     summary: Update a quest
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Quest ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quest updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/:id/', authMiddleware, updateQuest);

/**
 * @swagger
 * /quests/{id}:
 *   delete:
 *     summary: Delete a quest
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Quest ID
 *     responses:
 *       200:
 *         description: Quest deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, deleteQuest);

/**
 * Retrieves a quest with its associated photos.
 *
 * @swagger
 * /quests/{id}/photos:
 *   get:
 *     summary: Get a quest with its associated photos
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Quest ID
 *     responses:
 *       200:
 *         description: Quest retrieved successfully with photos
 *       500:
 *         description: Internal server error
 */
router.get('/:id/photos', authMiddleware, getQuestWithPhotos);

export default router;
