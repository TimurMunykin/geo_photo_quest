import { Router } from 'express';
import { uploadPhotos, getPhotos, resetPhotos, createRoute, updatePhotoOrder, deletePhoto, updatePhotoGeolocation } from '../controllers/photoController';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: Photo management endpoints
 */

/**
 * @swagger
 * /photos/upload:
 *   post:
 *     summary: Upload photos
 *     tags: [Photos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               questId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Photos uploaded successfully
 *       400:
 *         description: Invalid quest ID
 */
router.post('/upload', authMiddleware, upload.array('photos'), uploadPhotos);

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Get photos for a quest
 *     tags: [Photos]
 *     parameters:
 *       - in: query
 *         name: questId
 *         schema:
 *           type: string
 *         required: true
 *         description: Quest ID
 *     responses:
 *       200:
 *         description: Photos retrieved successfully
 */
router.get('/', authMiddleware, getPhotos);

/**
 * @swagger
 * /photos/reset:
 *   delete:
 *     summary: Delete all photos
 *     tags: [Photos]
 *     responses:
 *       200:
 *         description: All photos deleted successfully
 */
router.delete('/reset', authMiddleware, resetPhotos);

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Delete a photo
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Photo ID
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 */
router.delete('/:id', authMiddleware, deletePhoto);

/**
 * @swagger
 * /photos/route:
 *   get:
 *     summary: Create a photo route
 *     tags: [Photos]
 *     responses:
 *       200:
 *         description: Photo route created successfully
 */
router.get('/route', authMiddleware, createRoute);

/**
 * @swagger
 * /photos/order:
 *   put:
 *     summary: Update photo order
 *     tags: [Photos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Photo order updated successfully
 */
router.put('/order', authMiddleware, updatePhotoOrder);

/**
 * @swagger
 * /photos/{id}/geolocation:
 *   post:
 *     summary: Update photo geolocation
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Photo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Photo geolocation updated successfully
 */
router.post('/:id/geolocation/', authMiddleware, updatePhotoGeolocation);

export default router;
