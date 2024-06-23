import { Router } from 'express';
import { createQuest, getQuest, getAllQuests } from '../controllers/questController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/create', authMiddleware, createQuest);
router.get('/:token', getQuest);
router.get('/', authMiddleware, getAllQuests);

export default router;
