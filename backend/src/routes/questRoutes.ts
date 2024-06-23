import { Router } from 'express';
import { createQuest, getQuests, deleteQuest } from '../controllers/questController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createQuest);
router.delete('/:id', authMiddleware, deleteQuest);
router.get('/', authMiddleware, getQuests);

export default router;
