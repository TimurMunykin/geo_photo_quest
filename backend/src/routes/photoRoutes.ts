import { Router } from 'express';
import { uploadPhotos, getPhotos, resetPhotos, createRoute, updatePhotoOrder } from '../controllers/photoController';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer to use the uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.array('photos', 10), uploadPhotos); // Handle multiple files
router.get('/', getPhotos); // Endpoint to fetch all photos
router.delete('/reset', resetPhotos); // Endpoint to reset photos
router.get('/route', createRoute); // Endpoint to create a route
router.put('/order', updatePhotoOrder); // Endpoint to update photo order

export default router;
