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

router.post('/upload', authMiddleware, upload.array('photos'), uploadPhotos);
router.get('/', authMiddleware, getPhotos);
router.delete('/reset', authMiddleware, resetPhotos);
router.delete('/:id', authMiddleware, deletePhoto);
router.get('/route', authMiddleware, createRoute);
router.put('/order', authMiddleware, updatePhotoOrder);
router.post('/:id/geolocation/', authMiddleware, updatePhotoGeolocation);

export default router;
