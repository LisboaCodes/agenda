import { Router } from 'express';
import * as memoriesController from '../controllers/memoriesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', memoriesController.getMemories);
router.get('/:id', memoriesController.getMemory);
router.post('/', memoriesController.createMemory);
router.put('/:id', memoriesController.updateMemory);
router.delete('/:id', memoriesController.deleteMemory);

export default router;
